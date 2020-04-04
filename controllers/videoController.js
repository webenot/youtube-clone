import fs from 'fs';

import routes from '../routes';
import Video from '../models/Video';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 }).populate('creator');
    res.render('home', { pageTitle: 'Home', videos });
  } catch (e) {
    console.error(e);
    res.status(404);
    res.render('home', { pageTitle: 'Home', videos: [] });
  }
};

export const search = async (req, res) => {
  const { query: { term: searchingBy } } = req;
  const searchString = searchingBy.split(' ');
  const regular = new RegExp(`(${searchString.join(')|(')})|(${searchingBy})`, 'i');
  try {
    const where = {
      $or: [
        { title: { $regex: regular } },
        { description: { $regex: regular } },
      ],
    };
    const videos = await Video.find(where).sort({ _id: -1 });
    res.render('search', { pageTitle: 'Search', searchingBy, videos });
  } catch (e) {
    console.error(e);
    res.status(404);
    res.redirect(routes.home);
  }
};

export const getUpload = (req, res) => {
  res.render('upload', { pageTitle: 'Upload' });
};

export const postUpload = async (req, res) => {
  const { body: { title, description }, file: { path }, user: { id: creator } } = req;

  try {
    const newVideo = await Video.create({
      fileUrl: path.replace(/\\/g, '/'),
      title,
      description,
      creator,
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (e) {
    console.error(e);
    res.status(403);
    res.render('upload', { pageTitle: 'Upload' });
  }
};

export const videoDetail = async (req, res) => {
  const { params: { id } } = req;
  try {
    const video = await Video.findById(id).populate('creator');
    console.log(video);
    if (!video) {
      throw new Error('Video not found');
    }
    res.render('videoDetail', { pageTitle: video.title, video });
  } catch (e) {
    console.error(e);
    res.status(404);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const { params: { id }, user: { id: creator } } = req;
  try {
    const video = await Video.findOne({ _id: id, creator });
    if (video) {
      res.render('editVideo', { pageTitle: `Edit "${video.title}"`, video });
    } else {
      throw new Error('Video not found');
    }
  } catch (e) {
    console.error(e);
    res.status(404);
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const { params: { id }, body: { title, description }, user: { id: creator } } = req;
  try {
    await Video.findOneAndUpdate(
      {
        _id: id,
        creator,
      },
      { title, description },
      { new: true },
    );
    res.redirect(routes.videoDetail(id));
  } catch (e) {
    console.error(e);
    res.status(404);
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const { params: { id }, user: { id: creator } } = req;
  try {
    const video = await Video.findOne({ _id: id, creator });
    console.log('video', video);
    if (!video) {
      throw new Error('Video not found');
    }
    const deleted = await Video.findOneAndRemove({ _id: id, creator });
    console.log('deleted', deleted);
    if (deleted) {
      if (fs.existsSync(video.fileUrl)) {
        fs.unlinkSync(video.fileUrl);
      }
    }
    res.redirect(routes.home);
  } catch (e) {
    console.error(e);
    res.status(404);
    res.redirect(routes.home);
  }
};

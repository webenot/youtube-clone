import fs from 'fs';

import routes from '../routes';
import Video from '../models/Video';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render('home', { pageTitle: 'Home', videos });
  } catch (e) {
    console.error(e);
    res.render('home', { pageTitle: 'Home', videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  const searchString = searchingBy.split(' ');
  try {
    const where = {
      $or: [
        {
          title: {
            $regex: new RegExp(
              `(${searchString.join(')|(')})|(${searchingBy})`,
              'i'
            ),
          },
        },
        {
          description: {
            $regex: new RegExp(
              `(${searchString.join(')|(')})|(${searchingBy})`,
              'i'
            ),
          },
        },
      ],
    };
    const videos = await Video.find(where).sort({ _id: -1 });
    res.render('search', { pageTitle: 'Search', searchingBy, videos });
  } catch (e) {
    console.error(e);
    res.redirect(routes.home);
  }
};

export const getUpload = (req, res) => {
  res.render('upload', { pageTitle: 'Upload' });
};

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path },
  } = req;

  try {
    const newVideo = await Video.create({
      fileUrl: path.replace(/\\/g, '/'),
      title,
      description,
    });
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (e) {
    console.error(e);
    res.render('upload', { pageTitle: 'Upload' });
  }
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    res.render('videoDetail', { pageTitle: video.title, video });
  } catch (e) {
    console.error(e);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    res.render('editVideo', { pageTitle: `Edit "${video.title}"`, video });
  } catch (e) {
    console.error(e);
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );
    res.redirect(routes.videoDetail(id));
  } catch (e) {
    console.error(e);
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    const deleted = await Video.deleteOne({ _id: id });
    if (deleted.deletedCount === 1) {
      if (fs.existsSync(video.fileUrl)) {
        fs.unlinkSync(video.fileUrl);
      }
    }
  } catch (e) {
    console.error(e);
    res.redirect(routes.home);
  }
  res.redirect(routes.home);
};

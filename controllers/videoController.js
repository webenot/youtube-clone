import routes from '../routes';
import Video from '../models/Video';

export const home = async(req, res) => {
  try {
    const videos = await Video.find({});
    console.log(videos);
    res.render('home', { pageTitle: 'Home', videos });
  } catch (e) {
    console.error(e);
    res.render('home', { pageTitle: 'Home', videos: [] });
  }
};

export const search = (req, res) => {
  const { query: { term: searchingBy } } = req;
  const videos = [];
  res.render('search', { pageTitle: 'Search', searchingBy, videos });
};

export const getUpload = (req, res) => {
  res.render('upload', { pageTitle: 'Upload' });
};

export const postUpload = (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const {
    body: { file, title, description }
  } = req;
  // @todo Upload and save video
  res.redirect(routes.videoDetail(1234));
};

export const videoDetail = (req, res) => res.render('videoDetail', { pageTitle: 'Video Detail' });

export const editVideo = (req, res) => {
  const { params: { id: videoId } } = req;
  console.log(req.params);
  res.render('editVideo', { pageTitle: 'Edit Video', videoId });
};

export const deleteVideo = (req, res) => {
  res.render('deleteVideo', { pageTitle: 'Delete Video' });
};

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

export const postUpload = async(req, res) => {
  console.log(req.body);
  console.log(req.file);
  const {
    body: { title, description },
    file: { path }
  } = req;

  try {
    const newVideo = await Video.create({
      fileUrl: path.replace(/\\/g, '/'),
      title,
      description
    });
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (e) {
    console.error(e);
    res.render('upload', { pageTitle: 'Upload' });
  }
};

export const videoDetail = async(req, res) => {
  const { params: { id } } = req;
  try {
    const video = await Video.findById(id);
    res.render('videoDetail', { pageTitle: 'Video Detail', video });
  } catch (e) {
    console.error(e);
    res.render('videoDetail', { pageTitle: 'Video Detail', video: {} });
  }
};

export const getEditVideo = async(req, res) => {
  const { params: { id } } = req;
  console.log(req.params);
  try {
    const video = await Video.findById(id);
    res.render('editVideo', { pageTitle: `Edit "${video.title}"`, video });
  } catch (e) {
    console.error(e);
    res.redirect(routes.home);
  }
};

export const postEditVideo = async(req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  console.log(req.params);
  console.log(req.body);
  try {
    await Video.findByIdAndUpdate(id, {
      title, description
    }, { new: true });
    res.redirect(routes.videoDetail(id));
  } catch (e) {
    console.error(e);
    res.redirect(routes.home);
  }
};

export const deleteVideo = (req, res) => {
  res.render('deleteVideo', { pageTitle: 'Delete Video' });
};

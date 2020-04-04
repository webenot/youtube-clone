// Global
const HOME = '/';
const JOIN = '/join';
const LOGIN = '/login';
const LOGOUT = '/logout';
const SEARCH = '/search';

// Users
const USERS = '/users';
const USER_DETAIL = '/:id';
const EDIT_PROFILE = '/edit-profile';
const CHANGE_PASSWORD = '/change-password';
const PROFILE = '/profile';

// Third party auth services
const GITHUB_AUTH = '/auth/github';
const GITHUB_CALLBACK = '/auth/github/callback';
const FB_AUTH = '/auth/fb';
const FB_CALLBACK = '/auth/fb/callback';

// Videos
const VIDEOS = '/videos';
const UPLOAD = '/upload';
const VIDEO_DETAIL = '/:id';
const EDIT_VIDEO = '/:id/edit';
const DELETE_VIDEO = '/:id/delete';

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  userDetail: (id) => (id ? `${USERS}/${id}` : USER_DETAIL),
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  profile: PROFILE,
  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: (id) => (id ? `${VIDEOS}/${id}` : VIDEO_DETAIL),
  editVideo: (id) => (id ? `${VIDEOS}${EDIT_VIDEO.replace(':id', id)}` : EDIT_VIDEO),
  deleteVideo: (id) => (id ? `${VIDEOS}${DELETE_VIDEO.replace(':id', id)}` : DELETE_VIDEO),
  githubAuth: GITHUB_AUTH,
  githubCallback: GITHUB_CALLBACK,
  fbAuth: FB_AUTH,
  fbCallback: FB_CALLBACK,
};

export default routes;

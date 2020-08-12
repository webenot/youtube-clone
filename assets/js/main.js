import { videoPlayerInit } from './modules/videoPlayer';
import { videoRecorderInit } from './modules/videoRecorder';
import CommentForm from './modules/comments';

document.addEventListener('DOMContentLoaded', () => {
  videoPlayerInit('jsVideoPlayer');
  videoRecorderInit('jsVideoPreview');

  const comments = new CommentForm('jsComments');
  comments.init();
});

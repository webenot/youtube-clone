import { videoPlayerInit } from './modules/videoPlayer';
import { videoRecorderInit } from './modules/videoRecorder';
import CommentForm from './modules/comments';

document.addEventListener('DOMContentLoaded', () => {
  videoPlayerInit('jsVideoPlayer');
  videoRecorderInit('jsVideoPreview');

  const comments = new CommentForm('jsComments');
  comments.init();

  const closeMessageBtn = document.querySelectorAll('.flash-message__close');
  closeMessageBtn.forEach(btn => {
    btn.addEventListener('click', e => {
      e.currentTarget.closest('.flash-message').remove();
    });
  });
});

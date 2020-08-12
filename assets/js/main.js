import { videoPlayerInit } from './modules/videoPlayer';
import { videoRecorderInit } from './modules/videoRecorder';

document.addEventListener('DOMContentLoaded', () => {
  videoPlayerInit('jsVideoPlayer');
  videoRecorderInit('jsVideoPreview');
});

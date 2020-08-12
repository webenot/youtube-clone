window.URL = window.URL || window.webkitURL;
window.File = window.File || null;
window.getUserMedia =
  navigator.mediaDevices.getUserMedia ||
  navigator.mediaDevices.webkitGetUserMedia ||
  navigator.mediaDevices.mozGetUserMedia;
window.MediaRecorder = window.MediaRecorder || null;

export class VideoRecorder {
  constructor (containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.player = this.container.querySelector('video');
    this.recordBtn = this.container.querySelector('.start-record');
    this.stream = null;
    this.chunks = [];
    this.stopRecord = this.stopRecording.bind(this);
    this.startRecord = this.getVideo.bind(this);
    this.link = null;
  }

  stopRecording () {
    if (!File) {
      alert('Your browser does not support File saving!');
      return;
    }
    this.recorder.requestData();
    this.recorder.stop();
    this.player.pause();
    this.recordBtn.removeEventListener('click', this.stopRecord);
    this.recordBtn.addEventListener('click', this.startRecord);
    this.recordBtn.innerHTML = 'Start recording';
  }

  recordVideoData = event => {
    console.log('event', event);
    if (event.data.size > 0) {
      this.chunks.push(event.data);
      const fileName = `recorded-${Date.now()}.webm`;
      this.link = document.createElement('a');
      this.link.href = URL.createObjectURL(event.data);
      this.link.download = fileName;
      this.link.innerText = 'Download record';
      if (this.container.firstChild.children[1]) {
        this.container.firstChild.children[1].remove();
      }
      this.container.firstChild.appendChild(this.link);
    }
    /* if (this.chunks.length) {
      const fileName = `recorded-${Date.now()}.webm`;
      this.fullVideo = new Blob(this.chunks, {
        type: 'video/webm;codecs=vp8,opus',
        endings: 'native',
      });
      console.log('this.chunks', this.chunks);
      console.log('this.fullVideo', this.fullVideo);
      this.link = document.createElement('a');
      this.link.href = URL.createObjectURL(this.fullVideo);
      this.link.download = fileName;
      this.link.innerText = 'Download record';
      if (this.container.firstChild.children[1]) {
        this.container.firstChild.children[1].remove();
      }
      this.container.firstChild.appendChild(this.link);
    } */
  };

  startRecording () {
    if (!MediaRecorder) {
      alert('Your browser does not support video recording!');
      return;
    }
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.addEventListener('dataavailable', this.recordVideoData);
    // this.recorder.start(1000);
    this.recorder.start();
    // this.recorder.requestData();
    console.log('this.recorder', this.recorder);
    if (this.link) {
      URL.revokeObjectURL(this.link.href);
    }
  }

  async getVideo () {
    if (!navigator.mediaDevices) {
      alert('Your browser does not support video records');
      return;
    }

    try {
      this.stream = await window.getUserMedia.bind(navigator.mediaDevices)({
        audio: true,
        video: {
          width: 1920,
          height: 1080,
        },
      });
      console.log(this.stream);
      this.player.srcObject = this.stream;
      this.player.muted = true;
      this.player.play();
      this.recordBtn.innerHTML = 'Stop recording';
      this.startRecording();
      this.recordBtn.addEventListener('click', this.stopRecord);
    } catch (e) {
      console.error(e);
      this.recordBtn.innerHTML = '😢 Can\'t record';
    } finally {
      this.recordBtn.removeEventListener('click', this.startRecord);
    }
  }

  async init () {
    if (!this.container) return;

    this.recordBtn.addEventListener('click', this.startRecord);
  }
}

export const videoRecorderInit = containerId => {
  const videoContainer = document.getElementById(containerId);

  const init = async () => {
    const videoPlayer = new VideoRecorder(containerId);
    await videoPlayer.init();
  };

  if (videoContainer) {
    init().catch(console.error);
  }
};

import formatVideoTime from '../helpers/formatVideoTime';

class VideoPlayer {
  defaultVolume = 0.5;

  constructor (containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.player = this.container.querySelector('video');
    this.playBtn = this.container.querySelector('.play');
    this.volumeBtn = this.container.querySelector('.volume');
    this.fullScreenBtn = this.container.querySelector('.full-screen');
    this.isFullScreen = false;
    this.totalTimeContainer = this.container.querySelector('.timeline__total');
    this.currentTimeContainer = this.container.querySelector('.timeline__current');
    this.volumeInput = this.container.querySelector('.videoPlayer__volume input');
  }

  onPlayerLoaded () {
    return new Promise((resolve, reject) => {
      this.player.addEventListener('loadedmetadata', () => {
        this.totalTimeContainer.innerHTML = formatVideoTime(this.player.duration);
        this.currentTimeContainer.innerHTML = formatVideoTime(this.player.currentTime);
        this.volumeInput.value = this.defaultVolume;
        this.volumeChange(this.defaultVolume);
        resolve();
      });
      this.player.addEventListener('error', () => {
        reject();
      });
    });
  }

  volumeKeyControl = (event) => {
    if (event.code === 'ArrowUp') {
      let volume = this.player.volume + 0.1;
      if (volume > 1) volume = 1;
      this.volumeChange(volume);
      this.volumeInput.value = volume;
    }
    if (event.code === 'ArrowDown') {
      let volume = this.player.volume - 0.1;
      if (volume < 0) volume = 0;
      this.volumeChange(volume);
      this.volumeInput.value = volume;
    }
  };

  fullscreenchangeHandler () {
    const icon = this.fullScreenBtn.querySelector('i');
    icon.classList.toggle('fa-expand');
    icon.classList.toggle('fa-compress');
    this.container.classList.toggle('fullScreen');
    if (this.isFullScreen) {
      document.addEventListener('keydown', this.volumeKeyControl);
    } else {
      document.removeEventListener('keydown', this.volumeKeyControl);
    }
  }

  initKeyboardEvents () {
    document.addEventListener('keydown', async (event) => {
      if (event.target.closest('input:not(.videoPlayer__volume___input)')) return;
      if (event.target.closest('textarea')) return;
      if (event.target.closest('select')) return;
      if (event.code === 'Space') {
        event.preventDefault();
        await this.play();
      }
    });
    document.addEventListener('fullscreenchange', () => {
      this.isFullScreen =
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.msFullscreenElement;
      this.fullscreenchangeHandler();
    });
    document.addEventListener('mozfullscreenchange', () => {
      this.isFullScreen = !!document.mozFullScreenElement;
      this.fullscreenchangeHandler();
    });
    document.addEventListener('MSFullscreenChange', () => {
      this.isFullScreen = !!document.msFullscreenElement;
      this.fullscreenchangeHandler();
    });
  }

  initPlay () {
    this.player.addEventListener('click', async (event) => {
      if (
        !event.target.closest('.volume') &&
        !event.target.closest('.full-screen')
      ) {
        await this.play();
      }
    });
    this.playBtn.addEventListener('click', async () => {
      await this.play();
    });
  }

  async play () {
    const icon = this.playBtn.querySelector('i');
    if (this.player.paused) {
      await this.player.play();
    } else {
      await this.player.pause();
    }
    icon.classList.toggle('fa-pause');
    icon.classList.toggle('fa-play');
  }

  volumeChange (value) {
    this.player.volume = value;
    const volumeTracker = this.container.querySelector('.rangeTracker');
    volumeTracker.style.height =
      `${this.player.volume * 100}px`;
    const icon = this.volumeBtn.querySelector('i');
    if (!value) {
      icon.classList.remove('fa-volume-up');
      icon.classList.add('fa-volume-mute');
    } else if (!icon.classList.contains('fa-volume-up')) {
      icon.classList.add('fa-volume-up');
      icon.classList.remove('fa-volume-mute');
    }
  }

  initVolume () {
    this.volumeBtn.addEventListener('click', () => {
      this.player.muted = !this.player.muted;
      if (this.player.muted) {
        this.volumeChange(0);
      } else if (this.volumeInput.value) {
        this.volumeChange(this.volumeInput.value);
      } else {
        this.volumeChange(this.defaultVolume);
        this.volumeInput.value = this.defaultVolume;
      }
    });
    this.volumeInput.addEventListener('input', (event) => {
      this.volumeChange(event.target.closest('.videoPlayer__volume-wrapper')
        .querySelector('input').value);
    });
    this.container.onwheel = (event) => {
      event.preventDefault();
      console.log(event);
      let volume = +this.player.volume;
      volume += -(event.deltaY / 1000);
      if (volume > 1) {
        volume = 1;
      } else if (volume < 0) {
        volume = 0;
      }
      this.volumeChange(volume);
      this.volumeInput.value = volume;
    };
  }

  initFullScreen () {
    const requestFullScreen =
      this.container.requestFullscreen ||
      this.container.webkitRequestFullscreen ||
      this.container.mozRequestFullscreen ||
      this.container.msRequestFullscreen ||
      this.container.oRequestFullscreen;
    const exitFullScreen =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    this.fullScreenBtn.addEventListener('click', async () => {
      this.isFullScreen = !this.isFullScreen;
      if (this.isFullScreen) {
        await requestFullScreen.bind(this.container)();
      } else {
        await exitFullScreen.bind(document)();
      }
    });
  }

  initEnded () {
    this.player.addEventListener('ended', () => {
      const icon = this.playBtn.querySelector('i');
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
      this.player.currentTime = 0;
      this.currentTimeContainer.innerHTML = formatVideoTime(0);
    });
  }

  changeCurrentTimeLine () {
    this.player.addEventListener('timeupdate', () => {
      this.currentTimeContainer.innerHTML = formatVideoTime(this.player.currentTime);
    });
  }

  async init () {
    if (!this.container) return;

    await this.onPlayerLoaded();

    this.initPlay();
    this.initVolume();
    this.initFullScreen();
    this.initKeyboardEvents();
    this.initEnded();
    this.changeCurrentTimeLine();
  }
}

const videoPlayerInit = (containerId) => {
  const videoContainer = document.getElementById(containerId);

  const init = async () => {
    const videoPlayer = new VideoPlayer(containerId);
    await videoPlayer.init();
  };

  if (videoContainer) {
    init().catch((error) => console.error(error));
  }
};

export default videoPlayerInit;

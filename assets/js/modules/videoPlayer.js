import formatVideoTime from '../helpers/formatVideoTime';

const LOUD = 0.7;
const SILENT = 0.2;
const ARROW_STEP = 0.1;
const MOUSE_STEP = 1000;
const DEFAULT_VOLUME = 0.5;

export class VideoPlayer {
  constructor (containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.player = this.container.querySelector('video');
    this.controls = this.container.querySelector('.videoPlayer__controls');
    this.playBtn = this.controls.querySelector('.play');
    this.volumeBtn = this.controls.querySelector('.volume');
    this.fullScreenBtn = this.controls.querySelector('.full-screen');
    this.isFullScreen = false;
    this.totalTimeContainer = this.controls.querySelector('.timeline__total');
    this.currentTimeContainer = this.controls.querySelector('.timeline__current');
    this.volumeInput = this.controls.querySelector('.videoPlayer__volume input');
  }

  onPlayerLoaded () {
    return new Promise((resolve, reject) => {
      this.player.addEventListener('loadedmetadata', () => {
        this.totalTimeContainer.innerHTML = formatVideoTime(this.player.duration);
        this.currentTimeContainer.innerHTML = formatVideoTime(this.player.currentTime);
        this.volumeInput.value = DEFAULT_VOLUME;
        this.volumeChange(DEFAULT_VOLUME);
        resolve();
      });
      this.player.addEventListener('error', () => {
        reject('Error loading data');
      });
    });
  }

  volumeKeyControl = event => {
    if (event.code === 'ArrowUp') {
      let volume = this.player.volume + ARROW_STEP;
      if (volume > 1) volume = 1;
      this.volumeChange(volume);
      this.volumeInput.value = volume;
    }
    if (event.code === 'ArrowDown') {
      let volume = this.player.volume - ARROW_STEP;
      if (volume < 0) volume = 0;
      this.volumeChange(volume);
      this.volumeInput.value = volume;
    }
  };

  fullscreenchangeHandler () {
    this.container.classList.toggle('fullScreen');
    if (this.isFullScreen) {
      this.fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
      document.addEventListener('keydown', this.volumeKeyControl);
    } else {
      this.fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      document.removeEventListener('keydown', this.volumeKeyControl);
    }
  }

  keydown = async event => {
    if (event.target.closest('input:not(.videoPlayer__volume___input)')) return;
    if (event.target.closest('textarea')) return;
    if (event.target.closest('select')) return;
    if (event.code === 'Space') {
      event.preventDefault();
      await this.play();
    }
    if (event.code === 'ArrowRight') {
      if (this.player.currentTime < this.player.duration - 5) {
        this.player.currentTime += 5;
      } else {
        this.player.currentTime = this.player.duration;
      }
    }
    if (event.code === 'ArrowLeft') {
      if (this.player.currentTime > 5) {
        this.player.currentTime -= 5;
      } else {
        this.player.currentTime = 0;
      }
    }
  };

  fullscreenchange = () => {
    this.isFullScreen =
      !!document.fullscreenElement ||
      !!document.webkitFullscreenElement ||
      !!document.msFullscreenElement ||
      !!document.mozFullScreenElement ||
      !!document.msFullscreenElement;
    this.fullscreenchangeHandler();
  };

  initKeyboardEvents () {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('fullscreenchange', this.fullscreenchange);
    document.addEventListener('mozfullscreenchange', this.fullscreenchange);
    document.addEventListener('MSFullscreenChange', this.fullscreenchange);
  }

  initPlay () {
    this.player.addEventListener('click', async event => {
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
    if (this.player.paused) {
      await this.player.play();
      this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      await this.player.pause();
      this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  volumeChange (value) {
    this.player.volume = +value;
    const volumeTracker = this.container.querySelector('.rangeTracker');
    volumeTracker.style.height =
      `${this.player.volume * 100}px`;
    if (+value === 0) {
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      this.player.muted = true;
    } else {
      if (+value > LOUD) {
        this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      } else if (+value > SILENT) {
        this.volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
      } else {
        this.volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
      }
      this.player.muted = false;
    }
  }

  mute = () => {
    this.player.muted = !this.player.muted;
    const volumeTracker = this.container.querySelector('.rangeTracker');
    if (this.player.muted) {
      this.volumeInput.value = 0;
      volumeTracker.style.height = 0;
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      if (!this.player.volume) {
        this.player.volume = DEFAULT_VOLUME;
        this.volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
      } else if (this.player.volume > LOUD) {
        this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      } else if (this.player.volume > SILENT) {
        this.volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
      } else {
        this.volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
      }
      this.volumeInput.value = this.player.volume;
      volumeTracker.style.height =
        `${this.player.volume * 100}px`;
    }
  };

  initVolume () {
    this.volumeBtn.addEventListener('click', this.mute);

    this.volumeInput.addEventListener('input', event => {
      this.volumeChange(event.target.closest('.videoPlayer__volume-wrapper')
        .querySelector('input').value);
    });

    this.container.onwheel = event => {
      event.preventDefault();
      let volume = +this.player.volume;
      volume += -(event.deltaY / MOUSE_STEP);
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

  ended = () => {
    this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
    this.player.currentTime = 0;
    this.currentTimeContainer.innerHTML = formatVideoTime(0);
    this.registerView();
  };

  initEnded () {
    this.player.addEventListener('ended', this.ended);
  }

  changeCurrentTimeLine () {
    this.player.addEventListener('timeupdate', () => {
      this.currentTimeContainer.innerHTML = formatVideoTime(this.player.currentTime);
    });
  }

  async init () {
    if (!this.container) return;

    try {
      await this.onPlayerLoaded();
    } catch (e) {
      console.error(e);
    }
    this.initPlay();
    this.initVolume();
    this.initFullScreen();
    this.initKeyboardEvents();
    this.initEnded();
    this.changeCurrentTimeLine();
  }

  registerView () {
    const path = window.location.href.split('/');

    fetch(`/api/${path[path.length - 1]}/view`, { method: 'POST' })
      .then(response => {
        if (response.status === 200) {
          const viewsContainer = document.querySelector('.video__views');
          let views = +viewsContainer.innerText;
          views = !isNaN(views) ? views + 1 : 1;
          viewsContainer.innerText = views === 1 ? '1 view' : `${views} views`;
        }
      });
  }
}

export const videoPlayerInit = containerId => {
  const videoContainer = document.getElementById(containerId);

  const init = async () => {
    const videoPlayer = new VideoPlayer(containerId);
    await videoPlayer.init();
  };

  if (videoContainer) {
    init().catch(console.error);
  }
};

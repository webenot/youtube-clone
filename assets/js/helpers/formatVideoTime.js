const formatVideoTime = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 60 / 60);
  let minutes = Math.floor((secondsNumber - hours * 60 * 60) / 60);
  let totalSeconds = secondsNumber - hours * 60 * 60 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

export default formatVideoTime;

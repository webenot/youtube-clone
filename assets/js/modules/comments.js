import axios from 'axios';

class CommentForm {
  constructor (commentsId) {
    this.container = document.getElementById(commentsId);
    if (!this.container) return;
    this.form = this.container.querySelector('.add__comment');
    this.commentsList = this.container.querySelector('.video__comments-list');
    this.commentsCountContainer = this.container.querySelector('.video__comments-number');
    this.handleSubmit.bind(this);
  }

  async sendComment (comment) {
    const path = window.location.href.split('/');
    const id = path[path.length - 1].split('?');

    const response = await axios({
      url: `/api/${id[0]}/comment`,
      method: 'POST',
      data: { comment },
    });
    if (response.status === 403) {
      alert('To comment this video you have to be logged in!');
      return;
    }
    if (response.status !== 200) {
      alert('Server Error! Please, try to comment again!');
      return;
    }
    const commentElement = document.createElement('li');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `<span>${comment}</span>`;
    this.commentsList.prepend(commentElement);
    let commentsNumber = +this.commentsCountContainer.innerText;
    commentsNumber = !isNaN(commentsNumber) ? commentsNumber + 1 : 1;
    this.commentsCountContainer.innerText =
      `${commentsNumber} comment${commentsNumber > 1 ? 's' : ''}`;
  }

  handleSubmit = event => {
    event.preventDefault();
    this.commentInput = this.form.querySelector('input[type="text"]');
    this.comment = this.commentInput.value;
    if (!this.comment) return false;
    this.sendComment(this.comment).catch(console.error);
    this.commentInput.value = '';
    return false;
  }

  init () {
    if (!this.form) return;
    this.form.addEventListener('submit', this.handleSubmit);
  }
}

export default CommentForm;

import axios from 'axios';

class CommentForm {
  constructor (commentsId) {
    this.container = document.getElementById(commentsId);
    if (!this.container) return;
    this.form = this.container.querySelector('.add__comment');
    this.commentsList = this.container.querySelector('.video__comments-list');
    this.commentsCountContainer = this.container.querySelector('.video__comments-number');
    this.comment = '';
    const path = window.location.href.split('/');
    const [ videoId ] = path[path.length - 1].split('?');
    this.videoId = videoId;
    let commentsNumber = parseInt(this.commentsCountContainer.innerText, 10);
    commentsNumber = !isNaN(commentsNumber) ? commentsNumber : 1;
    this.commentsNumber = commentsNumber;
    this.handleSubmit.bind(this);
    this.handleDeleteComment.bind(this);
  }

  async sendComment (comment) {
    const response = await axios({
      url: `/api/${this.videoId}/comment`,
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
    const spanWrapper = document.createElement('span');
    spanWrapper.classList.add('comment__content');
    const spanElement = document.createElement('span');
    spanElement.innerText = comment;
    spanWrapper.appendChild(spanElement);
    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('fas', 'fa-times', 'comment__delete');
    spanWrapper.appendChild(deleteBtn);
    commentElement.setAttribute('data-id', response.data.id);
    commentElement.appendChild(spanWrapper);
    this.commentsList.prepend(commentElement);
    this.commentsNumber += 1;
    this.renderCommentsNumber(this.commentsNumber);
  }

  async deleteComment (commentId, element) {
    const response = await axios({
      url: `/api/${this.videoId}/comment/${commentId}`,
      method: 'DELETE',
    });
    if (response.status === 200) {
      element.remove();
      this.commentsNumber -= 1;
      this.renderCommentsNumber(this.commentsNumber);
    }
  }

  renderCommentsNumber (number) {
    this.commentsCountContainer.innerText = `${number} comment${number > 1 ? 's' : ''}`;
  }

  handleSubmit = event => {
    event.preventDefault();
    this.commentInput = this.form.querySelector('input[type="text"]');
    this.comment = this.commentInput.value;
    if (!this.comment) return false;
    this.sendComment(this.comment).catch(console.error);
    this.commentInput.value = '';
    this.comment = '';
    return false;
  };

  handleDeleteComment = event => {
    const confirmation = confirm('Are you sure you want to delete this comment?');
    if (!confirmation) return;
    const currentComment = event.target.closest('li');
    const commentId = currentComment.dataset.id;
    this.deleteComment(commentId, currentComment).catch(console.error);
  };

  init () {
    if (!this.form) return;
    this.form.addEventListener('submit', this.handleSubmit);
    this.commentsList.addEventListener('click', this.handleDeleteComment);
  }
}

export default CommentForm;

document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
  });
  
  async function fetchPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
      postsContainer.appendChild(createPostElement(post));
    });
  }
  
  function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
  
    const img = document.createElement('img');
    img.src = post.photoUrl;
    postElement.appendChild(img);
  
    const actions = document.createElement('div');
    actions.classList.add('actions');
  
    const likeButton = document.createElement('button');
    likeButton.textContent = `Like (${post.likes})`;
    likeButton.onclick = () => likePost(post.id);
    actions.appendChild(likeButton);
  
    postElement.appendChild(actions);
  
    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');
  
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Add a comment...';
    commentInput.onkeypress = (event) => {
      if (event.key === 'Enter') {
        addComment(post.id, commentInput.value);
        commentInput.value = '';
      }
    };
    commentSection.appendChild(commentInput);
  
    post.comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.textContent = comment;
      commentSection.appendChild(commentElement);
    });
  
    postElement.appendChild(commentSection);
  
    return postElement;
  }
  
  async function uploadPhoto() {
    const photoInput = document.getElementById('photo');
    const file = photoInput.files[0];
    const formData = new FormData();
    formData.append('photo', file);
  
    await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });
  
    fetchPosts();
  }
  
  async function likePost(postId) {
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    fetchPosts();
  }
  
  async function addComment(postId, comment) {
    await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment })
    });
    fetchPosts();
  }
  
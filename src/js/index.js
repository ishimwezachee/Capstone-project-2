import '../style.css';
import counter from './counter.js';

const card = document.querySelector('.cards');
const body = document.querySelector('body');
const modal = document.getElementById('myModal');
const modalContent = document.querySelector('.content');
const spaceShip = document.querySelector('.space');
const baseUrl = 'https://api.tvmaze.com/search/shows?q=a';
const baseApiUrl = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/6AClVl2oXlI9tDJKRbp5/comments';

const reachData = async () => {
  const getData = await fetch(baseUrl);
  const dataContent = await getData.json();
  return dataContent;
};
reachData().then((data) => {
  spaceShip.innerText = `(${counter(data)})`;
});

reachData().then((data) => data.forEach(
  (e) => {
    card.innerHTML += `
           <div class="card">
           <img src="${e.show.image.medium}" alt="image">
           <div class="name-icon">
               <P class="name">${e.show.name}</P>
               <div class="onlike">
               <i id="${e.show.id}" class="far fa-heart likes"></i>
               <p><span id="${e.show.id}" class="number">0</span> likes</p>
               </div>
           </div>
           <button class="comments" id="${e.show.id}">Comments</button>
           </div>
            `;
  },
));

const getComment = async (id) => {
  const getData = await fetch(`${baseApiUrl}?item_id=${id}`);
  const dataContent = await getData.json();
  return dataContent;
};

const getCommentItems = (id) => {
  getComment(id).then((data) => {
    const commentList = document.querySelector('.comment-list');
    const commentName = document.querySelector('#name');
    const commentText = document.querySelector('#commentText');

    if (counter(data) === undefined) {
      commentList.innerHTML = 'No Comments';
    } else {
      commentList.innerHTML = `<h4>Comments(${counter(data)})</h4>`;
      data.forEach((e) => {
        commentList.innerHTML += `
                  <ul>
                  <li>${e.username} : </li>
                  <li>${e.comment}</li>
                  </ul>
                  `;
      });
      commentName.value = '';
      commentText.value = '';
    }
  });
};

const postItem = async (value) => {
  (await fetch(baseApiUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      item_id: value.id,
      username: value.name,
      comment: value.text,
    }),
  }));
  getCommentItems(value.id);
};

const getDataFromApi = (id) => {
  getCommentItems(id);
  reachData().then((data) => {
    data.forEach((el) => {
      if (el.show.id.toString() === id.toString()) {
        modalContent.innerHTML = `
           <div class="card">
           <div class="summary-image">
           <div class="imag-name">
           <img class="medium" src="${el.show.image.medium}" alt="">
           <p class="name">${el.show.name}</p>
           </div>
            <div class="text">
            <p class="summary">${el.show.summary}</p>
           <p class="language"><span>Language:</span>${el.show.language}</p>
            </div>
           </div>
               <input type="hidden" name="id" id="id" value="${el.show.id}">
               <div class="comment-list">
               <p>loading</p>
              </div>
               <div class="parent">
               <div class="commentArea">
               <input type="text" name="name" id="name" placeholder="Name">
               <textarea type="text" name="commentText" id="commentText" placeholder="Comments"rows="4" cols="50"></textarea>
               <button class="add-comments">Add Comments</button>
               </div>
               </div>
          
           </div>
           </div>
           </div>
            `;
      }
    });
  });
};

const CreateLikes = async (id) => {
  const data = await fetch('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/6AClVl2oXlI9tDJKRbp5/likes', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item_id: id }),
  });
  return data;
};

// get likes
const getData = async (collaback) => {
  const url = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/6AClVl2oXlI9tDJKRbp5/likes';
  const data = await fetch(url);
  const content = await data.json();
  collaback(content);
};

const addLikes = (id) => {
  reachData().then((data) => {
    data.forEach((el) => {
      if (el.show.id.toString() === id.toString()) {
        CreateLikes(id).then((data) => {
          if (data.status === 201) {
            getData((data) => {
              data.forEach((val) => {
                if (val.item_id.toString() === id.toString()) {
                  const elem = document.getElementById(id.toString());
                  elem.parentElement.lastElementChild.firstElementChild.textContent = val.likes;
                }
              });
            });
          }
        });
      }
    });
  });
};

window.addEventListener('load', () => {
  getData((data) => {
    data.forEach((element) => {
      const likesCount = document.querySelectorAll('.number');
      likesCount.forEach((e) => {
        if (e.id.toString() === element.item_id.toString()) {
          e.textContent = element.likes;
        }
      });
    });
  });
});

body.addEventListener('click', (e) => {
  if (e.target.className === 'comments') {
    modal.style.display = 'block';
    getDataFromApi(e.target.id);
  }
  if (e.target.className === 'close') {
    modal.style.display = 'none';
  }
  if (e.target === modal) {
    modal.style.display = 'none';
  }
  if (e.target.className === 'far fa-heart likes') {
    addLikes(e.target.id);
  }
  if (e.target.className === 'add-comments') {
    const value = { name: document.querySelector('#name').value, text: document.querySelector('#commentText').value, id: document.querySelector('#id').value };
    postItem(value);
  }
});

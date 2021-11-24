import '../style.css';

const card = document.querySelector('.cards');

const baseUrl = 'https://api.tvmaze.com/search/shows?q=girls';

const reachData = async () => {
    const getData = await fetch(baseUrl);
    const content = await getData.json();
    return content;
};
reachData().then((data) => data.forEach(
    (e) => {
        card.innerHTML += `
           <div class="card">
           <img src="${e.show.image.medium}" alt="">
           <div class="name-icon">
               <P class="name">${e.show.name}</P>
               <i class="far fa-heart"></i>
           </div>
           <button class="comments" id="${e.show.id}">Comments</button>
           </div>
            `;
    },
));


const commentBtn = document.getElementsByTagName('button');
console.log(commentBtn);





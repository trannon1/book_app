'use strict';

const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');

const PORT = 3000;
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded());

app.get('/', getForm);
app.post('/searches', getBookInfo);

function getForm(request, response){
  response.render('pages/index');
}

function getBookInfo(request, response){

  let url = 'https://www.googleapis.com/books/v1/volumes?q='
  // {
  //   "search": [
  //   "hatchet",
  //   "title"
  //   ]
  //   }
  let typeOfSearch = request.body.search[1];
  let searchCriteria = request.body.search[0];

  if(typeOfSearch === 'author'){
    url += `+inauthor:${searchCriteria}`;
  }

  if(typeOfSearch === 'title'){
    url += `+intitle:${searchCriteria}`;
  }

  superagent.get(url)
    .then(res => {
      let bookArray = res.body.items.map(book => {
        return new Book(book.volumeInfo)
      });

      response.render('pages/searches/show');
    })
}

  
function Book(bookObj){
  const placeholderImage = `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = bookObj.title || 'no title available';
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
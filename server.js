'use strict';

const express = require('express');
require('dotenv').config();
const app = express();
require('ejs');
const superagent = require('superagent');
const client = require('./lib/client');

const PORT = process.env.PORT || 3001;
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded ({ extended: true, }));

app.get('/', getIndex);
app.post('/searches', getBookInfo);
app.get('/searches/new', getForm);
app.post('/', insertIntoDatabase);

function getIndex(request, response){
  response.render('index');
}

function getForm(request, response){
  response.render('pages/searches/new');
}

function getBookInfo(request, response){

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
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
      let tenBooksArray = [];
      for (let i = 0; i < 10; i++){
        tenBooksArray.push(res.body.items[i]);
      }
      let bookArray = tenBooksArray.map(book => {
        return new Book(book.volumeInfo);
      });
    response.render('pages/searches/show', {bookArray: bookArray});
    });
}

function insertIntoDatabase(request, response){
  console.log(request.body.book);
}

function Book(bookObj){
  const placeholderImage = `https://i.imgur.com/J5LVHEL.jpg`;
  bookObj.imageLinks.thumbnail !== null ? this.image = bookObj.imageLinks.thumbnail : this.image = placeholderImage;
  this.image.substring(0,5) != 'https'? this.image = this.image.substring(0,4) + 's' + this.image.substring(4, this.image.length): this.image;
  bookObj.title !== null ? this.title = bookObj.title : this.title = 'no title available';
  bookObj.authors !== null ? this.authors = bookObj.authors : this.authors = 'no author available';
  bookObj.description !== null ? this.description = bookObj.description : this.description = 'no description available';
  bookObj.industryIdentifiers[1].identifier !== null ? this.isbn = bookObj.industryIdentifiers[1].identifier : this.isbn = 'no isbn available';
}

app.get('*', (request, response) => {
  response.status(404).render('pages/error');
});

client.connect()
  .then( () => {
    app.listen(PORT, () => console.log(`App is on port ${PORT}`));
  })
  .catch( err => console.error(err));

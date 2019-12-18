'use strict';

const express = require('express');
require('dotenv').config();
const app = express();
require('ejs');
const superagent = require('superagent');
// const client = require('./lib/client');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT || 3001;
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded ({ extended: true, }));

app.get('/', getForm);
app.post('/searches', getBookInfo);
var sqr = $('.square');

function getForm(request, response){
  response.render('index');
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

sqr.on('click', (e) => {
  const sql = `INSERT INTO bookshelf (author, title, isbn, image_url, description, bookshelf)`
  // this.li[0] = title; 
  safeValues = [this.li[0]]
});

// const locationObject = new Location(location, results.body.results[0]);
        
//             const sql = `INSERT INTO location (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);`;
//             const safeValues = [locationObject.search_query, locationObject.formatted_query, locationObject.latitude, locationObject.longitude];

//             client.query(sql, safeValues)

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

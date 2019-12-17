'use strict';

const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');

const PORT = process.env.PORT || 3001;
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded ({ extended: true, }));

app.get('/', getForm);
app.post('/searches', getBookInfo);


function getForm(request, response){
  response.render('index');
}

function getBookInfo(request, response){

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
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
      let tenBooksArray = [];
      for (let i = 0; i < 10; i++){
        tenBooksArray.push(res.body.items[i]);
      }
      // console.log(tenBooksArray);
      let bookArray = tenBooksArray.map(book => {
        return new Book(book.volumeInfo);
      });
      console.log(bookArray);
    response.render('pages/searches/show', {bookArray: bookArray});
    });
}



function Book(bookObj){
  const placeholderImage = `https://i.imgur.com/J5LVHEL.jpg`;
  bookObj.imageLinks.thumbnail !== null ? this.image = bookObj.imageLinks.thumbnail : this.image = placeholderImage;
  this.image.substring(0,5) != 'https'? this.image = this.image.substring(0,4) + 's' + this.image.substring(4, this.image.length): this.image;
  bookObj.title !== null ? this.title = bookObj.title : this.title = 'no title available';
  bookObj.authors !== null ? this.authors = bookObj.authors : this.authors = 'no author available';
  bookObj.description !== null ? this.description = bookObj.description : this.description = 'no description available';
}

// Book.prototype.render = function () {
//   const myTemplate = $('#book-template').html();
//   const $newSection = $('<section></section>');
//   $newSection.html(myTemplate);
//   $newSection.find('img').attr('src', this.image);
//   $newSection.find('h1').text(this.title);
//   $newSection.find('h2').text(this.author);
//   $newSection.find('p').text(this.description);
//   $('main').append($newSection);
// }


app.listen(PORT, () => console.log(`listening on ${PORT}`));

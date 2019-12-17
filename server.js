// Bryan Tran
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const ejs = require('ejs');
const app = express();

const PORT = process.env.PORT || 3001;
app.use(cors());

// routes

app.get('*', (request, response) => {
  response.status(404).send('Page not found');
});

app.listen(PORT, () => console.log(`App is on port ${PORT}`));
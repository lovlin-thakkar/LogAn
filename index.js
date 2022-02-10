const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs')

// my implementations added as a import from other files
const readlog = require('./readlog.js')
const searchlog = require('./searchlog.js')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('<!DOCTYPE html>\
<html>\
<body>\
  <h1>LogAn</h1> \
  <h3>Welcome to the first generation Log Analyser!</h3> \
  <form action="/search" method="POST">\
    <fieldset>\
      <label>Keyword</label>\
      <input type="text" id = "keyword" name="keyword" required></br>\
      <label>Print Mode (line or chunk)</label>\
      <input type="text" id = "printMode" name="printMode" required> \
      <br><br>\
      <button type ="submit" onsubmit=>Search</button>\
    </fieldset>\
  </form>\
  </br>\
  <form action="/read" method="POST">\
    <fieldset>\
      <label>Line Number</label>\
      <input type="text" id = "lineNumber" name="lineNumber" required>\
      <br><br>\
      <button type ="submit" onsubmit=>Read</button>\
    </fieldset>\
  </form>\
</body>\
</html>');
});

app.post('/search', (req, res) => {
  let searchString = req.body.keyword;
  let chunkSize = Math.max(256, searchString.length);
  if (req.body.printMode == "line") {
    readlog.searchLog('example.txt', chunkSize, searchString).then((result) => {
      console.log(result);
    });
  } else {
    searchlog.searchLog('example.txt', chunkSize, searchString).then((result) => {
      console.log(result);
    });
  }

  console.log("Searching...")
});

app.post('/read', (req, res) => {
  let lineNumber = req.body.lineNumber;
  let chunkSize = 256;
  readlog.readLog('example.txt', chunkSize, lineNumber).then((result) => {
    console.log(result);
  });

  console.log("Reading...")
});

app.listen(3000, () => {
  console.log('server started');
});
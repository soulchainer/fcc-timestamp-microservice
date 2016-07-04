var express = require('express');

// return a function to create a express server
module.exports = function () {
  var app = express();

  var dateToJSON = function (req, res) {
    var unix = req.params.unix,
        month = req.params.month,
        day = req.params.day,
        year = req.params.year;
    var date, json = {};
    var months = ["January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];

    if (unix) {
      json.unix = Number(unix);
      date = new Date(unix * 1000);
      json.natural = months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear();
    } else {
      date = new Date(month + " " + day + ", " + year);
      json.unix = Date.UTC(year, date.getMonth(), day) / 1000;
      json.natural = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    }
    res.send(JSON.stringify(json));
  }

  var nullJSON = function (req, res) {
    var json = {"unix": null, "natural": null};
    res.send(JSON.stringify(json));
  }

  // serve static content in folder public/
  app.use(express.static('public'));
  app.get('/:month(January|February|March|April|May|June|July|August|September|October|November|December)(%20)?:day(\\d{1,2}),(%20)?:year(\\d{4})', dateToJSON);
  app.get('/:unix(\-?\\d+)', dateToJSON);
  app.get('/*', nullJSON);

  return app;
};

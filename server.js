const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const URL = require("url").URL;

const request = require('request');
const cheerio = require('cheerio');

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const routes = require('./routes');
app.use(routes);

app.use(cors())
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));




// for demo purpose
//demo_url = "https://www.copyblogger.com/";

var stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};


app.post(`/api/scrap`, function (req, res) {

  var demo_url = req.body.data.Url;
  
  if (stringIsAValidUrl(demo_url) === false) {
    res.send({ code: 100, message: "Invaild Url" })
    res.end();
    return false;
  }


  request(demo_url, (error, response, html) => {

    var Result = [];

    if (!error && response.statusCode === 200) {
      var $ = cheerio.load(html);

      //var title, no_of_headings, no_of_internal_links, no_of_external_links, no_of_images;
      var dataCollection = {
        title: "", no_of_headings: "",
        no_of_internal_links: "", no_of_external_links: "", no_of_images: "",
        largest_image: ""
      };

      //console.log($);

      //var htmlVersion = $('!DOCTYPE').text();
     // dataCollection.htmlDocVersion = htmlVersion;

      //console.log(htmlVersion)


      // We'll use the unique header class as a starting point.
      var title = $('title').text();
      dataCollection.title = title;

      // compute number of headings
      headings = $('h1,h2,h3,h4,h5,h6');
      var headings_counter = 0;
      $(headings).each(function (i, heading) {
        headings_counter += 1;
      });
      dataCollection.no_of_headings = headings_counter;

      // compute number of internal links
      var links = $("a[href^='" + demo_url + "'], a[href^='/'], a[href^='./'], a[href^='../'], a[href^='#']");
      var links_counter = 0;
      $(links).each(function (i, link) {
        links_counter += 1;
      });
      dataCollection.no_of_internal_links = links_counter;

      // compute number of external links
      var links = $('a');
      var links_counter = 0;
      $(links).each(function (i, link) {
        links_counter += 1;
      });
      dataCollection.no_of_external_links = links_counter;

      // compute number of pictures
      var images = $('img');
      var image_counter = 0;
      var maxImage = null;
      var maxDimension = 0;


      //code for largest image
      $(images).each(function (i, image) {

        image_counter += 1;

        //console.log(imagesData);
        //        for (img in images)
        var currDimension = $(image).attr('width') * $(image).attr('height')
        if (currDimension > maxDimension) {
          maxDimension = currDimension;
          maxImage = image;
//          console.log($(maxImage).attr('src'));
        }
      });
      dataCollection.largest_image = $(maxImage).attr('src');
      dataCollection.no_of_images = image_counter;

      resultCollection = {
        'title': dataCollection.title,
        'no_of_headings': dataCollection.no_of_headings,
        'no_of_internal_links': dataCollection.no_of_internal_links,
        'no_of_external_links': dataCollection.no_of_external_links,
        'no_of_images': dataCollection.no_of_images,
        'largest_image': dataCollection.largest_image,
        'htmlDocVersion': dataCollection.htmlDocVersion
      }
      Result.push(resultCollection);

      // res.send(Result);
      res.send({ output: Result, code: 200 });
      res.end();
      //console.log(Result)
    }
    else if (response.statusCode === 404) {
      console.log("page not found");

      res.send({ code: 404, message: "Page not Found" });
      res.end();
    }
    else {
      console.log("There are some errors");
      res.send({ code: 500, message: "There are some errors" });
      res.end();
    }
  });
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
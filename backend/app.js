const express = require('express');
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const feedsRoutes = require("./routes/feeds");
const scrapRoutes = require("./routes/scrap");


const app = express();

mongoose
  .connect(
    "mongodb+srv://dailytrends:NOkzKaTSEqntmsgd@dailytrends.j5xh7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Special-Request-Header"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/feeds', feedsRoutes);

app.use('/api/scrap', scrapRoutes);

// app.use('/api/scrap', (req, res, next) => {
//   const browserObject = require('./browser');
//   const scraperController = require('../middleware/scraper');


//   //Start the browser and create a browser instance
//   let browserInstance = browserObject.startBrowser();

//   // Pass the browser instance to the scraper controller
//   const scrapeall = scraperController.scrapeAll(browserInstance, (err, res));

//   console.log(scrapeall);
// });

// app.post("/api/posts", (req, res, next) => {
//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content
//   });
//   post.save().then(createdPost => {
//     res.status(201).json({
//       message: "Post added successfully",
//       postId: createdPost._id
//     });
//   });
// });

module.exports = app;

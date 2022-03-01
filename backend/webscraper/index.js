const browserObject = require('./browser');
const scraperController = require('../middleware/scraper');
const FeedController = require('../controllers/feeds');
const Feed = require("../models/feed");
var async = require('async');
const {performance} = require('perf_hooks');




// Pass the browser instance to the scraper controller
exports.getScrapedFeed = async (req, res, next) => {
  const t0 = performance.now();
  //Start the browser and create a browser instance
  let browserInstance = await browserObject.startBrowser();

  const scraperData = await scraperController.scrapeAll(browserInstance);
  const timing = performance.now()-t0;
  console.log(timing);



  Feed.insertMany(scraperData)
  .then( () => {
    return res.status(200).json({ message: "Feeds inserted" });
  })
  .catch( () => {
    return res.status(500).json({
      message: "Error"
    });
  });

}


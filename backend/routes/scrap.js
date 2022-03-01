const express = require("express");

const scraper = require("../webscraper/index");

const router = express.Router();

// router.post("", scraper);
router.get("", scraper.getScrapedFeed);


module.exports = router;

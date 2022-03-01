const Feed = require("../models/feed");

exports.createFeed = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const feed = new Feed({
    title: req.body.title,
    body: req.body.body,
    imagePath: url + "/images/" + req.file.filename,
    source: req.body.source,
    publisher: req.body.publisher
  });
  feed.save().then((createdFeed) => {
    res.status(201).json({
      message: "Feed added successfully",
      feed: {
        ...createdFeed,
        id: createdFeed._id,
      },
    });
  })
  .catch((error) => {
    res.status(500).json({
      message: "Creating a feed failed!",
    });
  });
};

exports.updateFeed = (req, res, next) => {
  let imagePath = req.file.filename;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const feed = new Feed({
    _id: req.body.id,
    title: req.body.title,
    body: req.body.body,
    imagePath: imagePath,
    source: req.body.source,
    publisher: req.body.publisher,
  });
  Feed.updateOne(feed)
    .then((result) => {
      res.status(200).json({
        message: "Update successful!"
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update feed!"
      });
    });
};

exports.getFeeds = (req, res, next) => {
  const feedQuery = Feed.find();
  feedQuery
    .then((documents) => {
      fetchedFeeds = documents;
      return Feed.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Feeds fetched successfully!",
        feeds: fetchedFeeds,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching feeds failed",
      });
    });
};

exports.getFeed = (req, res, next) => {
  Feed.findById(req.params.id)
    .then((feed) => {
      if (feed) {
        res.status(200).json(feed);
      } else {
        res.status(404).json({ message: "Feed not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching feed failed",
      });
    });
};

exports.deleteFeed = (req, res, next) => {
  Feed.deleteOne()
    .then((result) => {
      res.status(200).json({ message: "Feed deleted!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching feeds failed",
      });
    });
};

exports.deleteScrapedFeeds = (req, res, next) => {
  console.log("Deleting scraped feeds");
  Feed.deleteMany({ imagePath: /^https/ })
    .then((result) => {
      res.status(200).json({ message: "Feed deleted!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching feeds failed",
      });
    });
};

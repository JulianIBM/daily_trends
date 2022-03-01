const pageScraper = require("../webscraper/pageScraper");

async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    let scrapedRawData = [];
    let scrapedData = [];
    scrapedRawData["Pais"] = await pageScraper.scraper(
      browser,
      "https://elpais.com/"
    );

    scrapedRawData["Mundo"] = await pageScraper.scraper(
      browser,
      "https://www.elmundo.es/"
    );

    await browser.close();

    for (let cat in scrapedRawData) {
      for (let el in scrapedRawData[cat]) {
        scrapedData.push(scrapedRawData[cat][el]);
      }
    }

    return scrapedData;
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
    return err;
  }
}

module.exports.scrapeAll = (browserInstance) => scrapeAll(browserInstance);

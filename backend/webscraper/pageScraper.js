const scraperObject = {
  async scraper(browser, url) {
    if (url == "https://elpais.com/") {
      selector = "#fusion-app";
      selectorAll = "#fusion-app h2 a";
      var title = ".a_e_txt > h1";
      var body = ".a_e_txt > h2";
      var source = ".a_md_a > a";
      var publisher = "El Pais";
      var imageUrl = ".a_m > .a_m_w > img";
      var altImage =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Elpais-co.svg/1280px-Elpais-co.svg.png";
    } else {
      var selector = ".main";
      var selectorAll = ".main header a";
      var title = ".ue-l-article__header-content > h1";
      var body = ".ue-l-article__header > p";
      var source = ".ue-c-article__byline-item > div";
      var publisher = "El Mundo";
      var imageUrl = "picture > img";
      var altImage =
        "https://e00-elmundo.uecdn.es/assets/v19/img/destacadas/elmundo__logo-generica.jpg";
    }
    const page = await browser.newPage();
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: "networkidle2" });
    let scrapedData = [];
    // Wait for the required DOM to be rendered
    await page.waitForSelector(selector);
    // Get the link to all the required books
    let urls = await page.evaluate(() => {
      if (this.document.location == "https://elpais.com/") {
        selectorAll = "#fusion-app h2 a";
      } else {
        selectorAll = ".main header a";
      }
      const elements = document.querySelectorAll(selectorAll);
      const links = [];
      for (let i = 0; i < 5; i++) {
        links.push(elements[i].href);
      }
      return links;
    });

    // Loop through each of those links, open a new page instance and get the relevant data from them
    let pagePromise = (link) =>
      new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(link);
        dataObj["title"] = await newPage.$eval(
          title,
          (text) => text.textContent
        );
        dataObj["body"] = (await newPage.$(body))
          ? await newPage.$eval(body, (text) => text.textContent)
          : " ";
        dataObj["source"] = await newPage.$eval(source, (text) => {
          // Strip new line and tab spaces
          text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
          text = text.toLowerCase();
          const arr = text.split(" ");
          for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
          }
          const str2 = arr.join(" ");
          return str2;
        });
        dataObj["publisher"] = publisher;
        dataObj["imagePath"] = (await newPage.$(imageUrl))
          ? await newPage.$eval(imageUrl, (img) => img.src)
          : altImage;
        resolve(dataObj);
        await newPage.close();
      });

    for (link in urls) {
      let currentPageData = await pagePromise(urls[link]);
      scrapedData.push(currentPageData);
    }
    return scrapedData;
  },
};

module.exports = scraperObject;

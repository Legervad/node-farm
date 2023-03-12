`use strict`;
const http = require("http");
const fs = require("fs");
/////////////////////////////////////////
// SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  `utf-8`
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  `utf-8`
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  `utf-8`
);

const replaceTemplate = (tempCard, product) => {
  let output = tempCard.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  output = output.replace(
    /{%NOT_ORGANIC%}/g,
    product.organic ? "" : "not-organic"
  );

  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, `utf-8`);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    // An array of HTML as strings
    let cardsHTML = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(output);
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT");
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });

    res.end("<h1> PAGE NOT FOUND! </h1>");
  }
});

server.listen(8080);

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const dataService = require("./modules/data-service.js");

const HTTP_PORT = process.env.port || 8080;
const myData = dataService(
  "mongodb+srv://dmitriy:admin@test-uluoh.mongodb.net/sample_supplies?retryWrites=true&w=majority"
);

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)
app.post("/api/sales", (req, res) =>
  myData
    .addNewSale()
    .then(data => res.json({ data }).status(200))
    .catch(err => res.json({ err }).status(500))
);

// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage",
// ie: /api/sales?page=1&perPage=5 )
app.get("/api/sales", (req, res) =>
  myData
    .getAllSales(req.query.page, req.query.perPage)
    .then(data => res.json({ data }).status(200))
    .catch(err => res.json({ err }).status(500))
);

// GET /api/sales (NOTE: This route must accept a numeric route parameter,
// ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.get("/api/sales/:id", (req, res) =>
  myData
    .getSaleById(req.params.id)
    .then(data => res.json({ data }).status(200))
    .catch(err => res.json({ err }).status(500))
);

// PUT /api/sales (NOTE: This route must accept a numeric route parameter,
// ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put("/api/sales/:id", (req, res) =>
  myData
    .updateSaleById(req.body, req.param.id)
    .then(data => res.json({ data }).status(200))
    .catch(err => res.json({ err }).status(500))
);

// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:id", (req, res) =>
  myData
    .deleteSaleById(req.params.id)
    .then(deletedSale => res.json({ deletedSale }).status(200))
    .catch(err => res.json({ err }).status(500))
);

// ************* Initialize the Service & Start the Server

myData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jiixnyw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// main run function starts
async function run() {
  try {
    const categoryCollection = client
      .db("resaleProducts")
      .collection("resaleProductCategories");

    // make api for all resale product categories
    app.get("/resaleProductCategories", async (req, res) => {
      const query = {};
      const options = await categoryCollection.find(query).toArray();
      res.send(options);
    });
  } finally {
  }
}

run().catch(console.log);

// basic root
app.get("/", async (req, res) => {
  res.send("used resale product server is running..");
});

app.listen(port, () =>
  console.log(`resale product server is running on ${port}`)
);

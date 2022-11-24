const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
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

// verify jwt
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

// main run function starts
async function run() {
  try {
    const categoryCollection = client
      .db("resaleProducts")
      .collection("resaleProductCategories");

    const categoryWiseCollection = client
      .db("resaleProducts")
      .collection("categoryWiseProducts");

    const usersCollection = client.db("resaleProducts").collection("users");

    // make api for all resale product categories
    app.get("/resaleProductCategories", async (req, res) => {
      const query = {};

      // const decodedEmail = req.decoded.email;
      // if (email !== decodedEmail) {
      //   return res.status(403).send({ message: "forbidden access" });
      // }

      const options = await categoryCollection.find(query).toArray();
      res.send(options);
    });

    // category wise product
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categories: id };
      const selectedCat = await categoryWiseCollection.find(query).toArray();
      res.send(selectedCat);
    });

    // jwt token
    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);

      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "2d",
        });
        return res.send({ accessToken: token });
      }

      res.status(403).send({ accessToken: "" });
    });

    // post users data into the database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
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

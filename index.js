const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// basic root
app.get("/", async (req, res) => {
  res.send("used resale product server is running..");
});

app.listen(port, () =>
  console.log(`resale product server is running on ${port}`)
);

const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const dotenv = require("dotenv");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// manere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4vnd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("TourPlan");
    const tourCollection = database.collection("tour");
    const manageCollection = database.collection("managetour");

    // POST API
    app.post("/addservices", async (req, res) => {
      const service = req.body;
      const result = await tourCollection.insertOne(service);

      res.json(result);
    });
    // SINLE POST API
    app.post("/users", async (req, res) => {
      const manageService = req.body;

      const result = await manageCollection.insertOne(manageService);
      res.json(result);
    });
    // Get manage order API
    app.get("/users", async (req, res) => {
      const cursur = manageCollection.find({});
      const resutl = await cursur.toArray();
      res.send(resutl);
    });
    // GET API
    app.get("/addservices", async (req, res) => {
      const cursur = tourCollection.find({});
      const resutl = await cursur.toArray();
      res.send(resutl);
    });
    // GET SINGLE API
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tourCollection.findOne(query);
      res.send(result);
    });
    // DELETE API
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = manageCollection.deleteOne(query);

      console.log("getting deleteing id", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("staart the root folder");
});
app.listen(port, () => {
  console.log("server is runnig ", port);
});

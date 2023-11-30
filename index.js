const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DIAG}:${process.env.DIAG_PASS}@cluster0.e2ydxes.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const handleMongoDB = async () => {
  try {
    const UserCollection = client.db("ApexDiagDB").collection("Users");
    const TestCollection = client.db("ApexDiagDB").collection("Tests");
    const BannerCollection = client.db("ApexDiagDB").collection("Banners");

    app.get("/users", async (req, res) => {
      let query = {};
      const result = await UserCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/tests", async (req, res) => {
      let query = {};
      const result = await TestCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/tests/:id", async (req, res) => {
      const { id } = req.params;
      const query1 = { _id: new ObjectId(id) };
      const result = await TestCollection.findOne(query1);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      newUser.role = "normal";
      newUser.status = "active";
      const result = await UserCollection.insertOne(newUser);
      res.send(result);
    });

    app.post("/tests", async (req, res) => {
      const newTest = req.body;
      const result = await TestCollection.insertOne(newTest);
      res.send(result);
    });
    
    app.post("/banners", async (req, res) => {
      const newBanner = req.body;
      newBanner.isActive = false;
      const result = await BannerCollection.insertOne(newBanner);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      // const options = { upsert: true };
      const updatedProperties = {
        $set: req.body, // { name, age }
      }; // {$set: {name, age}}
      const result = await UserCollection.updateOne(filter, updatedProperties);
      res.send(result);
    });
    
    app.put("/tests/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProperties = {
        $set: req.body, // { name, age }
      }; // {$set: {name, age}}
      const result = await TestCollection.updateOne(filter, updatedProperties, options);
      res.send(result);
    });

    app.delete("/tests/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await TestCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
};

handleMongoDB().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

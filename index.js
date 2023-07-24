const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//midleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfi6tak.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const College = client.db("College")
    const admissionCollection = client.db("College").collection("addmission")
    const reviewCollection = client.db("College").collection("review")

    app.get("/Colleges", async (req, res) => {
      const cursor = College.collection("allcolleges").find();
      const result = await cursor.limit(3).toArray();
      res.send(result);
    });
    app.get("/AllColleges", async (req, res) => {
      const cursor = College.collection("allcolleges").find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await College.collection("allcolleges").findOne(query);
      res.send(result);
    });

    app.get("/myCollege", async (req, res) => {
      query = { name : req.query.name };
      const result = await admissionCollection.find(query).toArray();
      res.send(result);
    });


    app.post("/addmission", async (req, res) => {
      const students = req.body;
      const result = await admissionCollection.insertOne(students);
      res.send(result);
    });

    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("College admission is going");
  });
  
  app.listen(port, () => {
    console.log(`College admission is going on port : ${port}`);
  });
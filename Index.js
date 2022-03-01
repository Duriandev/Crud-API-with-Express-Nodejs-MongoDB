const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://myUserAdmin:myUserAdmin@localhost:27017";

// insert document into the collection by POST method, 
// db.collection.insertOne()
// db.collection.insertMany()
app.post("/users/create", async (req, res) => {
  const user = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  // insertOne()
  await client.db("mydb").collection("users").insertOne({
    id: parseInt(user.id),
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    email: user.email,
    avatar: user.avatar
  });
  await client.close();
  res.status(200).send({
      "status": "ok",
      "message": "User with ID " + user.id + "is created.",
      "user": user
  });
});

// read all documents from collection by GET method
// db.collection.find()
app.get("/users", async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db("mydb").collection("users").find({}).toArray();
    await client.close();
    res.status(200).send(users);
});

// read document from collection by GET method with id
// db.collection.findOne()
app.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const user = await client.db("mydb").collection("users").findOne({"id": id});
  await client.close();
  res.status(200).send({
      "status": "ok",
      "user": user
  });
});

// update document from collection by PUT method
// db.collection.updateOne()
// db.collection.updateMany()
// db.collection.replaceOne()
app.put("/users/update", async (req, res) => {
  const user = req.body; 
  const id = parseInt(user.id);
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("mydb").collection("users").updateOne({ "id": id }, { "$set": {
      fname: user.fname,
      lname: user.lname,
      username: user.username,
      email: user.email,
      avatar: user.avatar
  }});
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = " + id + " is updated.",
    "user": user
  });
});

// Delate document in collection by DELETE method
//
//
app.delete("/users/delete", async (req, res) => {
  const id = parseInt(req.body.id);
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("mydb").collection("users").deleteOne({ "id": id });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = " + id + " is deleted."});
});


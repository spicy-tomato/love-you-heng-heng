const express = require("express");
const { google } = require("googleapis");
const { MongoClient } = require("mongodb");
require("dotenv").config();

async function main() {
  const app = express();
  const port = 3000;
  const username = encodeURIComponent(process.env.MONGODB_USERNAME);
  const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
  const cluster = encodeURIComponent(process.env.MONGODB_CLUSTER);
  const database = encodeURIComponent(process.env.MONGODB_DATABASE);

  const uri = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    client.connect();
  } catch (e) {
    console.log(e);
  }

  app.get("/login", login);
  app.get("/me", me);
  app.get("/users", (req, res) => verifyUser(req, res, client));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
  });
});

main().catch(console.error);

function login(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.REDERIECT_URI;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const scope = ["profile"];
  const url = oauth2Client.generateAuthUrl({ scope });
  res.send(url);
}

function me(req, res) {}

async function verifyUser(email) {
  const database = process.env.MONGODB_DATABASE;
  const cursor = await client.db(database).collection("users").find({});
  const results = await cursor.toArray();
  return results.map((r) => r.email).includes(email);
}

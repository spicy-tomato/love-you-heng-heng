const express = require("express");
const { google } = require("googleapis");
const { MongoClient, ServerApiVersion } = require("mongodb");

async function main() {
  const app = express();
  const port = 3000;
  var username = encodeURIComponent("snowflower1408");
  var password = encodeURIComponent("Uncrush0nu?..");
  const uri = `mongodb+srv://${username}:${password}@cluster0.03tdjzr.mongodb.net/lyhh?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    client.connect();
    await listDatabases(client);
  } catch (e) {
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  app.get("/login", (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
      "1042739600757-qghfrl7kb92c5mkol5ti5b5h5q96un9j.apps.googleusercontent.com",
      'client_secret":"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',
      "http://127.0.0.1:8080/client/"
    );

    const scopes = ["profile"];
    const url = oauth2Client.generateAuthUrl({
      scope: scopes,
    });
    res.send(url);
  });

  app.get("/users", async (req, res) => {
    const users = await client.db("lyhh").collections();
    console.log(users);
    res.send(users);
  });
}

main().catch(console.error);

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

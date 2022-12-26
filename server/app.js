require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const axios = require("axios").default;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const database = process.env.MONGODB_DATABASE;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

async function main() {
  const app = express();
  const port = 3000;
  const _username = encodeURIComponent(username);
  const _password = encodeURIComponent(password);
  const _cluster = encodeURIComponent(cluster);
  const _database = encodeURIComponent(database);

  const uri = `mongodb+srv://${_username}:${_password}@${_cluster}/${_database}?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    client.connect();
  } catch (e) {
    console.log(e);
  }

  app.use(cors());

  app.get("/generateAuthUrl", generateAuthUrl);
  app.get("/me", me);
  app.get("/exchange", exchange);
  app.get("/verify", (req, res) => verifyUser(req, res, client));

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

function generateAuthUrl(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const scope = ["profile", "https://www.googleapis.com/auth/userinfo.email"];
  const url = oauth2Client.generateAuthUrl({ scope });
  res.send(url);
}

async function exchange(req, res) {
  const code = req.query.code;

  axios
    .post(
      "https://oauth2.googleapis.com/token",
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        },
      }
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((e) => {
      res.send(null);
    });
}

async function verifyUser(req, res, client) {
  const code = req.headers.authorization;
  const cursor = await client.db(database).collection("users").find({});
  const results = await cursor.toArray();
  const email = await me(code);
  res.send(results.map((r) => r.email).includes(email));
}

async function me(bearer) {
  const results = await axios.get(
    "https://people.googleapis.com/v1/people/me?personFields=emailAddresses",
    {
      headers: {
        Authorization: bearer,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return results.data.emailAddresses.find((e) => e.metadata.primary).value;
}

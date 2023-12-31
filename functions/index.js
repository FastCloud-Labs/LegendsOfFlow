/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");
const {applicationDefault} = require("firebase-admin/app");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
admin.initializeApp({
  credential: applicationDefault(),
  projectId: "pvplegends",
  // eslint-disable-next-line max-len
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.getLaLigaFixtures = onRequest(async (request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  const axiosOptions = {
    method: "GET", url: "https://api-football-v1.p.rapidapi.com/v3/fixtures", params: {
      league: "140", season: "2023",
    }, headers: {
      "X-RapidAPI-Key": "09d3620e99mshad5ee7d3344b744p1c3cc9jsnbba61fd9b92d",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };
  try {
    const fixtures = await axios.request(axiosOptions);
    await admin.firestore().collection("fixtures")
        .doc("LaLiga")
        .set(fixtures.data.response)
        .then(() => {
          response.send(fixtures.data.response);
        })
        .catch((error) => {
          console.log("Error getting advisor documents: ", error);
          response.send(error);
        });
  } catch (error) {
    console.error(error);
    response.send(error);
  }
});


exports.getJWTToken = onRequest(async (request, response) => {
  cors(request, response, async () => {
    if (request.method != "POST") {
      response.status(400).send("Denied");
    }
    const body = request.body;
    const uid = body.uid;
    const cid = body.cid;
    const ts = body.ts;
    const dateTs = new Date(ts);
    const oneMinute = dateTs.setMinutes(dateTs.getMinutes() + 2);
    const now = Date.now();
    if (now > oneMinute) {
      console.log("too old");
      response.status(400).send("Denied");
      return;
    } else {
      console.log("good", uid);
      await admin.auth().createCustomToken(uid)
          .then((customToken) => {
            console.log("got token!");
            response.status(200).send({cid: cid, token: customToken});
            return;
          })
          .catch((error) => {
            console.log("Error creating custom token:", error);
            response.send(error);
            return;
          });
    }
  });
});

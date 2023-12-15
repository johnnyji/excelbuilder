const {Configuration, OpenAIApi} = require("openai");
const functions = require("firebase-functions/v2");

const openAIKey = functions.params.defineSecret("OPENAI_KEY");

const fbAPIKey = functions.params.defineSecret("FB_API_KEY");
const fbAuthDomain = functions.params.defineSecret("FB_AUTH_DOMAIN");
const fbProjectId = functions.params.defineSecret("FB_PROJECT_ID");
const fbStorageBucket = functions.params.defineSecret("FB_STORAGE_BUCKET");
const fbMessageSenderId = functions.params.defineSecret("FB_MESSAGE_SENDER_ID");
const fbAppId = functions.params.defineSecret("FB_APP_ID");
const fbMeasurementId = functions.params.defineSecret("FB_MEASUREMENT_ID");

const getSystemWording = (system) => {
  if (system === "EXCEL") return "an Excel";
  if (system === "SHEETS") return "a Google Sheets";
  if (system === "AIRTABLE") return "an Airtable";
};

exports.getFirebaseConfig = functions.https.onRequest(
    {
    // This must be defined everytime, can't be in a variable
      cors: [
        "http://localhost:3000",
        "https://excelformulator.com",
        "https://excelbuilder.firebaseapp.com",
      ],
      secrets: [
        fbAPIKey,
        fbAuthDomain,
        fbProjectId,
        fbStorageBucket,
        fbMessageSenderId,
        fbAppId,
        fbMeasurementId,
      ],
    },
    (_req, res) => {
      const config = {
        apiKey: fbAPIKey.value(),
        authDomain: fbAuthDomain.value(),
        projectId: fbProjectId.value(),
        storageBucket: fbStorageBucket.value(),
        messagingSenderId: fbMessageSenderId.value(),
        appId: fbAppId.value(),
        measurementId: fbMeasurementId.value(),
      };

      res.send({
        status: 200,
        data: config,
      });
    },
);

exports.explain = functions.https.onRequest(
    {
    // This must be defined everytime, can't be in a variable
      cors: [
        "http://localhost:3000",
        "https://excelformulator.com",
        "https://excelbuilder.firebaseapp.com",
      ],
      secrets: [openAIKey],
    },
    (req, res) => {
      const configuration = new Configuration({
        apiKey: openAIKey.value(),
      });
      const openai = new OpenAIApi(configuration);
      const {
        data: {prompt, system},
      } = req.body;

      openai
          .createCompletion({
            model: "text-davinci-003",
            prompt: `Explain to me what this ${getSystemWording(
                system,
            )} is doing in plain english:\n\n${prompt}`,
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          })
          .then((completion) => {
            res.send({
              status: 200,
              data: completion.data.choices[0],
            });
          })
          .catch((err) => {
            res.send({
              status: 500,
              data: err,
            });
          });
    },
);

exports.generate = functions.https.onRequest(
    {
    // This must be defined everytime, can't be in a variable
      cors: [
        "http://localhost:3000",
        "https://excelformulator.com",
        "https://excelbuilder.firebaseapp.com",
      ],
      secrets: [openAIKey],
    },
    (req, res) => {
      const configuration = new Configuration({
        apiKey: openAIKey.value(),
      });
      const openai = new OpenAIApi(configuration);
      const {
        data: {prompt, system},
      } = req.body;

      openai
          .createCompletion({
            model: "text-davinci-003",
            prompt: `Generate me ${getSystemWording(
                system,
            )} formula for:\n\n${prompt}`,
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          })
          .then((completion) => {
            res.send({
              status: 200,
              data: completion.data.choices[0],
            });
          })
          .catch((err) => {
            res.send({
              status: 500,
              data: err,
            });
          });
    },
);

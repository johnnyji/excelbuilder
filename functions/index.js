const OpenAI = require("openai");
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

const performCompletion = (openai, question) => {
  return openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: question}],
    temperature: 0,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};

exports.getFirebaseConfig = functions.https.onRequest(
    {
    // This must be defined everytime, can't be in a variable
      cors: [
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
      const openai = new OpenAI({
        apiKey: openAIKey.value(),
      });

      const {
        data: {prompt, system},
      } = req.body;

      const question = `
        You are an AI who can read and explain ${getSystemWording(
      system,
  )} formulas, here are some rules you must follow:\n\n

        1. Explain to the user in plain english what the formula is doing in plain english.\n
        2. If the prompt is no a valid formula, ask the user to try again with a valid prompt\n\n

        Here is the prompt:\n\n ${prompt}
      `;

      performCompletion(openai, question)
          .then((completion) => {
            res.send({
              status: 200,
              data: {text: completion.choices[0].message.content},
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
      const openai = new OpenAI({
        apiKey: openAIKey.value(),
      });
      const {
        data: {prompt, system},
      } = req.body;

      const question = `
        You are an AI who can generate ${getSystemWording(
      system,
  )} formulas for the given prompt, here are some rules you must follow:\n\n

        1. Do not return any other text except for the formula.\n
        2. If the prompt doesn't make sense, ask the user to try again with a valid prompt\n\n

        Here is the prompt:\n\n ${prompt}
      `;

      performCompletion(openai, question)
          .then((completion) => {
            res.send({
              status: 200,
              data: {text: completion.choices[0].message.content},
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

const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const os = require("os");

const setupDialogflow = () => {
    const base64Key = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!base64Key) {
        console.error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
        process.exit(1);
    }

    const jsonKey = Buffer.from(base64Key, "base64").toString("utf-8");
    const tempKeyPath = path.join(os.tmpdir(), "google-key.json");
    fs.writeFileSync(tempKeyPath, jsonKey);

    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempKeyPath;
};

setupDialogflow();

const projectId = "curious-voice-442807-d0";
const sessionClient = new dialogflow.SessionsClient();

const detectIntent = async (query) => {
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: "en",
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        return result.fulfillmentText;
    } catch (error) {
        console.error("Dialogflow Error:", error);
        throw new Error("Error connecting to the chatbot.");
    }
};

module.exports = { detectIntent };

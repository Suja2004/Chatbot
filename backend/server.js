const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = 5000;

// Ensure credentials are provided
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("GOOGLE_APPLICATION_CREDENTIALS is not set in the environment.");
    process.exit(1);
}
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'curious-voice-442807-d0-90aae8f06acc.json');

// Dialogflow configuration
const projectId = "curious-voice-442807-d0"; 
const sessionId = uuid.v4();
const sessionClient = new dialogflow.SessionsClient();

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
    const { query } = req.body;

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
        res.json({ reply: result.fulfillmentText });
    } catch (error) {
        console.error("Dialogflow Error:", error);
        res.status(500).json({ reply: "Error connecting to the chatbot." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

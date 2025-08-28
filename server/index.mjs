import fetch from 'node-fetch';
import express, { response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// Import OpenAI libraries for Structured Response
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is Running!')
})

// Read the instruction set: prompt.md
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let prompt = '';
try {
    prompt = fs.readFileSync(path.join(__dirname, 'prompt.md'), 'utf8');
} catch (error) {
    console.error('Failed to load instructions: ', error)
}

// Set up OpenAI client
const openai = new OpenAI()

// Define the detected language schema format as an array of strings.
// This schema assumes that the most used language will be the first one in the list.
const languageSchema = z.array(z.string());

// Define the word output schema format.
const wordSchema = z.object({
    word: z.string(),
    pronunciation: z.string(),
    definition: z.string(),
});

// Define the response object output schema.
const textDetails = z.object({
    detectedLanguage: z.array(languageSchema),
    tokenizedText: z.array(wordSchema)
})

app.post('/tokenize', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'No Text Provided' });
    }
    try{
        const response = await openai.responses.parse({
                model: "chatgpt-4o-latest",
                input: [
                    {
                        role: "system",
                        content: prompt
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                text: {
                    format: zodTextFormat(textDetails, "text_details")
                }
        });
        const text_details = response.output_parsed;
        console.log('Tokenized output:', text_details);
        res.json({ text_details: text_details })
    } catch (error){
        res.status(500).json({error: 'Failed to segment text', details: error.message})
    }
});
    
const PORT = process.env.PORT || 5656;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
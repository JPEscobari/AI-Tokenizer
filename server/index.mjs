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

// Define the word output schema format.
const wordSchema = z.object({
    word: z.string(),
    pronunciation: z.string(),
    definition: z.string(),
});

// Define the response object output schema.
const tokenizedOutput = z.object({
    detectedLanguage: z.string(),
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
                    format: zodTextFormat(tokenizedOutput, "tokenized_output")
                }
        });
        const tokenized_output = response.output_parsed;
        console.log('Tokenized output:', tokenized_output);
        res.json({ tokenized_output: tokenized_output })
    } catch (error){
        res.status(500).json({error: 'Failed to segment text', details: error.message})
    }
});
    

// Old Tokenizer Method:
// app.post('/tokenizeOld', async (req, res) => {
//     const url = 'https://api.openai.com/v1/responses';
//     const { text } = req.body;

//     if (!text) {
//         return res.status(400).json({ error: 'No Text Provided' });
//     }

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 model: 'gpt-4o-mini',
//                 messages: [
//                     { role: 'system', content: prompt },
//                     { role: 'user', content: text },
//                 ],
//                 temperature: 0.2,
//             }),
//         });
//         const data = await response.json();
//         // Log the message
//         console.log('Message:', data.choices[0].message);
//         const segmented = data.choices[0].message.content.trim();
//         console.log('Segmented Text:', segmented);
//         res.json({ segmented });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to segment text' });
//     }
// });

const PORT = process.env.PORT || 5656;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
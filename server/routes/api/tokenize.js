
import express from 'express';
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { textDetails } from '../../models/TextDetailsSchema.mjs';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Read the instruction set: prompt.md
const __dirname = path.resolve();
let prompt = '';
try {
    const promptPath = path.join(__dirname, '../server/prompt.md');
    console.log('Resolved prompt.md path:', promptPath); // Debugging line
    prompt = fs.readFileSync(promptPath, 'utf8');
} catch (error) {
    console.error('Failed to load instructions: ', error)
}

// Set up OpenAI client
const openai = new OpenAI();

router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'No Text Provided' });
    }
    try {
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

        // Send the tokenized output back to the frontend.
        res.json({ text_details: text_details });

        // Add the new entry to the history
        await fetch('http://localhost:5656/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: text, output: text_details })
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to segment text', details: error.message });
    }
});

export default router;

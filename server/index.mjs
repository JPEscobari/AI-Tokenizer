

import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is Running!')
})

app.post('/tokenize', async (req, res) => {
    const url = 'https://api.openai.com/v1/chat/completions';
    const { text } = req.body;

    // Read prompt.md as instruction set for the API
    let prompt = '';
    try {
        prompt = fs.readFileSync(path.join(__dirname, 'prompt.md'), 'utf8');
    } catch (err) {
        return res.status(500).json({ error: 'Failed to load prompt' });
    }

    if (!text) {
        return res.status(400).json({ error: 'No Text Provided' });
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: text },
                ],
                temperature: 0.2,
            }),
        });
        const data = await response.json();
        // Log the message
        console.log('Message:', data.choices[0].message);
        const segmented = data.choices[0].message.content.trim();
        console.log('Segmented Text:', segmented);
        res.json({ segmented });
    } catch (error) {
        res.status(500).json({ error: 'Failed to segment text' });
    }
});

const PORT = process.env.PORT || 5656;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
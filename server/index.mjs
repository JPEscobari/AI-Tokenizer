import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is Running!')
})

app.post('/tokenize', async (req, res) => {
    const url = 'https://api.openai.com/v1/chat/completions';
    const { text } = req.body;
    const instruction = 'You are a strict Chinese word segmentation tool. Only segment and return Chinese text. If the input is not Chinese, respond with: "ERROR: Input is not Chinese."';

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
                    { role: 'system', content: instruction },
                    { role: 'user', content: text },
                ],
                temperature: 0.2,
            }),
        });
        const data = await response.json();
        const segmented = data.choices[0].message.content.trim();
        res.json({ segmented });
    } catch (error) {
        res.status(500).json({ error: 'Failed to segment text' });
    }
})

const PORT = process.env.PORT || 5656;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
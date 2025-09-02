import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import historyRoutes from './routes/api/history.js';
import tokenizeRoutes from './routes/api/tokenize.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use history routes
app.use('/api/history', historyRoutes);

// Use tokenize routes
app.use('/api/tokenize', tokenizeRoutes);

app.get('/', (req, res) => {
    res.send('Server is Running!')
});

const PORT = process.env.PORT || 5656;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});
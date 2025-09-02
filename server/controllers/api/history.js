
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const outputFile = path.join(__dirname, 'Tokenizer/output/tokenizer_history.json');

export const getHistory = (req, res) => {
  try {
    const fileData = fs.readFileSync(outputFile, 'utf8');
    const history = JSON.parse(fileData);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read history', details: error.message });
  }
};

export const addHistoryEntry = (req, res) => {
  const { input, output } = req.body;
  if (!input || !output) {
    return res.status(400).json({ error: 'Invalid data provided' });
  }

  try {
    let history = [];
    if (fs.existsSync(outputFile)) {
      const fileData = fs.readFileSync(outputFile, 'utf8');
      history = JSON.parse(fileData);
    }

    history.push({
      input,
      output,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(outputFile, JSON.stringify(history, null, 2));
    res.status(201).json({ message: 'History entry added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add history entry', details: error.message });
  }
};

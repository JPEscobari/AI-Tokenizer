
import React from 'react';
import './history.css';

function History({ history }) {
  return (
    <section className="history">
      <h2>History</h2>
      {history.slice().reverse().map((entry, idx) => (
        <div key={idx} className="history-entry">
          <h3>Detected Language: {entry.output.detectedLanguage.join(', ')}</h3>
          <div className="input-text">
            <strong>Input:</strong> {entry.input}
          </div>
          <div className="tokenized-text">
            {entry.output.tokenizedText.map((token, index) => (
              <div key={index} className="token">
                <strong>{token.word}</strong>: {token.definition} <em>({token.pronunciation})</em>
              </div>
            ))}
          </div>
          <small className="timestamp">Timestamp: {new Date(entry.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </section>
  );
}

export default History;


import React from 'react';

function History({ history }) {
  return (
    <section className="history">
      <h2>History</h2>
      <ul>
        {history.map((entry, idx) => (
          <li key={idx}>
            <strong>Input:</strong> {entry.input} <br />
            <strong>Output:</strong> {JSON.stringify(entry.output)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default History;

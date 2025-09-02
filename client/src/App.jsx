import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { sendRequest } from './utils/sendRequest'

function App() {
  const [input, setInput] = useState("")
  const [tokens, setTokens] = useState([])
  const [language, setLanguage] = useState('')
  const [selectedToken, setSelectedToken] = useState(null)
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await sendRequest('http://localhost:5656/api/history')
        setHistory(data)
      } catch (error) {
        console.error('Failed to fetch history:', error)
      }
    }
    fetchHistory();
  }, []);

function handleClear() {
  setInput("")
  setTokens([])
  setLanguage('')
}

function handleTokenClick(token) {
  setSelectedToken(token)
}

function handleCloseDetails() {
  setSelectedToken(null)
}

 async function handleTokenize() {
    try {
      const response = await fetch('http://localhost:5656/api/tokenize', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ text: input }),
      })
      const data = await response.json()
      console.log('Server Response:', data);
      const { text_details } = data;
      console.log('Full data:', text_details);
      console.log('Detected Language:', text_details.detectedLanguage);
      console.log('These are your individual tokens:');
      text_details.tokenizedText.forEach(token => {
        if (token.word) {
          console.log(token.word);
        }
      });

      setTokens(text_details.tokenizedText);
      setLanguage(text_details.detectedLanguage)

    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
      <div className='main-container'>
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
        <section className='tokenizer-app'>
            <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Your Text Here"
            rows={8}
            className='text-area'
            />
            <button 
            className='buttons'
            onClick={handleTokenize}>
              Tokenize
            </button>
            <button 
            className='buttons'
            onClick={handleClear}>
              Clear
            </button>

            {/* Detected Language Banner */}
            <div>
              { tokens.length > 0 &&
                <h4 className='banner'>
                  Detected language{language.length > 0 ? 's' : ''}: {language.map(lang => (`${lang}`))}
                </h4>
              }
            </div>
          
            {/* Tokenized Text */}
            <div>
              {tokens.map((token, idx) => (
                <span 
                key={idx} 
                className='token'
                onClick={() => handleTokenClick(token)}
                >
                  {token?.word}
                </span>
              ))}
            </div>
            
            {/* Token Details Modal/Panel */}
            {selectedToken && 
              <div className='token-details-modal'>
                <h3>Word Details:</h3>
                <h4>{selectedToken.word}</h4>
                <p><strong>Definition: </strong>{selectedToken.definition || 'N/A'}</p>
                <p><strong>Pronunciation: </strong>{selectedToken.pronunciation || 'N/A'}</p>
                <button 
                  onClick={handleCloseDetails}
                  className='buttons'
                >
                  Close
                </button>
              </div>
            }
        </section>
      </div>
    </>
  )
}

export default App

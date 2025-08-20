import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [input, setInput] = useState("")
  const [tokens, setTokens] = useState([])

function handleClear() {
  setInput("")
  setTokens([])
}

 async function handleTokenize() {
    try {
      const response = await fetch('http://localhost:5656/tokenize', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ text: input }),
      })
      const { text_details } = await response.json()
      console.log('Full data:', text_details);
      console.log('Detected Language:', text_details.detectedLanguage);
      
      setTokens(text_details.tokenizedText);
      
      // Log Tokenized Words:
      console.log('These are your individual tokens:');
      text_details.tokenizedText.forEach(token => {
        if (token.word) {
          console.log(token.word);
        }
      });

    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
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
      <div>
        { tokens.length > 0 &&
          <span className='token'>
            Detected language: {tokens[0]?.detected_language}
          </span>
        }
      </div>
    
      <div>
        {/* {tokens.map((token, idx) => (
          <span key={idx} className='token'>
            {token?.word}
          </span>
        ))} */}
      </div>
    </>
  )
}

export default App

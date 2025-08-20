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
    // We will use the OpenAI API to tokenize the input text.
    // Send a POST request to http://localhost:5656/tokenize
    try {
      const response = await fetch('http://localhost:5656/tokenize', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ text: input }),
      })
      const data = await response.json()
      console.log('Full segmented array:', data.segmented);
      setTokens(data.segmented);

      // Log each word in the console
      console.log('These are your tokens:');
      data.segmented.forEach(obj => {
        if (obj.word) {
          console.log(obj.word);
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
      placeholder="Paste Chinese Text Here"
      rows={8}
      style={{ width: '100%' }}
      />
      <button onClick={handleTokenize}>
        Tokenize
      </button>
      <button onClick={handleClear}>
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

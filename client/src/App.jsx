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
      setTokens(data.segmented.split(' '));
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
        {tokens.map((token, idx) => (
          <span key={idx} className='token'>
            {token}
          </span>
        ))}
      </div>
    </>
  )
}

export default App

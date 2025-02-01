require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

// Allow requests from the frontend URL

// Allow requests from both frontend URLs
app.use(
  cors({
    origin: [
      'https://python-tutor-frontend-part.netlify.app', // Netlify frontend URL
      'https://puneetharajkrcr6xarjscpa6spq.drops.nxtwave.tech', // NxtWave frontend URL
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json())

// Ensure the backend is running on the right port (from environment or default to 5000)
const PORT = process.env.PORT || 5000

app.post('/api/python-tutor', async (req, res) => {
  const {question} = req.body // The question sent from frontend

  const apiKey = process.env.OPENAI_API_KEY // API key stored in environment variables

  if (!apiKey) {
    return res.status(500).json({error: 'API key is missing on the server.'})
  }

  try {
    // Make the request to OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: `Explain Python to a 10-year-old: ${question}`,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )

    // Send the response back to the frontend with OpenAI's answer
    res.json({response: response.data.choices[0].text})
  } catch (error) {
    res.status(500).json({error: 'Error contacting OpenAI API'})
    console.error(error)
  }
})

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

// app.use(
//   cors({
//     origin: 'https://puneetharajkrcr6xarjscpa6spq.drops.nxtwave.tech', // your frontend's URL
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }),
// )

app.use(cors()) // This allows all origins by default
app.use(
  cors({
    origin: 'http://https://puneetharajkrcr6xarjscpa6spq.drops.nxtwave.tech/',
  }),
)

app.use(express.json())
// app.use(cors()) // This allows the frontend to make requests to the backend

const PORT = process.env.PORT || 5000

app.post('/api/python-tutor', async (req, res) => {
  const {question} = req.body
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return res.status(500).json({error: 'API key is missing on the server.'})
  }

  try {
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
    res.json({response: response.data.choices[0].text})
  } catch (error) {
    res.status(500).json({error: 'Error contacting OpenAI API'})
  }
})

// app.listen(PORT, () => {
//   console.log(`
//   The Server has Started,
//   Server is running on port ${PORT},`)
// })

app.listen(5000, '0.0.0.0', () => {
  console.log('The Server has Started, The Server is running on port 5000')
})

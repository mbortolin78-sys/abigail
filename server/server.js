const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { interpretPrompt } = require('./ollama_bridge');
const { generateNarrative } = require('./narrativa_engine');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
  const userPrompt = req.body.prompt;
  const interpreted = await interpretPrompt(userPrompt);
  const response = await generateNarrative(interpreted);
  res.json(response);
});

app.listen(3001, () => {
  console.log('Abigail backend attivo sulla porta 3001');
});

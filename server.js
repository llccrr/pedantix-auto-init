const express = require('express');
const launchGameInit = require('./pupeteer');

const app = express();
const port = 3006;

app.get('/run', async (req, res) => {
  try {
    const title = await launchGameInit('https://example.com');
    res.send(`Page title is: ${title}`);
  } catch (error) {
    res.status(500).send('Error running Puppeteer script');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

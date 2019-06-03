const express = require('express');
const app = express();
const port = 8000;

const queue = [];

app.use(express.json());

app.post('/', (req, res) => {
  queue.push(req.body);
  res.end();
});

app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.json(queue);
  queue.length = 0;
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

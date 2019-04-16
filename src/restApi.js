const express = require('express');
const app = express();
const port = 8000;

const queue = [];

app.use(express.json());

app.post('/', (req, res) => {
  console.log('pushing...');
  queue.push(req.body);
  console.log('pushed');
});

app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.json(queue);
  console.log('purging...');
  queue.length = 0;
  console.log('purged');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.on('event', (error) => console.log('Something really bad happened...', error));

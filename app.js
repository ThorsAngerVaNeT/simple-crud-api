require('dotenv').config();
const process = require('process');
const http = require('http');

const port = process.env.PORT || 3000;
const internalError = 500;

try {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({ msg: `Everything is fine` }));
  });

  server.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
} catch (e) {
  process.stderr.write(`Error appears - ${e.message}`);
  process.exit(1);
}

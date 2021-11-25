require('dotenv').config();
const process = require('process');
const http = require('http');
const router = require('./src/router.js');

const port = process.env.PORT || 3000;
const internalError = 500;

try {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let response = {};
    try {
      [response.code, response.msg] = router.validateUrl(req);
    } catch (e) {
      [response.code, response.msg] = router.formatResponse(
        internalError,
        `Internal server error - ${e}`
      );
    }
    // console.log(response);
    res.writeHead(response.code);
    res.end(response.msg);
  });

  server.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
} catch (e) {
  process.stderr.write(`Error appears - ${e.message}`);
  process.exit(1);
}

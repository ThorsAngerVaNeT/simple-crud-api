require('dotenv').config();
const process = require('process');
const startServer = require('./src/server.js');

const port = process.env.PORT || 3000;

try {
  const server = startServer();
  server.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
} catch (e) {
  process.stderr.write(`Error appears - ${e.message}`);
  process.exit(1);
}

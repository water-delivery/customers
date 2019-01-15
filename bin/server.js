// This will be our application entry. We'll setup our server here.
const http = require('http');
const app = require('../app'); // The express app we just created

const port = parseInt(process.env.PORT, 10) || 6100;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => logger.info('Server listening on port: ', port));

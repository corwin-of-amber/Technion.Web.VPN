const http = require('http'),
      url = require('url');

// Create an HTTP server instance
const server = http.createServer();

// Define the port to listen on
const PORT = 2002;

// Event listener for HTTP requests
server.on('request', (req, res) => {
  let dsid = new URLSearchParams(url.parse(req.url).search).get('dsid');
  if (dsid) console.log('received DSID', dsid);
  else console.log("missing DSID:", req.url);

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Ok.\n');
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

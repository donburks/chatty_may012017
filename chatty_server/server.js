const express = require('express');
const SocketServer = require('ws').Server;
const uuidV1 = require('uuid/v1');
const WebSocket = require('ws');
const request = require('request');
// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    let type = 'textMessage';
    let uuid = uuidV1();
    if (message.content[0] == '/') {
      //any slash command here
      let command = message.content.split(' ')[0].replace('/', '');
      switch(command) {
        case 'me':
          type = 'myMessage'; 
          message.content = message.content.replace(`/${command} `, '');
          break;
        case 'collapse':
          type = 'collapseMessage';
          message.content = "has collapsed the gifs.";
          break;
        case 'expand':
          type = 'expandMessage';
          message.content = 'has brought back the gifs';
          break;
        case 'gif':
          type = 'gifMessage';
          request("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC", (err, response, gifData) => {
            gifData = JSON.parse(gifData);
            message.content = (err) ? 'There was an error getting a gif.' : gifData.data.image_url; 
            
            let outputMessage = {
              type: type,
              id: uuid,
              username: message.username,
              content: message.content
            }
            wss.broadcast(JSON.stringify(outputMessage));
          }); 
          break;
        default:
          type = 'errorMessage';
          message.content = 'There was an error.';
          break;
      }
    }
    if (type !== 'gifMessage') {
      let outputMessage = {
        type: type,
        id: uuid,
        username: message.username,
        content: message.content
      }
      wss.broadcast(JSON.stringify(outputMessage));
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const roomStates = {};

io.on('connection', (socket) => {
socket.on('joinRoom', (roomCode) => {
socket.join(roomCode);

if (!roomStates[roomCode]) {
roomStates[roomCode] = {
top: 'green', jgl: 'green', mid: 'green', bot: 'green', sup: 'green'
};
}
socket.emit('updateLights', roomStates[roomCode]);
});

socket.on('toggleLight', (data) => {
const { roomCode, lane } = data;
if (roomStates[roomCode]) {
const currentColor = roomStates[roomCode][lane];
roomStates[roomCode][lane] = currentColor === 'green' ? 'red' : 'green';
io.to(roomCode).emit('updateLights', roomStates[roomCode]);
}
});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
console.log(`MIA Tracker running on port ${PORT}`);
});

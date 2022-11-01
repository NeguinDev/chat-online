const users = {};

module.exports = async function connectionSocket(socket) {
	const { id } = socket;
	console.log(`[SOCKET] ID: ${id} => Connected`);

	socket.on('disconnect', () => {
		console.log(`[SOCKET] ID: ${id} => Disconnected`);

		if (!users[id]) return;

		socket.broadcast.emit('logout', users[id].name);
		delete users[id];
	});

	socket.on('login', (name) => {
		name = name?.trim?.();
		if (!name) return;
		
		console.log(`[SOCKET] ID: ${id} => Login: ${name}`);

		users[id] = {
			name
		};

		socket.broadcast.emit('login', name);
	});

	socket.on('message', (message) => {
		message = message.trim();
		if (!users[id]) return;
		
		console.log(`[SOCKET] ID: ${id} => Message: ${message}`);

		const name = users[id].name;
		socket.broadcast.emit('message', `${name}: ${message}`);
	});
}
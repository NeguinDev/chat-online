function start(message, count, interval) {
	for (let i = 0; i < count; i++) {
		setTimeout(() => {
			sendMessage(message);
		}, i * interval);
	}
}

async function sendMessage(message) {

	await document.execCommand('insertText', false, message);
	const btn = document.querySelector("form > svg");
	btn.dispatchEvent(new KeyboardEvent('keydown', {'key':'Enter'} ));
	btn.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'Enter' }));
}

const message = prompt('Insira a mensagem:');
const count = prompt('Insira a quantidade de mensagens:');
const interval = prompt('Insira o intervalo entre as mensagens:');

start(message, count, interval);
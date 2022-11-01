(async function () {
	const notify = {
		async init() {
			const permission = await Notification.requestPermission()
			if (permission !== "granted") {
				throw new Error('Permissão negada')
			}
		},
		notify({ title, body, icon }) {
			return () => new Notification(title, {
				body,
				icon
			})
		}
	}

	const socket = io();
	const buttonLogin = document.getElementsByClassName('btn-name')[0];
	const buttonSend = document.getElementsByClassName('btn-send')[0];

	const inputName = document.getElementById('name');
	const inputMessage = document.getElementById('message');
	const header = document.getElementsByClassName('header')[0];

	let lastMessage = null;

	buttonLogin.addEventListener('click', () => {
		const name = filterHTML(inputName.value);

		socket.emit('login', name);
		inputName.value = '';

		header.style.display = 'none';
		notify.init()
			.catch(() => {
				alert('Permissão negada');
			});

		addMessage('Você entrou no chat', { login: true });
	});

	buttonSend.addEventListener('click', () => {
		const message = filterHTML(inputMessage.value);

		if (!message) return;

		socket.emit('message', message);
		inputMessage.value = '';

		addMessage('Você: ' + message);
	});

	document.addEventListener('keypress', (e) => {
		if (e.key !== 'Enter') {
			if (header.style.display === 'none') {
				return inputMessage.focus();
			} else {
				return inputName.focus();
			}
		}

		if (inputName.value) {
			return buttonLogin.click();
		}

		if (inputMessage.value) {
			return buttonSend.click();
		}
	});

	socket.on('message', (message) => {
		message = filterHTML(message);
		addMessage(message);

		const notifyMessage = notify.notify({
			title: 'Nova mensagem',
			body: message,
			icon: 'https://cdn-icons-png.flaticon.com/512/5063/5063960.png'
		});

		notifyMessage();
	});

	socket.on('login', (name) => {
		name = filterHTML(name);
		addMessage(`${name} entrou no chat!`, { login: true });

		const notifyLogin = notify.notify({
			title: 'Novo usuário',
			body: `${name} entrou no chat!`,
			icon: 'https://cdn-icons-png.flaticon.com/512/5063/5063960.png'
		});

		notifyLogin();
	});

	socket.on('logout', (name) => {
		name = filterHTML(name);
		addMessage(`${name} saiu do chat!`, { logout: true });

		const notifyLogout = notify.notify({
			title: 'Usuário saiu',
			body: `${name} saiu do chat!`,
			icon: 'https://cdn-icons-png.flaticon.com/512/5063/5063960.png'
		});

		notifyLogout();
	});

	async function addMessage(data, options = {}) {
		const boxBody = document.getElementsByClassName('box-body')[0];

		const message = document.createElement('p');
		message.className = 'message';
		message.innerText = filterHTML(data);

		if (options.login) message.className += ' login';
		if (options.logout) message.className += ' logout';

		boxBody.appendChild(message);

		const isVisible = await checkVisible(lastMessage);
		if (isVisible) {
			message.scrollIntoView();
		}

		lastMessage = message;
		return message;
	}

	async function checkVisible(elm, threshold, mode) {
		threshold = threshold || 0;
		mode = mode || 'visible';

		let rect = await elm?.getBoundingClientRect?.();
		let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
		let above = rect?.bottom - threshold < 0;
		let below = rect?.top - viewHeight + threshold >= 0;

		return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
	}

	function filterHTML(string) {
		strin = filterXSS(string);

		return string
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}
})();
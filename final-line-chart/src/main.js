import App from './App.svelte';

const app = new App({
	target: document.getElementById('svelte-app1'),
	props: {
		name: 'world'
	}
});

export default app;
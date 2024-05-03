import App from './App.svelte';

const app = new App({
    target: document.getElementById('svelte-graph'),
    props: {
        name: 'world' // Remove or adjust props as necessary for your component
    }
});

export default app;

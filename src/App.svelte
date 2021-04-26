<script>
	import Router from 'svelte-spa-router';
    import FireAPI from './FireTable.svelte';
	import Home from './Home.svelte';
	import NotFound from './404.svelte'
    const routes = {
		"/":Home,
		"/fire": FireAPI,
		"*":NotFound
    };
</script>
<main>
	<Router {routes}> </Router>
</main>
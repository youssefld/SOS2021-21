<script>
	import Router from 'svelte-spa-router';
    import FireAPI from './FireTable.svelte';
	import Home from './Home.svelte';
	import NotFound from './404.svelte';
	import TemperatureAPI from './Temperature.svelte'
	import EmisionAPI from './EmisionTable.svelte';

    const routes = {
		"/":Home,
		"/fire": FireAPI,
		"/temperature": TemperatureAPI,
		"/emisions": EmisionAPI,
		"*":NotFound
    };
</script>
<main>
	<Router {routes}> </Router>
</main>
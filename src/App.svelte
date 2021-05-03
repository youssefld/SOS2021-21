<script>
	import Router from 'svelte-spa-router';
	import Home from './Home.svelte';
	import NotFound from './404.svelte';
    import Info from './Info.svelte';

	import FireAPI from './frontend/fire_api/FireTable.svelte';
    import EditFire from './frontend/fire_api/EditeFire.svelte';

	import TemperatureAPI from './frontend/temperature_api/Temperature.svelte';


	import EmisionAPI from './frontend/emisions_api/EmisionTable.svelte';

 	
	const routes = {
		"/":Home,
		"/fire": FireAPI,
        "/fire-stats/:country/:year": EditFire,
		"/temperature": TemperatureAPI,
		"/emisions": EmisionAPI,
		"/info": Info,
		"*":NotFound,
    };
</script>

<main>
	<Router {routes} />
</main>

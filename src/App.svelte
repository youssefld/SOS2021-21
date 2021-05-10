<script>
	import Router from 'svelte-spa-router';
	import Home from './Home.svelte';
	import NotFound from './404.svelte';
    import Info from './Info.svelte';

	import FireAPI from './frontend/fire_api/FireTable.svelte';
    import EditFire from './frontend/fire_api/EditeFire.svelte';

	import EditTemperature from './frontend/temperature_api/EditTemperature.svelte';
	import TemperatureAPI from './frontend/temperature_api/TemperatureTable.svelte';


	import EmisionAPI from './frontend/emisions_api/EmisionTable.svelte';
	import EditEmision from './frontend/emisions_api/EditEmision.svelte';
 	
	const routes = {
		"/":Home,
		"/fire": FireAPI,
        "/fire-stats/:country/:year": EditFire,
		"/temperature-stats/:country/:year": EditTemperature,
		"/temperature": TemperatureAPI,
		"/emisions": EmisionAPI,
		"/emisions-stats/:country/:year": EditEmision,
		"/info": Info,
		"*":NotFound,
    };
</script>

<main>
	<Router {routes} />
</main>

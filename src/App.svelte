<script>
	import Router from 'svelte-spa-router';
	import Home from './Home.svelte';
	import NotFound from './404.svelte';
    import Info from './Info.svelte';

	import FireAPI from './frontend/fire_api/FireTable.svelte';
    import EditFire from './frontend/fire_api/EditeFire.svelte';
	import FireGraph from './frontend/fire_api/Graph.svelte';
	import FireBillboard from './frontend/fire_api/GraphBillboard.svelte'

	import EditTemperature from './frontend/temperature_api/EditTemperature.svelte';
	import TemperatureAPI from './frontend/temperature_api/TemperatureTable.svelte';
	import TemperatureGraph from './frontend/temperature_api/Graph.svelte';


	import EmisionAPI from './frontend/emision_api/EmisionTable.svelte';
	import EditEmision from './frontend/emision_api/EditEmision.svelte';
	import EmisionGraph from './frontend/emision_api/Graph.svelte';
	import CommonGraph from './frontend/CommonGraph.svelte';

	const routes = {
		"/":Home,
		"/fire": FireAPI,
        "/fire-stats/:country/:year": EditFire,
		"/fire/graph": FireGraph,
		"/fire/billboard": FireBillboard,
		"/temperature-stats/:country/:year": EditTemperature,
		"/temperature": TemperatureAPI,
		"/temperature/graph": TemperatureGraph,
		"/emision": EmisionAPI,
		"/emision-stats/:country/:year": EditEmision,
		"/emision/graph": EmisionGraph,
		"/info": Info,
		"/graph": CommonGraph,
		"*":NotFound,
    };
</script>

<main>
	<Router {routes} />
</main>

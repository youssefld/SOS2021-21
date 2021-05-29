<script>

import bb from "billboard.js/dist/billboard.pkgd";

let data = []
let graphData = []

async function loadGraph(){


    const fireData = await fetch("/api/v2/fire-stats")
    data = await fireData.json()

    data.forEach((x) => {
        graphData.push([x.country, x.fire_nfc])
    })

    console.log(graphData)

    return graphData
}

loadGraph();

var chart = bb.generate({
  data: {
    columns: [],
    type: "bar", // for ESM specify as: line()
  },
  bindto: "#chart"
});


setTimeout(function() {
	chart.load({
		columns:graphData});
}, 1500);


setTimeout(function() {
	chart.unload({
		ids: "Cargando..."
	});
	chart.unload({
		ids: "Cargando.."
	});
}, 2500);


</script>


<svelte:head>

</svelte:head>

<main>
    <h2>Número de incendios España en los últimos años</h2>
    <div id="chart"></div>
</main>

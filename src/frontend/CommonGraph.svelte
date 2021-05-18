<script>

    async function loadGraph() {

        const fire_stats = await fetch("/api/v2/fire-stats");
        const temperature_stats = await fetch("/api/v2/temperature-stats");
        const emision_stats = await fetch("/api/v2/emision-stats");

        let fire = await fire_stats.json();
        let temperature = await temperature_stats.json();
        let emision = await emision_stats.json();

        let fire_stats_data = fire.map((f) => {
            let res = {
                name: f.country + " - " + f.year,
                value: f["fire_aee"],
            };
            return res;
        });

        let temperature_stats_data = temperature.map((t) => {
            let res = {
                name: t.country + " - " + t.year,
                value: t["temperature_co2"],
            };
            return res;
        });

        let emision_stats_data = emision.map((e) => {
            let res = {
                name: e.country + " - " + e.year,
                value: e["carb_diox_ppm"],
            };
            return res;
        });


        let dataTotal = [
            {
                name: "Media de emisiones emitidas.",
                data: fire_stats_data,
            },
            {
                name: "Temperatura de CO2",
                data: temperature_stats_data,
            },
            {
                name: "Índice de ppm en el CO2",
                data: emision_stats_data,
            }
        ];

        Highcharts.chart("container", {
            chart: {
                type: "packedbubble",
                height: "100%",
            },
            title: {
                text: "Relación de las API",
            },
            tooltip: {
                useHTML: true,
                pointFormat: "<b>{point.name}:</b> {point.value}",
            },
            plotOptions: {
                packedbubble: {
                    minSize: "30%",
                    maxSize: "120%",
                    zMin: 0,
                    zMax: 1000,
                    layoutAlgorithm: {
                        splitSeries: false,
                        gravitationalConstant: 0.02,
                    },
                    dataLabels: {
                        enabled: true,
                        format: "{point.name}",
                        filter: {
                            property: "y",
                            operator: ">",
                            value: 250,
                        },
                        style: {
                            color: "black",
                            textOutline: "none",
                            fontWeight: "normal",
                        },
                    },
                },
            },
            series: dataTotal,
        });
    }
    loadGraph();
</script>

<svelte:head>
    <script
        src="https://code.highcharts.com/highcharts.js"
        on:load={loadGraph}></script>
    <script
        src="https://code.highcharts.com/highcharts-more.js"
    ></script>
    <script
        src="https://code.highcharts.com/modules/exporting.js"
></script>
    <script
        src="https://code.highcharts.com/modules/accessibility.js"
></script>
</svelte:head>

<main>

    <figure class="highcharts-figure">
        <div id="container" />
        <p class="highcharts-description">
            Gráfica que relaciona la media de emisiones emitidas, temperatura C02 y el índice ppm.
        </p>
    </figure>
</main>
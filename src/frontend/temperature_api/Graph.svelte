<script>
    import {
        onMount
    } from "svelte";
 
    let temperatureData = [];
    let ejeX = [];
    let temperature_min = [];
    let temperature_max = [];
    let temperature_co2 = [];
    
    async function loadGraph(){  
        const res = await fetch("/api/v2/temperature-stats");
        if(res.ok){
            temperatureData = await res.json();
            console.log(JSON.stringify(temperatureData, null, 2))
            temperatureData.forEach(data => {
                ejeX.push(data.country + "-" + data.year);
                temperature_min.push(data["temperature_min"]);
                temperature_max.push(data["temperature_max"]);
                temperature_co2.push(data["temperature_co2"]);
            });
        }else{
            console.log("Error loading temperature");
        }

        Highcharts.chart('container', {
            title: {
                text: 'Gráfico de temperaturas'
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            xAxis: {
                title: {
                    text: 'País-Año'
                },
                categories: ejeX
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            series: [{
                name: 'Temperatura mínima',
                data: temperature_min
            },
            {
                name: 'Temperatura máxima',
                data: temperature_max
            },
            {
                name: 'Temperatura del co2',
                data: temperature_co2
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
  }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>  
</main>
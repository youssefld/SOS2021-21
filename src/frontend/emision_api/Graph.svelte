<script>
    import {
        onMount
    } from "svelte";
 
    let emisionData = [];
    let ejeX = [];
    let carb_diox_ppm = [];
    let methane_ppb = [];
    let nitro_oxide_ppb = [];
    
    async function loadGraph(){  
        const res = await fetch("/api/v2/emision-stats");
        if(res.ok){
            emisionData = await res.json();
            console.log(JSON.stringify(emisionData, null, 2))
            emisionData.forEach(data => {
                ejeX.push(data.country + "-" + data.year);
                carb_diox_ppm.push(data["carb_diox_ppm"]);
                methane_ppb.push(data["methane_ppb"]);
                nitro_oxide_ppb.push(data["nitro_oxide_ppb"]);
            });
        }else{
            console.log("Error loading emisions");
        }

        Highcharts.chart('container', {
            title: {
                text: 'Gráfico de emisiones'
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
                name: 'Dioxido de carbono',
                data: carb_diox_ppm
            },
            {
                name: 'Metano',
                data: methane_ppb
            },
            {
                name: 'Oxido nitroso',
                data: nitro_oxide_ppb
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
<script>
    import {
        onMount
    } from "svelte";
 
    let fireData = [];
    let ejeX = [];
    let nfc = [];
    let aee = [];
    let nvs = [];
    
    async function loadGraph(){  
        const res = await fetch("/api/v2/fire-stats");
        if(res.ok){
            fireData = await res.json();
            console.log(JSON.stringify(fireData, null, 2))
            fireData.forEach(data => {
                ejeX.push(data.country + "-" + data.year);
                nfc.push(data["fire_nfc"]);
                aee.push(data["fire_aee"]);
                nvs.push(data["fire_nvs"]);
            });
        }else{
            console.log("Error loading fires");
        }

        Highcharts.chart('container', {
            title: {
                text: 'Gráfico de incendios'
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
                name: 'Incendios',
                data: nfc
            },
            {
                name: 'Estmación anual de emisiones',
                data: aee
            },
            {
                name: 'Especies vegetales afectadas',
                data: nvs
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
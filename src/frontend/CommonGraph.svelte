<script>
    import {
      Button,
      Jumbotron,
      Navbar,
      Nav,
      NavItem,
      NavLink,
      NavbarBrand,
      Dropdown,
      DropdownToggle,
      DropdownMenu,
      DropdownItem,
    } from "sveltestrap";
  
    let isOpen = false;
  
    var BASE_API_PATH = "/api/v2";
  
    var fires=[];
    var temperatures=[];
    var emisions=[];
  
    var XAxis = [];
    var fireGraph=[];
    var temperatureGraph=[];
    var emisionGraph=[];
  
  
  
    
    var int = 0;
  
    let errorPrint = "";
  
    async function getData() {
      const dataA = await fetch(BASE_API_PATH + "/fire-stats");
      const dataB = await fetch(BASE_API_PATH + "/temperature-stats");
      const dataC = await fetch(BASE_API_PATH + "/emision-stats");
  
  
      if (dataA.ok && dataB.ok && dataC.ok) { 
        fires = await dataA.json();
        temperatures = await dataB.json();
        emisions= await dataC.json();
  
  
        fires.forEach(e=>{
          XAxis.push(e.country+"("+parseInt(e.year)+")");
        });
  
        temperatures.forEach(e=>{
          XAxis.push(e.country+"("+parseInt(e.year)+")");
        });
  
        emisions.forEach(e=>{
          XAxis.push(e.country+"("+parseInt(e.year)+")");
        })
  
  
  

  
  
        fires.forEach(e=>{
          fireGraph.push(parseInt(e.fire_nfc));
        });

  
        temperatures.forEach(e=>{
          temperatureGraph.push(e.temperature_min);
        });

        emisions.forEach(e=>{
          emisionGraph.push(parseInt(e.carb_diox_ppm));
        });

        
      } else {
        console.log("Error!");
      }
    }
  
    async function loadGraph() {
      getData().then(() => {
        Highcharts.chart("container", {
          title: {
            text: "",
          },
          yAxis: {
            title: {
              text: "Unidades",
            },
          },
          xAxis: {
            title: {
              text: "Pais, Año",
            },
            categories: XAxis,
          },
          legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
          },
          annotations: [
            {
              labels: [
                {
                  point: "date",
                  text: "",
                },
                {
                  point: "min",
                  text: "Min",
                  backgroundColor: "white",
                },
              ],
            },
          ],
          series: [
            {
              name: "Total incendios",
              data: fireGraph,
            },
            {
              name: "Total temepreature minima",
              data: temperatureGraph,
            },
            
            {
              name: "Total emisiones",
              data: emisionGraph,
            }
          ],
          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                  },
                },
              },
            ],
          },
        });
      });
    }
  </script>
  
  <svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
  </svelte:head>
  
  <main>
    <div>
      <h1 class="titulo2">Gráfica conjunta</h1>
    </div>

  </main>
  
  <style>
    
  </style>
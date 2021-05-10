<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import { Alert, Nav, NavItem, NavLink, Badge, Navbar, NavbarBrand,} from 'sveltestrap';

    let temperatureData = [];
    let newTemperature = {
        country: "",
        year: "",
        temperature_min: "",
        temperature_max: "",
        temperature_co2: "",
    };

    let limit = 10;
    let offset = 0;
    let page = (offset/10)+1;
    let num_pages= 0;

    let dialogMSG = "";
    let color = "";

    let findTemperatureCountry = "";
    let findTemperatureYear = "";
    let findTemperatureMin= "";
    let findTemperatureMax = "";
    let findTemperatureCo2 = "";

    onMount(getTemperatureData);

    //Método Get
    async function getTemperatureData() {
        getNumPages()
        const res = await fetch("/api/v1/temperature-stats?limit="+limit+"&offset="+offset);
        if (res.ok) {
            const json = await res.json();
            temperatureData = json;
            page = (offset/10)+1
        }
    }

    //Load initial data
    async function loadInitialData() {
        await fetch("/api/v1/temperature-stats/loadInitialData");
        const res = await fetch("/api/v1/temperature-stats?limit="+limit+"&offset="+offset);
        if (res.ok) {
            const json = await res.json();
            temperatureData = json;
            color = "success"
            dialogMSG = "Se han cargado los datos iniciales";
        }
    }

    //New temperature
    async function insertTemperatureData() {
        console.log("Insertando nuevo dato: "+newTemperature.country)
        if (newTemperature.country == "" || newTemperature.country == null || 
            newTemperature.year == "" || newTemperature.year == null ||
            newTemperature.temperature_min == "" || newTemperature.temperature_min == null ||
            newTemperature.temperature_max == "" || newTemperature.temperature_max == null || 
            newTemperature.temperature_co2 == "" || newTemperature.temperature_co2 == null)
        {
            color = "danger"
            dialogMSG = "Existe más de un campo vacío.";              
        } else {
            console.log("Nueva temperatura:"+newTemperature)
            const res = await fetch("/api/v1/temperature-stats", {
                method: "POST",
                body: JSON.stringify(newTemperature),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(function (res) {
                if (res.status == 201) {
                    color = "success"
                    dialogMSG = "Se ha añadido una nueva temperatura.";
                }
                else if (res.status == 409) {
                    color = "danger"
                    dialogMSG = "Datos introducidos incorrectos.";                
                } else if (res.status == 400) {
                    color = "danger"
                    dialogMSG = "Ya existe una temperatura con los mismos datos.";                
                }
            });
        }
        await getTemperatureData()
    }

    //Delete an specif temperature
    async function deleteTemperature(country, year) {
        const res = await fetch(
            "/api/v1/temperature-stats/" + country + "/" + year,
            {
                method: "DELETE",
            }
        ).then(function (res) {
            if (res.status == 200) {
                color = "success"
                dialogMSG = "Se ha eliminado una temperatura.";
          
            } else if (res.status == 404) {
                color = "danger"
                dialogMSG = "Se ha producido un error.";                  
            }
        });

        await getTemperatureData();
    }

    //Delete all temperature data
    async function deleteAllTemperature() {
        const res = await fetch("/api/v1/temperature-stats/", {
            method: "DELETE",
        }).then(function (res) {
            if (res.ok) {
                getTemperatureData();
                color = "success"
                dialogMSG = "Se han eliminado todas las temperaturas.";
            } else {
                color = "danger"
                dialogMSG = "Se ha producido un error.";
            }
        });

        await getTemperatureData();

    }

    //Find temperature
    async function findTemperature(findTemperatureCountry, findTemperatureYear, findTemperatureMin, findTemperatureMax, findTemperatureCo2){
        if(typeof findTemperatureCountry == 'undefined'){
            findTemperatureCountry = "";
        }
        if(typeof findTemperatureYear == 'undefined'){
            findTemperatureYear = "";
        }
        if(typeof findTemperatureMin == 'undefined'){
            findTemperatureMin = "";
        }
        if(typeof findTemperatureMax=='undefined'){
            findTemperatureMax = "";
        }
        if(typeof findTemperatureCo2 == 'undefined'){
            findTemperatureCo2 = "";
        }
        const res = await fetch("/api/v1/temperature-stats?country="+findTemperatureCountry+"&year="+findTemperatureYear+"&temperature_min="+findTemperatureMin+"&temperature_max="+findTemperatureMax+"&temperature_co2="+findTemperatureCo2);
        if (res.ok){
            const json = await res.json();
            temperatureData = json;
            
            if(temperatureData.length>0){
                color = "success"
                dialogMSG = "Dato(s) encontrado(s): " + temperatureData.length;
            }
        }else{
            color = "danger";
            dialogMSG = "No se ha encontrado ningún resultado.";
        }
    }

    const nextPage = () => {offset+=10; getTemperatureData()}
    const previousPage = () => {offset-=10; getTemperatureData()}

    async function getNumPages() {
        const res = await fetch("/api/v1/temperature-stats");
        let temperatures=[]
        if(res.ok){
            const json = await res.json();
            temperatures = json;
            num_pages=(temperatures.length/10)+1|0;
            if(temperatures.length%10==0 && num_pages !== 1){
                num_pages--;
            }
        }
    }
</script>

<main>
    <Navbar color="light" light>
        <NavbarBrand>Temperaturas</NavbarBrand>
        <Nav>
            <NavItem>
                <NavLink href="#/">Inicio</NavLink> 
            </NavItem>
        </Nav>
    </Navbar>
    <hr>
    <Alert {color} dismissible>
        {#if dialogMSG.length>0}
		    {dialogMSG}
	    {/if}
    </Alert>
    <hr>
    <h4 style="text-align:center"><strong>Búsqueda de temperaturas</strong></h4>
    <Table>
        <th>País</th>
        <th>Año </th>
        <th>Temperatura mínima</th>
        <th>Temperatura máxima</th>
        <th>Temperatura co2</th>
        <th>Acciones</th>
        <tr>
            <td><input type = "text" bind:value="{findTemperatureCountry}"></td>
            <td><input type = "number" bind:value="{findTemperatureYear}"></td>
            <td><input type = "number" bind:value="{findTemperatureMin}"></td>
            <td><input type = "number" bind:value="{findTemperatureMax}"></td>
            <td><input type = "number" bind:value="{findTemperatureCo2}"></td>
            <td>
                <Button color="primary" on:click="{findTemperature (findTemperatureCountry, findTemperatureYear, findTemperatureMin, findTemperatureMax, findTemperatureCo2)}">Buscar</Button>
            </td>

        </tr>
    </Table>
    <hr>
    <h4 style="text-align:center"><strong>Lista de temperaturas</strong></h4>
    {#await temperatureData}
        Cargando las temperaturas
    {:then temperatureData}
    <Table responsive>
        <thead>
            <tr>
                <th>País</th>
                <th>Año </th>
                <th>Temperatura mínima</th>
                <th>Temperatura máxima</th>
                <th>Temperatura co2</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each temperatureData as temperature}
                <tr>
                    <td><a href="#/temperature-stats/{temperature.country}/{temperature.year}">{temperature.country}</a></td>
                    <td>{temperature.year}</td>
                    <td>{temperature.temperature_min}</td>
                    <td>{temperature.temperature_max}</td>
                    <td>{temperature.temperature_co2}</td>
                    <td> <a href="#/temperature-stats/{temperature.country}/{temperature.year}"> <Button color="primary">Editar</Button></a></td>
                    <td><Button color="danger" on:click={deleteTemperature(temperature.country, temperature.year)}>Eliminar</Button></td>

                </tr>
            {/each}
            <tr>
                <td><input bind:value={newTemperature.country} /></td>
                <td><input type=number bind:value={newTemperature.year} /></td>
                <td><input bind:value={newTemperature.temperature_min} /></td>
                <td><input bind:value={newTemperature.temperature_max} /></td>
                <td><input bind:value={newTemperature.temperature_co2}/></td>
                <td><Button color="primary" on:click={insertTemperatureData}>Añadir</Button></td>
            </tr>
        </tbody>
    </Table>
    

    <Button color="success" on:click={loadInitialData}>
        Cargar datos inciales
    </Button>
    <Button color="danger" on:click={deleteAllTemperature}>
        Eliminar todo
    </Button>


    {#if temperatureData.length !== 0}
        <div style="text-align: center; " >
            <h4>
                {#if page != 1}
                    <Button color="success" on:click={previousPage}>Anterior</Button>
                {/if}
                <Badge> {page} / {num_pages}</Badge>
                {#if num_pages-page!=0 }
                    <Button color="success" on:click={nextPage}>Siguiente</Button>
                {/if}  
            </h4>
            
        </div>
    {/if}
    {/await}
</main>

<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    let temperatureData = [];
    let newTemperature = {
        country: "",
        year: "",
        temperature_min: "",
        temperature_max: "",
        temperature_co2: "",
    };

    onMount(getTemperatureData);

    //Método Get
    async function getTemperatureData() {
        const res = await fetch("/api/v1/temperature-stats?limit=10&offset=1");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            temperatureData = json;
        }
    }

    //Load initial data
    async function loadInitialData() {
        await fetch("/api/v1/temperature-stats/loadInitialData");
        const res = await fetch("/api/v1/temperature-stats?limit=10&offset=1");
        if (res.ok) {
            const json = await res.json();
            temperatureData = json;
        }
    }

    //New temperature
    async function insertTemperatureData() {
        if (newTemperature.temperature_country == "" || newTemperature.temperature_country == null || 
            newTemperature.temperature_year == "" || newTemperature.temperature_year == null ||
            newTemperature.temperature_min == "" || newTemperature.temperature_min == null ||
            newTemperature.temperature_max == "" || newTemperature.temperature_max == null || 
            newTemperature.temperature_co2 == "" || newTemperature.temperature_co2 == null)
        {
            alert("Existe uno o más de un campo vacío.");
        } else {
            const res = await fetch("/api/v1/temperature-stats", {
                method: "POST",
                body: JSON.stringify(newTemperature),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(function (res) {
                if (res.status == 201) {
                    getTemperatureData();
                    alert("Se ha añadido una nueva estadística.")
                }
                else if (res.status == 409) {
                    alert("Ya existe un recurso con los datos")
                } else if (res.status == 400) {
                    alert("Los campos introducidos son incorrectos.")
                }
            });
        }
    }

    //Delete an specif temperature
    async function deleteTemperature(country, year) {
        const res = await fetch(
            "/api/v1/temperature-stats/" + country + "/" + year,
            {
                method: "DELETE",
            }
        ).then(function (res) {
            getTemperatureData();
            if (res.status == 200) {
                alert("Se ha eliminado con éxito una temperatura.")
            } else if (res.status == 404) {
                alert("No se ha encontrado la temperatura")
            }
        });
    }

    //Delete all temperature data
    async function deleteAllTemperature() {
        const res = await fetch("/api/v1/temperature-stats/", {
            method: "DELETE",
        }).then(function (res) {
            if (res.ok) {
                getTemperatureData();
                alert("Se han eliminado todas las temperaturas.")
            } else {
                alert("Se ha producido un error y no se han podido eliminar los datos.")
            }
        });

    }
</script>

<main>
    <h1>Temperaturas</h1>
    {#await temperatureData}
        Cargando las temperaturas
    {:then temperatureData}
        <Table responsive>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Número de temperaturas</th>
                    <th>Temperatura mínima</th>
                    <th>Temperatura máxima</th>
                    <th>Temperatura cO2</th>
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
                        <td><Button color="danger" on:click={deleteTemperature(temperature.country, temperature.year)}>Eliminar</Button></td>
                    </tr>
                {/each}
                <!--
                <tr>
                    <td><input bind:value={newFire.fire_country} /></td>
                    <td><input type=number bind:value={newFire.fire_year} /></td>
                    <td><input type=number bind:value={newFire.fire_nfc} /></td>
                    <td><input type=number bind:value={newFire.fire_aee} /></td>
                    <td><input type=number bind:value={newFire.fire_nvs}/></td>
                    <td><Button color="primary" on:click={insertFireData}>Añadir</Button></td>
                </tr>
                -->
            </tbody>
        </Table>

        <Button color="success" on:click={loadInitialData}>
            Cargar datos inciales
        </Button>
        <Button color="danger" on:click={deleteAllTemperature}>Eliminar todo</Button>
    {/await}
</main>

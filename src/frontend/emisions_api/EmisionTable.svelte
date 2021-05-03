<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import {Nav, NavItem, NavLink } from "sveltestrap";


    let emisionData = [];
    let newEmision = {
        country: "",
        year: "",
        carb_diox_ppm: "",
        methane_ppb: "",
        nitro_oxide_ppb: "",
    };

    onMount(getEmisionData);

    //Método Get
    async function getEmisionData() {
        const res = await fetch("/api/v1/emisions-stats?limit=10&offset=1");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            emisionData = json;
        }
    }

    //Load initial data
    async function loadInitialData() {
        await fetch("/api/v1/emisions-stats/loadInitialData");
        const res = await fetch("/api/v1/emisions-stats?limit=10&offset=1");
        if (res.ok) {
            const json = await res.json();
            emisionData = json;
        }
    }

    //New emision
    async function insertemisionData() {
        if (newEmision.emision_country == "" || newEmision.emision_country == null || 
            newEmision.emision_year == "" || newEmision.emision_year == null ||
            newEmision.methane_ppb == "" || newEmision.methane_ppb == null ||
            newEmision.carb_diox_ppm == "" || newEmision.carb_diox_ppm == null || 
            newEmision.nitro_oxide_ppb == "" || newEmision.nitro_oxide_ppb == null)
        {
            alert("Existe uno o más de un campo vacío.");
        } else {
            const res = await fetch("/api/v1/emisions-stats", {
                method: "POST",
                body: JSON.stringify(newEmision),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(function (res) {
                if (res.status == 201) {
                    getEmisionData();
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

    //Delete an specif emision
    async function deleteEmision(country, year) {
        const res = await fetch(
            "/api/v1/emisions-stats/" + country + "/" + year,
            {
                method: "DELETE",
            }
        ).then(function (res) {
            getEmisionData();
            if (res.status == 200) {
                alert("Se ha eliminado con éxito una emision.")
            } else if (res.status == 404) {
                alert("No se ha encontrado la emision")
            }
        });
    }

    //Delete all emision data
    async function deleteAllEmision() {
        const res = await fetch("/api/v1/emisions-stats/", {
            method: "DELETE",
        }).then(function (res) {
            if (res.ok) {
                getEmisionData();
                alert("Se han eliminado todos los emisiones.")
            } else {
                alert("Se ha producido un error y no se han podido eliminar los datos.")
            }
        });

    }
</script>

<main>
    <Nav>
        <NavItem>
          <NavLink href="/">Inicio</NavLink>
        </NavItem>
    </Nav>
    <h1>Emisiones</h1>
    {#await emisionData}
        Cargando las emisiones
    {:then emisionData}
        <Table responsive>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Partes por millón de CO2</th>
                    <th>Partes por billón de metano</th>
                    <th>Partes por billón de óxido nitroso</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each emisionData as emision}
                    <tr>
                        <td><a href="#/emisions-stats/{emision.country}/{emision.year}">{emision.country}</a></td>
                        <td>{emision.year}</td>
                        <td>{emision.carb_diox_ppm}</td>
                        <td>{emision.methane_ppb}</td>
                        <td>{emision.nitro_oxide_ppb}</td>
                        <td> <a href="#/emisions-stats/{emision.country}/{emision.year}"> <Button color="primary">Editar</Button></a></td>
                        <td><Button color="danger" on:click={deleteEmision(emision.country, emision.year)}>Eliminar</Button></td>
                    </tr>
                {/each}
                
                <tr>
                    <td><input bind:value={newEmision.emision_country} /></td>
                    <td><input type=number bind:value={newEmision.emision_year} /></td>
                    <td><input type=number bind:value={newEmision.carb_diox_ppm} /></td>
                    <td><input type=number bind:value={newEmision.methane_ppb} /></td>
                    <td><input type=number bind:value={newEmision.nitro_oxide_ppb}/></td>
                    <td><Button color="primary" on:click={insertemisionData}>Añadir</Button></td>
                </tr>
                
            </tbody>
        </Table>

        <Button color="success" on:click={loadInitialData}>
            Cargar datos inciales
        </Button>
        <Button color="danger" on:click={deleteAllEmision}>Eliminar todo</Button>
    {/await}
</main>

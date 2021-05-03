<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import {Nav, NavItem, NavLink } from "sveltestrap";


    let fireData = [];
    let newFire = {
        country: "",
        year: "",
        fire_nfc: "",
        fire_aee: "",
        fire_nvs: "",
    };

    onMount(getFireData);

    //Método Get
    async function getFireData() {
        const res = await fetch("/api/v1/fire-stats?limit=10&offset=1");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            fireData = json;
        }
    }

    //Load initial data
    async function loadInitialData() {
        await fetch("/api/v1/fire-stats/loadInitialData");
        const res = await fetch("/api/v1/fire-stats?limit=10&offset=1");
        if (res.ok) {
            const json = await res.json();
            fireData = json;
        }
    }

    //New fire
    async function insertFireData() {
        if (newFire.fire_country == "" || newFire.fire_country == null || 
            newFire.fire_year == "" || newFire.fire_year == null ||
            newFire.fire_aee == "" || newFire.fire_aee == null ||
            newFire.fire_nfc == "" || newFire.fire_nfc == null || 
            newFire.fire_nvs == "" || newFire.fire_nvs == null)
        {
            alert("Existe uno o más de un campo vacío.");
        } else {
            const res = await fetch("/api/v1/fire-stats", {
                method: "POST",
                body: JSON.stringify(newFire),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(function (res) {
                if (res.status == 201) {
                    getfireData();
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

    //Delete an specif fire
    async function deleteFire(country, year) {
        const res = await fetch(
            "/api/v1/fire-stats/" + country + "/" + year,
            {
                method: "DELETE",
            }
        ).then(function (res) {
            getFireData();
            if (res.status == 200) {
                alert("Se ha eliminado con éxito un incendio.")
            } else if (res.status == 404) {
                alert("No se ha encontrado el incendio")
            }
        });
    }

    //Delete all fire data
    async function deleteAllFire() {
        const res = await fetch("/api/v1/fire-stats/", {
            method: "DELETE",
        }).then(function (res) {
            if (res.ok) {
                getFireData();
                alert("Se han eliminado todos los incendios.")
            } else {
                alert("Se ha producido un error y no se han podido eliminar los datos.")
            }
        });

    }
</script>

<main>
    <Nav>
        <NavItem>
          <NavLink href="#/">Inicio</NavLink>        
        </NavItem>
      </Nav>
    <h1>Incendios</h1>
    {#await fireData}
        Cargando los incendios
    {:then fireData}
        <Table responsive>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Número de incendios</th>
                    <th>Estimación anual de emisiones</th>
                    <th>Número de especies vegetales afectadas</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each fireData as fire}
                    <tr>
                        <td><a href="#/fire-stats/{fire.country}/{fire.year}">{fire.country}</a></td>
                        <td>{fire.year}</td>
                        <td>{fire.fire_nfc}</td>
                        <td>{fire.fire_aee}</td>
                        <td>{fire.fire_nvs}</td>
                        <td> <a href="#/fire-stats/{fire.country}/{fire.year}"> <Button color="primary">Editar</Button></a></td>
                        <td><Button color="danger" on:click={deleteFire(fire.country, fire.year)}>Eliminar</Button></td>

                    </tr>
                {/each}
                <tr>
                    <td><input bind:value={newFire.fire_country} /></td>
                    <td><input type=number bind:value={newFire.fire_year} /></td>
                    <td><input type=number bind:value={newFire.fire_nfc} /></td>
                    <td><input type=number bind:value={newFire.fire_aee} /></td>
                    <td><input type=number bind:value={newFire.fire_nvs}/></td>
                    <td><Button color="primary" on:click={insertFireData}>Añadir</Button></td>
                </tr>
            </tbody>
        </Table>

        <Button color="success" on:click={loadInitialData}>
            Cargar datos inciales
        </Button>
        <Button color="danger" on:click={deleteAllFire}>Eliminar todo</Button>
    {/await}
</main>

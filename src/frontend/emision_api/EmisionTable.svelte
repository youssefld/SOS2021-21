<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import { Alert, Nav, NavItem, NavLink, Badge, Navbar, NavbarBrand,} from 'sveltestrap';


    let emisionData = [];
    let newEmision = {
        country: "",
        year: "",
        carb_diox_ppm: "",
        methane_ppb: "",
        nitro_oxide_ppb: "",
    };
    let limit = 10;
    let offset = 0;
    let page = (offset/10)+1;
    let num_pages= 0;

    let dialogMSG = "";
    let color = "";

    let findCountry = "";
    let findYear = "";
    let findCarb_diox_ppm = "";
    let findMethane_ppb = "";
    let findNitro_oxide_ppb = "";

    onMount(getEmisionData);

    //Método Get
    async function getEmisionData() {
        getNumPages();
        const res = await fetch("/api/v2/emision-stats?limit="+limit+"&offset="+offset);
        if (res.ok) {
            const json = await res.json();
            emisionData = json;
            page = (offset/10)+1
        }
    }

    //Load initial data
    async function loadInitialData() {
        await fetch("/api/v2/emision-stats/loadInitialData");
        const res = await fetch("/api/v2/emision-stats?limit="+limit+"&offset="+offset);
        if (res.ok) {
            const json = await res.json();
            emisionData = json;
            color = "success"
            dialogMSG = "Se han cargado los datos iniciales";
        }
    }

    //New emision
    async function insertemisionData() {
        if (newEmision.country == "" || newEmision.country == null || 
            newEmision.year == "" || newEmision.year == null ||
            newEmision.methane_ppb == "" || newEmision.methane_ppb == null ||
            newEmision.carb_diox_ppm == "" || newEmision.carb_diox_ppm == null || 
            newEmision.nitro_oxide_ppb == "" || newEmision.nitro_oxide_ppb == null)
        {
            color = "danger"
            dialogMSG = "Existe más de un campo vacío.";  
        } else {
            console.log("Nueva emisión:"+newEmision)
            const res = await fetch("/api/v2/emision-stats", {
                method: "POST",
                body: JSON.stringify(newEmision),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(function (res) {
                if (res.status == 201) {
                    color = "success"
                    dialogMSG = "Se ha añadido una nueva emisión.";
                }
                else if (res.status == 409) {
                    color = "danger"
                    dialogMSG = "Datos introducidos incorrectos.";
                } else if (res.status == 400) {
                    color = "danger"
                    dialogMSG = "Ya existe una emisión con los mismos datos.";
                }
            });
        }
        await getEmisionData();
    }

    //Delete an specif emision
    async function deleteEmision(country, year) {
        const res = await fetch(
            "/api/v2/emision-stats/" + country + "/" + year,
            {
                method: "DELETE",
            }
        ).then(function (res) {
            if (res.status == 200) {
                color = "success";
                dialogMSG = "Se ha eliminado la emisión.";
            } else if (res.status == 404) {
                color = "danger";
                dialogMSG = "Se ha producido un error.";                  
            }
        });
        await getEmisionData();
    }

    //Delete all emision data
    async function deleteAllEmision() {
        const res = await fetch("/api/v2/emision-stats/", {
            method: "DELETE",
        }).then(function (res) {
            if (res.ok) {
                getEmisionData();
                color = "success"
                dialogMSG = "Se han eliminado todas las emisiones.";
            } else {
                color = "danger"
                dialogMSG = "Se ha producido un error.";
            }
        });

        await getEmisionData();
    }

    //Find emision
    async function findEmision(findCountry, findYear, findCarb_diox_ppm, findMethane_ppb, findNitro_oxide_ppb){
        if(typeof findCountry == 'undefined'){
            findCountry = "";
        }
        if(typeof findYear == 'undefined'){
            findYear = "";
        }
        if(typeof findCarb_diox_ppm == 'undefined'){
            findCarb_diox_ppm = "";
        }
        if(typeof findMethane_ppb=='undefined'){
            findMethane_ppb = "";
        }
        if(typeof findNitro_oxide_ppb == 'undefined'){
            findNitro_oxide_ppb = "";
        }
        const res = await fetch("/api/v2/emision-stats?country="+findCountry+"&year="+findYear+"&carb_diox_ppm="+findCarb_diox_ppm+"&methane_ppb="+findMethane_ppb+"&nitro_oxide_ppb="+findNitro_oxide_ppb);
        if (res.ok){
            const json = await res.json();
            emisionData = json;
            
            if(emisionData.length>0){
                color = "success"
                dialogMSG = "Dato(s) encontrado(s): " + emisionData.length;
            }
        }else{
            color = "danger";
            dialogMSG = "No se ha encontrado ningún resultado.";
        }
    }

    const nextPage = () => {offset+=10; getEmisionData()};
    const previousPage = () => {offset-=10; getEmisionData()};

    async function getNumPages() {
        const res = await fetch("/api/v2/emision-stats");
        let emisions=[]
        if(res.ok){
            const json = await res.json();
            emisions = json;
            num_pages=(emisions.length/10)+1|0;
            if(emisions.length%10==0 && num_pages !== 1){
                num_pages--;
            }
        }
    }
</script>

<main>
    <Navbar color="light" light>
        <NavbarBrand>Emisiones</NavbarBrand>
        <Nav>
            <NavItem>
                <NavLink href="#/">Inicio</NavLink> 
            </NavItem>
            <NavItem>
                <NavLink href="#/emision/graph">Estadísticas</NavLink>
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
    <h4 style="text-align:center"><strong>Búsqueda de emisiones</strong></h4>
    <Table>
        <th>País</th>
        <th>Año</th>
        <th>Partes por millón de CO2</th>
        <th>Partes por billón de metano</th>
        <th>Partes por billón de óxido nitroso</th>
        <th>Acciones</th>
        <tr>
            <td><input type = "text" bind:value="{findCountry}"></td>
            <td><input type = "number" bind:value="{findYear}"></td>
            <td><input type = "number" bind:value="{findCarb_diox_ppm}"></td>
            <td><input type = "number" bind:value="{findMethane_ppb}"></td>
            <td><input type = "number" bind:value="{findNitro_oxide_ppb}"></td>
            <td>
                <Button color="primary" on:click="{findEmision(findCountry, findYear, findCarb_diox_ppm, findMethane_ppb, findNitro_oxide_ppb)}">Buscar</Button>
            </td>

        </tr>
    </Table>
    <hr>
    <h4 style="text-align:center"><strong>Lista de emisiones</strong></h4>
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
                        <td><a href="#/emision-stats/{emision.country}/{emision.year}">{emision.country}</a></td>
                        <td>{emision.year}</td>
                        <td>{emision.carb_diox_ppm}</td>
                        <td>{emision.methane_ppb}</td>
                        <td>{emision.nitro_oxide_ppb}</td>
                        <td> <a href="#/emision-stats/{emision.country}/{emision.year}"> <Button color="primary">Editar</Button></a></td>
                        <td><Button color="danger" on:click={deleteEmision(emision.country, emision.year)}>Eliminar</Button></td>
                    </tr>
                {/each}
                
                <tr>
                    <td><input bind:value={newEmision.country} /></td>
                    <td><input bind:value={newEmision.year} /></td>
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
        {#if emisionData.length !== 0}
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

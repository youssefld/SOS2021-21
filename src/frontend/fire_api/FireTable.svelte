<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import { Alert, Nav, NavItem, NavLink, Badge, Navbar, NavbarBrand,} from 'sveltestrap';

    let fireData = [];
    let newFire = {
        country: "",
        year: "",
        fire_nfc: "",
        fire_aee: "",
        fire_nvs: "",
    };

    let limit = 10;
    let offset = 0;
    let page = (offset/10)+1;
    let num_pages= 0;

    let dialogMSG = "";
    let color = "";

    let findFireCountry = "";
    let findFireYear = "";
    let findFireNfc = "";
    let findFireAee = "";
    let findFireNvs = "";

    onMount(getFireData);

    //Método Get
    async function getFireData() {
        getNumPages()
        const res = await fetch("/api/v2/fire-stats?limit="+limit+"&offset="+offset);
        if (res.ok) {
            const json = await res.json();
            fireData = json;
            page = (offset/10)+1
        }
    }

    //Load initial data
    async function loadInitialData() {
        await fetch("/api/v2/fire-stats/loadInitialData");
        const res = await fetch("/api/v2/fire-stats?limit="+limit+"&offset="+offset);
        if (res.ok) {
            const json = await res.json();
            fireData = json;
            color = "success"
            dialogMSG = "Se han cargado los datos iniciales";
        }
    }

    //New fire
    async function insertFireData() {
        console.log("Insertando nuevo dato: "+newFire.country)
        if (newFire.country == "" || newFire.country == null || 
            newFire.year == "" || newFire.year == null ||
            newFire.fire_aee == "" || newFire.fire_aee == null ||
            newFire.fire_nfc == "" || newFire.fire_nfc == null || 
            newFire.fire_nvs == "" || newFire.fire_nvs == null)
        {
            color = "danger"
            dialogMSG = "Existe más de un campo vacío.";              
        } else {
            console.log("Nuevo incendio:"+newFire)
            const res = await fetch("/api/v2/fire-stats", {
                method: "POST",
                body: JSON.stringify(newFire),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(function (res) {
                if (res.status == 201) {
                    color = "success"
                    dialogMSG = "Se ha añadido un nuevo incendio.";
                }
                else if (res.status == 409) {
                    color = "danger"
                    dialogMSG = "Datos introducidos incorrectos.";                
                } else if (res.status == 400) {
                    color = "danger"
                    dialogMSG = "Ya existe un incendio con los mismos datos.";                
                }
            });
        }
        await getFireData()
    }

    //Delete an specif fire
    async function deleteFire(country, year) {
        const res = await fetch(
            "/api/v2/fire-stats/" + country + "/" + year,
            {
                method: "DELETE",
            }
        ).then(function (res) {
            if (res.status == 200) {
                color = "success"
                dialogMSG = "Se ha eliminado un incedio.";
          
            } else if (res.status == 404) {
                color = "danger"
                dialogMSG = "Se ha producido un error.";                  
            }
        });

        await getFireData();
    }

    //Delete all fire data
    async function deleteAllFire() {
        const res = await fetch("/api/v2/fire-stats/", {
            method: "DELETE",
        }).then(function (res) {
            if (res.ok) {
                getFireData();
                color = "success"
                dialogMSG = "Se han eliminado todos los incendios.";
            } else {
                color = "danger"
                dialogMSG = "Se ha producido un error.";
            }
        });

        await getFireData();

    }

    //Find fire
    async function findFire(findFireCountry, findFireYear, findFireNfc, findFireAee, findFireNvs){
        if(typeof findFireCountry == 'undefined'){
            findFireCountry = "";
        }
        if(typeof findFireYear == 'undefined'){
            findFireYear = "";
        }
        if(typeof findFireNfc == 'undefined'){
            findFireNfc = "";
        }
        if(typeof findFireAee=='undefined'){
            findFireAee = "";
        }
        if(typeof findFireNvs == 'undefined'){
            findFireNvs = "";
        }
        const res = await fetch("/api/v2/fire-stats?country="+findFireCountry+"&year="+findFireYear+"&fire_nfc="+findFireNfc+"&fire_aee="+findFireAee+"&fire_nvs="+findFireNvs);
        if (res.ok){
            const json = await res.json();
            fireData = json;
            
            if(fireData.length>0){
                color = "success"
                dialogMSG = "Dato(s) encontrado(s): " + fireData.length;
            }
        }else{
            color = "danger";
            dialogMSG = "No se ha encontrado ningún resultado.";
        }
    }

    const nextPage = () => {offset+=10; getFireData()}
    const previousPage = () => {offset-=10; getFireData()}

    async function getNumPages() {
        const res = await fetch("/api/v2/fire-stats");
        let fires=[]
        if(res.ok){
            const json = await res.json();
            fires = json;
            num_pages=(fires.length/10)+1|0;
            if(fires.length%10==0 && num_pages !== 1){
                num_pages--;
            }
        }
    }
</script>

<main>
    <Navbar color="light" light>
        <NavbarBrand>Incendios</NavbarBrand>
        <Nav>
            <NavItem>
                <NavLink href="#/">Inicio</NavLink> 
            </NavItem>
            <NavItem>
                <NavLink href="#/fire/graph">Estadísticas</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="#/graph">Estadísticas globales</NavLink> 
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
    <h4 style="text-align:center"><strong>Búsqueda de incendios</strong></h4>
    <Table>
        <th>País</th>
        <th>Año</th>
        <th>Número de incendios</th>
        <th>Estimación anual de emisiones</th>
        <th>Número de especies vegetales afectadas</th>
        <th>Acciones</th>
        <tr>
            <td><input type = "text" bind:value="{findFireCountry}"></td>
            <td><input type = "number" bind:value="{findFireYear}"></td>
            <td><input type = "number" bind:value="{findFireNfc}"></td>
            <td><input type = "number" bind:value="{findFireAee}"></td>
            <td><input type = "number" bind:value="{findFireNvs}"></td>
            <td>
                <Button color="primary" on:click="{findFire (findFireCountry, findFireYear, findFireNfc, findFireNfc, findFireNvs)}">Buscar</Button>
            </td>

        </tr>
    </Table>
    <hr>
    <h4 style="text-align:center"><strong>Lista de incendios</strong></h4>
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
                <td><input bind:value={newFire.country} /></td>
                <td><input type=number bind:value={newFire.year} /></td>
                <td><input bind:value={newFire.fire_nfc} /></td>
                <td><input bind:value={newFire.fire_aee} /></td>
                <td><input bind:value={newFire.fire_nvs}/></td>
                <td><Button color="primary" on:click={insertFireData}>Añadir</Button></td>
            </tr>
        </tbody>
    </Table>
    

    <Button color="success" on:click={loadInitialData}>
        Cargar datos inciales
    </Button>
    <Button color="danger" on:click={deleteAllFire}>
        Eliminar todo
    </Button>


    {#if fireData.length !== 0}
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

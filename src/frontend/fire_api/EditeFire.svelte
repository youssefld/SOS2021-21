<script>
    import { onMount } from "svelte";
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";
  
    const BASE_CONTACT_API_PATH = "/api/v1";
    export let params = {};
    let fire = {};
    let updateCountry = "XXXX";
    let updateYear = 2010;
    let updateFire_nfc = 100;
    let updateFire_aee = 100;
    let updateFire_nvs = 100;

    
    async function getFire() {
      const res = await fetch(
        BASE_CONTACT_API_PATH +"/fire-stats/" + params.country +"/" + params.year
      );
  
      if (res.ok) {
        const json = await res.json();
        fire = json;
        updateCountry = fire.country;
        updateYear = fire.year;
        updateFire_nfc = fire["fire_nfc"];
        updateFire_aee = fire["fire_aee"];
        updateFire_nvs = fire["fire_nvs"];

      } else {
        if(res.status===404){
            alert("Error al encontrar el incendio solicitador ");
          }else if(res.status ===500){
            alert("Error al acceder a la base de datos");
          }        
        }
    }
  
    async function updateFire() {
      console.log(
        "Updating fire..." +
          JSON.stringify(params.country) +
          JSON.stringify(params.year)
      );
  
      const res = await fetch(
        BASE_CONTACT_API_PATH +
          "/fire-stats/" +
          params.country +
          "/" +
          params.year,
        {
          method: "PUT",
          body: JSON.stringify({
            "country": params.country,
            "year": parseInt(params.year),
            "fire_nfc": parseInt(updateFire_nfc),
            "fire_aee": parseFloat(updateFire_aee),
            "fire_nvs": parseInt(updateFire_nvs),
          }),
          headers: {
            "Content-Type": "application/json",
          }
        }
      ).then(function (res) {
        if (res.ok) {
          getFire();
          alert("Se ha actualizado el incendio correctamente");
        } else {
          if(res.status===409){
              alert("El incendio ya se encuentra cargado.")
          }else if(res.status ===500){
              alert("Error al acceder a la base de datos.")
          }else if(res.status ===404){
              alert("Error al encontrar el incendio solicitado.")
          }        
          getFire();
        }
      });
    }
    onMount(getFire);
  </script>
  
  <main>
    <Nav>
      <NavItem>
        <NavLink href="#/fire">Volver</NavLink>
      </NavItem>
    </Nav>
  
    <h2>
      Editar incendio: <strong>{params.country}</strong>
      <strong>{params.year}</strong>
    </h2>
    <Table bordered>
      <thead>
        <tr>
          <th>País</th>
          <th>Año </th>
          <th>Número de incendios</th>
          <th>Estmación anual de emisiones</th>
          <th>Número de especies vegetales afectadas</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{updateCountry}</td>
          <td>{updateYear}</td>
          <td><input type="number" placeholder="2000" min="1"   bind:value={updateFire_nfc} /></td>
          <td><input type="number" placeholder="1000" min="1.0"   bind:value={updateFire_aee} /></td>
          <td><input type="number" placeholder="1000" min="1"   bind:value={updateFire_nvs} /></td>
          <td>
            <Button outline color="primary" on:click={updateFire}>Actualizar</Button>
          </td>
        </tr>
      </tbody>
    </Table>  
  </main>
  
  <style>
    main{
      text-align: center;
      padding: 1em;
      margin: 0 auto;
    }
  </style>
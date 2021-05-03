<script>
    import { onMount } from "svelte";
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";
  
    const BASE_CONTACT_API_PATH = "/api/v1";
    export let params = {};
    let emision = {};
    let updateCountry = "XXXX";
    let updateYear = 2010;
    let updateEmision_carb_diox_ppm = 100;
    let updateEmision_methane_ppb = 100;
    let updateEmision_nitro_oxide_ppb = 100;

    
    async function getEmision() {
      const res = await fetch(
        BASE_CONTACT_API_PATH +"/emisions-stats/" + params.country +"/" + params.year
      );
  
      if (res.ok) {
        const json = await res.json();
        emision = json;
        updateCountry = emision.country;
        updateYear = emision.year;
        updateEmision_carb_diox_ppm = emision["carb_diox_ppm"];
        updateEmision_methane_ppb = emision["methane_ppb"];
        updateEmision_nitro_oxide_ppb = emision["nitro_oxide_ppb"];

      } else {
        if(res.status===404){
            alert("Error al encontrar la emision solicitadora ");
          }else if(res.status ===500){
            alert("Error al acceder a la base de datos");
          }        
        }
    }
  
    async function updateEmision() {
      console.log(
        "Updating emision..." +
          JSON.stringify(params.country) +
          JSON.stringify(params.year)
      );
  
      const res = await fetch(
        BASE_CONTACT_API_PATH +
          "/emisions-stats/" +
          params.country +
          "/" +
          params.year,
        {
          method: "PUT",
          body: JSON.stringify({
            "country": params.country,
            "year": parseInt(params.year),
            "carb_diox_ppm": parseFloat(updateEmision_carb_diox_ppm),
            "methane_ppb": parseInt(updateEmision_methane_ppb),
            "nitro_oxide_ppb": parseFloat(updateEmision_nitro_oxide_ppb),
          }),
          headers: {
            "Content-Type": "application/json",
          }
        }
      ).then(function (res) {
        if (res.ok) {
          getEmision();
          alert("Se ha actualizado la emisión correctamente");
        } else {
          if(res.status===409){
              alert("La emisión ya se encuentra cargada.")
          }else if(res.status ===500){
              alert("Error al acceder a la base de datos.")
          }else if(res.status ===404){
              alert("Error al encontrar la emisión solicitada.")
          }        
          getEmision();
        }
      });
    }
    onMount(getEmision);
  </script>
  
  <main>
    <Nav>
      <NavItem>
        <NavLink href="#/emisions">Volver</NavLink>
        <NavLink href="/">Inicio</NavLink>
      </NavItem>
    </Nav>
  
    <h2>
      Editar emision: <strong>{params.country}</strong>
      <strong>{params.year}</strong>
    </h2>
    <Table bordered>
      <thead>
        <tr>
          <th>País</th>
          <th>Año </th>
          <th>Partes por millón de CO2</th>
          <th>Partes por billón de metano</th>
          <th>Partes por billón de óxido nitroso</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{updateCountry}</td>
          <td>{updateYear}</td>
          <td><input type="number" placeholder="2000" min="1.0"   bind:value={updateEmision_carb_diox_ppm} /></td>
          <td><input type="number" placeholder="1000" min="1"   bind:value={updateEmision_methane_ppb} /></td>
          <td><input type="number" placeholder="1000" min="1.0"   bind:value={updateEmision_nitro_oxide_ppb} /></td>
          <td>
            <Button outline color="primary" on:click={updateEmision}>Actualizar</Button>
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
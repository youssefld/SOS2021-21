<script>
  import { onMount } from "svelte";
  import { Table, Button, Nav, NavItem, NavLink, Navbar, NavbarBrand } from "sveltestrap";

  const BASE_CONTACT_API_PATH = "/api/v1";
  export let params = {};
  let temperature = {};
  let updateCountry = "XXXX";
  let updateYear = 2010;
  let updateTemperature_min = 100;
  let updateTemperature_max = 100;
  let updateTemperature_co2 = 100;

  
  async function getTemperature() {
    const res = await fetch(
      BASE_CONTACT_API_PATH +"/temperature-stats/" + params.country +"/" + params.year
    );

    if (res.ok) {
      const json = await res.json();
      temperature = json;
      updateCountry = temperature.country;
      updateYear = temperature.year;
      updateTemperature_min = temperature["temperature_min"];
      updateTemperature_max = temperature["temperature_max"];
      updateTemperature_co2 = temperature["temperature_co2"];

    } else {
      if(res.status===404){
          alert("Error al encontrar la temperatura solicitada ");
        }else if(res.status ===500){
          alert("Error al acceder a la base de datos");
        }        
      }
  }

  async function updateTemperature() {
    console.log(
      "Updating temperature..." +
        JSON.stringify(params.country) +
        JSON.stringify(params.year)
    );

    const res = await fetch(
      BASE_CONTACT_API_PATH +
        "/temperature-stats/" +
        params.country +
        "/" +
        params.year,
      {
        method: "PUT",
        body: JSON.stringify({
          "country": params.country,
          "year": parseInt(params.year),
          "temperature_min": parseInt(updateTemperature_min),
          "temperature_max": parseFloat(updateTemperature_max),
          "temperature_co2": parseInt(updateTemperature_co2),
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }
    ).then(function (res) {
      if (res.ok) {
        getTemperature();
        alert("Se ha actualizado la temperatura correctamente");
      } else {
        if(res.status===409){
            alert("La temperatura ya se encuentra cargado.")
        }else if(res.status ===500){
            alert("Error al acceder a la base de datos.")
        }else if(res.status ===404){
            alert("Error al encontrar la temperatura solicitada.")
        }        
        getTemperature();
      }
    });
  }
  onMount(getTemperature);
</script>

<main>
  <Navbar color="light" light>
    <NavbarBrand>Temperaturas</NavbarBrand>
    <Nav>
        <NavItem>
            <NavLink href="#/">Inicio</NavLink> 
        </NavItem>
        <NavItem>
          <NavLink href="#/temperature">Volver</NavLink> 
      </NavItem>
    </Nav>
  </Navbar>

  <h2>
    Editar temperatura: <strong>{params.country}</strong>
    <strong>{params.year}</strong>
  </h2>
  <Table bordered>
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
      <tr>
        <td>{updateCountry}</td>
        <td>{updateYear}</td>
        <td><input type="number" placeholder="2000" min="1"   bind:value={updateTemperature_min} /></td>
        <td><input type="number" placeholder="1000" min="1.0"   bind:value={updateTemperature_max} /></td>
        <td><input type="number" placeholder="1000" min="1"   bind:value={updateTemperature_co2} /></td>
        <td>
          <Button outline color="primary" on:click={updateTemperature}>Actualizar</Button>
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
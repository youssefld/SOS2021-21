var cool = require('cool-ascii-faces')
var express = require('express')
var path = require("path")
var app = express()
var bodyParser = require("body-parser");

var fire_api = require('./fire_api/index');
var temperature_api = require('./temperature_api/index');

var BASE_API_PATH = "/api/v1";
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: false })); // support encoded bodies

var port = process.env.PORT || 3000

app.use("/", express.static(__dirname + "./public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})


app.get('/cool', (request, response) => {
    response.send(cool());
    console.log("New request to /cool has arrived")
})

//Info fire-stats: Youssef
app.get("/info/fire-stats", (req, res) => {
    res.send(`<html>
    <body>
    <h2>Se trata del número medio de incendios por país</h2>
    <table class="table">
  <thead>
    <tr>
      <th scope="col">country</th>
      <th scope="col">year</th>
      <th scope="col">fire-nfc</th>
      <th scope="col">fire-aee</th>
      <th scope="col">fire-nvs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <th scope="row">Australia</th>
        <td>2019</td>
        <td>11200</td>
        <td>46.6</td>
        <td>12500</td>
    </tr>
    <tr>
        <th scope="row">Brazil</th>
        <td>2019</td>
        <td>7420</td>
        <td>2.7751</td>
        <td>4510</td>
    </tr>
    <tr>
        <th scope="row">Bolivia</th>
        <td>2019</td>
        <td>24831</td>
        <td>17.7737</td>
        <td>13210</td>
    </tr>
    <tr>
        <th scope="row">Peru</th>
        <td>2019</td>
        <td>16972</td>
        <td>3.7874</td>
        <td>11200</td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`)
})


//Info temperature-stats: Paula
app.get("/info/temperature-stats", (req, res) => {
    res.send(`<html>
    <body>
    <h2>Se trata de la temperatura media por pais</h2>
    <table class="table">
  <thead>
    <tr>
      <th scope="col">Country</th>
      <th scope="col">Year</th>
      <th scope="col">Temprature Min</th>
      <th scope="col">Temperature Max</th>
      <th scope="col">Temperature CO2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <th scope="row">China</th>
        <td>2010</td>
        <td>37</td>
        <td>46.6</td>
        <td>40</td>
    </tr>
    <tr>
        <th scope="row">Spain</th>
        <td>2010</td>
        <td>37</td>
        <td>43</td>
        <td>44</td>
    </tr>
    <tr>
        <th scope="row">Canada</th>
        <td>2010</td>
        <td>37</td>
        <td>44</td>
        <td>46</td>
    </tr>
    <tr>
        <th scope="row">Russia</th>
        <td>2010</td>
        <td>36</td>
        <td>44</td>
        <td>40</td>
    </tr>
    <tr>
        <th scope="row">EEUU</th>
        <td>2010</td>
        <td>34</td>
        <td>43</td>
        <td>41</td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`)
})
//Info emisions-stats: Alejandro
app.get("/info/emisions-stats", (req, res) => {
    res.send(`<html>
    <body>
    <h2>Se trata de la media de emisiones por pais</h2>
    <table class="table">
  <thead>
    <tr>
      <th scope="col">Country</th>
      <th scope="col">Year</th>
      <th scope="col">co2-ppm</th>
      <th scope="col">ch4-ppb</th>
      <th scope="col">n20-ppb</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <th scope="row">USA</th>
        <td>2019</td>
        <td>381.2</td>
        <td>1782</td>
        <td>320.1</td>
    </tr>
    <tr>
        <th scope="row">China</th>
        <td>2019</td>
        <td>389.0</td>
        <td>1783</td>
        <td>318.6</td>
    </tr>
    <tr>
        <th scope="row">Spain</th>
        <td>2019</td>
        <td>377.1</td>
        <td>1808</td>
        <td>323.2</td>
    </tr>
    <tr>
        <th scope="row">Russia</th>
        <td>2019</td>
        <td>383.1</td>
        <td>1789</td>
        <td>320.9</td>
    </tr>
    <tr>
        <th scope="row">Japan</th>
        <td>2019</td>
        <td>379.1</td>
        <td>1783</td>
        <td>319.2</td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`)
})

//API REST Youssef
fire_api.register(app);

//API REST Paula
temperature_api.register(app);



//API REST Alejandro
var emisions_stats = [];

app.get(BASE_API_PATH + "/emisions-stats", (req, res) => {
    res.send(JSON.stringify(emisions_stats, null, 2));
});

app.get(BASE_API_PATH + "/emisions-stats/loadInitialData", (req, res) => {
    if (emisions_stats.length != 0) {
        emisions_stats.splice(0, emisions_stats.length);
    }
    var emisionsIni = [{
        "country": "spain",
        "year": 2019,
        "carb-diox-ppm": 377
    },
    {
        "country": "japan",
        "year": 2019,
        "carb-diox-ppm": 379
    }];

    for (var emisions of emisionsIni){
        emisions_stats.push(emisions);
    }
    res.status(201).send(JSON.stringify(emisions_stats, null, 2));

    console.log(`Nuevas emisiones creadas: <${JSON.stringify(emisionsIni, null, 2)}>`);
    
});

app.post(BASE_API_PATH + "/emisions-stats", (req, res) => {
    var newEmisions = req.body;
    console.log(`Nuevas emisiones añadidas: <${JSON.stringify(newEmisions, null, 2)}>`);
    emisions_stats.push(newEmisions);
    res.sendStatus(201);
});
app.get(BASE_API_PATH + "/emisions-stats/:country/:year", (req, res) => {
    country = req.params.country
    year = parseInt(req.params.year)
    console.log("Buscando emisiones con año "+year+" y pais "+country);
    for (var emisions of emisions_stats){
		if (emisions.country == country && emisions.year == year){
            console.log("Emisiones encontradas:\n"+JSON.stringify(emisions))
			return res.status(200).json(emisions);
		}
	}
    return res.sendStatus(404);

});

app.delete(BASE_API_PATH + "/emisions-stats/:country/:year", (req, res) => {
    country = req.params.country
    year = req.params.year
    console.log("Eliminando emision con año "+year+" y pais "+country);
    for (var i = 0; i < emisions_stats.length; i++) {
		if (emisions_stats[i]["country"] == country && emisions_stats[i]["year"] == year) {
            console.log("Recurso eliminado");
			emisions_stats.splice(i, 1);
			return res.status(200).send("Se ha eliminado el recurso");
		}
	}

});

app.put(BASE_API_PATH + "/emisions-stats/:country/:year", (req, res) => {
    country = req.params.country;
    year = req.params.year;
    console.log("Actualizando recurso con COUNTRY="+country+" y YEAR="+year);
    data_updated = req.body;
    if(emisions_stats.length == 0){
        console.log("No hay datos");
        return res.sendStatus(404);
    } else {
		for (var i = 0; i < emisions_stats.length; i++) {
			if (emisions_stats[i].country == country && emisions_stats[i].year == year) {
				emisions_stats[i] = data_updated;
                console.log("Recurso actualizado");
				return res.status(200).send("Elemento actualizado");
			}
		}
    }

});
app.post(BASE_API_PATH + "/emisions-stats/:country/:year", (req, res) => {
    console.log("Acción no permitida");
    res.sendStatus(405);
});

app.delete(BASE_API_PATH + "/emisions-stats", (req, res) => {
    console.log("Datos borrados");
    emisions_stats.splice(0, emisions_stats.length);
    res.sendStatus(200);
});

app.put(BASE_API_PATH + "/emisions-stats", (req, res) => {
    console.log("Acción no permitida");
    res.sendStatus(405);
});

app.listen(port, () => {
    console.log("Server ready listening on port " + port)
})

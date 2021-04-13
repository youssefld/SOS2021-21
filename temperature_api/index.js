var BASE_API_PATH = "/api/v1";

module.exports.register = (app) => {
    var temperature_stats = [];

app.get(BASE_API_PATH + "/temperature-stats", (req, res) => {
    if(temperature_stats.length==0){
        console.log("No hay datos");
        res.status(404).send("No existen datos");
    }else{
        res.send(JSON.stringify(temperature_stats, null, 2));
    }

});

app.get(BASE_API_PATH + "/temperature-stats/loadInitialData", (req, res) => {
    if (temperature_stats.length != 0) {
        temperature_stats.splice(0, temperature_stats.length);
    }
    var temperatureIni = [
        {
            "country": "china",
            "year": 2010,
            "temperature_min": 37,
            "temperature_max": 46.6,
            "temperature_co2": 40
        },
        {
            "country": "spain",
            "year": 2010,
            "temperature_min": 37,
            "temperature_max": 43,
            "temperature_co2": 44
        }
    ];
    console.log(`Nuevas estadisticas de temperaturas creadas: <${JSON.stringify(temperatureIni, null, 2)}>`);
    for (var temperature of temperatureIni){
        temperature_stats.push(temperature);
    }
    res.status(201).send(JSON.stringify(temperature_stats, null, 2));
});

app.post(BASE_API_PATH + "/temperature-stats", (req, res) => {
    country = req.body.country;
    year = req.body.year;
    temperature_min = req.body.temperature_min;
    temperature_max = req.body.temperature_max;
    temperature_co2 = req.body.temperature_co2;
    new_temperature = {
        country: country,
        year: year,
        temperature_min: temperature_min,
        temperature_max: temperature_max,
        temperature_co2: temperature_co2
    }
    console.log(`Nueva temperatura añadida: <${JSON.stringify(new_temperature, null, 2)}>`);
    temperature_stats.push(new_temperature);
    res.sendStatus(201);
});


app.get(BASE_API_PATH + "/temperature-stats/:country/:year", (req, res) => {
    country = req.params.country
    year = parseInt(req.params.year)
    console.log("Buscando temperatura con año "+year+" y pais "+country)
    for (var temperature of temperature_stats){
		if (temperature.country == country && temperature.year == year){
            console.log("Temperatura encontrada:\n"+JSON.stringify(temperature))
			return res.status(200).json(temperature);
		}
	}
    return res.sendStatus(404);

});

app.delete(BASE_API_PATH + "/temperature-stats/:country/:year", (req, res) => {
    country = req.params.country
    year = req.params.year
    console.log("Eliminando recurso temperatura con año "+year+" y pais "+country)
    for (var i = 0; i < temperature_stats.length; i++) {
		if (temperature_stats[i]["country"] == country && temperature_stats[i]["year"] == year) {
            console.log("Recurso eliminado")
			temperature_stats.splice(i, 1);
			return res.status(200).send("Se ha eliminado el recurso");
		}
	}

});

app.put(BASE_API_PATH + "/temperature-stats/:country/:year", (req, res) => {
    country = req.params.country;
    year = req.params.year;
    console.log("Actualizando recurso con COUNTRY="+country+" y YEAR="+year);
    data_updated = req.body;
    if(temperature_stats.length == 0){
        console.log("No hay datos");
        return res.sendStatus(404);
    } else {
		for (var i = 0; i < temperature_stats.length; i++) {
			if (temperature_stats[i].country == country && temperature_stats[i].year == year) {
				temperature_stats[i] == data_updated;
                console.log("Recurso actualizado");
				return res.status(200).send("Elemento actualizado");
			}
		}
    }

});

app.post(BASE_API_PATH + "/temperature-stats/:country/:year", (req, res) => {
    console.log("Acción no permitida");
    res.sendStatus(405);
});

app.delete(BASE_API_PATH + "/temperature-stats", (req, res) => {
    console.log("Datos borrados");
    temperature_stats.splice(0, temperature_stats.length);
    res.status(200).send("Se han eliminado todas las estadisticas")
});

app.put(BASE_API_PATH + "/temperature-stats", (req, res) => {
    console.log("Acción no permitida");
    res.sendStatus(405);
});

}
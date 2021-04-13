var BASE_API_PATH = "/api/v1";

module.exports.register = (app) => {
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
}
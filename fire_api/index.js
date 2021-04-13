var BASE_API_PATH = "/api/v1";

module.exports.register = (app) => {
    var fire_stats = [];

    app.get(BASE_API_PATH + "/fire-stats", (req, res) => {
        if (fire_stats.length == 0) {
            console.log("No hay datos");
            res.status(404).send("No existen datos");
        } else {
            res.send(JSON.stringify(fire_stats, null, 2));
        }

    });

    app.get(BASE_API_PATH + "/fire-stats/loadInitialData", (req, res) => {
        if (fire_stats.length != 0) {
            fire_stats.splice(0, fire_stats.length);
        }
        var firesIni = [
            {
                "country": "australia",
                "year": 2019,
                "fire_nfc": 377,
                "fire_aee": 46.6,
                "fire_nvs": 12500
            },
            {
                "country": "Brazil",
                "year": 2019,
                "fire_nfc": 7420,
                "fire_aee": 2.7751,
                "fire_nvs": 4510
            }
        ];
        console.log(`Nuevas estadisticas de incendios creadas: <${JSON.stringify(firesIni, null, 2)}>`);
        for (var fire of firesIni) {
            fire_stats.push(fire);
        }
        res.status(201).send(JSON.stringify(fire_stats, null, 2));
    });

    app.post(BASE_API_PATH + "/fire-stats", (req, res) => {
        country = req.body.country;
        year = req.body.year;
        fire_nfc = req.body.fire_nfc;
        fire_aee = req.body.fire_aee;
        fire_nvs = req.body.fire_nvs;
        new_fire = {
            country: country,
            year: year,
            fire_nfc: fire_nfc,
            fire_aee: fire_aee,
            fire_nvs: fire_nvs
        }
        console.log(`Nuevo incendio añadido: <${JSON.stringify(new_fire, null, 2)}>`);
        fire_stats.push(new_fire);
        res.sendStatus(201);
    });


    app.get(BASE_API_PATH + "/fire-stats/:country/:year", (req, res) => {
        country = req.params.country
        year = parseInt(req.params.year)
        console.log("Buscando incendio con año " + year + " y pais " + country)
        for (var fire of fire_stats) {
            if (fire.country == country && fire.year == year) {
                console.log("Incendio encontrado:\n" + JSON.stringify(fire))
                return res.status(200).json(fire);
            }
        }
        return res.sendStatus(404);

    });

    app.delete(BASE_API_PATH + "/fire-stats/:country/:year", (req, res) => {
        country = req.params.country
        year = req.params.year
        console.log("Eliminando recurso incendio con año " + year + " y pais " + country)
        for (var i = 0; i < fire_stats.length; i++) {
            if (fire_stats[i]["country"] === country && fire_stats[i]["year"] === year) {
                console.log("Recurso eliminado")
                fire_stats.splice(i, 1);
                return res.status(200).send("Se ha eliminado el recurso");
            }
        }

    });

    app.put(BASE_API_PATH + "/fire-stats/:country/:year", (req, res) => {
        country = req.params.country;
        year = req.params.year;
        console.log("Actualizando recurso con COUNTRY=" + country + " y YEAR=" + year);
        data_updated = req.body;
        if (fire_stats.length == 0) {
            console.log("No hay datos");
            return res.sendStatus(404);
        } else {
            for (var i = 0; i < fire_stats.length; i++) {
                if (fire_stats[i].country == country && fire_stats[i].year == year) {
                    fire_stats[i] = data_updated;
                    console.log("Recurso actualizado");
                    return res.status(200).send("Elemento actualizado");
                }
            }
        }

    });

    app.post(BASE_API_PATH + "/fire-stats/:country/:year", (req, res) => {
        console.log("Acción no permitida");
        res.sendStatus(405);
    });

    app.delete(BASE_API_PATH + "/fire-stats", (req, res) => {
        console.log("Datos borrados");
        fire_stats.splice(0, fire_stats.length);
        res.status(200).send("Se han eliminado todas las estadisticas")
    });

    app.put(BASE_API_PATH + "/fire-stats", (req, res) => {
        console.log("Acción no permitida");
        res.sendStatus(405);
    });
}
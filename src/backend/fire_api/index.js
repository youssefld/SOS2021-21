var DataStore = require('nedb')
var fire_stats = new DataStore({ filename: 'fire_api/fire.db', autoload: true })
var BASE_API_PATH = "/api/v1";


module.exports.register = (app) => {

    app.get(BASE_API_PATH + "/fire-stats", (req, res) => {
        dbquery = {}
        if(req.query.country){
            dbquery["country"] = req.query.country;
        }
        if(req.query.year){
            dbquery["year"] = parseInt(req.query.year);
        }
        if(req.query.fire_nfc){
            dbquery["fire_nfc"] = parseInt(req.query.fire_nfc);
        }
        if(req.query.fire_aee){
            dbquery["fire_aee"] = parseFloat(req.query.fire_aee);
        }
        if(req.query.fire_nvs){
            dbquery["fire_nvs"] = parseInt(req.query.fire_nvs);
        }
        
        const offset = parseInt(req.query.offset);
        const limit = parseInt(req.query.limit);
        delete offset;
        delete limit;

        fire_stats.find(dbquery).skip(offset).limit(limit).exec((err, docs) =>{
            if(err){
                console.log("[INFO] An unexcepted errer while loading database has ocurred.")
                res.status(500).send("Error while loading the database")
            }else{
                if (docs.length == 0) {
                    console.log("No hay datos");
                    res.status(404).send("No existen datos");
                } else {
                    docs.forEach((doc) => {
                        delete doc._id;
                    })
                    console.log("[INFO] Loading fires")
                    console.log(JSON.stringify(docs, null, 2))
                    res.status(200).send(JSON.stringify(docs));
                }
            }
        })

        

    });

    app.get(BASE_API_PATH + "/fire-stats/loadInitialData", (req, res) => {
        var firesIni = [
            {
                "country": "Australia",
                "year": 2019,
                "fire_nfc": 377,
                "fire_aee": 46.6,
                "fire_nvs": 12500
            },
            {
                "country": "Chile",
                "year": 2019,
                "fire_nfc": 45,
                "fire_aee": 21.3,
                "fire_nvs": 8500
            },
            {
                "country": "United States",
                "year": 2019,
                "fire_nfc": 210,
                "fire_aee": 34.9,
                "fire_nvs": 4230
            },
            {
                "country": "Colombia",
                "year": 2019,
                "fire_nfc": 377,
                "fire_aee": 46.6,
                "fire_nvs": 12500
            },
            {
                "country": "Brazil",
                "year": 2019,
                "fire_nfc": 7420,
                "fire_aee": 23.7751,
                "fire_nvs": 4510
            }
        ];
        console.log('[INFO] Initial data loaded succesfully!');
        fire_stats.insert(firesIni)
        res.status(201).send('Initial data loaded succesfully!');
    });

    app.post(BASE_API_PATH + "/fire-stats", (req, res) => {
        country = req.body.country;
        year = parseInt(req.body.year);
        fire_nfc = parseInt(req.body.fire_nfc);
        fire_aee = parseFloat(req.body.fire_aee);
        fire_nvs = parseInt(req.body.fire_nvs);
        fire_stats.find({ $and: [{ "country": country, "year": year }] }, function (error, docs) {
            if (docs.length > 0) {
                console.log("[INFO] This fire already exists");
                res.status(400).send("This fire already exists");
            } else {
                if (country == '' || year == 'null' || fire_nfc == 'null' || fire_aee == 'null' || fire_nvs == 'null') {
                    console.log("Empty values")
                    res.status(400).send("Invalid format of fire.");
                } else {
                    new_fire = {
                        country: country,
                        year: year,
                        fire_nfc: fire_nfc,
                        fire_aee: fire_aee,
                        fire_nvs: fire_nvs
                    }
                    console.log('[INFO] New fire was added:\n' + JSON.stringify(new_fire));
                    fire_stats.insert(new_fire);
                    res.status(201).send("New fire was added");
                }
            }
        });
    });

    app.get(BASE_API_PATH + "/fire-stats/:country/:year", (req, res) => {
        country = req.params.country
        year = parseInt(req.params.year)
        console.log("[INFO] Searching for fire with year " + year + " and coutry name " + country)
        fire_stats.findOne({ $and: [{ country: country }, { year: year }] }, function (err, docs) {
            res.status(200).send(JSON.stringify(docs, null, 2));
        });
    });

    app.delete(BASE_API_PATH + "/fire-stats/:country/:year", (req, res) => {
        country = req.params.country
        year = parseInt(req.params.year)
        fire_stats.remove({ $and: [{ country: country }, { year: year }] }, function (err, docs) {
            if (docs == 0) {
                res.status(404).send("Fire not found")
            } else {
                res.status(200).send("Fire deleted.");
            }
        });

    });

    app.put(BASE_API_PATH + "/fire-stats/:country/:year", (req, res) => {
        countryQuery = req.params.country;
        yearQuery = parseInt(req.params.year);
        //Data updated
        country = req.body.country;
        year = parseInt(req.body.year);
        fire_nfc = parseInt(req.body.fire_nfc);
        fire_aee = parseFloat(req.body.fire_aee);
        fire_nvs = parseInt(req.body.fire_nvs);
        data_updated = {country, year, fire_nfc, fire_aee, fire_nvs}
        fire_stats.update({ "country": countryQuery, "year": yearQuery }, { $set: data_updated }, (err, doc) => {
            if (doc == 0) {
                console.log("[INFO] Fire not found. Cannot be updated")
                res.status(404).send("Fire not found.");
            }
            else {
                console.log("[INFO] Fire updated")
                res.status(200).send("Fire updated.");
            }
        });

    });

    app.post(BASE_API_PATH + "/fire-stats/:country/:year", (req, res) => {
        console.log("[INFO] Action not allowed");
        res.sendStatus(405);
    });

    app.delete(BASE_API_PATH + "/fire-stats", (req, res) => {
        console.log("[INFO] All fires were deleted");
        fire_stats.remove({}, { multi: true }, (error, docs) => {
            res.status(200).send("All fires were deleted");
        });
    });

    app.put(BASE_API_PATH + "/fire-stats", (req, res) => {
        console.log("[INFO] Action not allowed");
        res.sendStatus(405);
    });
}
var DataStore = require('nedb');
var emisions_stats = new DataStore({ filename: 'emision_api/emision.db', autoload: true });
var BASE_API_PATH = "/api/v1";


module.exports.register = (app) => {

    app.get(BASE_API_PATH + "/emisions-stats", (req, res) => {
        dbquery = {}
        if(req.query.country){
            dbquery["country"] = req.query.country;
        }
        if(req.query.year){
            dbquery["year"] = parseInt(req.query.year);
        }
        if(req.query.carb_diox_ppm){
            dbquery["carb_diox_ppm"] = parseFloat(req.query.carb_diox_ppm);
        }
        if(req.query.methane_ppb){
            dbquery["methane_ppb"] = parseInt(req.query.methane_ppb);
        }
        if(req.query.nitro_oxide_ppb){
            dbquery["nitro_oxide_ppb"] = parseFloat(req.query.nitro_oxide_ppb);
        }
        
        const offset = parseInt(req.query.offset);
        const limit = parseInt(req.query.limit);
        delete offset;
        delete limit;

        emisions_stats.find(dbquery).skip(offset).limit(limit).exec((err, docs) =>{
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
                    console.log("[INFO] Loading emisions")
                    console.log(JSON.stringify(docs, null, 2))
                    res.status(200).send(JSON.stringify(docs));
                }
            }
        })

        

    });

    app.get(BASE_API_PATH + "/emisions-stats/loadInitialData", (req, res) => {
        var emisionsIni = [
            {
                "country": "eeuu",
                "year": 2019,
                "carb_diox_ppm": 381.2,
                "methane_ppb": 1782,
                "nitro_oxide_ppb": 320.1
            },
            {
                "country": "china",
                "year": 2019,
                "carb_diox_ppm": 389,
                "methane_ppb": 1783,
                "nitro_oxide_ppb": 318.6
            },
            {
                "country": "spain",
                "year": 2019,
                "carb_diox_ppm": 377.1,
                "methane_ppb": 1808,
                "nitro_oxide_ppb": 323.2
            }
        ];
        console.log('[INFO] Initial data loaded succesfully!');
        emisions_stats.insert(emisionsIni)
        res.status(201).send('Initial data loaded succesfully!');
    });

    app.post(BASE_API_PATH + "/emisions-stats", (req, res) => {
        country = req.body.country;
        year = parseInt(req.body.year);
        carb_diox_ppm = parseFloat(req.body.carb_diox_ppm);
        methane_ppb = parseInt(req.body.methane_ppb);
        nitro_oxide_ppb = parseFloat(req.body.nitro_oxide_ppb);
        emisions_stats.find({ $and: [{ "country": country, "year": year }] }, function (error, docs) {
            if (docs.length > 0) {
                console.log("[INFO] This emision already exists");
                res.status(400).send("This emision already exists");
            } else {
                if (country == '' || year == 'null' || carb_diox_ppm == 'null' || methane_ppb == 'null' || nitro_oxide_ppb == 'null') {
                    console.log("Invalid format of emision.")
                    res.status(400).send("Invalid format of emision.");
                } else {
                    new_emision = {
                        country: country,
                        year: year,
                        carb_diox_ppm: carb_diox_ppm,
                        methane_ppb: methane_ppb,
                        nitro_oxide_ppb: nitro_oxide_ppb
                    }
                    console.log('[INFO] New emision was added:\n' + JSON.stringify(new_emision));
                    emisions_stats.insert(new_emision);
                    res.status(201).send("New emision was added");
                }
            }
        });
    });

    app.get(BASE_API_PATH + "/emisions-stats/:country/:year", (req, res) => {
        country = req.params.country
        year = parseInt(req.params.year)
        console.log("[INFO] Searching for emision with year " + year + " and coutry name " + country)
        emisions_stats.findOne({ $and: [{ country: country }, { year: year }] }, function (err, docs) {
            res.status(200).send(JSON.stringify(docs, null, 2));
        });
    });


    app.delete(BASE_API_PATH + "/emisions-stats/:country/:year", (req, res) => {
        country = req.params.country
        year = parseInt(req.params.year)
        emisions_stats.remove({ $and: [{ country: country }, { year: year }] }, function (err, docs) {
            if (docs == 0) {
                res.status(404).send("Emision not found")
            } else {
                res.status(200).send("Emision deleted.");
            }
        });

    });

    app.put(BASE_API_PATH + "/emisions-stats/:country/:year", (req, res) => {
        countryQuery = req.params.country;
        yearQuery = parseInt(req.params.year);
        //Data updated
        country = req.body.country;
        year = parseInt(req.body.year);
        carb_diox_ppm = parseFloat(req.body.carb_diox_ppm);
        methane_ppb = parseInt(req.body.methane_ppb);
        nitro_oxide_ppb = parseFloat(req.body.nitro_oxide_ppb);
        data_updated = {country, year, carb_diox_ppm, methane_ppb, nitro_oxide_ppb}
        emisions_stats.update({ "country": countryQuery, "year": yearQuery }, { $set: data_updated }, (err, doc) => {
            if (doc == 0) {
                console.log("[INFO] Emision not found. Cannot be updated")
                res.status(404).send("Emision not found.");
            }
            else {
                console.log("[INFO] Emision updated")
                res.status(200).send("Emision updated.");
            }
        });

    });

    app.post(BASE_API_PATH + "/emisions-stats/:country/:year", (req, res) => {
        console.log("[INFO] Action not allowed");
        res.sendStatus(405);
    });

    app.delete(BASE_API_PATH + "/emisions-stats", (req, res) => {
        console.log("[INFO] All emisions were deleted");
        emisions_stats.remove({}, { multi: true }, (error, docs) => {
            res.status(200).send("All emisions were deleted");
        });
    });

    app.put(BASE_API_PATH + "/emisions-stats", (req, res) => {
        console.log("[INFO] Action not allowed");
        res.sendStatus(405);
    });
}
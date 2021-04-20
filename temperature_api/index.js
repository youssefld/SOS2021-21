var DataStore = require('nedb')
var temperature_stats = new DataStore({ filename: 'temperature_api/temperature.db', autoload: true })
var BASE_API_PATH = "/api/v1";


module.exports.register = (app) => {

    app.get(BASE_API_PATH + "/temperature-stats", (req, res) => {
        dbquery = {}
        if(req.query.country){
            dbquery["country"] = req.query.country;
        }
        if(req.query.year){
            dbquery["year"] = parseInt(req.query.year);
        }
        if(req.query.temperature_min){
            dbquery["temperature_min"] = parseInt(req.query.temperature_min);
        }
        if(req.query.temperature_max){
            dbquery["temperature_max"] = parseFloat(req.query.temperature_max);
        }
        if(req.query.temperature_co2){
            dbquery["temperature_co2"] = parseInt(req.query.temperature_co2);
        }
        
        const offset = parseInt(req.query.offset);
        const limit = parseInt(req.query.limit);
        delete offset;
        delete limit;

        temperature_stats.find(dbquery).skip(offset).limit(limit).exec((err, docs) =>{
            if(err){
                console.log("[INFO] An unexcepted error while loading database has ocurred.")
                res.status(500).send("Error while loading the database")
            }else{
                if (docs.length == 0) {
                    console.log("[INFO] No data found");
                    res.status(404).send("[INFO] No data found");
                } else {
                    docs.forEach((doc) => {
                        delete doc._id;
                    })
                    console.log("[INFO] Loading temperatures")
                    console.log(JSON.stringify(docs, null, 2))
                    res.status(200).send(JSON.stringify(docs));
                }
            }
        })

        

    });

    app.get(BASE_API_PATH + "/temperature-stats/loadInitialData", (req, res) => {
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
        console.log('[INFO] Initial data loaded succesfully!');
        temperature_stats.insert(temperatureIni)
        res.status(201).send('Initial data loaded succesfully!');
    });

    app.post(BASE_API_PATH + "/temperature-stats", (req, res) => {
        country = req.body.country;
        year = parseInt(req.body.year);
        temperature_min = parseInt(req.body.temperature_min);
        temperature_max = parseFloat(req.body.temperature_max);
        temperature_co2 = parseInt(req.body.temperature_co2);
        temperature_stats.find({ $and: [{ "country": country, "year": year }] }, function (error, docs) {
            if (docs.length > 0) {
                console.log("[INFO] This temperature already exists");
                res.status(400).send("This temperature already exists");
            } else {
                if (country == '' || typeof year == null || temperature_min == null || temperature_max == null || temperature_co2 == null) {
                    console.log("Invalid format of temperature.")
                    res.status(400).send("Invalid format of temperature.");
                }else if (country == req.body.country || typeof year ==  req.body.year || temperature_min ==  req.body.temperature_min || temperature_max ==  req.body.temperature_max || temperature_co2 ==  req.body.temperature_co2){
                        console.log("Conflict.")
                        res.sendStatus(400);
                    
                } else {
                    new_temperature = {
                        country: country,
                        year: year,
                        temperature_min: temperature_min,
                        temperature_max: temperature_max,
                        temperature_co2: temperature_co2
                    }
                    console.log('[INFO] New temperature was added:\n' + JSON.stringify(new_temperature));
                    temperature_stats.insert(new_temperature);
                    res.status(201).send("New temperature was added");
                }
            
            }
        });
    });

    app.get(BASE_API_PATH + "/temperature-stats/:country/:year", (req, res) => {
        country = req.params.country
        year = parseInt(req.params.year)
        console.log("[INFO] Searching for temperature with year " + year + " and coutry name " + country)
        temperature_stats.findOne({ $and: [{ country: country }, { year: year }] }, function (err, docs) {
            res.sendStatus(200).send(docs);
        });
    });

    app.delete(BASE_API_PATH + "/temperature-stats/:country/:year", (req, res) => {
        country = req.params.country
        year = parseInt(req.params.year)
        temperature_stats.remove({ $and: [{ country: country }, { year: year }] }, function (err, docs) {
            if (docs == 0) {
                res.status(404).send("Temperature not found")
            } else {
                res.status(200).send("Temperature deleted.");
            }
        });

    });

    app.put(BASE_API_PATH + "/temperature-stats/:country/:year", (req, res) => {
        countryQuery = req.params.country;
        yearQuery = parseInt(req.params.year);
        //Data updated
        country = req.body.country;
        year = parseInt(req.body.year);
        temperature_min = parseInt(req.body.temperature_min);
        temperature_max = parseFloat(req.body.temperature_max);
        temperature_co2 = parseInt(req.body.temperature_co2);
        data_updated = {country, year, temperature_min, temperature_max, temperature_co2}
        temperature_stats.update({ "country": countryQuery, "year": yearQuery }, { $set: data_updated }, (err, doc) => {
            if (doc == 0) {
                console.log("[INFO] Temperature not found. Cannot be updated")
                res.status(404).send("Temperature not found.");
            }
            else {
                console.log("[INFO] Temperature updated")
                res.status(200).send("Temperature updated.");
            }
        });

    });

    app.post(BASE_API_PATH + "/temperature-stats/:country/:year", (req, res) => {
        console.log("[INFO] Action not allowed");
        res.sendStatus(405);
    });

    app.delete(BASE_API_PATH + "/temperature-stats", (req, res) => {
        console.log("[INFO] All temperatures were deleted");
        temperature_stats.remove({}, { multi: true }, (error, docs) => {
            res.status(200).send("All temperatures were deleted");
        });
    });

    app.put(BASE_API_PATH + "/temperature-stats", (req, res) => {
        console.log("[INFO] Action not allowed");
        res.sendStatus(405);
    });
}
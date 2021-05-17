var cool = require('cool-ascii-faces')
var express = require('express')
var path = require("path");

var app = express()

var fire_api = require('./src/backend/fire_api/v2/index');
var temperature_api = require('./src/backend/temperature_api/v2/index');
var emisions_api = require('./src/backend/emisions_api/index');

app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: false })); // support encoded bodies

var port = process.env.PORT || 3000

app.use("/", express.static(path.join(__dirname,"public")));

//API REST Youssef
fire_api.register(app);

//API REST Paula
temperature_api.register(app);

//API REST Alejandro
emisions_api.register(app);

app.listen(port, () => {
    console.log("Server ready listening on port " + port)
})

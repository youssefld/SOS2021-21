var cool = require('cool-ascii-faces')
var express = require('express')
var path = require("path")
var app = express()

var port = process.env.PORT || 3000

app.use("/", express.static(__dirname + "./public"))

app.get("/", (req, res) =>{
    res.sendFile(__dirname + '/public/index.html');
})


app.get('/cool', (request, response)=> {
    response.send(cool());
    console.log("New request to /cool has arrived")
})

app.listen(port, ()=>{
    console.log("Server ready listening on port "+port)
})
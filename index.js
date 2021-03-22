var cool = require('cool-ascii-faces')
var express = require('express')
var path = require("path")
var app = express()

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
app.get("/info/fire-stats", (req, res)=>{
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

app.listen(port, () => {
    console.log("Server ready listening on port " + port)
})
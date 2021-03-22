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

//Info temperature-stats: Paula
app.get("/info/temperature-stats", (req, res) =>{
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

app.listen(port, ()=>{
    console.log("Server ready listening on port "+port)
})
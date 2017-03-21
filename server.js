const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const url = require('url');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(express.static(__dirname + '/client'));

//Load CountryCode Country Name map
countryCodeName = fs.readFileSync('./countryCodeNameMapData');
countryCodeName = JSON.parse(countryCodeName);
//Load CountryCode City Map
countryCity = fs.readFileSync('./groupedCountryCityMapData');
countryCity = JSON.parse(countryCity);

app.get('/', (req, res)=>{
	
	fs.readFile(path.join(__dirname,'index.html'), (err, page)=>{
		res.end(page);
	})
	
})



app.get('/countryList', (req, res)=>{
	
	res.end(JSON.stringify(countryCodeName));
		
})


app.get('/cityList', (req, res)=>{
	let url_comp = url.parse(req.url, true);
	let cc = url_comp.query.id;
	
	res.end(countryCity[cc].toString());
	
})


server.listen(port, function(){
    console.log("server is up on port: " + port);
});






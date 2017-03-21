const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const url = require('url');
const app = express();

//self signed cerificate
const privateKey = fs.readFileSync(path.join(__dirname,'/secureKey/key.pem'))
const certificate = fs.readFileSync(path.join(__dirname,'/secureKey/server.crt'))
const credentials = {key: privateKey , cert: certificate}

const httpsPort = process.env.PORT || 8080;



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



//APIs
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

const httpsServer = https.createServer(credentials, app);

//Listen
httpsServer.listen(httpsPort, function(){
    console.log("server is up on port: " + httpsPort);
});






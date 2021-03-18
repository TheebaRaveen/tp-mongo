var express = require('express');
var app = express();

var mydb;
var MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'pug');
app.set('views','./views');

MongoClient.connect("mongodb://localhost:27017/geo", function(err, db) {
 mydb = db;
 app.listen(3000);
 console.log("Server listening...on 3000");
});

/***************
* Les routes
****************/
app.get('/hello', function(req, res){
   res.send("hello");
});

app.use('/static', express.static('public'));

// Requete puis resultat en HTML
app.get('/geo-search-results', function(req, res){
 // req.query : recuperer les param de l'url ap un ?

 var latitude = parseFloat(req.query.latitude);
 var longitude = parseFloat(req.query.longitude);
 var radius = parseFloat(req.query.radius)

 var filtreTitre = req.query.filtreTitre

// Filtre
 var filter = {"properties.ins_nom" : {$regex : ".*stade.*", $options : "i"}};
 if (Math.abs(longitude) > 0.00001 && Math.abs(latitude) > 0.00001) {
   filter.geometry = { "$geoWithin": { "$center": [ [ longitude, latitude ] , radius] } };
 }
 // console.log("filter", filter, [ longitude, latitude, radius ]);

//
 mydb.collection('equip').find(filter).toArray(function(err, docs) {
   console.log("Found "+docs.length+" records");
   // afficher les resultats dans la console
   // console.dir(docs);
   res.render('geo-search-results', {
     results: docs
   });
 });

})

// Requete puis resultat en json
app.get('/geo-search-results-json', function(req, res){
  console.log(req.query);

 var latitude = parseFloat(req.query.latitude);
 var longitude = parseFloat(req.query.longitude);
 var radius = parseFloat(req.query.radius)

 var filter = {};
 if (Math.abs(longitude) > 0.00001 && Math.abs(latitude) > 0.00001) {
   filter.geometry = { "$geoWithin": { "$center": [ [ longitude, latitude ] , radius] } };
 }
 // console.log("filter", filter, [ longitude, latitude, radius ]);

 mydb.collection('equip').find(filter).toArray(function(err, docs) {
   console.log("Found "+docs.length+" records");
   // afficher les resultats dans la console
   // console.dir(docs);
   res.end(JSON.stringify({
     "type": "FeatureCollection",
     "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
     "features": docs
   }
  ));
 });
})

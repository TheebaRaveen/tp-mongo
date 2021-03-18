var map = new ol.Map({
 target: 'map',
 layers: [
   new ol.layer.Tile({
     source: new ol.source.OSM(),
     opacity: 1
   }),
   new ol.layer.Vector({
     source: new ol.source.Vector({
       url: 'geo-search-results-json' + window.location.search,
       format: new ol.format.GeoJSON()
     }),
     style: new ol.style.Style({
       image: new ol.style.Circle({
         radius: 10,
         stroke: new ol.style.Stroke({
           color: 'red',
           width: 4
         }),
       fill: new ol.style.Fill({
         color: 'orange'})
       })
     })
   })
 ],
 view: new ol.View({
   center: ol.proj.fromLonLat([2.584, 48.841]),
   zoom: 12,
   maxZoom: 20,
 })
});

var toCenter = document.getElementById("toCenter")
var fromCenter = document.getElementById("fromCenter")

var form = document.getElementById("form")
toCenter.addEventListener("click", function(){
  console.log("Coords center : ", ol.proj.toLonLat(map.getView().getCenter(), 'EPSG:3857'));

  map.getView().setCenter(ol.proj.fromLonLat([parseFloat(form.elements.longitude.value), parseFloat(form.elements.latitude.value)]))
  console.log("Coords maj:", form.elements.longitude.value, form.elements.latitude.value);
})

fromCenter.addEventListener("click", function(){
  console.log("Coords center : ", ol.proj.toLonLat(map.getView().getCenter(), 'EPSG:3857'));
  var coords = ol.proj.toLonLat(map.getView().getCenter(), 'EPSG:3857');
  form.elements.longitude.value = coords[0]
  form.elements.latitude.value = coords[1]
  console.log("Coords maj:", form.elements.longitude.value, form.elements.latitude.value);
})

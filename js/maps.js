var map; var SDLLayer;

function initialize() {
  var center_pt = new google.maps.LatLng(12.080529,121.7679702);    
  var mapOptions = {
    zoom: 6,
    center: center_pt            
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);       
  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);         


  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var elem = document.getElementById("longitude");
      elem.value = position.coords.longitude;
      elem = document.getElementById("latitude");
      elem.value = position.coords.latitude;

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  }

  google.maps.event.addListener(map, "rightclick", function(event){

      var newpos = new google.maps.LatLng(event.latLng.lat(),
                 event.latLng.lng());
      var newmarker = new google.maps.Marker({
        position: newpos,
        map: map,
        title: 'Your crush!'
      });

      var contentString = '';
        var infowindow = new google.maps.InfoWindow({
          content: contentString
      });

      google.maps.event.addListener(newmarker, 'mouseover', function(){
          infowindow.open(map,newmarker);
      });
      google.maps.event.addListener(newmarker, 'mouseout', function(){
          infowindow.close();
      });

      google.maps.event.addListener(newmarker, 'dblclick', function(){
        newmarker.setMap(null);
      });

  });

}


 function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }
  
function AddWMSLayer(){
  floodMaps.forEach(function(entry){
    entry.flood.forEach(function(flood){
      SDLLayer = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
          var proj = map.getProjection();
          var zfactor = Math.pow(2, zoom);

          // get Long Lat coordinates
          var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
          var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

          //corrections for the slight shift of the SLP (mapserver)
          var deltaX = 0.0013;
          var deltaY = 0.00058;

          //create the Bounding box string
          var bbox = (top.lng() + deltaX) + "," +
          (bot.lat() + deltaY) + "," +
          (bot.lng() + deltaX) + "," +
          (top.lat() + deltaY);

          var url = "http://202.90.153.87:8080/geoserver/wms?service=WMS&version=1.1.1&request=GetMap&layers=" + flood.geoserver_layer + "&styles=point&srs=epsg:4326&bbox=" + bbox + "&width=256&height=256&format=image/png&BGCOLOR=0xD8D8D8&TRANSPARENT=TRUE";
          return url;                 // return URL for the tile
        },               

        tileSize: new google.maps.Size(256, 256),
        opacity: 1, // setting image TRANSPARENCY 
        isPng: true
      });   
      map.overlayMapTypes.push(SDLLayer);

    });
  });
}



function RemoveLayer(){
  if(SDLLayer){
    var count = 0
    map.overlayMapTypes.forEach(function(remove){
      map.overlayMapTypes.removeAt(count++);  
    });
  }
}

//some parts of the code came from http://www.etechpulse.com/2013/06/how-to-add-wms-layer-as-imagepng-on.html
google.maps.event.addDomListener(window, 'load', initialize);
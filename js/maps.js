var map; var SDLLayer;
var markers = [];

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

  
}

function showRain(){

    var image = {
    url: 'img/flood.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(32, 37),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 32)
    };
    $.post(baserl + "index.php/home/getRainForecast", function(data){
      var ct = 0;
      $.parseJSON(data).forEach(function(entry){
        if(entry.data[0] != undefined && entry.data[0].chance_of_rain == "High Chance of Rain")
        var myLatlng = new google.maps.LatLng(entry.lat, entry.lng);
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: entry.location,
          icon: image
        });

        markers.push(marker);
      });
    });
  }

function removeMarker(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
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
    var count = 0;
    if(entry.event_id == "5")
      entry.flood.forEach(function(flood){
        if(count == 10) return;
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
        count++;
        console.log(count);
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
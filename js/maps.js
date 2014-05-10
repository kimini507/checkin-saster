var map; var SDLLayer;

window.onload = getData;

function getData(){
  var content = document.getElementById('hidden_values').innerHTML;
  console.log($.parseJSON(content));
};

function initialize() {
    var center_pt = new google.maps.LatLng(12.080529,121.7679702);    
    var mapOptions = {
        zoom: 6,
        center: center_pt            
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);       
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);         
}

function AddWMSLayer()
{
    //Define custom WMS tiled layer
    SDLLayer = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            var proj = map.getProjection();
            var zfactor = Math.pow(2, zoom);

        //     // get Long Lat coordinates

             var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
             var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

        //     //corrections for the slight shift of the SLP (mapserver)
             var deltaX = 0.0013;
             var deltaY = 0.00058;

             //create the Bounding box string
             var bbox = (top.lng() + deltaX) + "," +
                                  (bot.lat() + deltaY) + "," +
                                  (bot.lng() + deltaX) + "," +
                                  (top.lat() + deltaY);             


            //http://localhost:808/cgi-bin/mapserv.exe?MAP=C:/Users/lepton/Desktop/My Docs/Development/GIS Testing/Delhi_State_Locality.map&LAYERS=ALL&MODE=MAP
            console.log(bbox);

            var url = "http://202.90.153.87:8080/geoserver/wms?service=WMS&version=1.1.1&request=GetMap&layers=noah:LanaoDelNorte_IliganCity_Flood_5year&styles=point&srs=epsg:4326&bbox=" + bbox + "&width=256&height=256&format=image/png&BGCOLOR=0xD8D8D8&TRANSPARENT=TRUE";

            return url;                 // return URL for the tile
        },               

        tileSize: new google.maps.Size(256, 256),
        opacity: 1, // setting image TRANSPARENCY 
        isPng: true
    });   
    map.overlayMapTypes.push(SDLLayer);

}



 function RemoveLayer() {
    if(SDLLayer)
    {          
        map.overlayMapTypes.removeAt(0);           
    }
}

//source from http://www.etechpulse.com/2013/06/how-to-add-wms-layer-as-imagepng-on.html
google.maps.event.addDomListener(window, 'load', initialize);
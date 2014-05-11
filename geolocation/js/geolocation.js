/**
Most of the codes are copy pasted from the samples from https://www.developers.google.com/maps
**/
var map;

function initialize() {
	var mapOptions = {
		zoom: 6,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById('map-canvas'),
	mapOptions);

	// Try HTML5 geolocation
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		var pos = new google.maps.LatLng(position.coords.latitude,
		           position.coords.longitude);


		map.setCenter(pos);

		var marker = new google.maps.Marker({
			position: pos,
			map: map,

			title: 'You are here!'
		});


		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	}
	
	google.maps.event.addListener(map, "rightclick", function(event){

		if(infoEmpty()){
			var newpos = new google.maps.LatLng(event.latLng.lat(),
			           event.latLng.lng());
			var newmarker = new google.maps.Marker({
				position: newpos,
				map: map,
				icon: "img/loveinterest.png",
				shadow: "img/loveinterest.png",
				title: 'Your crush!'
			});

			var contentString = '<div id="content">'+
			    '<div id="siteNotice">'+
			    '</div>'+
			    '<h2 id="firstHeading" class="firstHeading">'+ $('#inp_name').val() +'</h2>'+
			    '<div id="bodyContent">'+
			    '<p>Address: '+$('#inp_address').val()+'</p>'+
			    '<p>Email: '+$('#inp_email').val()+'</p>'+
			    '</div>'+
			    '</div>';
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

		}
	});
}

function infoEmpty(){

	if($('#inp_name').val()=="" || $('#inp_address').val()=="" || $('#inp_email')=="")
		return false;

	return true;
}

function handleNoGeolocation(errorFlag) {
	if (errorFlag) {
		var content = 'Error: The Geolocation service failed.';
	} else {
		var content = 'Error: Your browser doesn\'t support geolocation.';
	}

	var options = {
		map: map,
		position: new google.maps.LatLng(60, 105),
		content: content
	};

	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);




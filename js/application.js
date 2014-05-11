/**
* @author Markus Michel
* @copyright 2007 by Markus Michel
* @license Creative Commons License - Some rights reserved
*/
//<![CDATA[

/* Constants */
var GPSMM_PAPER_ORIENTATION_PORTRAIT  = 0;
var GPSMM_PAPER_ORIENTATION_LANDSCAPE = 1;

/* Variables */

/** The Google map object */
var map = null;

/** The currently acvtive waypoint */
var currentMarker = null;

/** The root for all other waypoints */
var rootMarker = null;

/** Marker container */
var markers = [];

/** The geocoder object that does location->coord retrieval */
var geocoder = null;

/** Gridsizes for paper formats */
var gridSizesA4Portrait  = [16,  9,  4];

/** Gridsizes for paper formats */
var gridSizesA4Landscape = [24, 12,  6];

/** Gridsizes for paper formats */
var gridSizesA3Portrait  = [24, 12,  8];

/** Gridsizes for paper formats */
var gridSizesA3Landscape = [32, 16,  8];

/** Number of gridlines in auto mode */
var xGridSize = gridSizesA4Portrait[1];

/** Number of gridlines in auto mode */
var yGridSize = gridSizesA4Landscape[1];

/** the current grid color */
var gridColor = "#666";

/** Default grid width for desired zoom level */
var deltaLng = [0,0,0,0,0,0,0,0,0,(28/60),(5/60),(3/60),(1/60),(0.75/60),(0.5/60),0.005,0,0,0,0,0,0];

/** Default grid width for desired zoom level */
var deltaLat = [0,0,0,0,0,0,0,0,0,(12/60),(4/60),(2/60),(1/60),(0.5/60),(0.25/60),0.005,0,0,0,0,0,0];

/** Turn on/off automatic grid width calculation */
var autoGridWidth = true;

/** Paper format */
var paperFormat = "4";

/** Paper orientation */
var paperOrientation = GPSMM_PAPER_ORIENTATION_PORTRAIT;

/** Initial latitude, longitude of map */
var startLat = 50.7327; //
var startLng = 7.0963;  // Bonn, Germany

/**
 * Initializes the application on page load
 */
function load() {
  if (GBrowserIsCompatible()) {
    map = new GMap2(document.getElementById("map"));

    // hook before init of map
    hookBeforeInit();

    map.addControl(new GLargeMapControl());
    map.addControl(new GMapTypeControl());
    map.setCenter(new GLatLng(startLat, startLng), 13);

    // setup waypoint manager
    markerMgr = new GMarkerManager(map, {trackMarkers: false});
    initWaypointIcons();

    GEvent.addListener(map, "moveend", function() {
        var center = map.getCenter();
        document.getElementById("coords").innerHTML =
                getDecimalMinute(center.lat()) + " " + getDecimalMinute(center.lng());
        generateGrid();
    });
    GEvent.addListener(map, "zoomend", function(oldZoomLevel, newZoomLevel) {
        //alert(newZoomLevel);
		//removeGrid();
    });

    geocoder = new GClientGeocoder();

	/* init default values */
	var elem = document.getElementById("gridsize");
	xGridSize = _getGridSizes(false)[elem.selectedIndex];
	yGridSize = _getGridSizes(true)[elem.selectedIndex];
	elem = document.getElementById("paperformat");
	paperFormat = elem.options[elem.selectedIndex].value;
	elem = document.getElementById("paperorientation");
	paperOrientation = elem.options[elem.selectedIndex].value;
    elem = document.getElementById("autogrid");
	autoGridWidth = elem.checked;
	document.getElementById("gridsize").disabled = !autoGridWidth;
    var center = map.getCenter();
    document.getElementById("coords").innerHTML =
        getDecimalMinute(center.lat()) + " " + getDecimalMinute(center.lng());

	formatMap();
	// second setCenter is necessary to position the map after formating
    map.setCenter(new GLatLng(startLat, startLng), 13);

	document.getElementById("gridsize").onchange = function() {
		var elem = document.getElementById("gridsize");
		xGridSize = _getGridSizes(false)[elem.selectedIndex];
		yGridSize = _getGridSizes(true)[elem.selectedIndex];
		generateGrid();
	}

	document.getElementById("paperformat").onchange = function() {
		var elem = document.getElementById("paperformat");
		paperFormat = elem.options[elem.selectedIndex].value;
		formatMap();
	}

	document.getElementById("paperorientation").onchange = function() {
		var elem = document.getElementById("paperorientation");
		paperOrientation = elem.options[elem.selectedIndex].value;
		formatMap();
	}

	hookAfterInit();
  }
}

/**
 * Handles the location search
 */
function geocode() {
    if (geocoder) {
        var address = document.getElementById("address").value;
        geocoder.getLatLng(address,
            function(point) {
                if (!point) {
                    alert(address + " not found");
                } else {
                    map.setCenter(point, 13);
                }
            });
    }
    //return false;
}

/**
 * Adds a waypoint to the map and sets this as the
 * current active waypoint.
 */
function addWaypoint(toCenter, title) {

    // set waypoint to map center
    if (toCenter || document.getElementById("newWpLocation").value.length == 0) {
        if (!title || title.length == 0)
            if (document.getElementById("newWpName").value.length == 0)
                title = "Waypoint";
            else
                title = document.getElementById("newWpName").value

        var m = new GMarker(map.getCenter(),
            {title: title, icon: MGG_DEFAULT_WP_ICON, draggable: true});
        GEvent.addListener(m, "dragend", function () {
            m.openInfoWindowHtml("<b>" + m.getTitle() + "</b><br />"
                + getDecimalMinute(m.getLatLng().lat()) + ", "
                + getDecimalMinute(m.getLatLng().lng()) + "<br /><br />"
                + "<a href=\"#\" onclick=\"removeWaypoint()\">Remove</a>"
            );
            notifyCurrentMarker(m);
        });
        GEvent.addListener(m, "dragstart", function () {
            m.closeInfoWindow();
        });
        GEvent.addListener(m, "click", function () {
            m.openInfoWindowHtml("<b>" + m.getTitle() + "</b><br />"
                + getDecimalMinute(m.getLatLng().lat()) + ", "
                + getDecimalMinute(m.getLatLng().lng()) + "<br /><br />"
                + "<a href=\"#\" onclick=\"removeWaypoint()\">Remove</a>"
            );
            notifyCurrentMarker(m);
        });

        map.addOverlay(m);
        notifyCurrentMarker(m);
        markers.push(m);
        return;
    }

    // set waypoint to given location
    title = document.getElementById("newWpName").value;
    if (geocoder) {
        var address = document.getElementById("newWpLocation").value;
        geocoder.getLatLng(address,
        function(point) {
            if (!point) {
                alert("Waypoint location not found. Please try again.");
            } else {
                var m = new GMarker(point,
                    {title: title, icon: MGG_DEFAULT_WP_ICON, draggable: true});
                GEvent.addListener(m, "dragend", function () {
                    m.openInfoWindowHtml("<b>" + m.getTitle() + "</b><br />"
                        + getDecimalMinute(m.getLatLng().lat()) + ", "
                        + getDecimalMinute(m.getLatLng().lng()) + "<br /><br />"
                        + "<a href=\"#\" onclick=\"removeWaypoint()\">Remove</a>"
                    );
                    notifyCurrentMarker(m);
                });
                GEvent.addListener(m, "dragstart", function () {
                    m.closeInfoWindow();
                });
                GEvent.addListener(m, "click", function () {
                    m.openInfoWindowHtml("<b>" + m.getTitle() + "</b><br />"
                        + getDecimalMinute(m.getLatLng().lat()) + ", "
                        + getDecimalMinute(m.getLatLng().lng()) + "<br /><br />"
                        + "<a href=\"#\" onclick=\"removeWaypoint()\">Remove</a>"
                    );
                    notifyCurrentMarker(m);
                });

                map.addOverlay(m);
                notifyCurrentMarker(m);
                markers.push(m);
            }
        });
    } else {
        alert("Geocoder error!");
    }
}

/**
 * Removes current active waypoint
 */
function removeWaypoint() {
    if (currentMarker != null) {
        map.removeOverlay(currentMarker);
        markers.remove(currentMarker);
        currentMarker = null;
    }
}

/**
 * Handles the update process of the current active marker
 */
function notifyCurrentMarker(m) {
    if (m != null) {
        currentMarker = m;
    }
    else {
        currentMarker = null;
    }
}

function initWaypointIcons() {
    MGG_DEFAULT_WP_ICON = new GIcon();
    MGG_DEFAULT_WP_ICON.image = "http://markusmichel.de/gps/mapicons/icong.png";
    MGG_DEFAULT_WP_ICON.shadow = "http://www.google.com/mapfiles/shadow50.png";
    MGG_DEFAULT_WP_ICON.iconSize = new GSize(20, 34);
    MGG_DEFAULT_WP_ICON.shadowSize = new GSize(37, 34);
    MGG_DEFAULT_WP_ICON.iconAnchor = new GPoint(9, 34);
    MGG_DEFAULT_WP_ICON.infoWindowAnchor = new GPoint(9, 2);
    MGG_DEFAULT_WP_ICON.infoShadowAnchor = new GPoint(18, 25);

    MGG_ACTIVE_WP_ICON = new GIcon();
    MGG_ACTIVE_WP_ICON.image = "http://markusmichel.de/gps/mapicons/iconr.png";
    MGG_ACTIVE_WP_ICON.shadow = "http://www.google.com/mapfiles/shadow50.png";
    MGG_ACTIVE_WP_ICON.iconSize = new GSize(20, 34);
    MGG_ACTIVE_WP_ICON.shadowSize = new GSize(37, 34);
    MGG_ACTIVE_WP_ICON.iconAnchor = new GPoint(9, 34);
    MGG_ACTIVE_WP_ICON.infoWindowAnchor = new GPoint(9, 2);
    MGG_ACTIVE_WP_ICON.infoShadowAnchor = new GPoint(18, 25);
}

function removeGrid() {
	map.clearOverlays();
}

function toogleAutoGrid(elem) {
    removeGrid();
    autoGridWidth = elem.checked;
	document.getElementById("gridsize").disabled = !autoGridWidth;
	generateGrid();
}

function generateGrid() {

    var pos        = findPos(document.getElementById("map"));
    var bounds     = map.getBounds();
    var sw         = bounds.getSouthWest();
    var ne         = bounds.getNorthEast();
    var gridWidth  = 0;
    var gridHeight = 0;

	removeGrid();

    if (autoGridWidth) {
		if (map.getZoom() > 5) {
            var delta  = computeDelta(sw, ne);
            gridWidth  = Math.floor(delta[1] / xGridSize * 1000) / 1000;
            gridHeight = Math.floor(delta[0] / yGridSize * 1000) / 1000;
		}
    } else {
        gridWidth  = deltaLng[map.getZoom()];
        gridHeight = deltaLat[map.getZoom()];
    }

    // if zoom level is to high or to low
    if (gridWidth == 0 || gridHeight == 0) {
        return;
    } else {
    }

	if (sw.lng() < 0)
		var lng = -(Math.abs(Math.floor(sw.lng() / gridWidth) + 1) * gridWidth);
	else
		var lng = Math.abs(Math.floor(sw.lng() / gridWidth) + 1) * gridWidth;
	var x0 = map.fromLatLngToDivPixel(new GLatLng(sw.lat(), lng)).x;
	var x1 = x0;
	while (Math.abs(x1-x0) < map.getSize().width) {
		map.addOverlay(new Gridline(new GLatLng(sw.lat(), lng), true, 2, gridColor));
		lng += gridWidth;
		x1 = map.fromLatLngToDivPixel(new GLatLng(sw.lat(), lng)).x;
	}

	if (sw.lat() < 0)
		var lat = -(Math.abs(Math.floor(sw.lat() / gridHeight) + 1) * gridHeight);
	else
		var lat = Math.abs(Math.floor(sw.lat() / gridHeight) + 1) * gridHeight;
	var y0 = map.fromLatLngToDivPixel(new GLatLng(lat, sw.lng())).y;
	var y1 = y0;
	while (Math.abs(y1 - y0) < map.getSize().height) {
		map.addOverlay(new Gridline(new GLatLng(lat, sw.lng()), false, 2, gridColor));
		lat += gridHeight;
		y1 = map.fromLatLngToDivPixel(new GLatLng(lat, sw.lng())).y;
	}

	// add markers to the map
    for (var i = 0; i < markers.length; i++) {
        map.addOverlay(markers[i]);
    }
}

/**
 * Computes the absolute between the two
 * geocoordinates sw and ne.
 *
 * @param {GLatLng} sw The South-West coordinate
 * @param {GLatLng} ne The North-East coordinate
 * @return {Array} An array of numbers lat and lng
 */
function computeDelta(sw, ne) {
    var deltaLng = 0;
    var deltaLat = 0;

    if (sw.lng() < 0) {
        if (ne.lng() < 0) {
            deltaLng = Math.abs(sw.lng() - ne.lng());
        } else {
            deltaLng = Math.abs(sw.lng()) + ne.lng();
        }
    } else {
        if (ne.lng() < 0) {
            deltaLng = 360 - sw.lng() + ne.lng();
        } else {
            deltaLng = ne.lng() - sw.lng();
        }
    }

    if (sw.lat() < 0) {
        if (ne.lat() < 0) {
            deltaLat = Math.abs(sw.lat() - ne.lat());
        } else {
            deltaLat = Math.abs(sw.lat()) + ne.lat();
        }
    } else {
        deltaLat = Math.abs(sw.lat() - ne.lat());
    }

    return [deltaLat, deltaLng];
}

function getDecimalMinute(number) {
    var s = "";
    var d = Math.floor(number);
    var frac = number - d;
    var m = Math.round(frac * 60000) / 1000;
    if (d <   0) s = "-";
    if (d < 100) s = s + "0";
    if (d <  10) s = s + "0";
    s = s + Math.abs(d) + "° ";
    if (m < 10) s = s + "0";
    s = s + m;
	if (Math.floor(m) - m == 0) s = s + ".0";
    if (Math.floor(m *  10) - m *  10 == 0) s = s + "0";
    if (Math.floor(m * 100) - m * 100 == 0) s = s + "0";
    return s;
}

/**
 * Diese Funktion liefert die absolute Position des uebergebenen Objektes obj
 * als Array (x,y) zurueck.
 */
function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft
        curtop = obj.offsetTop
        while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft
            curtop += obj.offsetTop
        }
    }
    return [curleft,curtop];
}

/**
 * Reformats the map after a paper format/orientation change
 */
function formatMap() {
	map.getContainer().className = "format" + paperFormat + paperOrientation;
	map.checkResize();
    var elem = document.getElementById("gridsize");
    xGridSize = _getGridSizes(true)[elem.selectedIndex];
    yGridSize = _getGridSizes(false)[elem.selectedIndex];
	generateGrid();
}

function _getGridSizes(isY) {
	if (isY)
		if (paperOrientation == "p")
			if (paperFormat == 4)
				return gridSizesA4Portrait;
			else
				return gridSizesA3Portrait;
		else
			if (paperFormat == 4)
				return gridSizesA4Landscape;
			else
				return gridSizesA3Landscape
	else
		if (paperOrientation == "p")
			if (paperFormat == 4)
				return gridSizesA4Landscape;
			else
				return gridSizesA3Landscape
		else
			if (paperFormat == 4)
				return gridSizesA4Portrait;
			else
				return gridSizesA3Portrait;
}

window.addEvent('domready', function(){

	$$('.box').setStyle('display', 'block');

	$$('.menuTitleBar').each(function(title){
		var link = title.getElement('img');
		var block = title.getNext();
		var fx = new Fx.Slide(block, {duration: 200});
		fx.addEvent("onComplete", function() {
			if (this.open)
				link.src = "img/silk/bullet_arrow_top.png";
			else
				link.src = "img/silk/bullet_arrow_bottom.png";
		});

		link.addEvent('click', function(){
			fx.toggle();
		});

		if (link.src.indexOf("img/silk/bullet_arrow_bottom.png") > -1)
		  fx.toggle();

	});

	$each($$('.gridColor'), function(c, idx) {
		c.addEvent('click', function() {
			gridColor = c.getStyle('backgroundColor');
			generateGrid();
		});
	});

	//new SmoothScroll();

});

function Gridline(pos, isLng, opt_weight, opt_color) {
	this.pos_ = pos;
	this.isLng_ = isLng;
	this.weight_ = opt_weight || 2;
	this.color_ = opt_color || "#666666";
}

Gridline.prototype = new GOverlay();

Gridline.prototype.initialize = function(map) {
	var div = document.createElement("div");
	var label = document.createElement("div");

	if (this.isLng_) {
		div.style.width = this.weight_ + "px";
		div.style.position = "absolute";
	} else {
		div.style.height = this.weight_ + "px";
		div.style.position = "absolute";
	}
	div.style.backgroundColor = this.color_;
	label.style.position = "absolute";
	label.style.backgroundColor = "#fff";
	label.style.font = "8pt normal nowrap";
	label.style.fontFamily = "Arial, Sans Serif";

	map.getPane(G_MAP_MAP_PANE).appendChild(div);
	map.getPane(G_MAP_MAP_PANE).appendChild(label);

	this.map_ = map;
	this.div_ = div;
	this.label_ = label;
}

Gridline.prototype.remove = function() {
	this.div_.parentNode.removeChild(this.div_);
	this.label_.parentNode.removeChild(this.label_);
}

Gridline.prototype.copy = function() {
	return new Gridline(this.pos_, this.isLng_,
	                    this.weight_, this.color_);
}

Gridline.prototype.redraw = function(force) {
	if (!force) return;

	var c1 = this.map_.fromLatLngToDivPixel(this.pos_);
	var c2;

	if (this.isLng_) {
		c2 = this.map_.fromLatLngToDivPixel(
			new GLatLng(this.map_.getBounds().getNorthEast().lat(),this.pos_.lng())
		);
		this.div_.style.height = Math.abs(c2.y - c1.y) + "px";
		this.label_.appendChild(document.createTextNode(getDecimalMinute(this.pos_.lng())));
	} else {
		c2 = this.map_.fromLatLngToDivPixel(
			new GLatLng(this.pos_.lat(), this.map_.getBounds().getNorthEast().lng())
		);
		this.div_.style.width = Math.abs(c2.x - c1.x) + "px";
        this.div_.style.fontSize = "0";
		this.label_.appendChild(document.createTextNode(getDecimalMinute(this.pos_.lat())));
	}

	this.div_.style.top = (Math.min(c2.y, c1.y) - Math.floor(this.weight_ / 2)) + "px";
	this.div_.style.left = (Math.min(c2.x, c1.x) - Math.floor(this.weight_ / 2)) + "px";
	this.label_.style.top = (Math.min(c2.y, c1.y) - Math.floor(this.weight_ / 2) + 4) + "px";
	this.label_.style.left = (Math.min(c2.x, c1.x) - Math.floor(this.weight_ / 2) + 4) + "px";
}

// some hook functions
// overwride them after inserting this script
function hookBeforeInit() {}
function hookAfterInit() {}

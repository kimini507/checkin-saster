<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title> .:: CheckInSaster ::. </title>
	<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>css/bootstrap.min.css">
</head>
<body>
	<hidden id="hidden_values" style="style:none;display:none;">
	<?php
		$content = file_get_contents('http://202.90.153.89/api/flood_maps');
		print_r($content);
	?>
	</hidden>
	<a href="#" onclick="AddWMSLayer();">Add WMS Layer</a> &nbsp;&nbsp;
    <a href="#" onclick="RemoveLayer();">Remove Layer</a> <br /><br />
    <div id="map_canvas" style="width: 100%; height: 600px;">
    </div>
</body>

<script type="text/javascript" src="<?php echo base_url();?>js/bootstrap.min.js"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=AIzaSyDs766uhPPeE9zxHfbsMOifMxffl7kbn_8&sensor=false"></script>
<script type="text/javascript" src="js/maps.js"></script>
</html>
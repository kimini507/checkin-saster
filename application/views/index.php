	<hidden id="hidden_values" style="style:none;display:none;">
	<?php
		$content = file_get_contents('http://202.90.153.89/api/flood_maps');
		print_r($content);
	?>
	</hidden>
	<a href="#" onclick="AddWMSLayer();">Add WMS Layer</a> &nbsp;&nbsp;
    <a href="#" onclick="RemoveLayer();">Remove Layer</a> <br /><br />
    <div id="map_canvas" class="col-xs-12">
    </div>

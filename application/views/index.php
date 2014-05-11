

    <div id="map_canvas" class="col-xs-12">
    </div>

    <div id="map_overlay" class="col-xs-12">
    	
    	<?php
    		for($i=0; $i<7; $i++){
    			for($j=0; $j<20; $j++){
    				echo '<div data-tt-x="' . $j . '" data-tt-y="' . $i . '" class="map_blocks"></div>';
    			}
    		}
    	?>


    </div>

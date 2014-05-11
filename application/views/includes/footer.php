</body>

<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.1.js"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/bootstrap.min.js"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=AIzaSyDs766uhPPeE9zxHfbsMOifMxffl7kbn_8&sensor=true"></script>
<script type="text/javascript" src="js/maps.js"></script>

<script>
    createMatrixCell();
</script>
</html>





<script type="text/javascript">
	
	var floodMaps;

	$.get("<?php echo base_url();?>index.php/home/getFloodmaps", function(data){
		floodMaps = data;
		floodMaps = $.parseJSON(floodMaps);
	})

</script>

<?php

  require ("/system/libraries/globelabs/GlobeApi.php");

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title> .:: CheckInSaster ::. </title>
	<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>css/style.css">
</head>
<body class="cbp-spmenu-push">


<nav id="navbar_top" class="navbar navbar-default" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" id="showLeftPush" href="#">Brand</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
      	<li><a href="#" onclick="AddWMSLayer();">Add WMS Layer</a></li>
	      <li><a href="#" onclick="RemoveLayer();">Remove Layer</a></li>
      </ul>

      <div class="navbar-left">
	  </div>

      <ul class="nav navbar-nav navbar-right">
        <li ><a id="showRightPush" href="#">Link</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
          <ul class="dropdown-menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li class="divider"></li>
            <li><a href="#">Separated link</a></li>
          </ul>
        </li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

<div class="modal fade" id="alert-modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">ALERT</h4>
      </div>
      <div class="modal-body">
        <table>
          <tr valign="top">
            <td><label> Radius(degrees): </label></td>
            <td><input id="alert-rad" type="number" value="10"/></td><br/>
          </tr>
          <tr valign="top">
            <td><label> Message: </label></td>
            <td><textarea id="alert-alert" placeholder="Input alert here..."> </textarea></td>
          </tr>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="" id="alert-submit" type="button" class="btn btn-danger">ALERT</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
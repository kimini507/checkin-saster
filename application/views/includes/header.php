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
      <a class="navbar-brand" id="showLeftPush" href="#">>Ready<</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
      	<li><a href="#" onclick="AddWMSLayer();">Add WMS Layer</a></li>
	      <li><a href="#" onclick="RemoveLayer();">Remove Layer</a></li>
         <li><a href="#" onclick="showRain();">Susceptible to Rain</a></li>
        <li><a href="#" onclick="removeMarker();">Remove</a></li>
        <?php
          if(!$this->session->userdata('username')) {
              ?>
              <li><a href="#login_modal" data-toggle="modal">Login</a></li>
              <li><a href="#signup_modal" data-toggle="modal">Register</a></li>
          <?php
          }
          else {
              

                echo "<li><a href='http://developer.globelabs.com.ph/dialog/oauth?app_id=opBdatgpa8RfA7czERia6EfaEBrot7ka'>Register your Cellphone number</a></li>";

              
         ?>
              <li><a href="<?php echo base_url()?>index.php/home/performLogout" data-toggle="modal">Logout</a></li>
          <?php
          }
          ?>
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

<div class="modal fade" id="login_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
                <h4 class="modal-title" id="myModalLabel">Login</h4>
            </div>
            <div class="modal-body">
                <form method="POST" action="index.php/home/performLogin" class="form-horizontal">

                    <input class="form-control" type="text" placeholder="Username" name="username"/><br/>
                    <input class="form-control" type="password" placeholder="Password" name="password"/><br/>
                    <input type="submit" class="btn btn-primary"/>

                </form>
            </div>
        </div>
    </div>

</div>

<div class="modal fade" id="signup_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
                <h4 class="modal-title" id="myModalLabel">Register</h4>
            </div>
            <div class="modal-body">

                <form method="POST" action="index.php/home/performRegister" class="form-horizontal">

                    <input class="form-control" type="text" placeholder="Name" name="name"><br/>
                    <input class="form-control" type="text" placeholder="Username" name="username"><br/>
                    <input class="form-control" type="password" placeholder="Password" name="pw"/><br/>
                    <input class="form-control" type="password" placeholder="Re-enter Password" name="pw2"/><br/>
                    <input class="form-control" type="text" id="longitude" name="longitude"/>
                    <input class="form-control" type="text" id="latitude" name="latitude"/>
                    <input type="submit"/>

                </form>

            </div>
        </div>
    </div>

</div>
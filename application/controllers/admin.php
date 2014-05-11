<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -  
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		$this->load->view('includes/adminheader');
		$this->load->view('index');
		$this->load->view('includes/adminfooter');
	}

	public function getFloodMaps(){
		$content = file_get_contents('http://202.90.153.89/api/flood_maps');
		echo $content;
	}

	public function sendSMS(){

		$rad = $_POST['rad'];
		$msg = $_POST['text'];
		$lng = $_POST['lng'];
		$lat = $_POST['lat'];

		$top = $rad + $lat;
		$btm = $lat - $rad;
		$left = $lng - $rad;
		$right = $lng + $rad;

		$this->load->database();
		$code = $this->db->query("SELECT code FROM user WHERE longitude>$left AND longitude<$right AND latitude>$btm AND latitude<$btm")->result();

		foreach ($code as $key) {
			
			$response = $auth->getAccessToken($key);

			$sms = $globe->sms( 4958 );
			$response = $sms->sendMessage($response['access_token'], $response['subscriber_number'], $msg);


		}

		$this->index();

	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
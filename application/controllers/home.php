<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {

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
        $this->load->library('session');
		$this->load->view('includes/header');
		$this->load->view('index');
		$this->load->view('includes/footer');
	}

	public function getFloodMaps(){
		$content = file_get_contents('http://202.90.153.89/api/flood_maps');
		echo $content;
	}

    public function performLogout(){
        $this->load->library('session');
        $this->session->unset_userdata('username');
        redirect('../');
    }

    public function greetings(){

        $code = $_GET['code'];

        $this->load->database();
        $this->db->query("UPDATE user SET code='$code' where username='{$this->session->userdata('username')}'");
        $this->index();

    }

    public function performRegister(){
        $name = $_POST['name'];
        $username = $_POST['username'];
        $password = MD5($_POST['pw']);
        $long = $_POST['longitude'];
        $lat = $_POST['latitude'];
        $this->load->model('user_follower');
        $this->user_follower->createUser($username,$password,$name,$long,$lat);
        redirect('../');
    }

    public function performLogin(){

        $this->load->database();


        $username = $_POST['username'];
        $password = MD5($_POST['password']);
        $this->load->model('user_follower');
        $user = $this->user_follower->getUser($username,$password);
        $this->load->library('session');
        if(!$user){


            redirect('asdasd');
        }
        else{


            $code = $this->db->query("SELECT code from user where username='$username'")->result();
            $data['code'] = $code;

            $data = array(
                'username' => $username,
                'code'  => $code
            );
            $this->session->set_userdata($data);
        
            redirect('../');
        }
    }

    public function getRainForecast(){
        $content = file_get_contents('http://202.90.153.89/api/four_hour_forecast');
        echo $content;
    }
    
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
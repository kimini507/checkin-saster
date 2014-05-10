<?php
/**
 * Created by IntelliJ IDEA.
 * User: Paul Ivann E Granada
 * Date: 5/11/2014
 * Time: 1:57 AM
 */

class User_Follower extends CI_Model {
    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }

    function getCode($user_id){
        $this->load->database();
        $query = $this->db->query("SELECT code from user where user_id= {$user_id}");
        return $query;
    }
} 
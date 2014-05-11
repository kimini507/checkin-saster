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

    function getCode($user_name){
        $this->load->database();
        $query = $this->db->query("SELECT code from user where user_name= {$user_name}");
        return $query;
    }

    function createUser($user_name,$password,$name,$longitude,$latitude){
        $this->load->database();
        $query = $this->db->query("INSERT INTO USER(username,password,name,longitude,latitude) VALUES('{$user_name}','{$password}','{$name}',{$longitude},{$latitude})");
        return $query;
    }

    function getFollower($user_name){
        $this->load->database();
        $query = $this->db->query("SELECT * from follows f inner join user on f.username = {$user_name}");
        return $query;
    }

    function getUser($username,$password){
        $this->load->database();
        $query = $this->db->query("SELECT * from user where username='{$username}' AND password='{$password}'");
        if($query->num_rows() > 0){
            return $query;
        }
        return null;
    }
} 
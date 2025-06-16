<?php

require_once __DIR__ . "/../../interface.php";
require_once __DIR__ . "/../AdminService.class.php";

function _interface($input) {
    if (!isset($input['username']) || !isset($input['password'])) {
        throw new Exception('Invalid Input Value', 400);
    }
    
    $username = trim($input['username']);
    $password = $input['password'];
    
    if (!AdminService::login($username, $password)) {
        throw new Exception('Invalid Username or Password', 401);
    }
    
    $token = AdminService::generateToken($username);
    setcookie('admin_token', $token, time() + 3600);
    
    $data = [
        'username' => $username,
        'token' => $token
    ];

    return $data;
};
?>
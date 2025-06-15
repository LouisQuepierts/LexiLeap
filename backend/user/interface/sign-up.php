<?php

require_once __DIR__ . '/../../interface.php';
require_once __DIR__ . '/../AuthService.class.php';

function _interface($input) {
    $email = $input['email'];
    $username = $input['username'];
    $password = $input['password'];

    if (empty($email) || empty($username) || empty($password)) {
        throw new Exception('Invalid Input Value', 400);
    }

    AuthService::signup($email, $username, $password);
}
?>
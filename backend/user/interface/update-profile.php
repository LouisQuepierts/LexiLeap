<?php

require_once __DIR__ . '/../user_interface.php';

function _interface($input) {
    $email = $input['email'];
    $username = $input['username'];

    if (empty($email) || empty($username)) {
        throw new Exception('Invalid input', 400);
    }

    $userdata = AuthService::id2user($input['user_id']);
    AuthService::updateProfile($input['id'], $username, $email);

    $data = [
        'email'=> $input['email'],
        'username'=> $input['username']
    ];
    return $data;
}
?>
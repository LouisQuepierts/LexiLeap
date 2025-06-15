<?php
require_once __DIR__ . '/../../interface.php';
require_once __DIR__ . '/../AuthService.class.php';

function _interface($input) {
    $email = $input['email'];
    $password = $input['password'];

    if (empty($email) || empty($password)) {
        throw new Exception('Invalid input value', 400);
    }

    AuthService::signin($email, $password);
}
?>
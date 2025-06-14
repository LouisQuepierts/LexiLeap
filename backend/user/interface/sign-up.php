<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap/backend' . '/interface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap/backend' . '/user/AuthService.class.php';

$response = [
    'success' => false,
    'message' => ''
];

try {
    $input = json_input();

    $email = $input['email'];
    $username = $input['username'];
    $password = $input['password'];

    AuthService::signup($email, $username, $password);

    $response['success'] = true;
    $response['message'] = 'Sign up successful';
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
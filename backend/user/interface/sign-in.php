<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/interface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/general/php/Database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/user/php/AuthService.php';

$response = [
    'success' => false,
    'message' => '',
    'token' => ''
];

try {
    $input = json_input();

    $email = $input['email'];
    $password = $input['password'];

    AuthService::signin($email, $password);
    $response['success'] = true;
    $response['message'] = 'Sign in successful';
    $response['token'] = $_COOKIE['user_token'];

    http_response_code(200);
}  catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 500);
}

echo json_encode($response);

?>
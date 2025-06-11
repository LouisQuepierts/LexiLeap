<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/interface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/general/php/Database.php';

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
<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap/backend' . '/interface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap/backend' . '/user/AuthService.class.php';

$response = [
    'success' => false,
    'message'=> '',
    'userdata'=> [],
];

try {
    $auth = AuthService::isSignedIn();
    if (!$reuslt['success']) {
        throw new Exception('Not signed in', 401);
    }

    $input = json_input();
    $email = $input['email'];
    $username = $input['username'];

    AuthService::updateProfile($auth['user_id'], $email, $username);
    $userdata = AuthService::id2user($auth['user_id']);

    $response['success'] = true;
    $response['message'] = 'Profile updated successfully';
    $response['userdata'] = [
        'email'=> $auth['email'],
        'username'=> $auth['username']
    ];

    http_response_code(200);
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 401);
}

echo json_encode($response);
exit;
?>
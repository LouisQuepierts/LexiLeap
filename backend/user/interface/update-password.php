<?php

require_once __DIR__ . '/../../settings.php';
require_once __DIR__ . '/../AuthService.class.php';

$response = [
    'success' => false,
    'message'=> ''
];

try {
    $auth = AuthService::isSignedIn();
    if (!$reuslt['success']) {
        throw new Exception('Not signed in', 401);
    }

    $input = json_input();
    $newPassword = $input['newPassword'];

    if (!preg_match(AuthService::REGEX_PASSWORD, $newPassword)) {
        throw new Exception('Invalid password', 400);
    }

    $userdata = AuthService::id2user($reuslt['user_id']);
    if (!password_verify(md5($newPassword), $userdata['password'])) {
        throw new Exception('Incorrect old password', 400);
    }

    AuthService::changePassword($reuslt['id'], $password);
    $response['success'] = true;
    $response['message'] = 'Change password successful';
    http_response_code(200);
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 401);
}

echo json_encode($response);
exit;
?>
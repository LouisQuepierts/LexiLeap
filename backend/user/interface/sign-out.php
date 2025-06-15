<?php

require_once __DIR__ . '/../../settings.php';
require_once __DIR__ . '/../AuthService.class.php';

$response = [
    'success' => false,
    'message' => ''
];

try { 
    AuthService::setSignedOut();
    $response['success'] = true;
    $response['message'] = 'Sign out successful';
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

return json_encode($response);

?>
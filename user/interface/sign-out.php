<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/interface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/user/php/AuthService.php';

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
<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap/backend' . '/interface.php';

$response = [
    'valid' => false,
    'message' => ''
];

try {
    if (!isset($_COOKIE['admin_token'])) {
        header('localhost:lexileap/admin/login.php');
        exit;
    }
    
    $response['valid'] = true;
    $response['message'] = 'Valid token';
    
    http_response_code(200);
    
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 401);
}

echo json_encode($response);
exit;
?>
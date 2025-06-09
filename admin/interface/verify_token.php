<?php

require_once '../../interface.php';

$response = [
    'valid' => false,
    'message' => ''
];

try {
    session_start();
    
    if (!isset($_COOKIE['admin_token'])) {
        throw new Exception('Did not login', 401);
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
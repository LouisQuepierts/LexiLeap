<?php

require_once __DIR__ . "/../interface.php";

$response = [
    'valid' => false,
    'message' => ''
];

try {
    $auth = AdminService::auth();

    if (!$auth['success']) {
        throw new Exception('Invalid token', 401);
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
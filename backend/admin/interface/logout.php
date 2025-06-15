<?php

require_once __DIR__ . "/../interface.php";

$response = [
    'success' => false,
    'message' => '',
];

try {
    $auth = AdminService::auth();

    if (!$auth['success']) {
        throw new Exception('Did not logined', 401);
    }

    $token = '';
    setcookie('admin_token', $token, time() - 3600);
    $response['success'] = true;
    $response['message'] = 'Logout successful';
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 401);

    error_log("Logout Error: " . $e->getMessage());
}

echo json_encode($response);
exit;
?>
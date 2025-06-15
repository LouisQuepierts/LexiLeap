<?php

require_once __DIR__ . "/../../interface.php";

$admin_users = [
    'admin' => password_hash('123456', PASSWORD_DEFAULT),
    'mod' => password_hash('123456', PASSWORD_DEFAULT)
];

$response = [
    'success' => false,
    'message' => '',
    'token' => '',
    'username' => ''
];

try {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);
    
    if (empty($input)) {
        throw new Exception('Invalid Request', 400);
    }
    
    if (!isset($input['username']) || !isset($input['password'])) {
        throw new Exception('Invalid Input Value', 400);
    }
    
    $username = trim($input['username']);
    $password = $input['password'];
    
    if (!array_key_exists($username, $admin_users)) {
        throw new Exception('Incorrect username or password', 401);
    }
    
    if (!password_verify($password, $admin_users[$username])) {
        throw new Exception('Incorrect username or password', 401);
    }
    
    $token = bin2hex(random_bytes(32));
    
    $response['success'] = true;
    $response['message'] = 'Login successful';
    $response['token'] = $token;
    $response['username'] = $username;

    setcookie('admin_token', $token, time() + 3600 * 24 * 7);    
    error_log("Admin {$username} Login Success");
    
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 500);
    
    error_log("Login Error: " . $e->getMessage());
}

echo json_encode($response);
exit;
?>
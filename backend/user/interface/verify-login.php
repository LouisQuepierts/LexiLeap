<?php
require_once __DIR__ . '/../../settings.php';
require_once __DIR__ . '/../AuthService.class.php';
require_once __DIR__ . '/../UserDataService.class.php';

$response = [
    'message' => '',
    'userdata' => ''
];

try {
    $auth = AuthService::isSignedIn();
    if (!$auth['success']) {
        throw new Exception($auth['message'], 401);
    }
    
    $response['message'] = 'Valid token';
    $uid = $auth['user_id'];

    try {
        $userdata = AuthService::id2user($uid);
        $response['userdata'] = [
            'email' => $userdata['email'],
            'username'=> $userdata['username'],
            'uid' => AuthService::encodeId($uid),
            'avatar' => $userdata['avatar'] ?:  UserDataService::defurl('avatar.png'),
        ];
    } catch (Exception $e) {
        $response['message'] = "Error getting user data: " . $e->getMessage();
        echo json_encode($response);
        exit();
    }

    http_response_code(200);

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 401);
}

echo json_encode($response);
exit;
?>
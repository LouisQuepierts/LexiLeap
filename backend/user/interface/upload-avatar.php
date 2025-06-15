<?php

require_once __DIR__ . '/../../settings.php';
require_once __DIR__ . '/../AuthService.class.php';
require_once __DIR__ . '/../UserDataService.class.php';

$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
$maxSize = 2 * 1024 * 1024;

$response = [
    'success' => false,
    'message' => '',
    'url' => ''
];

try {
    $auth = AuthService::isSignedIn();
    if (!$auth['success']) {
        throw new Exception($auth['message'], 401);
    }

    // check file type
    if (!in_array($_FILES['file']['type'], $allowedTypes)) {
        throw new Exception("Invalid file type " . $_FILES['file']['type'], 400);
    }

    // check file size
    if ($_FILES["fileToUpload"]["size"] > $maxSize) {
        throw new Exception("File is too large", 400);
    }

    $uid = AuthService::encodeId($auth['user_id']);
    $result = UserDataService::upload(
        $uid, 'profile', 
        'avatar.png', 
        $_FILES['file']['tmp_name'],
    );

    AuthService::updateAvatar($auth['user_id'], $result['url']);

    $response['success'] = $result['success'];
    $response['message'] = "Avatar uploaded successfully";
    $response["url"] = $result['url'];
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
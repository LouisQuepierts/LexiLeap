<?php

require_once __DIR__ . '/../user_interface.php';
require_once __DIR__ . '/../UserDataService.class.php';

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxSize = 2 * 1024 * 1024;

function _interface($input) { 
// check file type
    if (!in_array($_FILES['file']['type'], allowedTypes)) {
        throw new Exception("Invalid file type " . $_FILES['file']['type'], 400);
    }

    // check file size
    if ($_FILES["fileToUpload"]["size"] > maxSize) {
        throw new Exception("File is too large", 400);
    }

    $uid = AuthService::encodeId($input['user_id']);
    $result = UserDataService::upload(
        $uid, 'profile', 
        'avatar.png', 
        $_FILES['file']['tmp_name'],
    );

    AuthService::updateAvatar($input['user_id'], $result['url']);
    $data = [
        'url' => $result['url']
    ];
    return $data;
}
?>
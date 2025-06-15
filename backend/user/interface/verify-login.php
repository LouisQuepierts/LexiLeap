<?php

require_once __DIR__ . '/../user_interface.php';
require_once __DIR__ . '/../UserDataService.class.php';

function _interface($input) {
    $uid = $input['user_id'];
    $userdata = AuthService::id2user($input['user_id']);
    return [
        'email' => $userdata['email'],
        'username'=> $userdata['username'],
        'uid' => AuthService::encodeId($uid),
        'avatar' => $userdata['avatar'] ?:  UserDataService::defurl('avatar.png')
    ];
}
?>
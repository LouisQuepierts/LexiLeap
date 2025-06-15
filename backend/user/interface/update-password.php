<?php

require_once __DIR__ . '/../user_interface.php';

function _interface($input) {
    $oldPassword = $input['oldPassword'];
    $newPassword = $input['newPassword'];

    if (!isset( $oldPassword ) || !isset( $newPassword )) {
        throw new Exception('Missing parameters', 400);
    }

    if (!preg_match(AuthService::REGEX_PASSWORD, $newPassword)) {
        throw new Exception('Invalid password', 400);
    }

    $userdata = AuthService::id2user($input['user_id']);
    if (!password_verify($oldPassword, $userdata['password'])) {
        throw new Exception('Incorrect old password', 400);
    }

    AuthService::changePassword($input['id'], $newPassword);
}
?>
<?php

require_once __DIR__ . '/../interface.php';
require_once __DIR__ . '/AuthService.class.php';

function _verify() {
    $auth = AuthService::isSignedIn();

    if (!$auth['success']) {
        throw new Exception('Not signed in', 401);
    }

    return $auth;
}

?>
<?php
require_once __DIR__ . "/../interface.php";
require_once "/AdminService.class.php";

function _verify() {
    $auth = AdminService::auth();

    if (!$auth['success']) {
        throw new Exception('Did not logined', 401);
    }

    return $auth;
}
?>
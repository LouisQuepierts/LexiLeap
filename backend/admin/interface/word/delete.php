<?php
require_once __DIR__ . "/../../admin_interface.php";
require_once __DIR__ . "/../../../general/WordService.class.php";

function _interface($input) {
    $remove = $input['ids'];
    $db = Database::getInstance();

    if (!isset($remove)) {
        throw new Exception('Invalid input', 400);
    }

    if (empty($remove) || !is_array( $remove )) {
        throw new Exception('Invalid input content', 400);
    }

    WordService::delete_arr($remove);
}
?>
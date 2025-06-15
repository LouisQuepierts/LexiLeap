<?php

require_once __DIR__ . '/../../../interface.php';
require_once __DIR__ . '/../../FileStorageService.class.php';

$response = [
    'success' => false,
    'message' => ''
];

try {
    $input = json_input();

    $desciption = $input['description'];
    $words = $input['words'];


}

?>
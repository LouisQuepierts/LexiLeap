<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap/backend' . '/interface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap/backend' . '/general/FileStorageService.class.php';

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
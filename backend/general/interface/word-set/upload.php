<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/interface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/general/php/FileStorageService.php';

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
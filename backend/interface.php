<?php
require_once 'settings.php';

if (_DEV_) {
    header("Access-Control-Allow-Origin: http://localhost:63342");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

function json_input() {
    $inputJSON = file_get_contents('php://input');
    return json_decode($inputJSON, TRUE);
}

?>
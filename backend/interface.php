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

register_shutdown_function(function () {
    $response = [
        "success" => false,
        "message" => 'Unknown error',
        "trace" => []
    ];

    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        // 致命错误
        $response['message'] = "Fatal error: " . $error['message'];
        $response['file'] = $error['file'];
        $response['line'] = $error['line'];
        echo json_encode($response);
        return;
    }

    try {
        $input = [];

        if (function_exists('_verify')) {
            $tmp = _verify();
            if (is_array($tmp)) {
                $input = array_merge($input, $tmp);
            }
        }

        $tmp = json_input();
        if (is_array($tmp)) {
            $input = array_merge($input, $tmp);
        }

        if (function_exists('_interface')) {
            $data = _interface($input);
            $response['success'] = true;
            $response['message'] = 'Request successful';
            $response['data'] = $data;
        } else {
            throw new Exception('Undefined interface function', 500);
        }
    } catch (Exception $e) {
        $response['message'] = $e->getMessage();
        $response['trace'] = $e->getTrace();
        http_response_code($e->getCode() ?: 500);
    }

    echo json_encode($response);
    exit;
});


?>
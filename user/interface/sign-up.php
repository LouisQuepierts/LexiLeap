<?php

require_once '../../interface.php';
require_once '../../general/php/Database.php';

$response = [
    'success' => false,
    'message' => ''
];

try {
    $input = json_input();

    $email = $input['email'];
    $username = $input['username'];
    $password = $input['password'];

    $db = Database::getInstance();
    $query = $db->prepare("--sql
        INSERT INTO user (email, username, password)
        VALUES (:email, :username, :password)
    ");

    $query->bindParam(':email', $email, PDO::PARAM_STR);
    $query->bindParam(':username', $username, PDO::PARAM_STR);
    $query->bindParam(':password', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
    $query->execute();

    $response['success'] = true;
    $response['message'] = 'Sign up successful';
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);

?>
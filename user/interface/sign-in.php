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
    $password = $input['password'];

    if (empty($email) || empty($password)) {
        throw new Exception('Invalid Input Value', 400);
    }

    $db = Database::getInstance();
    $query = $db->prepare("--sql
        SELECT * FROM user
        WHERE email = :email
    ");

    $query->bindParam(':email', $email);
    $query->execute();

    $result = $query->fetch();

    if ($result) {
        if (password_verify($password, PASSWORD_DEFAULT)) {
            $response['success'] = true;
            $response['message'] = 'Sign in successful';
        } else {
            $response['message'] = 'Incorrect password';
        }
    } else {
        $response['message'] = 'User not found';
    }
}  catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);

?>
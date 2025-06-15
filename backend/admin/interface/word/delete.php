<?php
require_once __DIR__ . "/../../interface.php";
require_once __DIR__ . "/../../../general/Database.class.php";

$response = [
    'success' => false,
    'message' => ''
];

try {
    $auth = AdminService::auth();

    if (!$auth['success']) {
        throw new Exception('Did not logined', 401);
    }

    $input = json_input();

    if (!isset($input['remove'])) {
        throw new Exception('Invalid input value', 400);
    }

    $remove = $input['remove'];
    $db = Database::getInstance();

    if (!empty($remove) && is_array($remove)) {
        $placeholders = implode(', ', array_map(function($index) {
            return ":id{$index}";
        }, array_keys($remove)));

        $query = $db->prepare("
            UPDATE word
            SET deleted = 1
            WHERE id IN ({$placeholders})
        ");

        foreach ($remove as $index => $id) {
            $query->bindValue(":id{$index}", $id, PDO::PARAM_INT);
        }

        $query->execute();
        $response['success'] = true;
        $response['message'] = 'Words removed successfully';
    } else {
        $response['message'] = 'Invalid input value';
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 500);
}

echo json_encode($response);
exit;
?>
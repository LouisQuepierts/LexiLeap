<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap/backend' . '/general/Database.php';

class AuthService {
    public static const REGEX_EMAIL = "/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/";
    public static const REGEX_USERNAME = '/^[a-zA-Z0-9_.+-]+$/';
    public static const REGEX_PASSWORD = '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/';

    public static function isSignedIn() : bool {
        $token = $_COOKIE['user_token'];
        if (!isset($token)) {
            return false;
        }

        $db = Database::getInstance();
        $query = $db->prepare("--sql
            SELECT * FROM user_token
            WHERE token = :token
        ");

        $query->bindParam(':token', $token);
        $query->execute();

        $result = $query->fetch();
        if (!$result) {
            return false;
        }

        // check is expired
        if ($result['expired_at'] < time()) {
            $query = $db->prepare("--sql
                DELETE FROM user_token
                WHERE token = :token
            ");
            $query->bindParam(':token', $token);
            $query->execute();
            return false;
        }

        return true;
    }

    public static function fastCheck() {
        return isset($_COOKIE['user_token']);
    }

    public static function signin(string $email, string $password) {
        if (AuthService::isSignedIn()) {
            return;
        }

        if (!preg_match(AuthService::REGEX_EMAIL, $email)) {
            throw new Exception('Invalid email', 400);
        }

        if (!preg_match(AuthService::REGEX_PASSWORD, $password)) {
            throw new Exception('Password must be at least 6 characters', 400);
        }

        $db = Database::getInstance();
        $query = $db->prepare("--sql
            SELECT * FROM user
            WHERE email = :email
        ");

        $query->bindParam(':email', $email);
        $query->execute();

        $userdata = $query->fetch();

        if (!$userdata) {
            throw new Exception('User not found', 404);
        }

        if (!password_verify($password, $userdata['password'])) {
            throw new Exception('Incorrect password', 401);
        }

        $token = bin2hex(random_bytes(32));
        $expire = time() + 3600 * 24 * 7;
        setcookie('user_token', $token, $expire);

        // remove before insert
        $query = $db->prepare("--sql
            DELETE FROM user_token
            WHERE user_id = :user_id
        ");
        $query->bindParam(':user_id', $userdata['id'], PDO::PARAM_INT);
        $query->execute();
    

        // insert token into database
        $query = $db->prepare("--sql
            INSERT INTO user_token (user_id, token, expire)
            VALUES (:user_id, :token, :expire)
        ");
        $query->bindParam(':user_id', $userdata['id'], PDO::PARAM_INT);
        $query->bindParam(':token', $token, PDO::PARAM_STR);
        $query->bindParam(':expire', $expire, PDO::PARAM_STR);
        $query->execute();
    }

    public static function signup($email, $username, $password) {
        // check regex
        if (!preg_match(AuthService::REGEX_EMAIL, $email)) {
            throw new Exception('Invalid email', 400);
        }

        if (!preg_match(AuthService::REGEX_USERNAME, $username)) {
            throw new Exception('Invalid username', 400);
        }

        if (!preg_match(AuthService::REGEX_PASSWORD, $password)) {
            throw new Exception('Invalid password', 400);
        }

        $db = Database::getInstance();
        $query = $db->prepare("--sql
            INSERT INTO user (email, username, password)
            VALUES (:email, :username, :password)
        ");
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->bindParam(':username', $username, PDO::PARAM_STR);
        $query->bindParam(':password', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
        $query->execute();
    }

    public static function signout() {
        if (!isset($_COOKIE['user_token'])) {
            throw new Exception('Not signed in', 401);
        }

        $token = $_COOKIE['user_token'];
        $db = Database::getInstance();
        $query = $db->prepare("--sql
            DELETE FROM user_token
            WHERE token = :token
        ");
        $query->bindParam(':token', $token, PDO::PARAM_STR);
        $query->execute();
        setcookie('user_token', '', time() - 3600);
    }

    public static function setSignedOut() {
        // delete cookie
        setcookie('user_token', '', time() - 3600 * 24 * 7);
    }
}
?>
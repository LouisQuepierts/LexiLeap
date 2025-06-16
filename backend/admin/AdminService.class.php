<?php
class AdminService {
    private static $admin_users;

    public static function isUserExist($username) {
        return array_key_exists($username, self::$admin_users);
    }

    public static function login( $username, $password ) {
        $user = self::$admin_users[$username];
        return password_verify($password, $user);
    }

    public static function generateToken($username) {
        $token = self::base64Encode($username . ':' . time());
        return $token;
    }

    public static function auth() {
        $response = [
            'success' => false,
            'username' => ''
        ];

        if (!isset($_COOKIE['admin_token'])) {
            return $response;
        }

        $auth = self::verifyToken($_COOKIE['admin_token']);
        if (!$auth['success']) {
            return $response;
        }

        $user = $auth['username'];
        if (!self::isUserExist( $user )) {
            return $response;
        }

        $response['success'] = true;
        $response['username'] = $user;
        return $response;
    }

    public static function verifyToken($token) {
        $token = self::base64Decode($token);
        $token = explode(':', $token);
        $username = $token[0];
        $timestamp = $token[1];

        if (time() - $timestamp > 1000 * 60 * 60) {
            return [ 'success' => false ];
        }

        return [
            'success'=> true,
            'username' => $username
        ];
    }

    public static function base64Encode($data) {
        $data = base64_encode($data);
        $data = str_replace('+', '-', $data);
        $data = str_replace('/', '_', $data);
        $data = str_replace('=', '', $data);
        return $data;
    }

    public static function base64Decode($data) {
        $data = str_replace('-', '+', $data);
        $data = str_replace('_', '/', $data);
        
        $mod4 = strlen($data) % 4;
        if ($mod4) {
            $data .= str_repeat('=', 4 - $mod4);
        }
        
        return base64_decode($data);
    }

    public static function init() {
        self::$admin_users = [
            'admin' => password_hash('123456', PASSWORD_DEFAULT),
            'mod' => password_hash('123456', PASSWORD_DEFAULT)
        ];
    }
}

AdminService::init();
?>
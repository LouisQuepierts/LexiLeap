<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap/backend' . '/general/Database.php';

class AuthService {
    public const REGEX_EMAIL = "/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/";
    public const REGEX_USERNAME = '/^[a-zA-Z0-9_.+-]+$/';
    public const REGEX_PASSWORD = '/^[a-zA-Z\w]{6,20}$/';

    public static function isSignedIn()  {
        $token = $_COOKIE['user_token'];
        if (!isset($token)) {
            return [
                'success' => false,
                'message' => 'Unsigned in'
            ];
        }

        $db = Database::getInstance();
        $query = $db->prepare("--sql
            SELECT * FROM user_tokens
            WHERE token = :token
        ");

        $query->bindParam(':token', $token, PDO::PARAM_STR);
        $query->execute();

        $result = $query->fetch();
        if (!$result) {
            return [
                'success'=> false,
                'message' => "Token not found"
            ];
        }

        // check is expired
        $expiredAt = strtotime($result['expired_at']);
        if (time() > $expiredAt) {
            $query = $db->prepare("--sql
                DELETE FROM user_tokens
                WHERE token = :token
            ");
            $query->bindParam(':token', $token);
            $query->execute();
            return [
                'success'=> false,
                'message'=> $result['expired_at']
            ];
        }

        return [
            'success'=> true,
            'message' => 'Signed in',
            'user_id' => $result['user_id']
        ];
    }

    public static function fastCheck() {
        return isset($_COOKIE['user_token']);
    }

    public static function signin(string $email, string $password) {
        if (AuthService::isSignedIn()['success']) {
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

        $query->bindParam(':email', $email, PDO::PARAM_STR);
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
            DELETE FROM user_tokens
            WHERE user_id = :user_id
        ");
        $query->bindParam(':user_id', $userdata['id'], PDO::PARAM_INT);
        $query->execute();
    

        // insert token into database
        $query = $db->prepare("--sql
            INSERT INTO user_tokens (user_id, token, expired_at)
            VALUES (:user_id, :token, :expire)
        ");
        $query->bindParam(':user_id', $userdata['id'], PDO::PARAM_INT);
        $query->bindParam(':token', $token, PDO::PARAM_STR);
        $query->bindParam(':expire', date('Y-m-d H:i:s', $expire), PDO::PARAM_STR);
        $query->execute();
    }

    public static function changePassword($id, $password) {
        $db = Database::getInstance();
        $query = $db->prepare('--sql
        UPDATE users
        SET password = :password
        WHERE id = :id
        ');
        $query->bindParam('id', $id, PDO::PARAM_INT);
        $query->bindParam('password', $password, PDO::PARAM_STR);
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
            DELETE FROM user_tokens
            WHERE token = :token
        ");
        $query->bindParam(':token', $token, PDO::PARAM_STR);
        $query->execute();
        setcookie('user_token', '', time() - 3600);
    }

    public static function setSignedOut() {
        $token = $_COOKIE['user_token'];
        // delete cookie
        setcookie('user_token', '', time() - 3600 * 24 * 7);
        
        // remove from database
        $db = Database::getInstance();
        $query = $db->prepare('--sql
            DELETE FROM user_tokens
            WHERE token = :token
        ');

        $query->bindParam('token', $token, PDO::PARAM_STR);
        $query->execute();
    }

    public static function id2user($id) {
        $db = Database::getInstance();
        $query = $db->prepare('--sql
        SELECT * FROM user
        WHERE id = :id
        ');
        $query->bindParam('id', $id, PDO::PARAM_INT);
        $query->execute();
        $user = $query->fetch();

        return $user;
    }

    public static function updateProfile($id, $email, $name) {
        $db = Database::getInstance();
        $query = $db->prepare('--sql
        UPDATE user
        SET email = :email, name = :name
        WHERE id = :id
        ');
        $query->bindParam('id', $id, PDO::PARAM_INT);
        $query->bindParam('email', $email, PDO::PARAM_STR);
        $query->bindParam('name', $name, PDO::PARAM_STR);
        $query->execute();
    }

    public static function updateAvatar($id, $avatar) {
        $db = Database::getInstance();
        $query = $db->prepare('--sql
        UPDATE user
        SET avatar = :avatar
        WHERE id = :id
        ');
        $query->bindParam('id', $id, PDO::PARAM_INT);
        $query->bindParam('avatar', $avatar, PDO::PARAM_STR);
        $query->execute();
    }

    public static function encodeId(int $id, string $secret = "password"): string {
        $hash = hash_hmac('sha256', (string)$id, $secret);
        return substr($hash, 0, 16);
    }

    function decodeId(string $hex, string $secret = "password") {
        // 确保输入是有效的16进制字符串
        if (!ctype_xdigit($hex) || strlen($hex) !== 16) {
            return false;
        }
        
        // 将16进制转换回二进制
        $data = hex2bin($hex);
        
        // 提取IV和加密数据
        $ivLength = openssl_cipher_iv_length('aes-128-cbc');
        $iv = substr($data, 0, $ivLength);
        $encrypted = substr($data, $ivLength);
        
        // 生成密钥
        $key = substr(hash('sha256', $secret), 0, 16);
        
        // 解密
        $decrypted = openssl_decrypt(
            $encrypted,
            'aes-128-cbc',
            $key,
            OPENSSL_RAW_DATA,
            $iv
        );
        
        // 验证结果是否为有效的整数
        if (ctype_digit(trim($decrypted))) {
            return (int)$decrypted;
        }
        
        return false;
    }
}
?>
<?php

class UserDataService {
    public const USER_DATA_DIR = '/lexileap/backend/userdata/';

    public static function defurl($file) {
        return self::USER_DATA_DIR . 'default/' . $file;
    }

    public static function url($user, $sort, $file) {
        return self::USER_DATA_DIR . $sort . '/' . $user . '/' . $file;
    }

    public static function realurl($user, $sort, $file) {
        $real = realpath(dirname(__FILE__) ."/..");
        return $real . '/userdata/' . $sort . '/' . $user . '/' . $file;
    }

    public static function upload($user, $sort, $name, $file) {
        $url = self::realurl($user, $sort, $name);

        if (!file_exists(dirname($url))) {
            if (!mkdir(dirname($url), 0777, true)) {
                throw  new Exception("Error creating directory: " . dirname($url));
            }
        }

        $success = move_uploaded_file($file, $url);
        return [
            'success'=> $success,
            'url'=> self::url($user, $sort, $name)
        ];
    }

    public static function delete($user, $sort, $file) {
        $fileUrl = self::url($user, $sort, $file);
        if (file_exists($fileUrl)) {
            unlink($fileUrl);
        }
    }

    public static function get($user, $sort, $file) {
        $fileUrl = self::url($user, $sort, $file);
        if (file_exists($fileUrl)) {
            return file_get_contents($fileUrl);
        } else {
            return null;
        }
    }
}
?>
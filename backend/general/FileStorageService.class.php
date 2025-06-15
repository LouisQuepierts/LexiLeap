<?php

require_once __DIR__ . '/../settings.php';

class FileStorageService {
    public static function save($file, $fileName) {
        $filePath = _DATA_ . $fileName;
        $f = fopen($filePath, 'w');
        fwrite($f, $file);
        fclose($f);
    }

    public static function load($fileName) {
        $filePath = _DATA_ . $fileName;
        $f = fopen($filePath, 'r');
        $file = fread($f, filesize($filePath));
        fclose($f);
        return $file;
    }
}
?>
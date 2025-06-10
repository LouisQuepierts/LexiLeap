<?php
    function bind() {
        require_once './Database.php';
        require_once './WordService.php';
        require_once './TagService.php';

        $db = Database::getInstance();
        $word = WordService::getInstance();
        $tag = TagService::getInstance();
        
        $ielts = $tag->find("ielts");
        $adj = $tag->find("adj");

        $words = $word->all();

        for ($i = 0; $i < count($words); $i++) {
            echo $words[$i]["spell"] . "<br>";
            $word_id = $words[$i]["id"];
            $tag->bind($ielts["id"], $word_id);
            $tag->bind($adj["id"], $word_id);
        }
    }
?>
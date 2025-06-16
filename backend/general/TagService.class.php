<?php
require_once 'Database.class.php';

class TagService {
    public static function add($name, $description, $color) : void {
        $query = Database::getInstance()->prepare("--sql
            INSERT INTO tag (name, description, color) 
            VALUES (:name, :description, :color)
        ");
        $query->bindParam(':name', $name, PDO::PARAM_STR);
        $query->bindParam(':description', $description, PDO::PARAM_STR);
        $query->bindParam(':color', $color, PDO::PARAM_STR);
        $query->execute();
    }

    public static function delete($name) : void {
        $query = Database::getInstance()->prepare("--sql
            UPDATE tag 
            SET deleted = 1 
            WHERE name = :name
        ");
        $query->bindParam(':name', $name, PDO::PARAM_STR);
        $query->execute();
    }

    public static function find($name) {
        $query = Database::getInstance()->prepare("--sql
            SELECT id, name, description, color
            FROM tag 
            WHERE name = :name and deleted = 0
        ");
        $query->bindParam(':name', $name, PDO::PARAM_STR);
        $query->execute();
        return $query->fetch();
    }

    public static function bind($tag_id, $word_id) : void {
        $query = Database::getInstance()->prepare("--sql
            INSERT INTO word_tags (tag_id, word_id) 
            VALUES (:tag_id, :word_id)
        ");
        $query->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);
        $query->bindParam(':word_id', $word_id, PDO::PARAM_INT);
        $query->execute();
    }

    public static function word2tags($word_id) {
        $query = Database::getInstance()->prepare("--sql
            SELECT tag.id, tag.name, tag.description, tag.color
            FROM tag
            JOIN word_tags ON tag.id = word_tags.tag_id
            WHERE word_tags.word_id = :word_id
        ");
        $query->bindParam(':word_id', $word_id, PDO::PARAM_INT);
        $query->execute();
        return $query->fetchAll();
    }

    public static function tag2words($tag_id, $offset, $limit) {
        $query = Database::getInstance()->prepare("--sql
            SELECT word.id, word.spell, word.definition_cn, word.definition_en, word.example_sentence
            FROM word
            JOIN word_tags ON word.id = word_tags.word_id
            WHERE word_tags.tag_id = :tag_id
            LIMIT :offset, :limit
        ");
        $query->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);
        $query->bindParam(':offset', $offset, PDO::PARAM_INT);
        $query->bindParam(':limit', $limit, PDO::PARAM_INT);
        $query->execute();
        return $query->fetchAll();
    }
}
?>
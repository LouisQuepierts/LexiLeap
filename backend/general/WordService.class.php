<?php
require_once 'Database.class.php';

class WordService {
    public static function all() {
        $query = sql("--sql
            SELECT id, spell, definition_cn, definition_en, example_sentence
            FROM word 
            WHERE deleted = 0
        ");
        return Database::getInstance()->query($query)->fetchAll();
    }

    public static function count() {
        $query = sql("--sql
            SELECT COUNT(id) AS count
            FROM word 
            WHERE deleted = 0
        ");
        return Database::getInstance()->query($query)->fetchColumn();
    }

    public static function add($word, $definition_cn, $definition_en, $example_sentence) : void {
        $query = Database::getInstance()->prepare("--sql
            INSERT INTO word (spell, definition_cn, definition_en, example_sentence)
            VALUES (:spell, :definition_cn, :definition_en, :example_sentence)
        ");
        $query->bindParam(":spell", $word, PDO::PARAM_STR);
        $query->bindParam(":definition_cn", $definition_cn, PDO::PARAM_STR);
        $query->bindParam(":definition_en", $definition_en, PDO::PARAM_STR);
        $query->bindParam(":example_sentence", $example_sentence, PDO::PARAM_STR);
        $query->execute();
    }

    public static function update($id, $word, $definition_cn, $definition_en, $example_sentence) : void {
        $query = Database::getInstance()->prepare("--sql
            UPDATE word
            SET spell = :spell, definition_cn = :definition_cn, definition_en = :definition_en, example_sentence = :example_sentence
            WHERE id = :id
        ");
        $query->bindParam(':id', $id, PDO::PARAM_INT);
        $query->bindParam(':spell', $word, PDO::PARAM_STR);
        $query->bindParam(':definition_cn', $definition_cn, PDO::PARAM_STR);
        $query->bindParam(':definition_en', $definition_en, PDO::PARAM_STR);
        $query->bindParam(':example_sentence', $example_sentence, PDO::PARAM_STR);
        $query->execute();
    }

    public static function select_id($id) {
        $query = Database::getInstance()->prepare("--sql
            SELECT id, spell, definition_cn, definition_en, example_sentence, deleted
            FROM word 
            WHERE id = :id
        ");
        $query->bindParam(':id', $id, PDO::PARAM_INT);
        $query->execute();
        return $query->fetch();
    }

    public static function delete($word) : void {
        $query = Database::getInstance()->prepare("--sql
            UPDATE word 
            SET deleted = 1
            WHERE spell = :word
        ");
        $query->bindParam(':word', $word, PDO::PARAM_STR);
        $query->execute();
    }

    public static function delete_arr($ids) : void {
        $query = Database::getInstance()->prepare('--sql
            UPDATE word
            SET deleted = 1
            WHERE id IN ('.implode(',', $ids).')
        ');
        $query->execute();
    }

    public static function find($word) {
        $query = Database::getInstance()->prepare("--sql
            SELECT id, spell, definition_cn, definition_en, example_sentence
            FROM word 
            WHERE spell = :word and deleted = 0
        ");
        $query->bindParam(':word', $word, PDO::PARAM_STR);
        $query->execute();
        return $query->fetch();
    }

    public static function fetch($offset, $limit) {
        $query = Database::getInstance()->prepare("--sql
            SELECT id, spell, definition_cn, definition_en, example_sentence
            FROM word 
            WHERE deleted = 0
            LIMIT :offset, :limit
        ");
        $query->bindParam(':offset', $offset, PDO::PARAM_INT);
        $query->bindParam(':limit', $limit, PDO::PARAM_INT);
        $query->execute();
        return $query->fetchAll();
    }

    public static function roll($amount) {
        $query_range = sql("--sql
            SELECT
            min(id) as min_id,
            max(id) as max_id
            FROM word
            WHERE deleted = 0
        ");

        $result = Database::getInstance()->query($query_range);
        $minmax = $result->fetch();
        $min = $minmax['min_id'];
        $max = $minmax['max_id'];

        $ids = [];
        for ($i = 0; $i < $amount * 2; $i++) {
            $ids[$i] = rand($min, $max);
        }
        $ids = array_unique($ids);

        $range = implode(',', $ids);
        $query = sql("--sql
            SELECT id, spell, definition_cn, definition_en, example_sentence
            FROM word 
            WHERE deleted = 0
            AND id IN ($range)
            LIMIT $amount
        ");

        $result = Database::getInstance()->query($query);
        $arr = $result->fetchAll();
        shuffle($arr);
        return $arr;
    }
}
?>
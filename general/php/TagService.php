<?php
    require_once 'Database.php';
    class TagService {
        private static $instance;

        private $query_insert;
        private $query_delete;
        private $query_find;
        private $query_bind;
        private $query_word2tags;
        private $query_tag2words;

        private function __construct() {
            $db = Database::getInstance();

            $this->query_insert = $db->prepare("--sql
                INSERT INTO tag (name, description, color) 
                VALUES (?, ?, ?)
            ");

            $this->query_delete = $db->prepare("--sql
                UPDATE tag 
                SET deleted = 1 
                WHERE name = ?
            ");

            $this->query_find = $db->prepare("--sql
                SELECT id, name, description, color
                FROM tag 
                WHERE name = ? and deleted = 0
            ");

            $this->query_word2tags = $db->prepare("--sql
                SELECT tag.id, tag.name, tag.description, tag.color
                FROM tag
                JOIN word_tags ON tag.id = word_tags.tag_id
                WHERE word_tags.word_id = :word_id
            ");

            $this->query_tag2words = $db->prepare("--sql
                SELECT word.id, word.spell, word.definition_cn, word.definition_en, word.example_sentence
                FROM word
                JOIN word_tags ON word.id = word_tags.word_id
                WHERE word_tags.tag_id = :tag_id
                LIMIT :offset, :limit
            ");

            $this->query_bind = $db->prepare("--sql
                INSERT INTO word_tags (tag_id, word_id) 
                VALUES (:tag_id, :word_id)
            ");
        }

        public function add($name, $description, $color) : void {
            $this->query_insert->execute([$name, $description, $color]);
        }

        public function delete($name) : void {
            $this->query_delete->execute([$name]);
        }

        public function find($name) {
            $this->query_find->execute([$name]);
            return $this->query_find->fetch();
        }

        public function bind($tag_id, $word_id) : void {
            $this->query_bind->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);
            $this->query_bind->bindParam(':word_id', $word_id, PDO::PARAM_INT);
            $this->query_bind->execute();
        }

        public function word2tags($word_id) {
            $this->query_word2tags->bindParam(':word_id', $word_id, PDO::PARAM_INT);
            $this->query_word2tags->execute();
            return $this->query_word2tags->fetchAll();
        }

        public function tag2words($tag_id, $offset, $limit) {
            $this->query_tag2words->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);
            $this->query_tag2words->bindParam(':offset', $offset, PDO::PARAM_INT);
            $this->query_tag2words->bindParam(':limit', $limit, PDO::PARAM_INT);
            $this->query_tag2words->execute();
            return $this->query_tag2words->fetchAll();
        }

        public static function getInstance() : TagService {
            if (!isset(self::$instance)) {
                self::$instance = new TagService();
            }
            return self::$instance;
        }
    }
?>
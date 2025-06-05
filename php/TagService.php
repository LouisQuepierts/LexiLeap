<?php
    require_once 'Database.php';
    class TagService {
        private static $instance;

        private $query_insert;
        private $query_delete;
        private $query_find;

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
                SELECT (name, description, color) 
                FROM tag 
                WHERE name = ? and deleted = 0
            ");

            $this->query_bind = $db->prepare("--sql
                INSERT INTO tag_word (tag_id, word_id) 
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

        public static function getInstance() : TagService {
            if (!isset(self::$instance)) {
                self::$instance = new TagService();
            }
            return self::$instance;
        }
    }
?>
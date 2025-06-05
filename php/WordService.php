<?php
    require_once 'Database.php';

    class WordService {
        private static $instance;

        private $db;

        private $query_insert;
        private $query_select_id;
        private $query_delete;
        private $query_find;
        private $query_fetch;

        private function __construct() {
            $this->db = Database::getInstance();

            $this->query_insert = $this->db->prepare("--sql
                INSERT INTO word (spell, definition_cn, definition_en, example_sentence) 
                VALUES (?, ?, ?, ?)
            ");

            $this->query_select_id = $this->db->prepare("--sql
                SELECT id, spell, definition_cn, definition_en, example_sentence, deleted
                FROM word 
                WHERE id = :id
            ");

            $this->query_delete = $this->db->prepare("--sql
                UPDATE word 
                SET deleted = 1
                WHERE spell = ?
            ");

            $this->query_find = $this->db->prepare("--sql
                SELECT id, spell, definition_cn, definition_en, example_sentence
                FROM word 
                WHERE spell = ? and deleted = 0
            ");


            $this->query_fetch = $this->db->prepare("--sql
                SELECT id, spell, definition_cn, definition_en, example_sentence
                FROM word 
                WHERE deleted = 0
                LIMIT :offset, :limit
            ");
        }

        public function all() {
            $query = sql("--sql
                SELECT id, spell, definition_cn, definition_en, example_sentence
                FROM word 
                WHERE deleted = 0
            ");
            return $this->db->query($query)->fetchAll();
        }

        public function add($word, $definition_cn, $definition_en, $example_sentence) : void {
            $this->query_insert->execute([$word, $definition_cn, $definition_en, $example_sentence]);
        }

        public function select_id($id) {
            $this->query_select_id->bindParam(':id', $id, PDO::PARAM_INT);
            $this->query_select_id->execute();
            return $this->query_select_id->fetch();
        }

        public function delete($word) : void {
            $this->query_delete->execute([$word]);
        }

        public function find($word) {
            $this->query_find->execute([$word]);
            return $this->query_find->fetch();
        }

        public function fetch($offset, $limit) {
            $this->query_fetch->bindParam(':offset', $offset, PDO::PARAM_INT);
            $this->query_fetch->bindParam(':limit', $limit, PDO::PARAM_INT);
            $this->query_fetch->execute();
            return $this->query_fetch->fetchAll();
        }

        public function roll($amount) {
            $query_range = sql("--sql
                SELECT
                min(id) as min_id,
                max(id) as max_id
                FROM word
                WHERE deleted = 0
            ");

            $result = $this->db->query($query_range);
            $minmax = $result->fetch();
            $min = $minmax[0];
            $max = $minmax[1];

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

            $result = $this->db->query($query);
            $arr = $result->fetchAll();
            shuffle($arr);
            return $arr;
        }

        public static function getInstance() : WordService {
            if (!isset(self::$instance)) {
                self::$instance = new WordService();
            }
            return self::$instance;
        }
    }
?>
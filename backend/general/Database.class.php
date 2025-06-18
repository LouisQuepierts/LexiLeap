<?php
    class Database {
        public static $dsn = "mysql:host=localhost;dbname=lexi_leap";
        public static $user = 'root';
        public static $pass = '123456';

        private static $instance;
        private $db;

        public static function getInstance() : Database {
            if (!isset(self::$instance)) {
                self::$instance = new Database();
            }
            return self::$instance;
        }

        private function __construct() {
            try {
                $this->db = new PDO(Database::$dsn, Database::$user, Database::$pass);
            } catch (PDOException $e) {
                echo "Connection failed: " . $e->getMessage();
                exit();
            }
        }

        public function getDatabase() : PDO {
            return $this->db;
        }

        public function prepare($sql) : Query {
            $result = $this->db->prepare(sql($sql));

            if (!$result) {
                echo "SQL statement failed: " . $sql;
                exit();
            }

            return new Query($result);
        }

        public function query($sql) {
            return $this->db->query(sql($sql));
        }
    }

    class Query {
        private $query;

        public function __construct($query) {
            $this->query = $query;
        }

        public function bindParam($name, $value, $type = null) {
            $this->query->bindParam($name, $value, $type);
        }
        
        public function bindValue($name, $value, $type = null) {
            $this->query->bindValue($name, $value, $type);
        }

        public function execute($params = null) {
            if (!$this->query->execute($params)) {
                throw new Exception($this->query->errorInfo()[2]);
            }
        }

        public function fetch() {
            return $this->query->fetch();
        }

        public function fetchAll() {
            return $this->query->fetchAll();
        }
    }

    function sql($sql) : string {
        return str_replace("--sql", "", $sql);
    }
?>
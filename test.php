<!DOCTYPE html>
<html>
    <body> 
        <?php
        require_once 'php/Database.php';
        require_once 'php/WordService.php';

        $db = Database::getInstance();
        $word = WordService::getInstance();
        
        $result = $word->roll(10);
        foreach ($result as $row) {
            echo $row[0] . " " . $row[1] . " " . $row[2] . " " . $row[3] . "<br>";
        }
        ?>
    </body>
</html>
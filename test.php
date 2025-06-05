<!DOCTYPE html>
<html>
    <body> 
        <?php
        require_once 'php/Database.php';
        require_once 'php/WordService.php';
        require_once 'php/TagService.php';

        $db = Database::getInstance();
        $word = WordService::getInstance();
        $tag = TagService::getInstance();
        
        $words = $word->roll(4);
        for ($i = 0; $i < count($words); $i++) { 
            $w = $words[$i];
            $tags = $tag->word2tags($w["id"]);

        
            echo "<div>";
            echo "<h1>" . $w["spell"] . "</h1>";
            echo "<p>" . $w["definition_cn"] . "</p>";
            echo "<p>" . $w["definition_en"] . "</p>";
            echo "<p>" . $w["example_sentence"] . "</p>";

            echo "<ul>";
            for ($j = 0; $j < count($tags); $j++) {
                $t = $tags[$j];
                echo "<li>" . $t["name"] . ": " . $t["description"] . "</li>";
            }
            echo "</ul>";

            echo "</div>";
            echo "<br>";
        }
        ?>
    </body>
</html>
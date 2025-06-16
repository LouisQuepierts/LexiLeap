<?php
require_once __DIR__ . "/../../admin_interface.php";
require_once __DIR__ . "/../../../general/WordService.class.php";

function _interface($input) {
    $id = $input["id"];
    $spell = $input["spell"];
    $definition_cn = $input["definition_cn"];
    $definition_en = $input["definition_en"];
    $example_sentence = $input["example_sentence"];

    if (!isset($input["id"])
        || !isset($input["spell"])
        || !isset($input["definition_cn"])
        || !isset($input["definition_en"])
        || !isset($input["example_sentence"])) {
        throw new Exception('Invalid input', 400);
    }
    
    WordService::update($id, $spell, $definition_cn, $definition_en, $example_sentence);
}

?>
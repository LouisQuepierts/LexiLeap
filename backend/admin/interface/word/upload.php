<?php
require_once __DIR__ . "/../../admin_interface.php";
require_once __DIR__ . "/../../../general/WordService.class.php";

function _interface($input) {
    if (!isset($input['words']) || !is_array($input['words'])) {
        throw new Exception('Invalid input: "words" must be an array', 400);
    }

    $data = [
        'errors' => 0,
        'error_words' => [],
    ];

    foreach ($input['words'] as $wordData) {
        if (!isset($wordData['spell'], $wordData['definition_cn'], $wordData['definition_en'], $wordData['example_sentence'])) {
            $data['errors'] ++;
            array_push($data['error_words'], $wordData);
            continue;
        }

        try {
            WordService::add(
                $wordData['spell'],
                $wordData['definition_cn'],
                $wordData['definition_en'],
                $wordData['example_sentence']
            );
        } catch (Exception $e) {
            $data['errors'] ++;
            array_push($data['error_words'], $wordData);
        }
    }

    return $data;
}
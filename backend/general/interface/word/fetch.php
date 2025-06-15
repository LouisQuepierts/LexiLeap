<?php
require_once __DIR__ . '/../../../interface.php';
require_once __DIR__ . '/../../WordService.class.php';
require_once __DIR__ . '/../../TagService.class.php';

function _interface($input) {
    $offset = isset($input['offset']) ? intval($input['offset']) : 0;
    $limit = isset($input['limit']) ? intval($input['limit']) : 20;

    $wordService = WordService::getInstance();
    $tagService = TagService::getInstance();

    $result = $wordService->fetch($offset, $limit);

    $length = count($result);
    $data = [];
    $data['length'] = $length;

    for ($i = 0; $i < $length; $i++) { 
        $w = $result[$i];

        $tagResult = $tagService->word2tags($w['id']);
        $tags = [];

        for ($j = 0; $j < count($tagResult); $j++) { 
            $tags[$j] = [
                'id' => $tagResult[$j]['id'],
                'name' => $tagResult[$j]['name'],
                'description' => $tagResult[$j]['description'],
                'color' => $tagResult[$j]['color']
            ];
        }

        $data['words'][$i] = [
            'id' => (int) $w['id'],
            'spell' => $w['spell'],
            'definition_cn' => $w['definition_cn'],
            'definition_en' => $w['definition_en'],
            'example_sentence' => $w['example_sentence'],
            'tags' => $tags
        ];
    }
    
    return $data;
}
?>
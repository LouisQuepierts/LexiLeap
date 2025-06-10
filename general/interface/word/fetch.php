<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/interface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/general/php/WordService.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/LexiLeap' . '/general/php/TagService.php';

$response  = [
    'success' => false,
    'message' => '',
    'data' => [
        'length' => 0,
        'words' => []
    ]
];

try {
    $input = json_input();
    $offset = isset($input['offset']) ? intval($input['offset']) : 0;
    $limit = isset($input['limit']) ? intval($input['limit']) : 20;

    $wordService = WordService::getInstance();
    $tagService = TagService::getInstance();

    $result = $wordService->fetch($offset, $limit);
    $response['success'] = true;
    $response['message'] = 'Fetch successful';

    $length = count($result);
    $response['data']['length'] = $length;

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

        $response['data']['words'][$i] = [
            'id' => $w['id'],
            'spell' => $w['spell'],
            'definition_cn' => $w['definition_cn'],
            'definition_en' => $w['definition_en'],
            'example_sentence' => $w['example_sentence'],
            'tags' => $tags
        ];
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
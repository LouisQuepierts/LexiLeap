<?php
require_once __DIR__ . '/../../admin_interface.php';
require_once __DIR__ . '/../../../general/WordService.class.php';

function _interface($input) {
    $offset = isset($input['offset']) ? intval($input['offset']) : 0;
    $limit = isset($input['limit']) ? intval($input['limit']) : 20;

    // 调用 WordService 的 fetch 方法获取单词列表
    $words = WordService::fetch($offset, $limit);

    // 规整化数据
    for ($i = 0; $i < count($words); $i++) {
        $word = $words[$i];
        $words[$i] = [
            'id' => (int) $word['id'],
            'spell' => $word['spell'],
            'definition_cn' => $word['definition_cn'],
            'definition_en' => $word['definition_en'],
            'example_sentence' => $word['example_sentence']
        ];
    }

    // 构造返回数据
    $data = [
        'length' => count($words),
        'words' => $words
    ];

    return $data;
}
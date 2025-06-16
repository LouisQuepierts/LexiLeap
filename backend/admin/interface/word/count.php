<?php
require_once __DIR__ . '/../../admin_interface.php';
require_once __DIR__ . '/../../../general/WordService.class.php';

function _interface($input) {
    // 调用 WordService 的 count 方法获取单词总数
    $totalWords = WordService::count();

    // 返回结果
    return [
        'count' => $totalWords
    ];
}
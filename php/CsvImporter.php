<?php
function import_csv($filePath){
    $file = fopen($filePath, 'r');
    $data = [];
    while (($row = fgetcsv($file)) !== false) {
        $data[] = $row;
    }
    fclose($file);
    return $data;
}
?>
<?php
header('Content-Type: application/json; charset=utf-8');
$dataFile = "./data/dictionary.json";

// Read existing JSON file
$jsonFile = file_get_contents($dataFile);
$jsonData = json_decode($jsonFile, true);

// Get data from POST request
$postData = json_decode(file_get_contents('php://input'), true);

// Append new entry to the JSON data
foreach ($postData as $key => $value) {
    $jsonData[$key] = $value;
}

// Encode data back to JSON
$updatedJsonData = json_encode($jsonData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

// Write the updated data back to the file
file_put_contents($dataFile, $updatedJsonData);

echo ' Updated successfully.';
?>
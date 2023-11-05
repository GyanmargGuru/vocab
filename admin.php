<?php
$dataFile = "./data/dictionary.json";

if($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) 
&& $_GET['action'] === 'read-data') {
    // Handle reading data
    $data = file_get_contents($dataFile);
    echo json_encode(['data' => $data]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) 
&& $_POST['action'] === 'update-data') {
    // Handle updating data
    $newData = $_POST['data'];
    file_put_contents($dataFile, $newData);
    echo json_encode(['message' => 'Data updated successfully']);
} else {
    // Handle other cases
    echo json_encode(['error' => 'Invalid request']);
}
?>
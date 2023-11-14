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
    // Read existing data from the file
    $existingData = file_get_contents($dataFile);
    $existingDataArray = json_decode($existingData, true);

    // Get new data from the POST request
    $newData = json_decode($_POST['data'], true);

    // Append the new data to the existing data array
    foreach ($newData as $key => $value) {
        $existingDataArray[$key] = $value;
    }

    // Convert the merged data array back to JSON
    $jsonData = json_encode($existingDataArray, JSON_PRETTY_PRINT);

    // Write the updated data back to the file
    file_put_contents($dataFile, $jsonData);
    echo json_encode(['message' => 'Data updated successfully']);
} else {
    // Handle other cases
    echo json_encode(['error' => 'Invalid request']);
}
?>
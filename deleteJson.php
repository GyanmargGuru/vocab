<?php
header('Content-Type: application/json; charset=utf-8');
$dataFile = "./data/dictionary.json";

// Check if the file exists
if (file_exists($dataFile)) {
    // Read existing JSON file
    $jsonFile = file_get_contents($dataFile);
    $jsonData = json_decode($jsonFile, true);

    // Get the key to be deleted (passed from JavaScript)
    $keyToDelete = $_POST['keyToDelete'];
    echo "Need to delete: " . $keyToDelete . " \n";

    // Check if the key exists in the JSON data
    if (isset($jsonData[$keyToDelete])) {
        echo "Match found. \n";
        // Print_r(json_encode($jsonData[$keyToDelete], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        // echo "\n";

        // Delete the key
        unset($jsonData[$keyToDelete]);

        // Encode the updated data back to JSON
        $updatedJsonData = json_encode($jsonData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        // Save the updated JSON back to the file
        file_put_contents($dataFile, $updatedJsonData);
        echo "Object " . $keyToDelete . " deleted successfully.";
    } else {
        echo "Object " . $keyToDelete . " not found.";
    }
}
?>

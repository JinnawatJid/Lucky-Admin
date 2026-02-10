<?php
// admin/price_estimation/upload_file.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if file is uploaded
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No file uploaded"]);
    exit();
}

$file = $_FILES['file'];

// Validate file error
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "File upload error code: " . $file['error']]);
    exit();
}

// Validate file size (max 10MB)
if ($file['size'] > 10 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "File too large (max 10MB)"]);
    exit();
}

// Allowed extensions
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'ai', 'eps', 'psd', 'svg', 'zip', 'rar'];
$file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($file_ext, $allowed_extensions)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid file type"]);
    exit();
}

// Generate unique filename
// Use original name but prepend timestamp to avoid collisions
$filename = time() . '_' . preg_replace("/[^a-zA-Z0-9\._-]/", "", basename($file['name']));

// Upload directory (relative to this script)
// Assuming structure: admin/price_estimation/upload_file.php
// Saving to: uploads/price_estimation/ (need to go up 2 levels then into uploads)
$upload_dir = '../../uploads/price_estimation/';

// Create directory if not exists
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

$target_path = $upload_dir . $filename;

if (move_uploaded_file($file['tmp_name'], $target_path)) {
    // Return relative path for frontend usage
    // e.g., 'uploads/price_estimation/1234567890_file.pdf'
    $relative_path = 'uploads/price_estimation/' . $filename;

    echo json_encode([
        "status" => "success",
        "message" => "File uploaded successfully",
        "filePath" => $relative_path,
        "fileName" => $file['name']
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
}
?>

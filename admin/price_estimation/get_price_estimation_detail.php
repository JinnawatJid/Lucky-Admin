<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require '../../condb.php';
$conn->select_db('finfinph_lcukycompany');
$conn->set_charset("utf8mb4");

if (empty($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID is required"]);
    exit();
}

$id = $_GET['id'];

// Select all columns from price_estimations and relevant columns from customers_admin
$sql = "SELECT pe.*,
               c.company_name, c.contact_name, c.phone_numbers, c.emails, c.line_id as customer_line_id, c.customer_type
        FROM price_estimations pe
        LEFT JOIN customers_admin c ON pe.customer_id = c.id
        WHERE pe.id = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    exit();
}

$stmt->bind_param("s", $id);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

if ($data) {
    // Decode JSON fields from price_estimations
    $json_fields = ['selected_colors', 'front_details', 'back_details', 'attached_files'];
    foreach ($json_fields as $field) {
        if (!empty($data[$field])) {
            $data[$field] = json_decode($data[$field]);
        } else {
            $data[$field] = [];
        }
    }

    // Decode JSON fields from customers_admin
    $customer_json_fields = ['phone_numbers', 'emails'];
    foreach ($customer_json_fields as $field) {
        if (!empty($data[$field])) {
            $data[$field] = json_decode($data[$field]);
        } else {
            $data[$field] = [];
        }
    }

    // Numeric conversion
    $data['quantity'] = (int)$data['quantity'];
    $data['budget'] = (float)$data['budget'];
    $data['width'] = (float)$data['width'];
    $data['length'] = (float)$data['length'];
    $data['height'] = (float)$data['height'];
    $data['thickness'] = (float)$data['thickness'];

    echo json_encode($data);
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Price estimation not found"]);
}

$conn->close();
?>

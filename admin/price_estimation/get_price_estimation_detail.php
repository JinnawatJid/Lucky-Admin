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

$id = $_GET['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID is required"]);
    exit();
}

$sql = "SELECT pe.*,
               c.company_name, c.contact_name, c.phone_numbers, c.line_id AS customer_line_id, c.emails, c.customer_type
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

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // --- Process Customer Data ---
    $customerName = !empty($row['company_name']) ? $row['company_name'] :
                    (!empty($row['contact_name']) ? $row['contact_name'] : 'N/A');

    // Decode Customer JSON fields
    $phoneNumbers = !empty($row['phone_numbers']) ? json_decode($row['phone_numbers'], true) : [];
    $emails = !empty($row['emails']) ? json_decode($row['emails'], true) : [];

    // Get first phone/email for display
    $mainPhone = !empty($phoneNumbers) ? (is_array($phoneNumbers) ? $phoneNumbers[0] : $phoneNumbers) : '-';
    $mainEmail = !empty($emails) ? (is_array($emails) ? $emails[0] : $emails) : '-';

    // --- Process Price Estimation JSON fields ---
    $selectedColors = !empty($row['selected_colors']) ? json_decode($row['selected_colors'], true) : [];
    $frontDetails = !empty($row['front_details']) ? json_decode($row['front_details'], true) : [];
    $backDetails = !empty($row['back_details']) ? json_decode($row['back_details'], true) : [];
    $attachedFiles = !empty($row['attached_files']) ? json_decode($row['attached_files'], true) : [];

    // Construct Response Object matching Frontend Interface
    $response = [
        'id' => $row['id'],
        'status' => $row['status'],

        // Customer Info
        'customerName' => $customerName,
        'customerPhone' => $mainPhone,
        'customerLineId' => $row['customer_line_id'], // Alias from query
        'customerEmail' => $mainEmail,
        'customerTags' => $row['customer_type'], // Mapping type to tags

        // Estimation Info
        'estimateDate' => $row['estimate_date'],
        'salesOwner' => 'Sales Owner', // Note: sales_owner_id is stored, might need another join or simple display
        'salesOwnerId' => $row['sales_owner_id'],
        'jobName' => $row['job_name'],
        'eventDate' => $row['event_date'],
        'productCategory' => $row['product_category'],
        'productType' => $row['product_type'],
        'hasDesign' => $row['has_design'],
        'material' => $row['material'],
        'quantity' => (int)$row['quantity'],
        'budget' => (float)$row['budget'],

        // Details
        'medalSize' => $row['medal_size'],
        'medalThickness' => $row['medal_thickness'],
        'selectedColors' => $selectedColors,
        'frontDetails' => $frontDetails,
        'backDetails' => $backDetails,
        'lanyardSize' => $row['lanyard_size'],
        'lanyardPatterns' => $row['lanyard_patterns'],

        'awardDesignDetails' => $row['award_design_details'],
        'plaqueOption' => $row['plaque_option'],
        'plaqueText' => $row['plaque_text'],

        'genericDesignDetails' => $row['generic_design_details'],

        'notes' => $row['estimate_note'],
        'attachedFiles' => $attachedFiles
    ];

    echo json_encode($response);

} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Price estimation not found"]);
}

$stmt->close();
$conn->close();
?>

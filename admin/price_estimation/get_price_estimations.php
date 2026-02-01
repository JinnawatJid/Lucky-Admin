<?php
// 1. Set Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// 2. Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Connect to Database
require '../../condb.php';
$conn->select_db('finfinph_lcukycompany');
$conn->set_charset("utf8mb4");

try {
    // 4. Build SQL Query
    // We join price_estimations with customers_admin to get the customer name (company_name or contact_name)
    // We select specific fields to keep the payload efficient
    $sql = "SELECT
                p.id,
                p.estimate_date,
                p.job_name,
                p.product_type,
                p.quantity,
                p.budget,
                p.status,
                p.sales_owner_id,
                c.company_name,
                c.contact_name,
                c.line_id
            FROM price_estimations p
            LEFT JOIN customers_admin c ON p.customer_id = c.id
            WHERE 1=1";

    // 5. Handle Filtering parameters
    $params = [];
    $types = "";

    // Search term (searches job_name, product_type, or customer name)
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = "%" . $_GET['search'] . "%";
        $sql .= " AND (p.job_name LIKE ? OR p.product_type LIKE ? OR c.company_name LIKE ? OR c.contact_name LIKE ? OR c.line_id LIKE ?)";
        // Add params 5 times for the 5 LIKE clauses
        array_push($params, $search, $search, $search, $search, $search);
        $types .= "sssss";
    }

    // Filter by Status
    if (isset($_GET['status']) && !empty($_GET['status']) && $_GET['status'] !== 'all') {
        $sql .= " AND p.status = ?";
        array_push($params, $_GET['status']);
        $types .= "s";
    }

    // Filter by Product Type
    if (isset($_GET['productType']) && !empty($_GET['productType']) && $_GET['productType'] !== 'all') {
        $sql .= " AND p.product_type = ?";
        array_push($params, $_GET['productType']);
        $types .= "s";
    }

    // Filter by Date Range (estimate_date)
    if (isset($_GET['startDate']) && !empty($_GET['startDate'])) {
        $sql .= " AND p.estimate_date >= ?";
        array_push($params, $_GET['startDate']);
        $types .= "s";
    }
    if (isset($_GET['endDate']) && !empty($_GET['endDate'])) {
        $sql .= " AND p.estimate_date <= ?";
        array_push($params, $_GET['endDate']);
        $types .= "s";
    }

    // 6. Sorting
    $sql .= " ORDER BY p.created_at DESC";

    // 7. Prepare and Execute
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $estimations = [];
    while ($row = $result->fetch_assoc()) {
        // Format numeric types
        $row['quantity'] = (int)$row['quantity'];
        $row['budget'] = (float)$row['budget'];

        // Use company_name if available, otherwise contact_name, otherwise "Unknown"
        // Also map to 'lineName' as used in the frontend mock data originally,
        // but ideally we should update frontend to use more descriptive keys.
        // For now, let's provide both standard keys and mapped keys for compatibility.

        $customerName = $row['company_name'] ?: ($row['contact_name'] ?: 'Unknown Customer');

        $estimations[] = [
            'id' => $row['id'],
            'date' => $row['estimate_date'],
            'jobName' => $row['job_name'],
            'lineName' => $row['line_id'] ?: $customerName, // Fallback for the frontend's expected "lineName"
            'customerName' => $customerName,
            'productType' => $row['product_type'],
            'quantity' => $row['quantity'],
            'price' => $row['budget'],
            'status' => $row['status'],
            'salesOwner' => $row['sales_owner_id']
        ];
    }

    echo json_encode($estimations);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>

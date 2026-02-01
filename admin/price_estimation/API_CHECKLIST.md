# Price Estimation API Checklist

The following API endpoints and frontend integrations are required to complete the Sales / Price Estimation feature.

## 1. List View (`get_price_estimations.php`)
- [ ] **Backend:** Create endpoint to fetch a paginated list of price estimations.
    - Support filtering (e.g., by status, customer, date).
    - Support sorting.
- [ ] **Frontend:** Update `src/pages/sales/PriceEstimation.tsx` (or equivalent list page) to fetch data from this endpoint instead of mock data.

## 2. Detail View (`get_price_estimation_detail.php`)
- [ ] **Backend:** Create endpoint to fetch a single price estimation by ID.
    - Should include all fields stored in `price_estimations`.
    - Should probably join with `customers` table to get customer details if needed.
- [ ] **Frontend:** Update `src/pages/sales/AddPriceEstimation.tsx` to support "Edit Mode".
    - Fetch data when an ID is provided in the URL.
    - Populate the form fields.

## 3. File Upload (`upload_file.php`)
- [ ] **Backend:** Create endpoint to handle file uploads.
    - Validate file types and sizes.
    - Store files in a secure directory.
    - Return the file path/URL.
- [ ] **Frontend:** Update the file upload component in `src/pages/sales/AddPriceEstimation.tsx` to use this endpoint.
    - Currently, it might be mocking the upload or not persisting it.

## 4. Delete (`delete_price_estimation.php`)
- [ ] **Backend:** Create endpoint to soft-delete (update status to 'deleted') or hard-delete a price estimation.
- [ ] **Frontend:** Add delete functionality to the List View and potentially the Detail View.

## 5. Deployment
- [ ] Run `db_schema.sql` (Already done for the main table, check if updates are needed).
- [ ] Upload new PHP files to `admin/price_estimation/`.

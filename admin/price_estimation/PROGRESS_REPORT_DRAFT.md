# Progress Report: Price Estimation Module

## Status Overview
**Current State:** Phase 1 Complete (CRUD & Database Migration)
**Pending:** Phase 2 (File Upload System)

## Completed Tasks
1.  **Supabase Removal:**
    - Successfully migrated `PriceEstimation` pages (List, Detail, Add/Edit) from Supabase to the new PHP API.
    - Updated `salesApi.ts` to use `axios` and target the `admin/` endpoints.

2.  **API Implementation (`admin/price_estimation/`):**
    - `get_price_estimations.php`: Implemented list view with customer data joins.
    - `get_price_estimation_detail.php`: Implemented detailed view with JSON field decoding.
    - `save_price_estimation.php`: Implemented both **Create** and **Update** logic, handling complex nested data (JSON columns for details).
    - `delete_price_estimation.php`: Implemented **Soft Delete** (updates status to 'ยกเลิก').

3.  **Frontend Integration:**
    - **List Page:** Displays real data from the database. Filtering and Sorting working.
    - **Detail Page:** Displays all estimation details, including decoded JSON fields.
    - **Add/Edit Page:**
        - "Edit Mode" fully functional (pre-fills data from API).
        - Customer selection integration works with existing `customers_admin` table.
        - Form submission correctly sends data to the PHP backend.

## Pending Tasks
- **File Upload:**
    - Currently, the frontend only captures file objects.
    - No backend endpoint exists to receive and store the physical files.
    - Database stores file *names* but not paths.

---

# Discussion Points: File Upload Strategy

**Context:** We need to implement the file upload feature for Price Estimations (e.g., artwork, reference PDFs). Before implementation, I need guidance on the following architectural decisions:

1.  **Storage Location:**
    - *Option A (Simple):* Store files in a local directory on the server (e.g., `public_html/api-lucky/uploads/price_estimation/`).
    - *Option B (Cloud):* Use an external object storage service like AWS S3 or Google Cloud Storage (better for scalability but requires setup).
    - *Recommendation:* If we have no cloud infrastructure yet, Option A is fastest.

2.  **Security Measures:**
    - How strict should we be with file validation?
    - *Proposed:* Allow only specific extensions (`.jpg`, `.png`, `.pdf`, `.ai`, `.psd`, `.eps`).
    - *Proposed:* Rename all files upon upload (e.g., `timestamp_uuid.ext`) to prevent overwriting and malicious naming execution.

3.  **File Size Limits:**
    - Do we have a maximum file size policy? (e.g., 5MB, 10MB per file).
    - This affects PHP `php.ini` settings (`upload_max_filesize`, `post_max_size`).

4.  **Directory Structure:**
    - Should we organize uploads by Date (e.g., `uploads/2024/01/`) or by Customer ID?
    - *Recommendation:* Date-based folders prevent a single folder from becoming too large/slow.

Please advise on the preferred approach so I can proceed with the implementation.

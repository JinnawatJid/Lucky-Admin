# Manual Testing Instructions: Customer Activity

This document outlines how to manually verify the "Get Customer Activity" feature.

## Prerequisites
- Ensure the development server is running (e.g., `npm run dev`).
- Ensure you have access to the application in your browser (typically `http://localhost:8080` or similar).

## Test Scenario: Verify Customer Activities for Specific ID

We will verify that activities are correctly loaded from the API for customer ID `c6af75f091dc5011a1752baa1608b66b4934`.

### Step 1: Navigate to the Customer Profile

1.  Open your browser.
2.  Enter the following URL directly (adjust the port if necessary):

    ```
    http://localhost:8080/sales/customers/c6af75f091dc5011a1752baa1608b66b4934
    ```

    *Alternatively, if you are on the "Customer Management" list page, look for the customer with this ID and click "View" or the row itself.*

### Step 2: Access the Activity Timeline

1.  Once the Customer Profile page loads, look for the tabs navigation bar in the middle of the screen.
2.  Click on the tab labeled **"ไทม์ไลน์กิจกรรม"** (Activity Timeline).

### Step 3: Verify Data Loading

1.  **Observation**: You should see a vertical list of activities.
2.  **Expected Data**: Based on the current API data, you should see at least two activities:
    *   **Title**: "Test from Jules" (or similar recent entry)
    *   **Title**: "Test"
    *   **Dates**: Check that dates are formatted correctly (e.g., in Thai locale).
    *   **Status**: Check for badges like "รอดำเนินการ" (Pending) or "เสร็จสิ้น" (Completed).

### Step 4: Verify Activity Details

1.  Click on any of the activity items in the list.
2.  **Observation**: A dialog (popup) should open.
3.  **Verification**:
    *   The dialog title should match the activity title.
    *   Details such as "Type" (e.g., อีเมล), "Description", "Priority", and "Responsible Person" should be visible.
    *   There should be buttons to "Edit" (แก้ไข) or "Delete" (ลบ).

## Troubleshooting

-   **No Data?** If the list is empty ("ยังไม่มีกิจกรรมใดๆ"), check the browser console (F12 > Console) for any network errors regarding `get_customer_activities.php`.
-   **Loading Spinner Stuck?** Ensure your internet connection is active, as the API `finfinphone.com` is an external endpoint.

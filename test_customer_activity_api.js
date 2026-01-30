// test_customer_activity_api.js

async function testApi() {
  const url = 'https://finfinphone.com/api-lucky/admin/save_customer_activity.php';

  const payload = {
    "customer_id": "c6af75f091dc5011a1752baa1608b66b4934",
    "activity_type": "อีเมล",
    "title": "Test from Jules",
    "description": "Test connectivity from verification script",
    "start_datetime": new Date().toISOString(),
    "end_datetime": null,
    "reminder_type": "30 นาทีก่อน",
    "contact_person": "James",
    "responsible_person": "James",
    "status": "รอดำเนินการ",
    "priority": "ปานกลาง"
  };

  console.log('Testing API endpoint:', url);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    console.log('Response Status:', response.status);
    console.log('Content-Type:', contentType);

    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      console.log('Response Body:', data);
    } else {
      const text = await response.text();
      console.log('Response Text:', text);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();

const http = require("http");

// Test configuration
const BASE_URL = "localhost";
const PORT = 5000;
const ENDPOINTS = [
  "/",
  "/api/health",
  "/api/conversations",
  "/api/messages/919937320320", // Test with Ravi Kumar's wa_id
];

// Function to test an endpoint
const testEndpoint = (endpoint) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: endpoint,
      method: "GET",
      timeout: 5000,
    };

    console.log(`    Making request to: ${BASE_URL}:${PORT}${endpoint}`);

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            endpoint,
            status: res.statusCode,
            data: jsonData,
            success: res.statusCode >= 200 && res.statusCode < 300,
          });
        } catch (error) {
          resolve({
            endpoint,
            status: res.statusCode,
            data: data,
            success: res.statusCode >= 200 && res.statusCode < 300,
          });
        }
      });
    });

    req.on("error", (error) => {
      console.log(`    Request error: ${error.message}`);
      reject({
        endpoint,
        error: error.message,
        success: false,
      });
    });

    req.setTimeout(5000, () => {
      console.log(`    Request timeout for ${endpoint}`);
      req.destroy();
      reject({
        endpoint,
        error: "Request timeout",
        success: false,
      });
    });

    req.end();
  });
};

// Test all endpoints
const runTests = async () => {
  console.log(" Testing WhatsApp Web Clone Backend Endpoints...\n");

  let passedTests = 0;
  let totalTests = ENDPOINTS.length;

  for (let i = 0; i < ENDPOINTS.length; i++) {
    const endpoint = ENDPOINTS[i];
    try {
      console.log(` Testing ${i + 1}/${totalTests}: ${endpoint}`);
      const result = await testEndpoint(endpoint);

      if (result.success) {
        console.log(` PASS: ${endpoint} (Status: ${result.status})`);
        if (endpoint === "/api/conversations") {
          console.log(`    Found ${result.data.length} conversations`);
        } else if (endpoint.includes("/api/messages/")) {
          console.log(`    Found ${result.data.length} messages`);
        }
        passedTests++;
      } else {
        console.log(` FAIL: ${endpoint} (Status: ${result.status})`);
        console.log(`   Error: ${JSON.stringify(result.data)}`);
      }
    } catch (error) {
      console.log(` ERROR: ${endpoint}`);
      console.log(`   Error: ${error.error || error.message}`);
    }

    // Add small delay between tests
    if (i < ENDPOINTS.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log("");
  }

  // Summary
  console.log(" Test Results Summary:");
  console.log(`    Passed: ${passedTests}/${totalTests}`);
  console.log(`    Failed: ${totalTests - passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log("\n All tests passed! Backend is ready for Phase 2!");
  } else {
    console.log(
      "\n Some tests failed. Please check the backend before proceeding."
    );
  }
};

// Run the tests
runTests().catch(console.error);

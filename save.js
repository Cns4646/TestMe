const axios = require("axios");

// ✅ Random phone number
function randomPhone() {
  return "096" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

// ✅ Random token (Base64)
function randomToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return Buffer.from(token).toString("base64");
}

// ✅ Save random user
async function saveRandomUser() {
  const data = {
    phone: randomPhone(),
    token: randomToken()
  };

  try {
    const res = await axios.post("https://ironcoder.site/ironmyid/save.php", data, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Saved:", data.phone, data.token);
  } catch (err) {
    console.error("❌ Failed to save:", err.message);
  }
}

// 🔁 Loop forever (every 2s)
async function loopSave() {
  while (true) {
    await saveRandomUser();
    await new Promise(r => setTimeout(r, 2000)); // 2 seconds
  }
}

loopSave();

const axios = require("axios");
const FormData = require("form-data");

function randomPhone() {
  return "096" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

async function loopFormPosts() {
  while (true) {
    const form = new FormData();
    const phone = randomPhone();
    form.append("phone", phone);

    try {
      const res = await axios.post("https://iron-coder.site/ironmyid/online_users.php", form, {
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

    try {
      const versionRes = await axios.get("https://iron-coder.site/ironmyid/version.php");
      console.log("🔎 version.php:", versionRes.status, versionRes.data?.version || "");
    } catch (err) {
      console.error("❌ version.php Error:", err.message);
    }

    try {
      const adsRes = await axios.get("https://iron-coder.site/ironmyid/myads.php");
      console.log("📢 myads.php:", adsRes.status, Array.isArray(adsRes.data) ? `Got ${adsRes.data.length} ads` : adsRes.data);
    } catch (err) {
      console.error("❌ myads.php Error:", err.message);
    }

    await new Promise(r => setTimeout(r, 200));
  }
}

loopFormPosts();

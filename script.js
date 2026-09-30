```js
(function () {
  const cfg = window.LODGE || {};
  const $ = (id) => document.getElementById(id);

  const serverIp = cfg.serverIp || "lodgesmp.net";
  const discord = cfg.discordUrl || "#";
  const modrinth = cfg.modrinthUrl || "#";

  $("serverIp").textContent = serverIp;
  $("headerDiscord").href = discord;
  $("heroDiscord").href = discord;
  $("joinDiscord2").href = discord;
  $("footerDiscord").href = discord;
  $("footerModrinth").href = modrinth;
  $("year").textContent = new Date().getFullYear();

  document.querySelectorAll("code").forEach((el) => {
    if (el.textContent === "1.21.1 / NeoForge") {
      el.textContent = `${cfg.minecraftVersion || "1.21.1"} / ${cfg.loader || "NeoForge"}`;
    }
  });

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__lodgeToast);
    window.__lodgeToast = setTimeout(
      () => toast.classList.remove("show"),
      1800
    );
  }

  async function copyIp() {
    if (!serverIp) {
      showToast("Server IP is not configured");
      return;
    }

    try {
      await navigator.clipboard.writeText(serverIp);
      showToast("Server IP copied!");
    } catch (_) {
      showToast(serverIp);
    }
  }

  ["copyIp", "copyIp2", "copyIp3"].forEach((id) =>
    $(id)?.addEventListener("click", copyIp)
  );

  async function loadStatus() {
    const host = cfg.statusHost || serverIp;

    if (!host) {
      $("serverStatus").textContent = "Set server IP";
      $("playerCount").textContent = "—";
      $("heroStatus").textContent = "OFFLINE";
      $("heroStatus").classList.add("offline");
      return;
    }

    try {
      const res = await fetch(
        `https://api.mcsrvstat.us/3/${encodeURIComponent(host)}`
      );

      if (!res.ok) throw new Error("status unavailable");

      const data = await res.json();

      if (data.online) {
        const online = data.players?.online ?? 0;
        const max = data.players?.max ?? "?";

        $("serverStatus").textContent = "Online";
        $("playerCount").textContent = `${online}/${max}`;
        $("heroStatus").textContent = "ONLINE";
        $("heroStatus").classList.remove("offline");
      } else {
        $("serverStatus").textContent = "Offline";
        $("playerCount").textContent = "0";
        $("heroStatus").textContent = "OFFLINE";
        $("heroStatus").classList.add("offline");
      }
    } catch (_) {
      $("serverStatus").textContent = "Unavailable";
      $("playerCount").textContent = "—";
      $("heroStatus").textContent = "—";
    }
  }

  loadStatus();

  const gallery = cfg.gallery || [];

  document.querySelectorAll(".gallery-card").forEach((card, i) => {
    const src = gallery[i];

    if (src) {
      card.style.backgroundImage = `url("${src}")`;
      card.classList.add("has-image");

      const label = card.querySelector("span");
      if (label) label.textContent = "";
    }
  });
})();
```

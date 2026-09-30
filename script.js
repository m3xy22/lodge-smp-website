(function () {
  const cfg = window.LODGE || {};

  function get(id) {
    return document.getElementById(id);
  }

  const serverIp = cfg.serverIp || "lodgesmp.net";
  const discord = cfg.discordUrl || "#";
  const modrinth = cfg.modrinthUrl || "#";

  get("serverIp").textContent = serverIp;
  get("headerDiscord").href = discord;
  get("heroDiscord").href = discord;
  get("joinDiscord2").href = discord;
  get("footerDiscord").href = discord;
  get("footerModrinth").href = modrinth;
  get("year").textContent = new Date().getFullYear();

  document.querySelectorAll("code").forEach(function (el) {
    if (el.textContent === "1.21.1 / NeoForge") {
      el.textContent =
        (cfg.minecraftVersion || "1.21.1") +
        " / " +
        (cfg.loader || "NeoForge");
    }
  });

  function showToast(message) {
    const toast = get("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.__lodgeToast);

    window.__lodgeToast = setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  async function copyIp() {
    if (!serverIp) {
      showToast("Server IP is not configured");
      return;
    }

    try {
      await navigator.clipboard.writeText(serverIp);
      showToast("Server IP copied!");
    } catch (error) {
      showToast(serverIp);
    }
  }

  ["copyIp", "copyIp2", "copyIp3"].forEach(function (id) {
    const button = get(id);

    if (button) {
      button.addEventListener("click", copyIp);
    }
  });

  async function loadStatus() {
    const host = cfg.statusHost || serverIp;

    if (!host) {
      if (get("serverStatus")) get("serverStatus").textContent = "Set server IP";
      if (get("playerCount")) get("playerCount").textContent = "—";
      if (get("heroStatus")) {
        get("heroStatus").textContent = "OFFLINE";
        get("heroStatus").classList.add("offline");
      }
      return;
    }

    try {
      const res = await fetch(
        "https://api.mcsrvstat.us/3/" + encodeURIComponent(host)
      );

      if (!res.ok) {
        throw new Error("status unavailable");
      }

      const data = await res.json();

      if (data.online) {
        const online = data.players && data.players.online
          ? data.players.online
          : 0;

        const max = data.players && data.players.max
          ? data.players.max
          : "?";

        if (get("serverStatus")) get("serverStatus").textContent = "Online";
        if (get("playerCount")) {
          get("playerCount").textContent = online + "/" + max;
        }

        if (get("heroStatus")) {
          get("heroStatus").textContent = "ONLINE";
          get("heroStatus").classList.remove("offline");
        }
      } else {
        if (get("serverStatus")) get("serverStatus").textContent = "Offline";
        if (get("playerCount")) get("playerCount").textContent = "0";

        if (get("heroStatus")) {
          get("heroStatus").textContent = "OFFLINE";
          get("heroStatus").classList.add("offline");
        }
      }
    } catch (error) {
      if (get("serverStatus")) {
        get("serverStatus").textContent = "Unavailable";
      }

      if (get("playerCount")) {
        get("playerCount").textContent = "—";
      }

      if (get("heroStatus")) {
        get("heroStatus").textContent = "—";
      }
    }
  }

  loadStatus();

  const gallery = cfg.gallery || [];

  document.querySelectorAll(".gallery-card").forEach(function (card, i) {
    const src = gallery[i];

    if (src) {
      card.style.backgroundImage = 'url("' + src + '")';
      card.classList.add("has-image");

      const label = card.querySelector("span");

      if (label) {
        label.textContent = "";
      }
    }
  });
})();

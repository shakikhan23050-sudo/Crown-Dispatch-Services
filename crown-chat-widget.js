/**
 * Crown Dispatch Services — AI Chat Widget
 * ------------------------------------------------
 * Drop this near the end of your <body>, right before </body>:
 *
 *   <script>
 *     window.CROWN_CHAT_CONFIG = {
 *       apiEndpoint: "https://your-worker-name.your-subdomain.workers.dev/chat"
 *     };
 *   </script>
 *   <script src="crown-chat-widget.js"></script>
 */
(function () {
  "use strict";

  var config = window.CROWN_CHAT_CONFIG || {};
  var API_ENDPOINT = config.apiEndpoint || "";

  // ---------- Font ----------
  if (!document.getElementById("cds-font-link")) {
    var fontLink = document.createElement("link");
    fontLink.id = "cds-font-link";
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(fontLink);
  }

  // ---------- Styles ----------
  var css = `
  :root {
    --cds-bg: #0f1115;
    --cds-panel: #181b22;
    --cds-panel-2: #20242d;
    --cds-panel-3: #262b35;
    --cds-accent: #d99a34;
    --cds-accent-ink: #241705;
    --cds-accent-soft: rgba(217, 154, 52, 0.14);
    --cds-steel: #5b7d94;
    --cds-text: #eef0f3;
    --cds-text-dim: #8b93a3;
    --cds-border: #2a2f3a;
    --cds-success: #4caf6f;
    --cds-radius-lg: 18px;
    --cds-radius-md: 12px;
    --cds-radius-sm: 8px;
    --cds-font: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .cds-launcher {
    position: fixed;
    right: 22px;
    bottom: 22px;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: linear-gradient(155deg, #e2a544 0%, var(--cds-accent) 55%, #b87a1f 100%);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
    border: none;
    cursor: pointer;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease;
  }
  .cds-launcher:hover { transform: scale(1.07); box-shadow: 0 10px 30px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset; }
  .cds-launcher:active { transform: scale(0.97); }
  .cds-launcher svg { width: 24px; height: 24px; }
  .cds-launcher-icon-chat, .cds-launcher-icon-close { position: absolute; transition: opacity 0.15s ease, transform 0.15s ease; }
  .cds-launcher.cds-active .cds-launcher-icon-chat { opacity: 0; transform: scale(0.6) rotate(-20deg); }
  .cds-launcher.cds-active .cds-launcher-icon-close { opacity: 1; transform: scale(1) rotate(0deg); }
  .cds-launcher-icon-close { opacity: 0; transform: scale(0.6) rotate(20deg); }

  .cds-panel {
    position: fixed;
    right: 22px;
    bottom: 92px;
    width: 372px;
    max-width: calc(100vw - 32px);
    height: 560px;
    max-height: calc(100vh - 140px);
    background: var(--cds-panel);
    border: 1px solid var(--cds-border);
    border-radius: var(--cds-radius-lg);
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0,0,0,0.3);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 999999;
    font-family: var(--cds-font);
    opacity: 0;
    transform: translateY(14px) scale(0.98);
    transform-origin: bottom right;
  }
  .cds-panel.cds-open {
    display: flex;
    animation: cds-panel-in 0.22s cubic-bezier(.2,.9,.3,1) forwards;
  }
  @keyframes cds-panel-in {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .cds-header {
    background: linear-gradient(180deg, var(--cds-panel-2) 0%, var(--cds-panel) 100%);
    padding: 16px 18px;
    border-bottom: 1px solid var(--cds-border);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cds-brand-mark {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: var(--cds-accent-soft);
    border: 1px solid rgba(217, 154, 52, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cds-brand-mark svg { width: 19px; height: 19px; }
  .cds-header-text { flex: 1; min-width: 0; }
  .cds-header-title { color: var(--cds-text); font-size: 15px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
  .cds-header-sub { color: var(--cds-text-dim); font-size: 12px; margin: 2px 0 0; display: flex; align-items: center; gap: 5px; }
  .cds-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cds-success); flex-shrink: 0; box-shadow: 0 0 0 3px rgba(76, 175, 111, 0.15); }
  .cds-close-btn {
    background: var(--cds-panel-3);
    border: 1px solid var(--cds-border);
    border-radius: 8px;
    width: 30px;
    height: 30px;
    color: var(--cds-text-dim);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .cds-close-btn:hover { background: var(--cds-panel-2); color: var(--cds-text); }
  .cds-close-btn svg { width: 15px; height: 15px; }

  .cds-messages {
    flex: 1;
    overflow-y: auto;
    padding: 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background:
      radial-gradient(circle at 100% 0%, rgba(217,154,52,0.05), transparent 45%),
      var(--cds-bg);
  }
  .cds-messages::-webkit-scrollbar { width: 6px; }
  .cds-messages::-webkit-scrollbar-thumb { background: var(--cds-border); border-radius: 6px; }

  .cds-row { display: flex; align-items: flex-end; gap: 8px; }
  .cds-row-user { flex-direction: row-reverse; }
  .cds-avatar {
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--cds-panel-3);
    border: 1px solid var(--cds-border);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cds-avatar svg { width: 12px; height: 12px; }

  .cds-msg { max-width: 78%; padding: 10px 14px; border-radius: var(--cds-radius-md); font-size: 13.5px; line-height: 1.5; white-space: pre-wrap; letter-spacing: -0.003em; }
  .cds-msg-bot { background: var(--cds-panel-2); color: var(--cds-text); border: 1px solid var(--cds-border); border-bottom-left-radius: 4px; }
  .cds-msg-user { background: var(--cds-accent); color: var(--cds-accent-ink); font-weight: 500; border-bottom-right-radius: 4px; }

  .cds-msg-typing { background: var(--cds-panel-2); border: 1px solid var(--cds-border); padding: 11px 14px; border-radius: var(--cds-radius-md); border-bottom-left-radius: 4px; display: flex; gap: 4px; width: fit-content; }
  .cds-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--cds-text-dim); animation: cds-blink 1.2s infinite ease-in-out; }
  .cds-dot:nth-child(2) { animation-delay: 0.2s; }
  .cds-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes cds-blink { 0%, 80%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-1px); } }

  .cds-input-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 12px;
    border-top: 1px solid var(--cds-border);
    background: var(--cds-panel);
  }
  .cds-input {
    flex: 1;
    background: var(--cds-panel-2);
    border: 1px solid var(--cds-border);
    border-radius: var(--cds-radius-sm);
    color: var(--cds-text);
    padding: 10px 13px;
    font-size: 13.5px;
    outline: none;
    resize: none;
    font-family: var(--cds-font);
    max-height: 100px;
    transition: border-color 0.15s ease;
  }
  .cds-input::placeholder { color: var(--cds-text-dim); }
  .cds-input:focus { border-color: var(--cds-accent); }
  .cds-send {
    background: var(--cds-accent);
    border: none;
    border-radius: var(--cds-radius-sm);
    width: 38px;
    height: 38px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: filter 0.15s ease, transform 0.1s ease;
  }
  .cds-send:hover:not(:disabled) { filter: brightness(1.08); }
  .cds-send:active:not(:disabled) { transform: scale(0.94); }
  .cds-send:disabled { opacity: 0.4; cursor: default; }
  .cds-send svg { width: 16px; height: 16px; }

  .cds-footer-note {
    text-align: center;
    font-size: 10.5px;
    color: var(--cds-text-dim);
    padding: 7px 0 10px;
    background: var(--cds-panel);
  }

  @media (max-width: 420px) {
    .cds-panel { right: 12px; left: 12px; width: auto; bottom: 84px; height: calc(100vh - 120px); }
    .cds-launcher { right: 16px; bottom: 16px; }
  }
  `;
  var styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ---------- Icons ----------
  var ICON_CHAT =
    '<svg class="cds-launcher-icon-chat" viewBox="0 0 24 24" fill="none" stroke="#241705" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  var ICON_CLOSE_ON_LAUNCHER =
    '<svg class="cds-launcher-icon-close" viewBox="0 0 24 24" fill="none" stroke="#241705" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  var ICON_TRUCK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#d99a34" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="7" width="13" height="10"></rect><path d="M14 10h4l3 3v4h-7z"></path><circle cx="6" cy="19" r="2"></circle><circle cx="17.5" cy="19" r="2"></circle></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  var ICON_SEND =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#241705" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
  var ICON_AVATAR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#8b93a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="7" width="13" height="10"></rect><path d="M14 10h4l3 3v4h-7z"></path><circle cx="6" cy="19" r="2"></circle><circle cx="17.5" cy="19" r="2"></circle></svg>';

  // ---------- Markup ----------
  var launcher = document.createElement("button");
  launcher.className = "cds-launcher";
  launcher.setAttribute("aria-label", "Chat with Crown Dispatch");
  launcher.innerHTML = ICON_CHAT + ICON_CLOSE_ON_LAUNCHER;

  var panel = document.createElement("div");
  panel.className = "cds-panel";
  panel.innerHTML =
    '<div class="cds-header">' +
    '  <div class="cds-brand-mark">' + ICON_TRUCK + "</div>" +
    '  <div class="cds-header-text">' +
    '    <p class="cds-header-title">Crown Dispatch</p>' +
    '    <p class="cds-header-sub"><span class="cds-status-dot"></span>Online — same-day response</p>' +
    "  </div>" +
    '  <button class="cds-close-btn" aria-label="Close chat">' + ICON_CLOSE + "</button>" +
    "</div>" +
    '<div class="cds-messages" id="cds-messages"></div>' +
    '<div class="cds-input-row">' +
    '  <textarea class="cds-input" id="cds-input" rows="1" placeholder="Type your message..."></textarea>' +
    '  <button class="cds-send" id="cds-send" aria-label="Send">' + ICON_SEND + "</button>" +
    "</div>" +
    '<div class="cds-footer-note">Dry van · Reefer · Flatbed · Power only · Box truck</div>';

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var messagesEl = panel.querySelector("#cds-messages");
  var inputEl = panel.querySelector("#cds-input");
  var sendBtn = panel.querySelector("#cds-send");
  var closeBtn = panel.querySelector(".cds-close-btn");

  var history = [];
  var opened = false;

  function addMessage(role, text) {
    var row = document.createElement("div");
    row.className = "cds-row" + (role === "user" ? " cds-row-user" : "");

    if (role !== "user") {
      var avatar = document.createElement("div");
      avatar.className = "cds-avatar";
      avatar.innerHTML = ICON_AVATAR;
      row.appendChild(avatar);
    }

    var bubble = document.createElement("div");
    bubble.className = "cds-msg " + (role === "user" ? "cds-msg-user" : "cds-msg-bot");
    bubble.textContent = text;
    row.appendChild(bubble);

    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    var row = document.createElement("div");
    row.className = "cds-row";
    row.id = "cds-typing-row";
    var avatar = document.createElement("div");
    avatar.className = "cds-avatar";
    avatar.innerHTML = ICON_AVATAR;
    var bubble = document.createElement("div");
    bubble.className = "cds-msg-typing";
    bubble.innerHTML = '<span class="cds-dot"></span><span class="cds-dot"></span><span class="cds-dot"></span>';
    row.appendChild(avatar);
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() {
    var el = document.getElementById("cds-typing-row");
    if (el) el.remove();
  }

  function openPanel() {
    panel.classList.add("cds-open");
    launcher.classList.add("cds-active");
    if (!opened) {
      opened = true;
      addMessage(
        "assistant",
        "Hey! This is Crown Dispatch. Tell me what you're hauling — equipment type and where you're based — and I'll help get you set up, or answer any questions about how we work."
      );
    }
    inputEl.focus();
  }
  function closePanel() {
    panel.classList.remove("cds-open");
    launcher.classList.remove("cds-active");
  }

  launcher.addEventListener("click", function () {
    panel.classList.contains("cds-open") ? closePanel() : openPanel();
  });
  closeBtn.addEventListener("click", closePanel);

  async function sendMessage() {
    var text = inputEl.value.trim();
    if (!text) return;
    if (!API_ENDPOINT) {
      addMessage("assistant", "Chat isn't configured yet — missing apiEndpoint in CROWN_CHAT_CONFIG.");
      return;
    }

    addMessage("user", text);
    history.push({ role: "user", content: text });
    inputEl.value = "";
    inputEl.style.height = "auto";
    sendBtn.disabled = true;
    showTyping();

    try {
      var res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      var data = await res.json();
      hideTyping();

      if (!res.ok) {
        addMessage("assistant", "Sorry, something went wrong on our end. Please try again in a moment.");
      } else {
        addMessage("assistant", data.reply);
        history.push({ role: "assistant", content: data.reply });
      }
    } catch (err) {
      hideTyping();
      addMessage("assistant", "Couldn't connect — check your internet connection and try again.");
    } finally {
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  inputEl.addEventListener("input", function () {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + "px";
  });
})();

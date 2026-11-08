/* =====================================================
   LAEL IQ - PROFILE (صورة الحساب) + ADMIN SHORTCUT
   -----------------------------------------------------
   1) صورة الحساب: ترفعها من صفحة "حسابي" وتظهر بأيقونة
      الحساب في شريط الموقع.
   2) أيقونة الإدارة: تظهر فقط للحسابات المكتوبة بالقائمة
      أدناه. أي حساب ثاني ما تظهر له نهائياً.
===================================================== */

(function () {

    "use strict";
    function getPagePath(p) {
        return window.location.pathname.includes("/pages/") ? p : ("pages/" + p);
    }
    function getAdminPath(p) {
        return window.location.pathname.includes("/pages/") ? ("admin/" + p) : ("pages/admin/" + p);
    }

    /* ================================================
       ⚙️  إعدادات الأدمن — غيّر الإيميل هنا
       سجّل حساب بالموقع بنفس هذا الإيميل بالضبط
       وراح تظهر لك أيقونة الإدارة. تكدر تضيف أكثر
       من إيميل بين الأقواس.
    ================================================ */
    const ADMIN_EMAILS = [
        "admin@lael-iq.com"
    ];

    const USER_KEY  = "laelAuthUser";
    const USERS_KEY = "laelRegisteredUsers";
    const ADMIN_SESSION_KEY = "laelAdminLoggedIn";

    const AVATAR_SIZE = 256;
    const MAX_FILE_BYTES = 10 * 1024 * 1024;


    /* ================================================
       HELPERS
    ================================================ */

    function readJSON(key, fallback) {
        try {
            const v = JSON.parse(localStorage.getItem(key) || "null");
            return v == null ? fallback : v;
        } catch (e) {
            return fallback;
        }
    }

    function getSessionUser() {
        const u = readJSON(USER_KEY, null);
        return u && typeof u === "object" && u.loggedIn === true ? u : null;
    }

    function getUsers() {
        const u = readJSON(USERS_KEY, []);
        return Array.isArray(u) ? u : [];
    }

    function getUserRecord() {
        const s = getSessionUser();
        if (!s) return null;
        return getUsers().find(function (u) { return u.id === s.id; }) || null;
    }

    function isAdminEmail(email) {
        const e = String(email || "").trim().toLowerCase();
        return !!e && ADMIN_EMAILS.some(function (a) {
            return String(a).trim().toLowerCase() === e;
        });
    }

    function isAdminUser() {
        const s = getSessionUser();
        return !!s && isAdminEmail(s.email);
    }

    function getAvatar() {
        const r = getUserRecord();
        return r && typeof r.avatar === "string" && r.avatar.indexOf("data:image/") === 0
            ? r.avatar
            : "";
    }


    /* ================================================
       NAVBAR: ACCOUNT LINK + AVATAR
    ================================================ */

    function ensureAccountLink() {

        let link = document.getElementById("accountLink");
        if (link) return link;

        const actions = document.querySelector(".nav-actions");
        if (!actions) return null;

        link = document.createElement("a");
        link.className = "account-link";
        link.id = "accountLink";
        link.href = getPagePath("login.html");
        link.setAttribute("aria-label", "الحساب");
        link.innerHTML =
            '<span class="account-icon" aria-hidden="true">👤</span>' +
            '<span id="accountText">تسجيل الدخول</span>';

        actions.appendChild(link);
        return link;
    }

    function applyAccountLink() {

        const link = ensureAccountLink();
        if (!link) return;

        const user = getSessionUser();
        const text = document.getElementById("accountText");
        const icon = link.querySelector(".account-icon");

        link.href = user ? getPagePath("account.html") : getPagePath("login.html");
        link.classList.toggle("logged-in", !!user);
        if (text) text.textContent = user ? "حسابي" : "تسجيل الدخول";

        if (!icon) return;

        const avatar = user ? getAvatar() : "";
        let img = icon.querySelector("img.account-icon-img");

        if (avatar) {
            if (!img) {
                img = document.createElement("img");
                img.className = "account-icon-img";
                img.alt = "";
                icon.textContent = "";
                icon.appendChild(img);
            }
            if (img.getAttribute("src") !== avatar) img.setAttribute("src", avatar);
            icon.classList.add("has-avatar");
        } else {
            if (img) {
                icon.textContent = "👤";
            }
            icon.classList.remove("has-avatar");
        }
    }


    /* ================================================
       NAVBAR: ADMIN ICON (للأدمن فقط)
    ================================================ */

    const ADMIN_SVG =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
        'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/>' +
        '<path d="M9 12l2 2 4-4"/></svg>';

    function applyAdminIcon() {

        let el = document.getElementById("adminShortcut");

        if (!isAdminUser()) {
            if (el) el.remove();
            return;
        }

        const href = sessionStorage.getItem(ADMIN_SESSION_KEY) === "true"
            ? getAdminPath("dashboard.html")
            : getAdminPath("login.html");

        if (!el) {

            const actions = document.querySelector(".nav-actions");
            if (!actions) return;

            el = document.createElement("a");
            el.id = "adminShortcut";
            el.className = "admin-shortcut";
            el.title = "لوحة الإدارة";
            el.setAttribute("aria-label", "لوحة الإدارة");
            el.innerHTML = ADMIN_SVG;

            const account = document.getElementById("accountLink");
            if (account && account.parentNode === actions) {
                actions.insertBefore(el, account);
            } else {
                actions.appendChild(el);
            }
        }

        if (el.getAttribute("href") !== href) el.setAttribute("href", href);
    }


    /* ================================================
       IMAGE → SQUARE JPEG (صغيرة حتى ما تملي التخزين)
    ================================================ */

    function processImage(file) {

        return new Promise(function (resolve, reject) {

            if (!file || !/^image\//.test(file.type)) {
                reject(new Error("الملف المختار ليس صورة"));
                return;
            }

            if (file.size > MAX_FILE_BYTES) {
                reject(new Error("حجم الصورة كبير (الأقصى 10MB)"));
                return;
            }

            const reader = new FileReader();

            reader.onerror = function () {
                reject(new Error("تعذر قراءة الصورة"));
            };

            reader.onload = function () {

                const img = new Image();

                img.onerror = function () {
                    reject(new Error("تعذر فتح الصورة"));
                };

                img.onload = function () {

                    const side = Math.min(img.width, img.height);
                    const sx = (img.width - side) / 2;
                    const sy = (img.height - side) / 2;

                    const canvas = document.createElement("canvas");
                    canvas.width = AVATAR_SIZE;
                    canvas.height = AVATAR_SIZE;

                    const ctx = canvas.getContext("2d");
                    ctx.fillStyle = "#080808";
                    ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
                    ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

                    resolve(canvas.toDataURL("image/jpeg", 0.85));
                };

                img.src = reader.result;
            };

            reader.readAsDataURL(file);
        });
    }

    function saveAvatar(dataUrl) {

        const session = getSessionUser();
        if (!session) throw new Error("سجّل الدخول أولاً");

        const users = getUsers();
        const i = users.findIndex(function (u) { return u.id === session.id; });
        if (i < 0) throw new Error("الحساب غير موجود");

        if (dataUrl) users[i].avatar = dataUrl;
        else delete users[i].avatar;

        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch (e) {
            throw new Error("مساحة التخزين ممتلئة، جرّب صورة أصغر");
        }
    }


    /* ================================================
       ACCOUNT PAGE: رفع / حذف الصورة
    ================================================ */

    function renderAccountAvatar() {

        const img = document.getElementById("accountAvatarImg");
        const initial = document.getElementById("accountInitial");
        const removeBtn = document.getElementById("avatarRemoveBtn");
        const changeBtn = document.getElementById("avatarChangeBtn");

        if (!img) return;

        const avatar = getAvatar();

        if (avatar) {
            img.src = avatar;
            img.hidden = false;
            if (initial) initial.style.visibility = "hidden";
        } else {
            img.removeAttribute("src");
            img.hidden = true;
            if (initial) initial.style.visibility = "";
        }

        if (removeBtn) removeBtn.hidden = !avatar;
        if (changeBtn) changeBtn.textContent = avatar ? "📷 تغيير الصورة" : "📷 إضافة صورة";
    }

    function setAvatarMessage(text, ok) {
        const m = document.getElementById("avatarMsg");
        if (!m) return;
        m.textContent = text || "";
        m.classList.toggle("ok", !!ok);
        m.classList.toggle("bad", !ok && !!text);
        if (text) {
            clearTimeout(setAvatarMessage._t);
            setAvatarMessage._t = setTimeout(function () { m.textContent = ""; }, 3500);
        }
    }

    function setupAccountPage() {

        const input = document.getElementById("avatarInput");
        const changeBtn = document.getElementById("avatarChangeBtn");
        const removeBtn = document.getElementById("avatarRemoveBtn");
        const avatarBox = document.getElementById("accountAvatar");

        if (!input || !changeBtn) return;

        function openPicker() { input.click(); }

        changeBtn.addEventListener("click", openPicker);
        if (avatarBox) {
            avatarBox.addEventListener("click", openPicker);
            avatarBox.style.cursor = "pointer";
            avatarBox.title = "اضغط لتغيير الصورة";
        }

        input.addEventListener("change", function () {

            const file = input.files && input.files[0];
            input.value = "";
            if (!file) return;

            processImage(file)
                .then(function (dataUrl) {
                    saveAvatar(dataUrl);
                    refresh();
                    setAvatarMessage("تم حفظ الصورة ✓", true);
                })
                .catch(function (err) {
                    setAvatarMessage(err.message || "حدث خطأ", false);
                });
        });

        if (removeBtn) {
            removeBtn.addEventListener("click", function () {
                try {
                    saveAvatar("");
                    refresh();
                    setAvatarMessage("تم حذف الصورة", true);
                } catch (err) {
                    setAvatarMessage(err.message || "حدث خطأ", false);
                }
            });
        }
    }


    /* ================================================
       REFRESH / INIT
    ================================================ */

    function refresh() {
        applyAccountLink();
        applyAdminIcon();
        renderAccountAvatar();
    }

    let lastSignature = "";

    function signature() {
        const s = getSessionUser();
        return [
            s ? s.id : "",
            s ? s.email : "",
            getAvatar().length,
            sessionStorage.getItem(ADMIN_SESSION_KEY) || ""
        ].join("|");
    }

    function tick() {
        const sig = signature();
        if (sig !== lastSignature) {
            lastSignature = sig;
            refresh();
        }
    }

    function init() {
        refresh();
        setupAccountPage();
        lastSignature = signature();
        window.addEventListener("storage", tick);
        setInterval(tick, 600);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

    window.LAEL_isAdminEmail = isAdminEmail;
    window.LAEL_isAdminUser = isAdminUser;
    window.LAEL_refreshProfile = refresh;

})();

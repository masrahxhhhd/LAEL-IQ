/* =====================================================
   LAEL IQ - LAYOUT
   تثبيت الهيدر فوق بكل الأجهزة (موبايل / آيباد / لابتوب)
   + تثبيت الإشعارات تحت الهيدر مباشرة.
   إذا ما اشتغل هذا السكربت لأي سبب، يبقى الهيدر sticky الأصلي.
===================================================== */
(function () {
    "use strict";

    const nav = document.querySelector(".navbar");
    if (!nav) return;

    const root = document.documentElement;
    const spacer = document.createElement("div");
    spacer.id = "navSpacer";
    spacer.setAttribute("aria-hidden", "true");
    nav.parentNode.insertBefore(spacer, nav.nextSibling);

    let base = 0;      /* المكان الطبيعي للهيدر (تحت شريط الإعلان إن وجد) */
    let ticking = false;

    function measure() {
        const h = nav.offsetHeight;
        spacer.style.height = h + "px";
        base = spacer.getBoundingClientRect().top + (window.pageYOffset || 0);
        root.style.setProperty("--nav-h", h + "px");
        place();
    }

    function place() {
        const y = window.pageYOffset || 0;
        const top = Math.max(0, base - y);
        nav.style.top = top + "px";
        root.style.setProperty("--nav-bottom", (top + nav.offsetHeight) + "px");
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            ticking = false;
            place();
        });
    }

    document.body.classList.add("has-fixed-nav");
    measure();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", function () { setTimeout(measure, 250); });
    window.addEventListener("load", measure);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(measure);
    }

    if (window.ResizeObserver) {
        new ResizeObserver(measure).observe(nav);
    }
})();

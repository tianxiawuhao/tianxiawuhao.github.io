"use strict";
/* =====================================================================
   tianxia blog — 站点级增强（全站页面由生成器引用）
   1) 阅读进度条  #progress（对齐 J6vCn9W4Z）
   2) 明/暗主题切换（html[data-theme]，localStorage: tw-theme）
   3) 导航吸顶 .scrolled
   4) 卡片入场动画 .rv/.in（尊重 prefers-reduced-motion）
   ===================================================================== */
!(function () {
  var html = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- 主题 ---------- */
  function applyTheme(t) {
    html.setAttribute("data-theme", t === "dark" ? "dark" : "light");
  }
  var stored = null;
  try {
    stored = localStorage.getItem("tw-theme");
  } catch (e) {
    stored = null;
  }
  var theme = stored || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(theme);

  var navUl = document.querySelector("#mainNav .navbar-nav");
  if (navUl && !document.querySelector("#mainNav .theme-toggle")) {
    var li = document.createElement("li");
    li.className = "nav-item theme-toggle-item";
    li.innerHTML =
      '<button type="button" class="theme-toggle" aria-label="切换明暗主题">' +
      '<i class="fas fa-sun" aria-hidden="true"></i>' +
      '<i class="fas fa-moon" aria-hidden="true"></i>' +
      "</button>";
    navUl.appendChild(li);
    var btn = li.querySelector(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem("tw-theme", next);
        } catch (e) {}
      });
    }
  }

  /* ---------- 导航吸顶 ---------- */
  var nav = document.getElementById("mainNav");
  if (nav) {
    var navTick = false;
    function navOnScroll() {
      if (window.scrollY > 14) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!navTick) {
          navTick = true;
          window.requestAnimationFrame(function () {
            navOnScroll();
            navTick = false;
          });
        }
      },
      { passive: true }
    );
    navOnScroll();
  }

  /* ---------- 阅读进度条 ---------- */
  if (!document.getElementById("progress")) {
    var bar = document.createElement("div");
    bar.id = "progress";
    bar.innerHTML = "<i></i>";
    document.body.appendChild(bar);
  }
  var progBar = document.querySelector("#progress i");
  var tick = false;
  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var p = max > 0 ? doc.scrollTop / max : 0;
    if (progBar) progBar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!tick) {
        tick = true;
        window.requestAnimationFrame(function () {
          updateProgress();
          tick = false;
        });
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------- 入场动画（如无减少动态偏好） ---------- */
  var els = document.querySelectorAll(".post-row-container, .post-archives a.post, .post-content-container, #gridea-search-result a");
  if (!reduced || !reduced.matches) {
    if ("IntersectionObserver" in window && els.length) {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en, idx) {
            if (en.isIntersecting) {
              var el = en.target;
              if (!el.classList.contains("rv")) {
                el.classList.add("rv");
                el.classList.add("in");
              }
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
      );
      els.forEach(function (el, i) {
        el.classList.add("rv");
        if (i < 12) el.style.transitionDelay = (i * 28) % 200 + "ms";
        obs.observe(el);
      });
    }
  } else {
    els.forEach(function (el) {
      el.classList.add("in");
    });
  }
})();

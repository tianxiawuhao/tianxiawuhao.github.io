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

  /* ---------- 入场动画（渐进增强；动画失败/不支持时回退到「默认可见」） ----------
     旧实现：forEach 先加 .rv，再在观察回调里 `if (!el.classList.contains('rv'))` 跳过 .in，
     导致 .post-row-container / .post-content-container / .post-archives a.post / 搜索结果卡片
     opacity 始终为 0（用户反馈「文字看不见」就是这个原因）。
     新实现：默认就可见；仅在 IO 可用且无 reduced-motion 时启用动画，并把 .rv 与 .in 一起
     在回调里添加；2s 安全网兜底，确保任何元素最迟 2s 后一定可见。 */
  var rvEls = document.querySelectorAll(
    ".post-row-container, .post-archives a.post, .post-content-container, #gridea-search-result a"
  );
  var hasIO = "IntersectionObserver" in window;
  var reducedMotion = !!(reduced && reduced.matches);

  if (hasIO && !reducedMotion && rvEls.length) {
    var rvObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          el.classList.add("rv", "in");
          rvObs.unobserve(el);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
    );
    rvEls.forEach(function (el, i) {
      if (i < 12) el.style.transitionDelay = (i * 28) % 200 + "ms";
      rvObs.observe(el);
    });
    // 安全网：2s 内仍没拿到 .in 的元素（IO 异常 / 视口外元素从未进入）强制可见
    setTimeout(function () {
      rvEls.forEach(function (el) {
        if (!el.classList.contains("in")) el.classList.add("rv", "in");
      });
    }, 2000);
  } else if (rvEls.length) {
    // 不支持 IO 或用户开启了减少动态：直接可见，不挂动画
    rvEls.forEach(function (el) { el.classList.add("in"); });
  }
})();

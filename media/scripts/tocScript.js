"use strict";
/* =====================================================================
   tianxia blog — 目录增强脚本
   1) 宽屏（>=1280px）：把文末 .markdownIt-TOC 克隆为右侧吸顶 #tocSidebar，
      滚动时高亮当前章节（.is-active），原生锚点平滑跳转。
   2) 窄屏：保留文末目录卡片（由 styles/main.css 负责外观），仅绑定平滑滚动。
   不劫持链接、不注入行号，避免破坏正文与代码。
   ===================================================================== */
!(function () {
  var WIDE = window.matchMedia && window.matchMedia("(min-width: 1280px)");

  function findToc() {
    var box = document.querySelector(".toc-container .markdownIt-TOC");
    if (!box) return null;
    return box;
  }

  function smoothAnchors(root) {
    if (!root) return;
    var links = root.querySelectorAll("a[href^='#']");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function (e) {
        var id = this.getAttribute("href");
        if (!id || id.length < 2) return;
        var target = document.getElementById(decodeURIComponent(id.slice(1)));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", "#" + encodeURIComponent(id.slice(1)));
        }
      });
    }
  }

  function buildSidebar(source) {
    var existing = document.getElementById("tocSidebar");
    if (existing) existing.parentNode.removeChild(existing);

    var aside = document.createElement("aside");
    aside.id = "tocSidebar";
    aside.setAttribute("aria-label", "文章目录");
    aside.innerHTML =
      '<div class="toc-label">目录 · Contents</div>' +
      source.innerHTML;

    document.body.appendChild(aside);
    document.body.classList.add("toc-ready");

    smoothAnchors(aside);

    var links = aside.querySelectorAll("a[href^='#']");
    var heads = [];
    for (var i = 0; i < links.length; i++) {
      var id = decodeURIComponent((links[i].getAttribute("href") || "#").slice(1));
      heads.push({ link: links[i], el: document.getElementById(id) });
    }

    function spy() {
      var pos = (window.pageYOffset || document.documentElement.scrollTop || 0) + 110;
      var current = -1;
      for (var j = 0; j < heads.length; j++) {
        if (!heads[j].el) continue;
        var top = heads[j].el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
        if (top <= pos) current = j;
      }
      for (var k = 0; k < heads.length; k++) {
        if (heads[k].link.classList.contains("is-active") !== (k === current)) {
          if (k === current) heads[k].link.classList.add("is-active");
          else heads[k].link.classList.remove("is-active");
        }
      }
    }

    spy();
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(function () {
            spy();
            ticking = false;
          });
        }
      },
      { passive: true }
    );
  }

  function init() {
    var toc = findToc();
    if (!toc) return;
    // 锚点平滑滚动：宽屏 rail 与窄屏卡片都生效
    smoothAnchors(toc);
    if (WIDE && WIDE.matches) {
      buildSidebar(toc);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (WIDE && WIDE.addEventListener) {
    WIDE.addEventListener("change", function (e) {
      var toc = findToc();
      if (!toc) return;
      if (e.matches) buildSidebar(toc);
      else {
        var rail = document.getElementById("tocSidebar");
        if (rail) rail.parentNode.removeChild(rail);
        document.body.classList.remove("toc-ready");
      }
    });
  }
})();

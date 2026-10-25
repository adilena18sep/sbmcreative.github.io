/* ==========================================================================
   SBM Creative — main.js
   ========================================================================== */
(function () {
  "use strict";

  var WA_NUMBER = "628881123222";
  var rupiah = function (n) {
    return "Rp" + Number(n).toLocaleString("id-ID");
  };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     NAV
     ---------------------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-solid", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      burger.setAttribute("aria-label", open ? "Buka menu" : "Tutup menu");
      mobileMenu.hidden = open;
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
      });
    });
  }

  /* ----------------------------------------------------------------------
     REVEAL ON SCROLL
     ---------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      revealObs.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ----------------------------------------------------------------------
     INLINE VIDEO AUTOPLAY (only while visible)
     ---------------------------------------------------------------------- */
  var inlineVideos = document.querySelectorAll(".reel video, .longform__media video, .video-frame video");

  // Setiap video dimulai dari momen yang representatif (bukan frame kosong).
  var START_AT = {
    "assets/video/mg-01-apps.mp4": 11.3,
    "assets/video/mg-02-kinetic.mp4": 12.4,
    "assets/video/mg-04-montage.mp4": 10.6,
    "assets/video/mg-05-appicons.mp4": 11.8,
    "assets/video/mg-07-emoji-melody.mp4": 12.9,
    "assets/video/mg-08-particles.mp4": 8.5,
    "assets/video/mg-10-promo.mp4": 6,
    "assets/video/mg-11-lovehard.mp4": 9.6,
    "assets/video/prod-03-jesika.mp4": 4.9,
    "assets/video/prod-09-bayr.mp4": 6.9,
    "assets/video/prod-12-unboxing.mp4": 5.4,
    "assets/video/talk-06-edukasi.mp4": 33
  };

  inlineVideos.forEach(function (v) {
    var start = START_AT[v.getAttribute("src")];
    if (typeof start !== "number") return;
    v.addEventListener(
      "loadedmetadata",
      function () {
        try {
          if (v.currentTime < 0.2) v.currentTime = start;
        } catch (err) { /* ignore */ }
      },
      { once: true }
    );
  });

  function playVideo(v) {
    if (reduceMotion) return;
    var p = v.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  }

  if ("IntersectionObserver" in window) {
    var videoObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (v.preload === "none") v.preload = "auto";
            playVideo(v);
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    inlineVideos.forEach(function (v) {
      videoObs.observe(v);
    });
  } else {
    inlineVideos.forEach(playVideo);
  }

  // Pause everything when the tab is hidden.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      inlineVideos.forEach(function (v) { v.pause(); });
    }
  });

  /* ----------------------------------------------------------------------
     LIGHTBOX
     ---------------------------------------------------------------------- */
  var dlg = document.getElementById("lightbox");
  var lightboxVideo = document.getElementById("lightboxVideo");
  var lightboxTitle = document.getElementById("lightboxTitle");
  var lightboxMeta = document.getElementById("lightboxMeta");
  var lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(trigger) {
    if (!dlg || !lightboxVideo) return;
    lightboxVideo.src = trigger.getAttribute("data-video");
    lightboxVideo.muted = false;
    lightboxVideo.currentTime = 0;
    lightboxTitle.textContent = trigger.getAttribute("data-title") || "";
    lightboxMeta.textContent = trigger.getAttribute("data-meta") || "";
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
    playVideo(lightboxVideo);
  }

  function closeLightbox() {
    if (!dlg) return;
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute("src");
      lightboxVideo.load();
    }
    if (typeof dlg.close === "function" && dlg.open) dlg.close();
    else dlg.removeAttribute("open");
  }

  document.querySelectorAll(".reel, .longform__media").forEach(function (el) {
    el.addEventListener("click", function () {
      openLightbox(el);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (dlg) {
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) closeLightbox();
    });
    dlg.addEventListener("close", function () {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.removeAttribute("src");
        lightboxVideo.load();
      }
    });
  }

  /* ----------------------------------------------------------------------
     PRICING DATA (read from the cards)
     ---------------------------------------------------------------------- */
  var priceEls = Array.prototype.slice.call(document.querySelectorAll(".price"));
  var PAKET = priceEls.map(function (el) {
    var id = el.getAttribute("data-paket");
    return {
      id: id,
      group: id.indexOf("premium") === 0 ? "premium" : "simpel",
      label: el.getAttribute("data-label"),
      price: Number(el.getAttribute("data-price")),
      deadline: el.getAttribute("data-deadline"),
      revisi: el.getAttribute("data-revisi"),
      el: el
    };
  });

  var byId = {};
  PAKET.forEach(function (p) { byId[p.id] = p; });

  var calcPaket = document.getElementById("calcPaket");
  var calcMenit = document.getElementById("calcMenit");
  var calcTotal = document.getElementById("calcTotal");
  var formPaket = document.getElementById("paket");
  var formMenit = document.getElementById("menit");

  function fillSelect(select) {
    if (!select) return;
    var groups = { simpel: "Paket Simpel", premium: "Paket Premium" };
    ["simpel", "premium"].forEach(function (g) {
      var og = document.createElement("optgroup");
      og.label = groups[g];
      PAKET.filter(function (p) { return p.group === g; }).forEach(function (p) {
        var opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.label + " · " + rupiah(p.price) + "/menit";
        og.appendChild(opt);
      });
      select.appendChild(og);
    });
  }
  fillSelect(calcPaket);
  fillSelect(formPaket);

  var state = { paket: "simpel-1", menit: 1 };

  var sumPaket = document.getElementById("sumPaket");
  var sumHarga = document.getElementById("sumHarga");
  var sumDurasi = document.getElementById("sumDurasi");
  var sumDeadline = document.getElementById("sumDeadline");
  var sumRevisi = document.getElementById("sumRevisi");
  var sumTotal = document.getElementById("sumTotal");

  function clampMenit(value) {
    var n = parseInt(value, 10);
    if (isNaN(n) || n < 1) n = 1;
    if (n > 60) n = 60;
    return n;
  }

  function render() {
    var p = byId[state.paket] || PAKET[0];
    var total = p.price * state.menit;

    if (calcTotal) calcTotal.textContent = rupiah(total);
    if (sumPaket) sumPaket.textContent = p.label;
    if (sumHarga) sumHarga.textContent = rupiah(p.price) + "/menit";
    if (sumDurasi) sumDurasi.textContent = state.menit + " menit";
    if (sumDeadline) sumDeadline.textContent = p.deadline;
    if (sumRevisi) sumRevisi.textContent = p.revisi;
    if (sumTotal) sumTotal.textContent = rupiah(total);

    priceEls.forEach(function (el) {
      el.classList.toggle("is-selected", el.getAttribute("data-paket") === p.id);
    });
    if (calcPaket && calcPaket.value !== p.id) calcPaket.value = p.id;
    if (formPaket && formPaket.value !== p.id) formPaket.value = p.id;
  }

  function setPaket(id) {
    if (!byId[id]) return;
    state.paket = id;
    render();
  }

  function setMenit(value, source) {
    state.menit = clampMenit(value);
    if (source !== "calc" && calcMenit) calcMenit.value = state.menit;
    if (source !== "form" && formMenit) formMenit.value = state.menit;
    render();
  }

  if (calcPaket) calcPaket.addEventListener("change", function () { setPaket(this.value); });
  if (formPaket) formPaket.addEventListener("change", function () { setPaket(this.value); });
  if (calcMenit) calcMenit.addEventListener("input", function () { setMenit(this.value, "calc"); });
  if (formMenit) formMenit.addEventListener("input", function () { setMenit(this.value, "form"); });

  priceEls.forEach(function (el) {
    var btn = el.querySelector("[data-pick]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      setPaket(el.getAttribute("data-paket"));
      var order = document.getElementById("order");
      if (order) order.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      var nama = document.getElementById("nama");
      if (nama) setTimeout(function () { nama.focus({ preventScroll: true }); }, 700);
    });
  });

  document.querySelectorAll("[data-calc-go]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var order = document.getElementById("order");
      if (order) order.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  render();

  /* ----------------------------------------------------------------------
     TABS
     ---------------------------------------------------------------------- */
  var tabs = document.querySelectorAll(".tabs__btn");
  var panels = document.querySelectorAll(".panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-tab");
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.id === "panel-" + key);
      });
    });
  });

  /* ----------------------------------------------------------------------
     ORDER FORM → WHATSAPP
     ---------------------------------------------------------------------- */
  var form = document.getElementById("orderForm");

  function setError(name, message) {
    var input = document.getElementById(name);
    var err = document.querySelector('[data-error-for="' + name + '"]');
    if (input) {
      var field = input.closest(".field");
      if (field) field.classList.toggle("has-error", Boolean(message));
    }
    if (err) err.textContent = message || "";
  }

  function normalizePhone(raw) {
    var digits = String(raw).replace(/\D/g, "");
    if (digits.indexOf("62") === 0) return digits;
    if (digits.charAt(0) === "0") return "62" + digits.slice(1);
    if (digits.charAt(0) === "8") return "62" + digits;
    return digits;
  }

  if (form) {
    ["nama", "wa", "paket", "menit"].forEach(function (name) {
      var input = document.getElementById(name);
      if (input) {
        input.addEventListener("input", function () { setError(name, ""); });
        input.addEventListener("change", function () { setError(name, ""); });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nama = document.getElementById("nama");
      var wa = document.getElementById("wa");
      var referensi = document.getElementById("referensi");
      var brief = document.getElementById("brief");
      var ok = true;

      if (!nama.value.trim() || nama.value.trim().length < 2) {
        setError("nama", "Nama atau brand wajib diisi.");
        ok = false;
      }
      var phone = normalizePhone(wa.value);
      if (!/^62\d{9,13}$/.test(phone)) {
        setError("wa", "Nomor WhatsApp belum valid (contoh: 08881123222).");
        ok = false;
      }
      if (!ok) {
        var firstError = form.querySelector(".field.has-error input, .field.has-error select");
        if (firstError) firstError.focus();
        return;
      }

      var p = byId[state.paket] || PAKET[0];
      var total = p.price * state.menit;

      var lines = [
        "Halo SBM Creative, saya mau order video edit 🎬",
        "",
        "Nama: " + nama.value.trim(),
        "WhatsApp: " + phone,
        "Paket: " + p.label,
        "Harga: " + rupiah(p.price) + "/menit",
        "Durasi: " + state.menit + " menit",
        "Deadline: " + p.deadline,
        "Revisi: " + p.revisi,
        "Estimasi total: " + rupiah(total)
      ];
      if (referensi && referensi.value.trim()) lines.push("Referensi: " + referensi.value.trim());
      if (brief && brief.value.trim()) lines.push("Brief: " + brief.value.trim());
      lines.push("", "Mohon info langkah selanjutnya. Terima kasih!");

      var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  /* ----------------------------------------------------------------------
     HIDE STICKY CTA WHEN ORDER SECTION IS VISIBLE
     ---------------------------------------------------------------------- */
  var mobileCta = document.querySelector(".mobile-cta");
  var orderSection = document.getElementById("order");
  if (mobileCta && orderSection && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          mobileCta.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    ).observe(orderSection);
  }
})();

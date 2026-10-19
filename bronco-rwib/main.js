/* ============================================================
   Bronco Auto Repair — main.js
   1. Live "open now / closed" status per shop (Dallas time)
   2. Dallas clock in the bay board header
   3. Reveal-on-scroll
   4. Footer year
   5. Admin-managed content (/api/content): edited text, working
      hours, holiday closures and the holiday popup
   Default hours live in the HTML: each .board-row carries a
   data-hours attribute -> { weekday: [openMinutes, closeMinutes] }
   0 = Sunday ... 6 = Saturday. A missing day means closed.
   The admin portal (/admin/) overrides those defaults.
   ============================================================ */

(function () {
  "use strict";

  var TZ = "America/Chicago";
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var SHOP_NAMES = { "west-dallas": "West Dallas", "oak-cliff": "Oak Cliff" };

  var LANG = (document.documentElement.lang || "en").slice(0, 2) === "es" ? "es" : "en";

  var STRINGS = {
    en: {
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysLong: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "Opens",
      tomorrow: "tomorrow ",
      callForHours: "Call for hours",
      seeHours: "See hours",
      openUntil: "Open until",
      clockSuffix: " Dallas",
      closed: "Closed",
      open: "Open",
      hoursVary: "Hours vary by shop",
      notice: "Notice",
      gotIt: "Got it",
      close: "Close",
      locale: "en-US"
    },
    es: {
      days: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      daysLong: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      opens: "Abre",
      tomorrow: "mañana ",
      callForHours: "Llame para horario",
      seeHours: "Ver horario",
      openUntil: "Abierto hasta las",
      clockSuffix: " Dallas",
      closed: "Cerrado",
      open: "Abierto",
      hoursVary: "El horario varía según el taller",
      notice: "Aviso",
      gotIt: "Entendido",
      close: "Cerrar",
      locale: "es-US"
    }
  };
  var T = STRINGS[LANG];

  var SHORT_DAYS = {
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  }[LANG];
  var ORDER = [1, 2, 3, 4, 5, 6, 0];
  var EN_DASH = "–";

  var defaultHours = {};
  var overrideHours = {};
  var holidays = [];

  /* Admin live preview: /?preview=1 inside the admin's iframe takes its
     content from the editor (postMessage) instead of the saved version. */
  var PREVIEW = /[?&]preview=1\b/.test(location.search) && window.parent !== window;
  var previewDate = null;
  var previewDismissed = {};

  /* ---- current time in Dallas, independent of visitor timezone ---- */
  function dallasNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(new Date());

    var out = {};
    parts.forEach(function (p) { out[p.type] = p.value; });

    var day = DAYS.indexOf(out.weekday);
    var hour = parseInt(out.hour, 10) % 24;
    var minute = parseInt(out.minute, 10);

    var now = {
      day: day < 0 ? new Date().getDay() : day,
      minutes: hour * 60 + minute,
      y: parseInt(out.year, 10),
      m: parseInt(out.month, 10),
      d: parseInt(out.day, 10),
      ymd: out.year + "-" + out.month + "-" + out.day
    };

    if (PREVIEW && previewDate) {
      var p = previewDate.split("-");
      now.y = +p[0];
      now.m = +p[1];
      now.d = +p[2];
      now.ymd = previewDate;
      now.day = new Date(Date.UTC(now.y, now.m - 1, now.d)).getUTCDay();
      now.minutes = 12 * 60;
    }
    return now;
  }

  function ymdPlus(now, offset) {
    return new Date(Date.UTC(now.y, now.m - 1, now.d + offset)).toISOString().slice(0, 10);
  }

  /* ---- 480 -> "8 AM", 1080 -> "6 PM", 870 -> "2:30 PM" ---- */
  function label(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    var suffix = h >= 12 && h < 24 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m ? ":" + String(m).padStart(2, "0") : "") + " " + suffix;
  }

  /* ---- 480 -> "8:00 AM" ---- */
  function labelFull(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    var suffix = h >= 12 && h < 24 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + String(m).padStart(2, "0") + " " + suffix;
  }

  /* ---- 480 -> "8", 1080 -> "6", 870 -> "2:30" ---- */
  function labelBare(mins) {
    var h = Math.floor(mins / 60) % 12 || 12;
    var m = mins % 60;
    return h + (m ? ":" + String(m).padStart(2, "0") : "");
  }

  /* ---- holiday closures ---- */
  function closedByHoliday(shop, ymd) {
    for (var i = 0; i < holidays.length; i++) {
      var h = holidays[i];
      if (!h.closeShops) continue;
      if (h.shops !== "all" && h.shops !== shop) continue;
      if (h.closedFrom <= ymd && ymd <= h.closedTo) return true;
    }
    return false;
  }

  function shopHours(shop) {
    return overrideHours[shop] || defaultHours[shop] || {};
  }

  function nextOpening(hours, now, shop) {
    for (var i = 0; i < 35; i++) {
      var day = (now.day + i) % 7;
      var slot = hours[day];
      if (!slot) continue;
      if (closedByHoliday(shop, ymdPlus(now, i))) continue;
      if (i === 0 && now.minutes >= slot[0]) continue;
      var when;
      if (i === 0) {
        when = "";
      } else if (i === 1) {
        when = T.tomorrow;
      } else if (i <= 6) {
        when = T.days[day] + " ";
      } else {
        when = new Intl.DateTimeFormat(T.locale, { month: "short", day: "numeric", timeZone: "UTC" })
          .format(new Date(Date.UTC(now.y, now.m - 1, now.d + i))) + " ";
      }
      return T.opens + " " + when + label(slot[0]);
    }
    return T.callForHours;
  }

  function paintStatus(row) {
    var pill = row.querySelector("[data-status]");
    var text = row.querySelector("[data-status-text]");
    if (!pill || !text) return;

    var shop = row.getAttribute("data-shop");
    var hours;
    if (shop && (overrideHours[shop] || defaultHours[shop])) {
      hours = shopHours(shop);
    } else {
      try {
        hours = JSON.parse(row.getAttribute("data-hours") || "{}");
      } catch (err) {
        text.textContent = T.seeHours;
        return;
      }
    }

    var now = dallasNow();
    var today = hours[now.day];
    var isOpen = !!today && now.minutes >= today[0] && now.minutes < today[1] && !closedByHoliday(shop, now.ymd);

    pill.classList.toggle("is-open", isOpen);
    pill.classList.toggle("is-shut", !isOpen);
    text.textContent = isOpen ? T.openUntil + " " + label(today[1]) : nextOpening(hours, now, shop);
  }

  function paintClock(el) {
    el.textContent = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date()) + T.clockSuffix;
  }

  function tick() {
    document.querySelectorAll("[data-hours]").forEach(paintStatus);
    document.querySelectorAll("[data-clock]").forEach(paintClock);
    paintTheme();
  }

  /* ---- "**bold**" and line breaks -> DOM nodes (never innerHTML) ---- */
  function markup(str) {
    var frag = document.createDocumentFragment();
    String(str).split(/(\*\*[^*]+\*\*|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|\n)/).forEach(function (part) {
      if (!part) return;
      var link = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(part);
      if (part === "\n") {
        frag.appendChild(document.createElement("br"));
      } else if (link) {
        var a = document.createElement("a");
        a.href = link[2];
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = link[1];
        frag.appendChild(a);
      } else if (part.length > 4 && part.slice(0, 2) === "**" && part.slice(-2) === "**") {
        var strong = document.createElement("strong");
        strong.textContent = part.slice(2, -2);
        frag.appendChild(strong);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    });
    return frag;
  }

  function applyText(map) {
    map = map || {};
    document.querySelectorAll("[data-edit]").forEach(function (el) {
      if (el.__orig === undefined) el.__orig = el.innerHTML;
      var value = map[el.getAttribute("data-edit")];
      var has = typeof value === "string" && !!value;
      if (has) {
        el.textContent = "";
        el.appendChild(markup(value));
      } else if (el.__changed) {
        el.innerHTML = el.__orig;
      }
      el.__changed = has;
    });
  }

  /* ---- hours -> grouped rows ("Mon – Fri 8:00 AM – 6:00 PM") ---- */
  function groupHours(hours) {
    var groups = [];
    ORDER.forEach(function (day) {
      var slot = hours[day] || null;
      var sig = slot ? slot[0] + "-" + slot[1] : "closed";
      var last = groups[groups.length - 1];
      if (last && last.sig === sig) {
        last.days.push(day);
      } else {
        groups.push({ sig: sig, slot: slot, days: [day] });
      }
    });
    return groups;
  }

  function groupName(g) {
    if (g.days.length === 1) return T.daysLong[g.days[0]];
    return SHORT_DAYS[g.days[0]] + " " + EN_DASH + " " + SHORT_DAYS[g.days[g.days.length - 1]];
  }

  function groupTime(g) {
    return g.slot ? labelFull(g.slot[0]) + " " + EN_DASH + " " + labelFull(g.slot[1]) : T.closed;
  }

  function sameHours(a, b) {
    return JSON.stringify(groupHours(a)) === JSON.stringify(groupHours(b));
  }

  function remember(el, prop) {
    if (el.__orig === undefined) el.__orig = el[prop];
  }

  function restore(el, prop) {
    if (el.__changed) {
      el[prop] = el.__orig;
      el.__changed = false;
    }
  }

  function paintHourLists() {
    document.querySelectorAll("[data-hours-list]").forEach(function (dd) {
      remember(dd, "innerHTML");
      var article = dd.closest("[id]");
      var shop = article && article.id;
      if (!shop || !overrideHours[shop]) { restore(dd, "innerHTML"); return; }
      dd.textContent = "";
      groupHours(overrideHours[shop]).forEach(function (g) {
        var row = document.createElement("span");
        row.className = "hrow";
        var a = document.createElement("span");
        a.textContent = groupName(g);
        var b = document.createElement("span");
        b.textContent = groupTime(g);
        row.appendChild(a);
        row.appendChild(b);
        dd.appendChild(row);
      });
      dd.__changed = true;
    });

    var shops = Object.keys(SHOP_NAMES);
    var anyOverride = !!(overrideHours[shops[0]] || overrideHours[shops[1]]);
    var equal = sameHours(shopHours(shops[0]), shopHours(shops[1]));

    var foot = document.querySelector("[data-foot-hours]");
    if (foot) {
      remember(foot, "innerHTML");
      if (!anyOverride) {
        restore(foot, "innerHTML");
      } else {
        foot.textContent = "";
        var lines = [];
        if (equal) {
          groupHours(shopHours(shops[0])).forEach(function (g) {
            lines.push(groupName(g) + "\u00a0 " + groupTime(g));
          });
        } else {
          shops.forEach(function (s) {
            lines.push(SHOP_NAMES[s] + ":");
            groupHours(shopHours(s)).forEach(function (g) {
              lines.push(groupName(g) + "\u00a0 " + groupTime(g));
            });
          });
        }
        lines.forEach(function (line, i) {
          if (i) foot.appendChild(document.createElement("br"));
          foot.appendChild(document.createTextNode(line));
        });
        foot.__changed = true;
      }
    }

    var short = document.querySelector("[data-hours-short]");
    if (short) {
      remember(short, "textContent");
      if (!anyOverride) {
        restore(short, "textContent");
      } else {
        if (!equal) {
          short.textContent = T.hoursVary;
        } else {
          short.textContent = groupHours(shopHours(shops[0]))
            .filter(function (g) { return g.slot; })
            .map(function (g) {
              var name = g.days.length === 1
                ? SHORT_DAYS[g.days[0]]
                : SHORT_DAYS[g.days[0]] + EN_DASH + SHORT_DAYS[g.days[g.days.length - 1]];
              return name + " " + labelBare(g.slot[0]) + EN_DASH + labelBare(g.slot[1]);
            })
            .join(", ");
        }
        short.__changed = true;
      }
    }

    document.querySelectorAll("[data-hours][data-shop]").forEach(function (row) {
      if (row.__origHours === undefined) row.__origHours = row.getAttribute("data-hours");
      var shop = row.getAttribute("data-shop");
      row.setAttribute("data-hours", overrideHours[shop] ? JSON.stringify(overrideHours[shop]) : row.__origHours);
    });
  }

  /* ---- holiday popup ---- */
  /* every notice shows in English and Spanish, the visitor's page language first */
  var NOTICE_LANGS = LANG === "es" ? ["es", "en"] : ["en", "es"];

  function noticeBlocks(h) {
    return NOTICE_LANGS.map(function (l) {
      return { l: l, title: (h.title && h.title[l]) || "", msg: (h.message && h.message[l]) || "" };
    }).filter(function (b) { return b.title || b.msg; });
  }

  function fmtDay(ymd, l) {
    var p = ymd.split("-");
    return new Intl.DateTimeFormat(STRINGS[l].locale, {
      weekday: "short", month: "short", day: "numeric", timeZone: "UTC"
    }).format(new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])));
  }

  function noticeKey(h) {
    return h.id + "|" + h.closedFrom + "|" + h.closedTo;
  }

  function dismissedKeys() {
    try { return JSON.parse(sessionStorage.getItem("bronco-notices") || "[]"); } catch (e) { return []; }
  }

  function rememberDismissed(keys) {
    try { sessionStorage.setItem("bronco-notices", JSON.stringify(dismissedKeys().concat(keys))); } catch (e) { /* ignore */ }
  }

  var noticeCloser = null;

  function showNotices(list, today) {
    if (PREVIEW && noticeCloser) noticeCloser(true);
    var seen = PREVIEW ? [] : dismissedKeys();
    var active = list.filter(function (h) {
      return h.showFrom <= today && today <= h.closedTo && seen.indexOf(noticeKey(h)) === -1 &&
        !(PREVIEW && previewDismissed[JSON.stringify(h)]) && noticeBlocks(h).length > 0;
    });
    if (!active.length || document.querySelector(".notice-overlay")) return;

    var opener = document.activeElement;
    var overlay = document.createElement("div");
    overlay.className = "notice-overlay";

    var box = document.createElement("div");
    box.className = "notice";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-labelledby", "notice-title-0");

    var x = document.createElement("button");
    x.type = "button";
    x.className = "notice-x";
    x.setAttribute("aria-label", NOTICE_LANGS.map(function (l) { return STRINGS[l].close; }).join(" / "));
    x.textContent = "×";
    box.appendChild(x);

    var kicker = document.createElement("p");
    kicker.className = "mono-label notice-kicker";
    kicker.textContent = NOTICE_LANGS.map(function (l) { return STRINGS[l].notice; }).join(" \u00b7 ");
    box.appendChild(kicker);

    active.forEach(function (h, i) {
      var item = document.createElement("div");
      item.className = "notice-item";

      noticeBlocks(h).forEach(function (b, k) {
        var S = STRINGS[b.l];
        var part = document.createElement("div");
        part.className = "notice-lang";
        part.setAttribute("lang", b.l);

        if (b.title) {
          var title = document.createElement("h2");
          if (!i && !k) title.id = "notice-title-0";
          title.textContent = b.title;
          part.appendChild(title);
        }

        var range = h.closedFrom === h.closedTo
          ? fmtDay(h.closedFrom, b.l)
          : fmtDay(h.closedFrom, b.l) + " " + EN_DASH + " " + fmtDay(h.closedTo, b.l);
        var prefix = h.shops !== "all" ? SHOP_NAMES[h.shops] + ": " : "";
        var dates = document.createElement("p");
        dates.className = "notice-dates";
        dates.textContent = prefix + (h.closeShops ? S.closed + " " : "") + range;
        part.appendChild(dates);

        if (h.shops !== "all" && h.openFrom && h.openTo) {
          var other = h.shops === "oak-cliff" ? "west-dallas" : "oak-cliff";
          var openRange = h.openFrom === h.openTo
            ? fmtDay(h.openFrom, b.l)
            : fmtDay(h.openFrom, b.l) + " " + EN_DASH + " " + fmtDay(h.openTo, b.l);
          var openLine = document.createElement("p");
          openLine.className = "notice-dates is-open";
          openLine.textContent = SHOP_NAMES[other] + ": " + S.open + " " + openRange;
          part.appendChild(openLine);
        }

        if (b.msg) {
          var p = document.createElement("p");
          p.className = "notice-msg";
          p.appendChild(markup(b.msg));
          part.appendChild(p);
        }
        item.appendChild(part);
      });
      box.appendChild(item);
    });

    var ok = document.createElement("button");
    ok.type = "button";
    ok.className = "btn btn-ember notice-ok";
    ok.textContent = NOTICE_LANGS.map(function (l) { return STRINGS[l].gotIt; }).join(" \u00b7 ");
    box.appendChild(ok);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.documentElement.classList.add("notice-open");
    if (!PREVIEW) ok.focus();

    function close(silent) {
      if (!silent) {
        if (PREVIEW) active.forEach(function (h) { previewDismissed[JSON.stringify(h)] = true; });
        else rememberDismissed(active.map(noticeKey));
      }
      noticeCloser = null;
      document.removeEventListener("keydown", onKey);
      overlay.remove();
      document.documentElement.classList.remove("notice-open");
      if (!PREVIEW && opener && opener.focus) opener.focus();
    }
    noticeCloser = close;

    function onKey(e) {
      if (e.key === "Escape") { close(false); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === x) { e.preventDefault(); ok.focus(); }
      else if (!e.shiftKey && document.activeElement === ok) { e.preventDefault(); x.focus(); }
    }

    ok.addEventListener("click", function () { close(false); });
    x.addEventListener("click", function () { close(false); });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(false); });
    document.addEventListener("keydown", onKey);
  }

  /* ---- holiday themes: on between the dates set in /admin/ ---- */
  var THEMES = {
    christmas: { fx: "snow", colors: ["#9DB7D8", "#C9D9EE", "#B7C9E2"], icon: "snow" },
    thanksgiving: { fx: "leaves", colors: ["#B4531A", "#E8A933", "#8B4513", "#C0392B"], icon: "leaf" },
    newyear: { fx: "confetti", colors: ["#F2C230", "#2B3FD6", "#8E9AC0", "#D94BA0"], icon: "star" },
    july4: { fx: "confetti", colors: ["#B22234", "#0A3161", "#7FA3E0"], icon: "star" },
    memorial: { fx: null, icon: "star" },
    labor: { fx: null, icon: "star" },
    halloween: { fx: null, icon: "star" },
    fiesta: { fx: "confetti", colors: ["#006847", "#CE1126", "#F2C230"], icon: "star" }
  };

  var ICONS = {
    snow: "M12 2v20M4.2 7l15.6 10M19.8 7L4.2 17M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5",
    leaf: "M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19c3-5 6-8 10-10",
    star: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"
  };

  var themeKey = "";
  var fx = { raf: 0, canvas: null, onResize: null };

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function activeThemeNotice() {
    var now = dallasNow();
    var stamp = now.ymd + "T" + pad2(Math.floor(now.minutes / 60)) + ":" + pad2(now.minutes % 60);
    var best = null;
    holidays.forEach(function (h) {
      if (!h.theme || !THEMES[h.theme] || !h.themeFrom || !h.themeTo) return;
      if (h.themeFrom <= stamp && stamp <= h.themeTo && (!best || h.themeFrom > best.themeFrom)) best = h;
    });
    return best;
  }

  function stopFx() {
    if (fx.raf) cancelAnimationFrame(fx.raf);
    if (fx.onResize) window.removeEventListener("resize", fx.onResize);
    if (fx.canvas) fx.canvas.remove();
    fx = { raf: 0, canvas: null, onResize: null };
  }

  function startFx(type, colors) {
    stopFx();
    if (!type || !colors || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var canvas = document.createElement("canvas");
    canvas.className = "theme-fx";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();

    function spawn(anywhere) {
      var big = type === "snow" ? 1.5 + Math.random() * 2.6 : 5 + Math.random() * 5;
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : -12,
        r: big,
        vy: (type === "snow" ? 0.5 : 0.8) + Math.random() * (type === "confetti" ? 1.4 : 1),
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.02,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.08,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    }

    var count = W < 700 ? 26 : 52;
    var parts = [];
    for (var i = 0; i < count; i++) parts.push(spawn(true));

    function frame() {
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p, idx) {
        p.sway += p.swaySpeed;
        p.y += p.vy;
        p.x += Math.sin(p.sway) * 0.7;
        p.rot += p.vr;
        if (p.y > H + 14) parts[idx] = spawn(false);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = type === "snow" ? 0.85 : 0.9;
        if (type === "snow") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === "leaves") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        }
        ctx.restore();
      });
      fx.raf = requestAnimationFrame(frame);
    }

    fx.canvas = canvas;
    fx.onResize = size;
    window.addEventListener("resize", size);
    frame();
  }

  function removeBanner() {
    var old = document.querySelector(".theme-banner");
    if (old) old.remove();
  }

  function showBanner(text, icon) {
    removeBanner();
    if (!text) return;
    var bar = document.createElement("div");
    bar.className = "theme-banner";
    bar.setAttribute("role", "note");
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", ICONS[icon] || ICONS.star);
    svg.appendChild(path);
    var span = document.createElement("span");
    span.textContent = text;
    bar.appendChild(svg);
    bar.appendChild(span);
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* Christmas extras: a Santa flying across the page and a Santa hat on the logo */
  var SANTA_SVG =
    '<svg viewBox="0 0 230 96" aria-hidden="true" focusable="false"><g class="santa-bob">' +
    '<path d="M96 54h34" stroke="#8B6B3E" stroke-width="2" fill="none"/>' +
    '<ellipse cx="158" cy="52" rx="25" ry="12" fill="#8B5A2B"/>' +
    '<path d="M141 60l-3 20M151 62l-2 20M167 62l2 20M178 60l4 20" stroke="#6B4423" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M176 46l10-14" stroke="#8B5A2B" stroke-width="9" stroke-linecap="round"/>' +
    '<ellipse cx="192" cy="29" rx="11" ry="8" fill="#8B5A2B"/>' +
    '<circle cx="201" cy="30" r="3.6" fill="#E53935"/><circle cx="190" cy="26" r="1.6" fill="#1B1B1B"/>' +
    '<path d="M188 21l-4-12m4 12l-9-8m9 8l3-13m-3 13l6-10" stroke="#6B4423" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M10 48h88c0 16-12 26-28 26H28C18 74 10 64 10 48z" fill="#C62828"/>' +
    '<path d="M10 48h88" stroke="#F2C230" stroke-width="3"/>' +
    '<path d="M4 82h96c8 0 10-9 3-12" stroke="#D4A017" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '<path d="M28 74v8M80 74v8" stroke="#D4A017" stroke-width="3"/>' +
    '<path d="M14 48c0-16 8-24 20-18l4 18z" fill="#8D6E4A"/>' +
    '<path d="M46 48c0-14 7-22 17-22s17 8 17 22z" fill="#D32F2F"/>' +
    '<circle cx="63" cy="22" r="8" fill="#F6D2B1"/>' +
    '<path d="M55 24c3 12 13 12 16 0z" fill="#FFFFFF"/>' +
    '<path d="M54 19q9-22 21-8l-4 8z" fill="#D32F2F"/>' +
    '<rect x="53" y="17" width="20" height="5" rx="2.5" fill="#FFFFFF"/>' +
    '<circle cx="77" cy="11" r="4" fill="#FFFFFF"/>' +
    '<path d="M80 38l14-6" stroke="#D32F2F" stroke-width="5" stroke-linecap="round"/>' +
    '</g></svg>';

  function setSanta(on) {
    var el = document.querySelector(".theme-santa");
    if (!on) { if (el) el.remove(); return; }
    if (el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el = document.createElement("div");
    el.className = "theme-santa";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = SANTA_SVG;
    document.body.appendChild(el);
  }

  var HOLIDAY_LOGOS = {
    christmas: { src: "/logo-christmas.png", w: 300, h: 245 }
  };

  function setLogo(theme) {
    var img = document.querySelector(".head .brand-logo");
    if (!img) return;
    if (img.getAttribute("data-orig-src") === null) {
      img.setAttribute("data-orig-src", img.getAttribute("src"));
      img.setAttribute("data-orig-w", img.getAttribute("width"));
      img.setAttribute("data-orig-h", img.getAttribute("height"));
    }
    var def = HOLIDAY_LOGOS[theme];
    if (def) {
      img.setAttribute("src", def.src);
      img.setAttribute("width", def.w);
      img.setAttribute("height", def.h);
      img.classList.add("is-holiday");
    } else {
      img.setAttribute("src", img.getAttribute("data-orig-src"));
      img.setAttribute("width", img.getAttribute("data-orig-w"));
      img.setAttribute("height", img.getAttribute("data-orig-h"));
      img.classList.remove("is-holiday");
    }
    document.documentElement.classList.toggle("has-holiday-logo", !!def);
  }

  var SCENES = {
    christmas: { src: "/christmas-scene.jpg", w: 728, h: 475 },
    thanksgiving: { src: "/thanksgiving-scene.jpg", w: 530, h: 267 }
  };

  function setScene(theme) {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    var el = hero.querySelector(".theme-scene");
    if (el && el.getAttribute("data-scene") !== theme) { el.remove(); el = null; }
    if (!theme || !SCENES[theme]) {
      hero.classList.remove("has-scene");
      return;
    }
    if (el) return;
    var def = SCENES[theme];
    el = document.createElement("div");
    el.className = "theme-scene";
    el.setAttribute("data-scene", theme);
    el.setAttribute("aria-hidden", "true");
    var img = document.createElement("img");
    img.src = def.src;
    img.alt = "";
    img.width = def.w;
    img.height = def.h;
    img.decoding = "async";
    el.appendChild(img);
    hero.appendChild(el);
    hero.classList.add("has-scene");
  }

  function paintTheme() {
    var h = activeThemeNotice();
    var def = h ? THEMES[h.theme] : null;
    var banner = h && h.bannerOn && h.banner ? (h.banner[LANG] || h.banner.en || "") : "";
    var wantFx = !!(h && def.fx && h.themeEffect !== false);
    var wantSanta = !!(h && h.theme === "christmas" && h.themeSanta === true);
    var wantScene = h && SCENES[h.theme] && h.themeScene !== false ? h.theme : "";
    var wantLogo = h && h.theme === "christmas" && h.themeHat !== false ? "christmas" : "";
    var key = h ? [h.theme, banner, wantFx, wantSanta, wantLogo, wantScene].join("|") : "";
    if (key === themeKey) return;
    themeKey = key;

    if (!h) {
      document.documentElement.removeAttribute("data-theme");
      removeBanner();
      stopFx();
      setSanta(false);
      setLogo("");
      setScene("");
      return;
    }
    document.documentElement.setAttribute("data-theme", h.theme);
    showBanner(banner, def.icon);
    if (wantFx) startFx(def.fx, def.colors); else stopFx();
    setSanta(wantSanta);
    setLogo(wantLogo);
    setScene(wantScene);
  }

  /* ---- admin-managed content ---- */
  function applyContent(data) {
    if (!data) return;
    applyText(data.text && data.text[LANG]);

    overrideHours = {};
    if (data.hours) {
      Object.keys(SHOP_NAMES).forEach(function (shop) {
        if (data.hours[shop]) overrideHours[shop] = data.hours[shop];
      });
    }
    holidays = Array.isArray(data.holidays) ? data.holidays : [];

    paintHourLists();
    tick();
    showNotices(holidays, dallasNow().ymd);
  }

  function loadContent() {
    if (!window.fetch) return;
    fetch("r24/content.json")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(applyContent)
      .catch(function () { /* keep the defaults baked into the HTML */ });
  }

  /* ---- admin live preview (inside the admin iframe only) ---- */
  function initPreview() {
    var base = location.pathname.indexOf("/_site/") === 0 ? "/_site" : "";
    document.querySelectorAll("a.lang-switch").forEach(function (a) {
      a.setAttribute("href", base + a.getAttribute("href").split("?")[0] + "?preview=1");
    });

    window.addEventListener("message", function (e) {
      if (e.origin !== location.origin || e.source !== window.parent || !e.data) return;

      if (e.data.type === "bronco-preview" && e.data.content) {
        previewDate = e.data.content.previewDate || null;
        applyContent(e.data.content);
      } else if (e.data.type === "bronco-focus") {
        var el = null;
        if (e.data.key && /^[a-z0-9.-]+$/.test(e.data.key)) el = document.querySelector('[data-edit="' + e.data.key + '"]');
        else if (e.data.id && /^[a-z0-9-]+$/.test(e.data.id)) el = document.getElementById(e.data.id);
        if (!el) return;
        var box = el.getBoundingClientRect();
        window.scrollTo({ top: Math.max(0, box.top + window.scrollY - (window.innerHeight - box.height) / 2), behavior: "smooth" });
        el.classList.add("preview-flash");
        setTimeout(function () { el.classList.remove("preview-flash"); }, 1800);
      }
    });

    window.parent.postMessage({ type: "bronco-preview-ready", lang: LANG }, location.origin);
  }

  /* ---- reveal on scroll ---- */
  function initReveal() {
    var targets = document.querySelectorAll(
      ".sec-head, .svc, .plate, .shop, .step, .closer-in"
    );
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) return;

    targets.forEach(function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- boot ---- */
  document.querySelectorAll("[data-shop][data-hours]").forEach(function (row) {
    try { defaultHours[row.getAttribute("data-shop")] = JSON.parse(row.getAttribute("data-hours")); } catch (e) { /* ignore */ }
  });

  tick();
  setInterval(tick, 30000);
  initReveal();
  if (PREVIEW) initPreview(); else loadContent();

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();

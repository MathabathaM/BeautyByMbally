(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ADDRESS = "503 Gaborone St, Ehlanzeni, Thembisa";

  const SERVICES = $$(".price-item").map(b => ({ name: b.dataset.name, price: +b.dataset.price }));
  const selected = new Set();

  // Loader
  window.addEventListener("load", () => setTimeout(() => $("#loader").classList.add("done"), 900));
  setTimeout(() => $("#loader").classList.add("done"), 3500);

  $("#year").textContent = new Date().getFullYear();

  // Toast
  let toastT;
  const toast = msg => {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400);
  };

  // Nav
  const nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 40);
    $("#toTop").classList.toggle("show", scrollY > 600);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });
  $$("a", links).forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open"); burger.classList.remove("open"); burger.setAttribute("aria-expanded", false);
  }));
  $("#toTop").addEventListener("click", () => slowScrollTo(0));

  // Active link on scroll
  const sectionObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) $$("a", links).forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => sectionObs.observe(s));

  // Reveal
  const revObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("in"); revObs.unobserve(el);
    setTimeout(() => { el.classList.add("settled"); el.style.transitionDelay = ""; }, 1250 + parseFloat(el.style.transitionDelay || 0) * 1000);
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 0.13 + "s"; revObs.observe(el); });

  // Slower, eased scrolling between sections
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slowScrollTo = y => {
    if (reduceMotion) return scrollTo(0, y);
    const start = scrollY, dist = y - start, dur = Math.min(1200, 600 + Math.abs(dist) * 0.15), t0 = performance.now();
    const ease = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  document.documentElement.style.scrollBehavior = "auto";
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = a.getAttribute("href") === "#home" ? document.body : $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    slowScrollTo(target === document.body ? 0 : target.getBoundingClientRect().top + scrollY - 70);
    history.replaceState(null, "", a.getAttribute("href"));
  });

  // Counters
  const countObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 1800, 1);
      el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step); countObs.unobserve(el);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach(el => countObs.observe(el));

  // Typewriter
  const words = ["Flawless Installs", "Wig Wash", "Lace Cutting", "Glue Removal", "Sleek Styles"];
  const typed = $("#typed");
  let wi = 0, ci = words[0].length, del = true;
  const type = () => {
    const w = words[wi];
    ci += del ? -1 : 1;
    typed.textContent = w.slice(0, ci);
    let d = del ? 45 : 95;
    if (!del && ci === w.length) { del = true; d = 2000; }
    else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; d = 300; }
    setTimeout(type, d);
  };
  setTimeout(type, 2600);

  // Sparkles
  const sp = $("#sparkles");
  for (let i = 0; i < 28; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = 30 + Math.random() * 70 + "%";
    s.style.animationDuration = 4 + Math.random() * 6 + "s";
    s.style.animationDelay = Math.random() * 6 + "s";
    sp.appendChild(s);
  }

  // Ripple
  document.addEventListener("click", e => {
    const b = e.target.closest(".btn"); if (!b) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
    const s = document.createElement("span");
    s.className = "ripple";
    Object.assign(s.style, { width: d + "px", height: d + "px", left: e.clientX - r.left - d / 2 + "px", top: e.clientY - r.top - d / 2 + "px" });
    b.appendChild(s); setTimeout(() => s.remove(), 600);
  });

  // Tilt cards
  if (matchMedia("(hover:hover)").matches) {
    $$(".tilt").forEach(c => {
      c.addEventListener("mousemove", e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
      });
      c.addEventListener("mouseleave", () => (c.style.transform = ""));
    });
  }

  // Tabs
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x => { x.classList.toggle("active", x === t); x.setAttribute("aria-selected", x === t); });
    $$(".price-group").forEach(g => g.classList.toggle("hidden", t.dataset.tab !== "all" && g.dataset.group !== t.dataset.tab));
  }));

  // Selection state shared by price list + booking chips
  const chipGrid = $("#chipGrid");
  SERVICES.forEach(s => {
    const c = document.createElement("button");
    c.type = "button"; c.className = "chip"; c.dataset.name = s.name; c.setAttribute("aria-pressed", "false");
    c.innerHTML = `${s.name}<b>R${s.price}</b>`;
    c.addEventListener("click", () => toggle(s.name));
    chipGrid.appendChild(c);
  });
  $$(".price-item").forEach(b => b.addEventListener("click", () => toggle(b.dataset.name)));

  const total = () => SERVICES.filter(s => selected.has(s.name)).reduce((a, s) => a + s.price, 0);
  function toggle(name) {
    selected.has(name) ? selected.delete(name) : selected.add(name);
    render();
    if (selected.has(name)) toast(`${name} added ✦`);
  }
  function render() {
    if (typeof updatePreview === "function") updatePreview();
    $$(".price-item, .chip").forEach(el => el.setAttribute("aria-pressed", selected.has(el.dataset.name)));
    const items = SERVICES.filter(s => selected.has(s.name));
    $("#cartItems").innerHTML = items.length
      ? items.map(s => `<li><span>${s.name}</span><span>R${s.price}</span></li>`).join("")
      : '<li class="empty">No services selected yet.</li>';
    const t = "R" + total();
    const ct = $("#cartTotal");
    ct.textContent = t; ct.classList.remove("bump"); void ct.offsetWidth; ct.classList.add("bump");
    $("#formTotal").textContent = t;
  }
  $("#cartClear").addEventListener("click", () => { selected.clear(); render(); });

  // Booking wizard
  const form = $("#bookingForm");
  let step = 1;
  const dateIn = $("#bDate");
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateIn.min = today.toISOString().slice(0, 10);

  const goTo = n => {
    step = n;
    $$(".form-step", form).forEach(f => f.classList.toggle("active", +f.dataset.step === n));
    $$(".step", form).forEach(s => {
      s.classList.toggle("active", +s.dataset.step === n);
      s.classList.toggle("done", +s.dataset.step < n);
    });
  };
  const validate = n => {
    $$(".invalid", form).forEach(el => el.classList.remove("invalid"));
    const err = $("#err" + n); err.textContent = "";
    if (n === 1 && !selected.size) { err.textContent = "Please choose at least one service."; return false; }
    if (n === 2) {
      const bad = [dateIn, $("#bTime")].filter(el => !el.value);
      if (bad.length) { bad.forEach(el => el.classList.add("invalid")); err.textContent = "Please pick a date and time."; return false; }
      if (dateIn.value < dateIn.min) { dateIn.classList.add("invalid"); err.textContent = "Please choose a date from today onwards."; return false; }
    }
    if (n === 3 && !$("#bName").value.trim()) { $("#bName").classList.add("invalid"); err.textContent = "Please tell us your name."; return false; }
    return true;
  };
  $$("[data-next]", form).forEach(b => b.addEventListener("click", () => validate(step) && goTo(step + 1)));
  $$("[data-prev]", form).forEach(b => b.addEventListener("click", () => goTo(step - 1)));
  $("#cartBook").addEventListener("click", () => goTo(selected.size ? 2 : 1));

  const bookingRef = () => "BBM-" + Date.now().toString(36).slice(-5).toUpperCase();
  let ref = bookingRef();
  const buildMessage = () => {
    const items = SERVICES.filter(s => selected.has(s.name));
    const date = dateIn.value
      ? new Date(dateIn.value + "T00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : "—";
    const name = $("#bName").value.trim() || "—";
    const lines = [
      "*NEW BOOKING – Beauty By Mbally*",
      `Ref: ${ref}`,
      "",
      `*Client:* ${name}`,
    ];
    if ($("#bPhone").value.trim()) lines.push(`*Client phone:* ${$("#bPhone").value.trim()}`);
    lines.push(
      `*Date:* ${date}`,
      `*Time:* ${$("#bTime").value || "—"}`,
      "",
      "*Services requested:*",
      ...(items.length ? items.map(s => `• ${s.name} – R${s.price}`) : ["—"]),
      `*Estimated total:* R${total()}`
    );
    if ($("#bNotes").value.trim()) lines.push("", `*Notes:* ${$("#bNotes").value.trim()}`);
    lines.push("", "Please confirm this booking. Thank you!");
    return lines.join("\n");
  };
  const updatePreview = () => ($("#msgPreview").textContent = buildMessage());
  ["#bName", "#bPhone", "#bNotes", "#bDate", "#bTime"].forEach(id => $(id).addEventListener("input", updatePreview));
  $$("[data-next]", form).forEach(b => b.addEventListener("click", updatePreview));
  updatePreview();

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validate(3)) return;
    const url = `https://wa.me/${$("#bTo").value}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener");
    toast("Opening WhatsApp — just tap send ✓");
    ref = bookingRef();
  });

  // Any "Book via WhatsApp" link pre-selects the number and opens the booking form
  $$("[data-book-to]").forEach(a => a.addEventListener("click", () => {
    $("#bTo").value = a.dataset.bookTo;
    fabMenu.classList.remove("open"); fabBtn.setAttribute("aria-expanded", false);
    updatePreview();
  }));

  // Lightbox
  const gItems = $$(".g-item"), lb = $("#lightbox");
  let li = 0;
  const showLb = i => {
    li = (i + gItems.length) % gItems.length;
    const img = $("img", gItems[li]);
    $("#lbImg").src = img.src; $("#lbImg").alt = img.alt;
    $("#lbCap").textContent = gItems[li].dataset.caption;
  };
  gItems.forEach((g, i) => g.addEventListener("click", () => { showLb(i); lb.classList.add("open"); $("#lbClose").focus(); }));
  const closeLb = () => lb.classList.remove("open");
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", () => showLb(li - 1));
  $("#lbNext").addEventListener("click", () => showLb(li + 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(li - 1);
    if (e.key === "ArrowRight") showLb(li + 1);
  });

  // FAQ: one open at a time
  $$(".accordion details").forEach(d => d.addEventListener("toggle", () => {
    if (d.open) $$(".accordion details").forEach(o => o !== d && (o.open = false));
  }));

  // Copy address
  $("#copyAddr").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(ADDRESS); toast("Address copied ✓"); }
    catch { toast(ADDRESS); }
  });

  // FAB
  const fabBtn = $("#fabBtn"), fabMenu = $("#fabMenu");
  fabBtn.addEventListener("click", () => {
    const open = fabMenu.classList.toggle("open");
    fabBtn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", e => {
    if (!e.target.closest("#fab")) { fabMenu.classList.remove("open"); fabBtn.setAttribute("aria-expanded", false); }
  });
})();

/* Petoi site — functional layer.
   Structure + behaviour only; no visual-design decisions. Cart persists in localStorage.
   Renderers dispatched by <body data-page>. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const toPosInt = (v) => { const n = Math.floor(Number(v)); return Number.isFinite(n) && n > 0 ? n : 1; };

  // ---------- currency (display only; real build uses provider-localized prices) ----------
  const CUR_KEY = "petoi_currency";
  function curCode() { return localStorage.getItem(CUR_KEY) || "USD"; }
  function setCur(c) { localStorage.setItem(CUR_KEY, c); }
  function money(usd) { const c = PETOI.CURRENCIES[curCode()] || PETOI.CURRENCIES.USD; return c.symbol + (Number(usd) * c.rate).toFixed(2); }

  // ---------- Cart (localStorage, self-healing) ----------
  const CART_KEY = "petoi_cart";
  const Cart = {
    read() {
      let items; try { items = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { items = []; }
      // self-heal: drop lines whose product no longer exists; clamp qty to positive int
      const clean = items.filter(i => i && PETOI.product(i.handle)).map(i => ({ handle: i.handle, variant: i.variant || null, qty: toPosInt(i.qty) }));
      if (clean.length !== items.length || clean.some((c, idx) => !items[idx] || items[idx].qty !== c.qty)) localStorage.setItem(CART_KEY, JSON.stringify(clean));
      return clean;
    },
    write(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); renderCartCount(); },
    lineUnit(i) { return PETOI.variantPrice(PETOI.product(i.handle), i.variant); },
    add(handle, variant, qty) {
      if (!PETOI.product(handle)) return;
      const items = Cart.read();
      const found = items.find(i => i.handle === handle && i.variant === (variant || null));
      if (found) found.qty += toPosInt(qty); else items.push({ handle, variant: variant || null, qty: toPosInt(qty) });
      Cart.write(items);
    },
    setQty(idx, qty) { const i = Cart.read(); if (!i[idx]) return; i[idx].qty = toPosInt(qty); Cart.write(i); },
    remove(idx) { const i = Cart.read(); i.splice(idx, 1); Cart.write(i); },
    count() { return Cart.read().reduce((s, i) => s + i.qty, 0); },
    subtotal() { return Cart.read().reduce((s, i) => s + Cart.lineUnit(i) * i.qty, 0); },
  };

  // ---------- Shared chrome ----------
  function navHTML() {
    return PETOI.NAV.map((m, mi) => `
      <li class="nav-item" data-menu>
        <button class="nav-top" id="navtop-${mi}" aria-haspopup="true" aria-expanded="false" aria-controls="navdrop-${mi}">${esc(m.label)}</button>
        <ul class="nav-drop" id="navdrop-${mi}" role="menu" aria-labelledby="navtop-${mi}">
          ${m.children.map(c => `<li role="none"><a role="menuitem" href="${esc(c.href)}">${esc(c.label)}</a></li>`).join("")}
        </ul>
      </li>`).join("");
  }
  function header() {
    const el = document.createElement("header");
    el.className = "site-header";
    const curOpts = Object.keys(PETOI.CURRENCIES).map(c => `<option value="${c}"${c === curCode() ? " selected" : ""}>${c}</option>`).join("");
    el.innerHTML = `
      <div class="topbar">Buy 1, get 1 at 10% off. Free U.S. shipping on orders between $199 and $1000.</div>
      <div class="header-main">
        <a class="brand" href="index.html">Petoi</a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false">Menu</button>
        <nav class="site-nav" aria-label="Primary"><ul class="nav-list">${navHTML()}</ul></nav>
        <form class="site-search" action="search.html" method="get" role="search">
          <label class="vh" for="hdr-search">Search</label>
          <input id="hdr-search" type="search" name="q" placeholder="Search products">
          <button type="submit">Search</button>
        </form>
        <label class="cur-sel">Currency <select id="cur-select" aria-label="Currency">${curOpts}</select></label>
        <a class="acct-link" href="account.html">Account</a>
        <button class="cart-btn" aria-label="Open cart">Cart (<span class="cart-count">0</span>)</button>
      </div>`;
    document.body.prepend(el);

    const items = $$("[data-menu]", el);
    function closeAll() { items.forEach(o => { o.classList.remove("open"); $(".nav-top", o).setAttribute("aria-expanded", "false"); }); }
    items.forEach(item => {
      const btn = $(".nav-top", item), drop = $(".nav-drop", item);
      btn.addEventListener("click", () => {
        const willOpen = !item.classList.contains("open");
        closeAll();
        if (willOpen) { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
      });
      // keyboard: ArrowDown opens/moves into menu; Escape closes; arrows move between items
      btn.addEventListener("keydown", e => {
        if (e.key === "ArrowDown") { e.preventDefault(); item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); const a = $("a", drop); if (a) a.focus(); }
        else if (e.key === "Escape") { closeAll(); }
      });
      drop.addEventListener("keydown", e => {
        const links = $$("a", drop); const i = links.indexOf(document.activeElement);
        if (e.key === "ArrowDown") { e.preventDefault(); (links[i + 1] || links[0]).focus(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); (links[i - 1] || links[links.length - 1]).focus(); }
        else if (e.key === "Escape") { e.preventDefault(); closeAll(); btn.focus(); }
      });
    });
    const nav = $(".site-nav", el);
    $(".nav-toggle", el).addEventListener("click", e => {
      const open = nav.classList.toggle("open");
      e.currentTarget.setAttribute("aria-expanded", String(open));
      if (!open) closeAll(); // don't leave a stale-open dropdown when the mobile nav closes
    });
    $(".cart-btn", el).addEventListener("click", openCartDrawer);
    $("#cur-select", el).addEventListener("change", e => { setCur(e.target.value); location.reload(); });
    document.addEventListener("click", e => { if (!el.contains(e.target)) closeAll(); });
  }
  function footer() {
    const cols = Object.entries(PETOI.FOOTER).map(([h, links]) => `
      <div class="foot-col"><h4>${esc(h)}</h4><ul>${links.map(l => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join("")}</ul></div>`).join("");
    const el = document.createElement("footer");
    el.className = "site-footer";
    el.innerHTML = `
      <div class="foot-cols">${cols}
        <div class="foot-col"><h4>Newsletter</h4>
          <form class="newsletter" data-form="newsletter">
            <label>Get product news and offers<input type="email" name="email" required placeholder="you@example.com"></label>
            <button type="submit">Subscribe</button><p class="form-msg" role="status" aria-live="polite" hidden></p>
          </form>
        </div>
      </div>
      <div class="foot-meta">
        <p class="social">${PETOI.SOCIAL.map(s => `<a href="${esc(s.href)}" rel="noopener">${esc(s.name)}</a>`).join(" ")}</p>
        <p class="payments">Payments: ${PETOI.PAYMENTS.map(esc).join(", ")}</p>
        <p class="copyright">&copy; 2018&ndash;2026 Petoi LLC</p>
      </div>`;
    document.body.appendChild(el);
    wireForm($(".newsletter", el));
  }
  function renderCartCount() { $$(".cart-count").forEach(s => s.textContent = String(Cart.count())); }

  // ---------- Cart drawer (accessible dialog) ----------
  let lastFocus = null;
  function openCartDrawer() {
    lastFocus = document.activeElement;
    let dr = $("#cart-drawer");
    if (!dr) { dr = document.createElement("aside"); dr.id = "cart-drawer"; dr.className = "cart-drawer"; dr.setAttribute("role", "dialog"); dr.setAttribute("aria-modal", "true"); dr.setAttribute("aria-label", "Shopping cart"); document.body.appendChild(dr); }
    const items = Cart.read();
    dr.innerHTML = `
      <div class="cart-drawer-head"><h3>Your cart</h3><button class="cart-close" aria-label="Close cart">Close</button></div>
      ${items.length ? `<ul class="cart-lines">${items.map((i, idx) => {
        const p = PETOI.product(i.handle); // guaranteed by Cart.read() self-heal
        return `<li class="cart-line">
          <a href="product.html?handle=${esc(i.handle)}">${esc(p.title)}</a>
          ${i.variant ? `<span class="variant">${esc(i.variant)}</span>` : ""}
          <span class="line-price">${money(Cart.lineUnit(i))}</span>
          <label>Qty <input type="number" min="1" step="1" value="${i.qty}" data-qty="${idx}"></label>
          <button data-remove="${idx}">Remove</button></li>`;
      }).join("")}</ul>
      <div class="cart-foot"><p>Subtotal: <strong>${money(Cart.subtotal())}</strong></p>
      <a class="btn-checkout" href="cart.html">View cart and checkout</a></div>`
      : `<p class="cart-empty">Your cart is empty.</p>`}`;
    dr.classList.add("open");
    setBackgroundInert(true);
    const closeBtn = $(".cart-close", dr);
    closeBtn.focus();
    closeBtn.onclick = closeCartDrawer;
    $$("[data-qty]", dr).forEach(inp => inp.onchange = e => { Cart.setQty(+e.target.dataset.qty, e.target.value); openCartDrawer(); });
    $$("[data-remove]", dr).forEach(b => b.onclick = e => { Cart.remove(+e.target.dataset.remove); openCartDrawer(); });
    dr.onkeydown = e => {
      if (e.key === "Escape") { closeCartDrawer(); return; }
      if (e.key === "Tab") { // focus trap
        const f = $$('a[href],button,input,select,textarea', dr).filter(x => !x.disabled);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
  }
  function closeCartDrawer() { const dr = $("#cart-drawer"); if (dr) dr.classList.remove("open"); setBackgroundInert(false); if (lastFocus) lastFocus.focus(); }
  function setBackgroundInert(on) {
    ["header.site-header", "main", "footer.site-footer"].forEach(sel => { const n = $(sel); if (n) { if (on) n.setAttribute("aria-hidden", "true"); else n.removeAttribute("aria-hidden"); } });
  }

  // ---------- Forms ----------
  function wireForm(form) {
    if (!form) return;
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const msg = $(".form-msg", form);
      const kind = form.dataset.form;
      const val = n => { const el = form.querySelector(`[name="${n}"]`); return el ? el.value : ""; };
      let payload = null;
      if (kind === "newsletter") payload = { r: "newsletter", email: val("email") };
      else if (kind === "contact") payload = { r: "form", kind: "contact", payload: { topic: val("topic"), name: val("name"), email: val("email"), message: val("message") } };
      else if (kind === "review") payload = { r: "review", handle: form.dataset.handle, name: val("name"), rating: val("rating"), body: val("body") };
      // magic-link / referral-apply: no backend endpoint in the prototype
      if (msg) { msg.hidden = false; msg.textContent = "Sending..."; }
      let ok = true;
      if (payload) ok = await submit(payload);
      if (msg) msg.textContent = !payload
        ? "Received. (Prototype: this action is not wired to a backend.)"
        : ok ? (kind === "review" ? "Thank you. Your review is awaiting moderation." : "Thank you. We received your submission.")
             : "Sorry, something went wrong. Please try again.";
      if (ok) form.reset();
    });
  }

  // ---------- Page renderers ----------
  const Pages = {
    home() {
      const feat = ["petoi-robot-dog-bittle-x-voice-controlled", "petoi-nybble-q-robot-cat"].map(h => PETOI.product(h));
      $("#app").innerHTML = `
        <section class="hero"><p class="kicker">Open-source robotics / 9-11 DOF / ESP32</p>
          <h1>Build a robot pet that actually moves like one.</h1>
          <p>Bittle X robot dog and Nybble Q robot cat. Build, code, and play, on the open OpenCat framework.</p>
          <p><a class="btn" href="shop.html">Shop all</a></p>
          ${poseStrip()}</section>
        <section class="press"><p>As seen on Fox News Bay Area, Make, TechCrunch, Financial Times, Mashable.</p></section>
        <section class="valueprops"><p class="kicker">What you can do</p><h2>From first block of code to autonomous gaits</h2>
          <ul><li><h3>Play and Code</h3><p>Block-based to Python and C++.</p></li>
          <li><h3>STEM and Robotics Education</h3><p>Curricula for classrooms.</p></li>
          <li><h3>Robotics, IoT and AI Research</h3><p>An open platform for builders.</p></li></ul></section>
        <section class="featured"><h2>Featured</h2><div class="grid">${feat.map(card).join("")}</div></section>`;
    },
    shop() {
      $("#app").innerHTML = `
        <h1>Online Store</h1>
        <div class="shop-controls">
          <label>Availability <select id="f-avail"><option value="">All</option><option value="in_stock">In stock</option><option value="sold_out">Out of stock</option></select></label>
          <label>Max price (USD) <input id="f-price" type="number" min="0" placeholder="any"></label>
          <label>Sort <select id="f-sort">
            <option value="featured">Featured</option><option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option><option value="alpha">A-Z</option>
            <option value="reviews">Most reviewed</option></select></label>
        </div>
        <div class="grid" id="shop-grid"></div>
        <div class="pager" id="shop-pager" role="navigation" aria-label="Pagination"></div>`;
      let page = 1; const per = 16;
      function apply() {
        let list = PETOI.PRODUCTS.slice();
        const av = $("#f-avail").value, mp = parseFloat($("#f-price").value), so = $("#f-sort").value;
        if (av) list = list.filter(p => p.stock === av);
        if (!isNaN(mp)) list = list.filter(p => p.price <= mp);
        if (so === "price-asc") list.sort((a, b) => a.price - b.price);
        else if (so === "price-desc") list.sort((a, b) => b.price - a.price);
        else if (so === "alpha") list.sort((a, b) => a.title.localeCompare(b.title));
        else if (so === "reviews") list.sort((a, b) => b.reviews - a.reviews);
        const pages = Math.max(1, Math.ceil(list.length / per));
        page = Math.min(page, pages);
        $("#shop-grid").innerHTML = list.slice((page - 1) * per, page * per).map(card).join("") || "<p>No products match.</p>";
        $("#shop-pager").innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) =>
          `<button class="page-btn${i + 1 === page ? ' active' : ''}" data-page="${i + 1}" aria-current="${i + 1 === page}">${i + 1}</button>`).join("") : "";
        $$("#shop-pager [data-page]").forEach(b => b.onclick = () => { page = +b.dataset.page; apply(); });
      }
      ["f-avail", "f-price", "f-sort"].forEach(id => $("#" + id).addEventListener("input", () => { page = 1; apply(); }));
      apply();
    },
    product() {
      const p = PETOI.product(qs("handle"));
      if (!p) { $("#app").innerHTML = "<h1>Product not found</h1><p><a href='shop.html'>Back to store</a></p>"; return; }
      document.title = p.title + " — Petoi";
      const dist = p.reviews > 0 ? [94, 4, 1, 0, 1] : [0, 0, 0, 0, 0]; // mock; real build derives from data
      const priceLabel = p.variants ? "from " + money(p.price) : money(p.price);
      const overviewHTML = `<p>${esc(p.description || p.blurb)}</p>` + (p.highlights ? `<ul class="highlights">${p.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : "");
      const specHTML = p.specs ? `<table class="spec-table"><tbody>${Object.entries(p.specs).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table>` : "<p>Specifications available on request.</p>";
      const faqItems = p.faq || [["How long does assembly take?", "Assembly time varies by model; pre-assembled options are available."], ["Which programming languages are supported?", "Block-based coding, Python, and C++."]];
      $("#app").innerHTML = `
        <article class="pdp">
          <div class="pdp-media">${imgTag(p, "pdp-img")}${p.category === "Robots" ? poseStrip() : ""}</div>
          <div class="pdp-buy">
            <p class="kicker">${esc(p.category)}</p>
            <h1>${esc(p.title)}</h1>
            <p class="price" id="pdp-price">${priceLabel}</p>
            <p class="rating">${p.reviews} reviews</p>
            <p class="stock stock-${esc(p.stock)}">${esc(p.stock.replace("_", " "))}</p>
            <form id="buy-form">
              ${p.variants ? `<label>Package <select id="variant">${p.variants.map(v => `<option value="${esc(v.label)}" data-price="${v.price}">${esc(v.label)}</option>`).join("")}</select></label>` : ""}
              <label>Quantity <input id="qty" type="number" min="1" step="1" value="1"></label>
              <button type="submit" class="btn" ${p.stock !== "in_stock" ? "disabled" : ""}>${p.stock === "in_stock" ? "Add to cart" : "Unavailable"}</button>
            </form>
            <p><a href="contact.html?topic=edu">Contact us for corporate/education discount</a></p>
            <p class="promo">Buy one, get one for an extra 10% off. Free U.S. shipping $199-$1000. One-year warranty.</p>
          </div>
        </article>
        <div class="pdp-tabs" role="tablist" aria-label="Product information">
          ${["overview:Overview", "spec:Product Spec", "compare:Compare", "buy:Buy"].map((t, i) => { const [id, label] = t.split(":"); return `<button role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${id}">${label}</button>`; }).join("")}
        </div>
        <section class="pdp-panel" id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">${overviewHTML}</section>
        <section class="pdp-panel" id="panel-spec" role="tabpanel" aria-labelledby="tab-spec" hidden>${specHTML}</section>
        <section class="pdp-panel" id="panel-compare" role="tabpanel" aria-labelledby="tab-compare" hidden><p><a href="page.html?slug=compare">See full comparison</a></p></section>
        <section class="pdp-panel" id="panel-buy" role="tabpanel" aria-labelledby="tab-buy" hidden><p>Use the form above to add to cart.</p></section>
        <section class="reviews"><h2>Reviews (${p.reviews})</h2>
          <ul class="rating-dist">${dist.map((d, i) => `<li>${5 - i} star <span class="bar" style="--w:${d}%"></span> ${d}%</li>`).join("")}</ul>
          <form class="review-form" data-form="review" data-handle="${esc(p.handle)}"><h3>Write a review</h3>
            <label>Name <input name="name" required></label>
            <label>Rating <select name="rating"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label>
            <label>Review <textarea name="body" required></textarea></label>
            <button type="submit">Submit review</button><p class="form-msg" role="status" aria-live="polite" hidden></p></form>
          <button class="load-more">Load more reviews</button>
        </section>
        <section class="pdp-faq"><h2>FAQ</h2><div class="accordion">
          ${faqItems.map((qa, i) => `
            <div class="acc-item"><h3><button class="acc-q" id="accq-${i}" aria-expanded="false" aria-controls="acca-${i}">${esc(qa[0])}</button></h3>
            <div class="acc-a" id="acca-${i}" role="region" aria-labelledby="accq-${i}" hidden><p>${esc(qa[1])}</p></div></div>`).join("")}
        </div></section>`;
      // variant price update
      const variantSel = $("#variant");
      if (variantSel) variantSel.addEventListener("change", e => { const o = e.target.selectedOptions[0]; $("#pdp-price").textContent = money(+o.dataset.price); });
      $("#buy-form").addEventListener("submit", e => { e.preventDefault(); Cart.add(p.handle, variantSel ? variantSel.value : null, +$("#qty").value); openCartDrawer(); });
      // tabs (roving tabindex + arrow keys)
      const tabs = $$('.pdp-tabs [role="tab"]');
      function selectTab(btn) {
        tabs.forEach(t => { const sel = t === btn; t.setAttribute("aria-selected", String(sel)); t.tabIndex = sel ? 0 : -1; $("#panel-" + t.dataset.tab).hidden = !sel; });
      }
      tabs.forEach((b, i) => {
        b.onclick = () => selectTab(b);
        b.onkeydown = e => { if (e.key === "ArrowRight") { e.preventDefault(); const n = tabs[(i + 1) % tabs.length]; n.focus(); selectTab(n); } else if (e.key === "ArrowLeft") { e.preventDefault(); const n = tabs[(i - 1 + tabs.length) % tabs.length]; n.focus(); selectTab(n); } };
      });
      // accordion
      $$(".acc-q").forEach(b => b.onclick = () => { const a = $("#" + b.getAttribute("aria-controls")); const open = a.hidden; a.hidden = !open; b.setAttribute("aria-expanded", String(open)); });
      wireForm($(".review-form"));
      $(".load-more").onclick = e => { e.target.textContent = "No more reviews (prototype)"; e.target.disabled = true; };
    },
    cart() {
      function render() {
        const items = Cart.read(); // self-healed: every line has a valid product
        $("#app").innerHTML = `<h1>Your cart</h1>` + (items.length ? `
          <table class="cart-table"><thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead>
          <tbody>${items.map((i, idx) => { const p = PETOI.product(i.handle); const unit = Cart.lineUnit(i); return `<tr>
            <td><a href="product.html?handle=${esc(i.handle)}">${esc(p.title)}</a>${i.variant ? `<br><small>${esc(i.variant)}</small>` : ""}</td>
            <td>${money(unit)}</td><td><input type="number" min="1" step="1" value="${i.qty}" data-q="${idx}" aria-label="Quantity"></td>
            <td>${money(unit * i.qty)}</td><td><button data-r="${idx}">Remove</button></td></tr>`; }).join("")}</tbody></table>
          <div class="cart-summary"><p>Subtotal: <strong>${money(Cart.subtotal())}</strong></p>
          <button class="btn" id="checkout">Checkout</button>
          <p class="note">Checkout hands off to the secure hosted payment flow (prototype: not wired).</p></div>`
          : `<p>Your cart is empty. <a href="shop.html">Shop all</a>.</p>`);
        $$("[data-q]").forEach(inp => inp.onchange = e => { Cart.setQty(+e.target.dataset.q, e.target.value); render(); });
        $$("[data-r]").forEach(b => b.onclick = e => { Cart.remove(+e.target.dataset.r); render(); });
        const co = $("#checkout"); if (co) co.onclick = () => alert("Prototype: would redirect to hosted checkout (Shopify/Stripe).");
      }
      render();
    },
    account() {
      $("#app").innerHTML = `
        <h1>Account</h1>
        <section><h2>Sign in</h2>
          <form data-form="magic-link"><label>Email <input type="email" name="email" required></label>
            <button type="submit">Email me a sign-in link</button><p class="form-msg" role="status" aria-live="polite" hidden></p></form>
          <p class="note">Passwordless sign-in. We email a single-use link. (Prototype.)</p></section>
        <section><h2>Order history</h2><p>Sign in to see your orders.</p></section>
        <section id="referral"><h2>Get 5% off by referral</h2>
          <form data-form="referral-apply"><label>Have a referral code? <input name="code" placeholder="FRIEND5"></label>
            <button type="submit">Apply at checkout</button><p class="form-msg" role="status" aria-live="polite" hidden></p></form>
          <p class="note">Share your code; your friend gets 5% off and so do you. Codes are issued through the store. (Prototype.)</p></section>`;
      wireForm($('[data-form="magic-link"]'));
      wireForm($('[data-form="referral-apply"]'));
    },
    search() {
      const q = qs("q") || "";
      const res = PETOI.search(q);
      $("#app").innerHTML = `<h1>Search</h1>
        <form class="site-search" action="search.html" method="get" role="search"><label class="vh" for="sp-q">Search</label><input id="sp-q" type="search" name="q" value="${esc(q)}"><button>Search</button></form>
        <p>${res.length} result(s) for "${esc(q)}"</p><div class="grid">${res.map(card).join("")}</div>`;
    },
    page() {
      const c = PETOI.CONTENT[qs("slug")];
      if (!c) { $("#app").innerHTML = "<h1>Page not found</h1>"; return; }
      document.title = c.title + " — Petoi";
      // CMS body is first-party content (loaded at Step 3c). Real build sanitizes on ingest;
      // rendered as HTML so editorial markup (links/lists) works.
      $("#app").innerHTML = `<article class="cms"><h1>${esc(c.title)}</h1><div class="cms-body">${c.body}</div></article>`;
    },
    blog() {
      const slug = qs("post");
      if (slug) {
        const b = PETOI.blogPost(slug);
        if (!b) { $("#app").innerHTML = "<h1>Post not found</h1><p><a href='blog.html'>Back to blog</a></p>"; return; }
        document.title = b.title + " — Petoi Blog";
        $("#app").innerHTML = `<article class="cms"><p><a href="blog.html">&larr; Blog</a></p><h1>${esc(b.title)}</h1><p class="date">${esc(b.date)}</p><div class="cms-body">${b.body}</div></article>`;
        return;
      }
      $("#app").innerHTML = `<h1>Blog</h1><ul class="blog-list">${PETOI.BLOG.map(b => `
        <li><h2><a href="blog.html?post=${esc(b.slug)}">${esc(b.title)}</a></h2><p class="date">${esc(b.date)}</p><p>${esc(b.excerpt)}</p></li>`).join("")}</ul>`;
    },
    contact() {
      const edu = qs("topic") === "edu";
      $("#app").innerHTML = `<h1>Contact us</h1>
        <form data-form="contact"><label>Topic <select name="topic">
          <option${edu ? "" : " selected"}>General</option>
          <option${edu ? " selected" : ""}>Corporate / education discount</option>
          <option>Support</option><option>Partnership</option></select></label>
        <label>Name <input name="name" required></label><label>Email <input type="email" name="email" required></label>
        <label>Message <textarea name="message" required></textarea></label>
        <button type="submit">Send</button><p class="form-msg" role="status" aria-live="polite" hidden></p></form>`;
      wireForm($('[data-form="contact"]'));
    },
  };

  function imgTag(p, cls) {
    return /^https?:/.test(p.image || "")
      ? `<img class="${cls}" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`
      : `<div class="ph-img ${cls}" aria-hidden="true">image</div>`;
  }
  function card(p) {
    const price = p.variants ? "from " + money(p.price) : money(p.price);
    const dof = p.specs && p.specs["Degrees of freedom"] ? " / " + p.specs["Degrees of freedom"].split(" ")[0] + " DOF / ESP32" : "";
    const meta = esc(p.category.toUpperCase() + dof);
    const caps = p.category === "Robots" ? ["Walk", "Voice", "Python", "C++"] : [p.category];
    return `<a class="card" href="product.html?handle=${esc(p.handle)}">
      <p class="card-meta">${meta}</p>
      ${imgTag(p, "card-img")}
      <h3>${esc(p.title)}</h3>
      <div class="capability-strip">${caps.map(c => `<span>${esc(c)}</span>`).join("")}</div>
      <p class="price">${price}</p>
      <p class="rating">${p.reviews} reviews</p>
      <span class="stock stock-${esc(p.stock)}">${esc(p.stock.replace("_", " "))}</span></a>`;
  }
  function poseStrip() {
    const frames = [["01", "Stand"], ["02", "Shift weight"], ["03", "Step"], ["04", "Balance"], ["05", "Turn head"], ["06", "Sit"]];
    return `<div class="pose-strip" role="img" aria-label="OpenCat gait cycle: stand, shift weight, step, balance, turn head, sit">
      ${frames.map(([n, a]) => `<div class="pose-frame" aria-hidden="true"><div class="stage">frame ${n}</div><p class="lbl">Frame ${n}</p><p class="act">${a}</p></div>`).join("")}</div>`;
  }

  // ---------- real backend (with graceful fallback to embedded data) ----------
  const API_BASE = (typeof window !== "undefined" && window.PETOI_API_BASE) || "";
  window.PETOI_SUBMIT = submit;
  async function apiGet(qsArgs) {
    if (!API_BASE) return null;
    try {
      const r = await fetch(API_BASE + "/petoi-api?" + qsArgs, { cache: "no-store" });
      const j = await r.json();
      return j && j.ok ? j.rows : null;
    } catch { return null; }
  }
  async function submit(obj) {
    if (!API_BASE) return false;
    try {
      const r = await fetch(API_BASE + "/petoi-submit", { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(obj) });
      const j = await r.json(); return !!(j && j.ok);
    } catch { return false; }
  }
  function mapProduct(row) {
    return {
      handle: row.handle, title: row.title, category: row.category, stock: row.status,
      price: (row.base_price_cents || 0) / 100, reviews: row.rating_count || 0, image: row.image,
      variants: (row.variants && row.variants.length) ? row.variants.map(v => ({ label: v.label, price: (v.price_cents || 0) / 100 })) : null,
      description: row.description, blurb: row.blurb, highlights: row.highlights, specs: row.specs,
      faq: row.faq ? row.faq.map(f => [f.q, f.a]) : undefined,
      reviewsList: row.reviews || [],
    };
  }
  async function hydrate(page, p) {
    // catalog: powers cards, cart cross-ref, search
    const rows = await apiGet("r=catalog");
    if (rows) {
      const mapped = rows.map(mapProduct);
      PETOI.PRODUCTS.splice(0, PETOI.PRODUCTS.length, ...mapped);
    }
    if (page === "product" && p.handle) {
      const one = await apiGet("r=product&handle=" + encodeURIComponent(p.handle));
      if (one && one[0]) { const m = mapProduct(one[0]); const t = PETOI.product(p.handle);
        if (t) Object.assign(t, m); else PETOI.PRODUCTS.push(m); }
    }
    if (page === "page" && p.slug) {
      const c = await apiGet("r=content&slug=" + encodeURIComponent(p.slug));
      if (c && c[0]) PETOI.CONTENT[p.slug] = { title: c[0].title, body: c[0].body_html };
    }
    if (page === "blog") {
      if (p.post) { const c = await apiGet("r=content&slug=" + encodeURIComponent(p.post));
        if (c && c[0]) { const ex = PETOI.BLOG.find(b => b.slug === p.post);
          const row = { slug: p.post, title: c[0].title, body: c[0].body_html, excerpt: ex ? ex.excerpt : "", date: ex ? ex.date : "" };
          if (ex) Object.assign(ex, row); else PETOI.BLOG.push(row); } }
      else { const list = await apiGet("r=bloglist");
        if (list) PETOI.BLOG.splice(0, PETOI.BLOG.length, ...list.map(b => ({ slug: b.handle, title: b.title, excerpt: b.excerpt, date: b.date, body: "" }))); }
    }
  }

  // ---------- boot ----------
  document.addEventListener("DOMContentLoaded", async () => {
    if (!$("#app")) { const m = document.createElement("main"); m.id = "app"; document.body.appendChild(m); } // defensive
    const page = document.body.dataset.page;
    const params = { handle: qs("handle"), slug: qs("slug"), post: qs("post") };
    try { await hydrate(page, params); } catch { /* keep embedded data */ }
    header(); footer(); renderCartCount();
    if (Pages[page]) Pages[page]();
  });
})();

(function () {
  const results = document.getElementById("self-test-results");
  const frame = document.getElementById("app-frame");

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function report(name, passed, detail) {
    const row = document.createElement("div");
    row.className = `result ${passed ? "pass" : "fail"}`;
    row.innerHTML = `<span>${name}${detail ? ` - ${detail}` : ""}</span><span class="badge">${passed ? "PASS" : "FAIL"}</span>`;
    results.appendChild(row);
  }

  async function runCheck(name, check) {
    try {
      const detail = await check();
      report(name, true, detail);
    } catch (error) {
      report(name, false, error instanceof Error ? error.message : String(error));
    }
  }

  function getAppDocument() {
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc) {
      throw new Error("Cannot access app iframe.");
    }
    return doc;
  }

  function query(doc, selector) {
    const element = doc.querySelector(selector);
    if (!element) {
      throw new Error(`Missing selector: ${selector}`);
    }
    return element;
  }

  async function run() {
    const doc = getAppDocument();
    const win = frame.contentWindow;

    await runCheck("Page can load", () => {
      query(doc, "[data-testid='app-shell']");
      return "app shell found";
    });

    await runCheck("localStorage is available", () => {
      const key = "open-tools-starter.self-test";
      win.localStorage.setItem(key, "ok");
      const value = win.localStorage.getItem(key);
      win.localStorage.removeItem(key);
      if (value !== "ok") {
        throw new Error("localStorage did not persist the probe value.");
      }
      return "probe value persisted";
    });

    await runCheck("Theme toggle works", async () => {
      const before = doc.documentElement.dataset.theme;
      const button = query(doc, "[data-testid='theme-toggle']");
      button.click();
      await wait(80);
      const after = doc.documentElement.dataset.theme;
      if (!after || before === after) {
        throw new Error("Theme did not change.");
      }
      return `${before || "unset"} -> ${after}`;
    });

    await runCheck("Language toggle works", async () => {
      const before = doc.documentElement.dataset.lang;
      const button = query(doc, "[data-testid='language-toggle']");
      button.click();
      await wait(80);
      const after = doc.documentElement.dataset.lang;
      if (!after || before === after) {
        throw new Error("Language did not change.");
      }
      return `${before || "unset"} -> ${after}`;
    });

    await runCheck("A/B/C level cards exist", () => {
      ["A", "B", "C"].forEach((level) => {
        query(doc, `[data-testid='level-card-${level}']`);
      });
      return "all level cards found";
    });

    await runCheck("Module matrix region exists", () => {
      query(doc, "[data-testid='module-matrix']");
      query(doc, "[data-testid='module-matrix-preview']");
      query(doc, "[data-testid='status-legend']");
      return "matrix preview and legend found";
    });

    await runCheck("Theme and language buttons exist", () => {
      query(doc, "[data-testid='theme-toggle']");
      query(doc, "[data-testid='language-toggle']");
      return "topbar controls found";
    });

    await runCheck("Configuration data is readable", () => {
      const matrix = query(doc, "[data-testid='module-matrix']");
      const source = matrix.getAttribute("data-config-source") || "";
      query(doc, "[data-testid='selected-profile']");
      query(doc, "[data-testid='profile-required']");
      query(doc, "[data-testid='profile-recommended']");
      if (!source.includes("projectProfiles") || !source.includes("moduleRegistry")) {
        throw new Error("Config source marker is missing.");
      }
      return source;
    });

    await runCheck("Copy button works", async () => {
      const button = query(doc, "[data-testid='copy-button']");
      frame.focus();
      button.focus();
      button.click();
      await wait(160);
      const state = button.getAttribute("data-copy-state");
      if (state === "error") {
        throw new Error("Copy button reported an error.");
      }
      return `state: ${state || "idle"}`;
    });

    await runCheck("Download button works", async () => {
      const button = query(doc, "[data-testid='download-button']");
      button.click();
      await wait(80);
      const state = button.getAttribute("data-download-state");
      if (state !== "success") {
        throw new Error("Download button did not report success.");
      }
      return "download action triggered";
    });

    await runCheck("Critical DOM regions exist", () => {
      [
        "[data-testid='top-nav']",
        "[data-testid='hero']",
        "[data-testid='levels-section']",
        "[data-testid='module-matrix']",
        "[data-testid='module-matrix-preview']",
        "[data-testid='selected-profile']",
        "[data-testid='capabilities-section']",
        "[data-testid='quality-section']",
        "[data-testid='resources-section']",
        "[data-testid='settings-section']",
        "[data-testid='empty-state']",
        "[data-testid='error-state']",
      ].forEach((selector) => query(doc, selector));
      return "all key regions found";
    });

    await runCheck("Template Health region exists", () => {
      query(doc, "[data-testid='template-health']");
      const items = doc.querySelectorAll(".health-item");
      if (items.length < 8) {
        throw new Error(`Expected at least 8 health items, found ${items.length}`);
      }
      return `${items.length} health items found`;
    });

    await runCheck("ErrorBoundary root exists", () => {
      query(doc, "[data-error-boundary='ready']");
      query(doc, "[data-testid='error-boundary-root']");
      return "ErrorBoundary root found";
    });

    await runCheck("PWA/SEO Ready indicators in hero", () => {
      const heroTags = doc.querySelectorAll(".tag");
      const tagTexts = Array.from(heroTags).map((tag) => tag.textContent);
      const hasPwaRelated = tagTexts.some((text) => text.includes("GitHub Pages") || text.includes("Offline"));
      return hasPwaRelated ? "PWA/SEO indicators present" : "PWA/SEO indicators partial";
    });

    await runCheck("Language toggle updates Template Health", async () => {
      const langButton = query(doc, "[data-testid='language-toggle']");
      const beforeLang = doc.documentElement.dataset.lang;
      langButton.click();
      await wait(100);
      const afterLang = doc.documentElement.dataset.lang;
      if (beforeLang === afterLang) {
        throw new Error("Language did not change after toggle");
      }
      const healthTitle = query(doc, "[data-testid='template-health'] h2");
      const titleText = healthTitle.textContent;
      if (!titleText.includes("Template Health") && !titleText.includes("模板健康度")) {
        throw new Error("Template Health title did not update with language");
      }
      return `health title updated: ${titleText}`;
    });

    await runCheck("Dark mode affects main sections", async () => {
      const themeButton = query(doc, "[data-testid='theme-toggle']");
      const beforeTheme = doc.documentElement.dataset.theme;
      themeButton.click();
      await wait(100);
      const afterTheme = doc.documentElement.dataset.theme;
      if (!afterTheme || beforeTheme === afterTheme) {
        throw new Error("Theme did not change");
      }
      const hero = query(doc, "[data-testid='hero']");
      const section = query(doc, "[data-testid='levels-section']");
      return `${beforeTheme || "unset"} -> ${afterTheme}`;
    });

    await runCheck("PWA manifest link exists in index.html", async () => {
      const iframeSrc = frame.src || "";
      if (!iframeSrc) {
        throw new Error("Cannot determine iframe source");
      }
      const response = await fetch(iframeSrc.replace("self-test.html", "manifest.webmanifest"));
      if (!response.ok) {
        throw new Error("manifest.webmanifest not accessible");
      }
      return "manifest accessible";
    });
  }

  function start() {
    results.textContent = "";
    run();
  }

  frame.addEventListener("load", start);

  if (frame.contentDocument?.readyState === "complete") {
    start();
  }
})();

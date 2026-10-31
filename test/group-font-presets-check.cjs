// Requires a running ComfyUI and Playwright; optionally set PLAYWRIGHT_MODULE_PATH.
// HEADLESS=0 opens a desktop window for visual verification.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: process.env.HEADLESS !== '0' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    const url = process.env.COMFYUI_URL || 'http://127.0.0.1:8188';
    await page.goto(url);
    const prepare = async () => {
      await page.waitForFunction(() => window.HkGroups && window.app?.canvas && LiteGraph.registered_node_types.CLIPTextEncode);
      await page.waitForFunction(() => app.canvas.graph._nodes.length > 0);
      await page.evaluate(() => {
        const graph = app.canvas.graph;
        graph.clear();
        const group = new LiteGraph.LGraphGroup('CLIP & VAE');
        graph.add(group);
        group.font_size = 20; group.pos = [170, 420]; group.size = [850, 370]; group.selected = true;
        window.testGroup = group;
        const node = LiteGraph.createNode('CLIPTextEncode');
        node.pos = [210, 490]; node.size = [350, 230]; graph.add(node);
        app.canvas.ds.scale = 1; app.canvas.ds.offset = [0, 0]; app.canvas.setDirty(true, true);
      });
      await page.locator('.hk-floating-btn').click({ button: 'right' });
      await page.locator('.hk-grp-font-preset').first().waitFor({ state: 'visible' });
    };
    await prepare();
    const buttons = page.locator('.hk-grp-font-preset');
    assert.deepEqual(await buttons.allTextContents(), ['20', '40', '60', '80', '100']);
    await buttons.last().click();
    assert.equal(await page.evaluate(() => testGroup.font_size), 100);
    assert.equal(await buttons.last().getAttribute('aria-pressed'), 'true');
    assert.ok(Math.abs(await page.evaluate(() => testGroup.pos[1] + testGroup.titleHeight) - 448) < .01);

    await buttons.last().click({ button: 'right' });
    const editor = page.locator('.hk-grp-font-preset-input');
    await editor.fill('125'); await editor.press('Enter');
    assert.equal(await buttons.last().textContent(), '125');
    assert.equal(await page.evaluate(() => testGroup.font_size), 100, 'editing must not apply');
    await buttons.last().click();
    assert.equal(await page.evaluate(() => testGroup.font_size), 125);
    assert.equal(await page.locator('.hk-grp-font-val').inputValue(), '125');
    assert.equal(await page.locator('.hk-grp-font-slider').inputValue(), '125');

    await buttons.last().press('F2');
    await editor.fill('160'); await editor.press('Escape');
    assert.equal(await buttons.last().textContent(), '125');
    assert.equal(await page.locator('.hk-align-popup').evaluate(el => el.classList.contains('visible')), true);
    await buttons.last().press('F2');
    await editor.fill('301');
    assert.equal(await editor.evaluate(el => el.checkValidity()), false);
    await editor.press('Enter');
    assert.equal(await buttons.last().textContent(), '125');

    await buttons.first().press('F2');
    await editor.fill('24');
    await page.locator('.hk-grp-font-val').click();
    assert.equal(await buttons.first().textContent(), '24', 'blur saves the preset');
    await page.locator('.hk-grp-font-val').fill('60');
    assert.equal(await buttons.nth(2).getAttribute('aria-pressed'), 'true');
    assert.equal(await buttons.last().getAttribute('aria-pressed'), 'false');
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('hk-group-font-presets'))), [24, 40, 60, 80, 125]);
    await page.reload();
    await prepare();
    assert.deepEqual(await buttons.allTextContents(), ['24', '40', '60', '80', '125']);
    await buttons.last().click();
    if (process.env.SCREENSHOT_PATH) await page.screenshot({ path: process.env.SCREENSHOT_PATH });
    // Corrupt persisted input must fall back to safe defaults.
    await page.evaluate(() => localStorage.setItem('hk-group-font-presets', '[20,40,60,80,999]'));
    await page.reload();
    await prepare();
    assert.deepEqual(await buttons.allTextContents(), ['20', '40', '60', '80', '100']);
    console.log('PASS: font presets apply, edit, cancel, validate, highlight and persist; title anchor stays fixed');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

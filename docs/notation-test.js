/* Notation alignment test for PHYSICS-BRIEF.md section 6.4. Fixture:
   docs/notation-reference.html.

   Is the fraction bar actually on the maths axis, and do superscripts leave the line
   box alone? Measured, not eyeballed — the failure mode here is silent, and every one
   of these numbers is a defect that shipped in a sibling app.

   Needs playwright:  npm i -D playwright   (or run it from wherever yours is installed)
   and a chromium path — edit executablePath below to match your environment. */
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
  const p = await b.newPage({ viewport: { width: 820, height: 900 }, deviceScaleFactor: 2 });
  await p.goto("file:///home/user/Study-App/docs/notation-reference.html");
  await p.waitForTimeout(300);

  const m = await p.evaluate(() => {
    // Maths axis of a line of text = baseline - xHeight/2.
    function axisOf(row) {
      const probe = document.createElement("span");
      probe.className = "probe";
      row.appendChild(probe);
      const r = probe.getBoundingClientRect();
      const baseline = r.bottom;          // probe is baseline-aligned, height 1ex
      const xHeight = r.height;
      probe.remove();
      return { baseline, xHeight, axis: baseline - xHeight / 2 };
    }
    function barOf(sel) {
      const den = document.querySelector(sel + " > .den");
      const r = den.getBoundingClientRect();
      return r.top;                        // the border-top IS the bar
    }
    const out = {};
    const goodRow = document.querySelector("#good");
    const badRow = document.querySelector("#bad");
    const ga = axisOf(goodRow), ba = axisOf(badRow);
    out.good = { axis: ga.axis, bar: barOf("#f1"), x: ga.xHeight };
    const badDen = document.querySelector("#bad .bad-frac > span:last-child");
    out.bad = { axis: ba.axis, bar: badDen.getBoundingClientRect().top, x: ba.xHeight };

    // line-box disturbance
    out.plain = document.querySelector("#plain").getBoundingClientRect().height;
    out.withsup = document.querySelector("#withsup").getBoundingClientRect().height;

    // the radical's overline must clear everything under the root
    const sq = document.querySelectorAll(".sqrt");
    out.sqrtOverlap = 0;
    sq.forEach(s => {
      const body = s.querySelector(".body");
      const bar = body.getBoundingClientRect().top;
      body.querySelectorAll("*").forEach(ch => {
        const r = ch.getBoundingClientRect();
        if (r.height && r.top < bar - 0.5) out.sqrtOverlap = Math.max(out.sqrtOverlap, bar - r.top);
      });
    });
    // the radical glyph should reach the overline, not float mid-way
    /* Measure the DRAWN radical (the svg), not its flex box: with align-items:stretch
       the box is full height regardless, so measuring it asserts nothing. */
    const tall = [...sq].map(s => {
      const g = s.querySelector(".rad svg").getBoundingClientRect();
      const body = s.querySelector(".body").getBoundingClientRect();
      // Both directions: too short leaves the hook floating, too tall means the svg
      // fell back to its intrinsic size and towers over the line.
      return { gap: Math.abs(g.top - body.top), ratio: g.height / body.height };
    });
    out.radGap = Math.max(...tall.map(t => t.gap));
    out.radRatio = tall.map(t => t.ratio);

    // nuclear pair left edges must line up
    const ud = document.querySelector(".updown");
    const kids = [...ud.children].map(k => k.getBoundingClientRect());
    out.nucRightDelta = Math.abs(kids[0].right - kids[1].right);
    return out;
  });

  const off = (o) => (o.bar - o.axis);
  console.log(`  bad  (inline-flex column): bar is ${off(m.bad).toFixed(2)}px from the maths axis (x-height ${m.bad.x.toFixed(1)}px)`);
  console.log(`  good (inline-grid + middle): bar is ${off(m.good).toFixed(2)}px from the maths axis`);
  console.log(`  line height without superscripts: ${m.plain.toFixed(2)}px, with: ${m.withsup.toFixed(2)}px`);
  console.log(`  nuclear sub/sup right edges differ by ${m.nucRightDelta.toFixed(2)}px`);
  console.log(`  radical height / content height: ${m.radRatio.map(r => r.toFixed(2)).join(", ")}`);
  console.log(`  radical overline cuts into its content by ${m.sqrtOverlap.toFixed(2)}px, drawn radical meets the bar within ${m.radGap.toFixed(2)}px`);

  const tol = m.good.x * 0.12;                       // 12% of x-height
  const fails = [];
  if (Math.abs(off(m.good)) > tol) fails.push(`fraction bar off the maths axis by ${off(m.good).toFixed(2)}px (tolerance ${tol.toFixed(2)})`);
  if (Math.abs(m.plain - m.withsup) > 0.5) fails.push(`superscripts changed the line height by ${(m.withsup - m.plain).toFixed(2)}px`);
  if (m.nucRightDelta > 0.5) fails.push(`nuclear sub/sup not aligned (${m.nucRightDelta.toFixed(2)}px)`);
  if (m.sqrtOverlap > 0.5) fails.push(`the radical overline strikes through its own content by ${m.sqrtOverlap.toFixed(2)}px`);
  if (m.radGap > 1.5) fails.push(`the drawn radical starts ${m.radGap.toFixed(2)}px away from the overline instead of meeting it`);
  const bad = m.radRatio.filter(r => r < 0.95 || r > 1.05);
  if (bad.length) fails.push(`the radical height does not match its content (ratios ${m.radRatio.map(r => r.toFixed(2)).join(", ")})`);
  if (Math.abs(off(m.bad)) < tol) fails.push("the 'bad' example is not actually misaligned — the comparison proves nothing");

  await p.screenshot({ path: "notation.png", fullPage: true });
  await b.close();
  if (fails.length) { console.log("\n❌ " + fails.join("\n   ")); process.exit(1); }
  console.log("\n✅ Notation aligns.");
})();

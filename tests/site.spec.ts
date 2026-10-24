import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("activities paginate, filter, and show useful details with keyboard dismissal", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#activities");
  const cards = section.locator(".activity-card");
  await expect(cards).toHaveCount(3);
  await expect(
    section.getByRole("button", { name: "Previous activities" }),
  ).toBeDisabled();
  await section.getByRole("button", { name: "Next activities" }).click();
  await expect(cards.first()).toContainText(
    "Good questions. Real conversations.",
  );
  await expect(
    section.getByRole("button", { name: "Next activities" }),
  ).toBeDisabled();
  await section.getByRole("button", { name: "Previous activities" }).click();
  await expect(cards.first()).toContainText("One campus. Many stories.");
  await section.getByRole("button", { name: "Workshops", exact: true }).click();
  await expect(cards).toHaveCount(2);
  await expect(cards.first()).toContainText("Make something together.");
  await expect(cards.last()).toContainText("From a spark to a story.");
  await expect(
    section.getByRole("button", { name: "Next activities" }),
  ).toBeDisabled();
  await cards.first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Make something together." }),
  ).toBeVisible();
  await expect(dialog.getByRole("listitem")).toHaveCount(3);
  await expect(dialog).toContainText(
    "The team will confirm dates, venues, and participation details.",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(cards.first()).toBeFocused();
});

test("directory uses the confirmed department hierarchy and separates members", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#people");
  const cards = section.locator(".member-card");
  await expect(cards).toHaveCount(4);
  await expect(cards.locator("h3")).toHaveText([
    "Leader",
    "Assistant leader",
    "Consular",
    "Member",
  ]);
  await section
    .getByRole("button", { name: "Leadership", exact: true })
    .click();
  await expect(cards).toHaveCount(3);
  await cards.filter({ hasText: "Consular" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Consular", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Name to be added");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(cards.filter({ hasText: "Consular" })).toBeFocused();
  await section.getByRole("button", { name: "Members", exact: true }).click();
  await expect(cards).toHaveCount(1);
  await expect(cards.locator("h3")).toHaveText("Member");
  await section.getByRole("button", { name: "Everyone", exact: true }).click();
  await expect(cards).toHaveCount(4);
});

test("roadmap opens each phase with its tasks and expected outcome", async ({
  page,
}) => {
  await page.goto("/");
  const phases = page.locator("#plan .phase-card");
  await expect(phases).toHaveCount(4);
  for (const title of [
    "Find our people.",
    "Make room for ideas.",
    "Bring stories to life.",
    "Share. Reflect. Grow.",
  ]) {
    await phases
      .filter({ has: page.getByRole("heading", { name: title, exact: true }) })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(dialog.getByRole("listitem")).toHaveCount(3);
    await expect(dialog).toContainText("What we’re working toward");
    await page.getByRole("button", { name: "Close dialog" }).click();
  }
});

test("joining validates input and downloads the selected introduction locally", async ({
  page,
}) => {
  const outgoing: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") outgoing.push(request.url());
  });
  await page.goto("/");
  await page.locator(".header-join").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("it does not submit an application");
  await dialog.getByRole("button", { name: /Photography/ }).click();
  await expect(
    dialog.getByRole("button", { name: /Photography/ }),
  ).toHaveAttribute("aria-pressed", "true");
  const name = dialog.getByLabel("Your name");
  const downloadButton = dialog.getByRole("button", {
    name: "Download my introduction",
  });
  await downloadButton.click();
  await expect(name).toBeFocused();
  expect(
    await name.evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing,
    ),
  ).toBe(true);
  await name.fill("   ");
  await downloadButton.click();
  expect(
    await name.evaluate(
      (input: HTMLInputElement) => input.validity.patternMismatch,
    ),
  ).toBe(true);
  await name.fill("Sami");
  await dialog
    .getByLabel("A little about you")
    .fill("I would love to photograph campus events.");
  const downloadEvent = page.waitForEvent("download");
  await downloadButton.click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("my-hsiyc-introduction.txt");
  const filePath = await download.path();
  const text = await readFile(filePath!, "utf8");
  expect(text).toContain("My name is Sami. I’m interested in photography.");
  expect(text).toContain("I would love to photograph campus events.");
  await expect(dialog.getByRole("status")).toContainText(
    "Your introduction is downloaded",
  );
  expect(outgoing).toEqual([]);
});

test("mobile navigation and all sections fit a small screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu", exact: true });
  await toggle.click();
  await expect(
    page.getByRole("button", { name: "Close menu", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "The people", exact: true })
    .click();
  await expect(page).toHaveURL(/#people$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  for (const id of [
    "home",
    "about",
    "activities",
    "people",
    "plan",
    "vision",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
      `No horizontal overflow at ${id}`,
    ).toBeLessThanOrEqual(1);
  }
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator("#home").scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
      `No horizontal overflow at width ${width}`,
    ).toBeLessThanOrEqual(1);
  }
});

test("motion preference is controllable and retained between visits", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await page.getByRole("button", { name: "Motion on", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Motion off", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Motion off", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
});

test("reduced-motion users start with animation disabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(
    page.getByRole("button", { name: "Motion off", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  expect(
    await page
      .locator(".marquee-track")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
});

test("page loads its artwork and fonts without runtime errors or missing assets", async ({
  page,
}) => {
  const errors: string[] = [];
  const missing: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      response.url().startsWith("http://127.0.0.1:5173")
    )
      missing.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  // Visit every image so native lazy loading is exercised across the expanded gallery.
  for (const artwork of await page.locator("img").all()) {
    // Scroll the stable section: decorative poster transforms intentionally keep moving.
    await artwork.evaluate((image) =>
      image.closest("section")?.scrollIntoView({ behavior: "instant", block: "center" }),
    );
    await expect
      .poll(() =>
        artwork.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await expect
    .poll(async () =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        ),
    )
    .toBe(true);
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () =>
        document.fonts.check('16px "DM Sans"') &&
        document.fonts.check('700 16px "Barlow Condensed"'),
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
});

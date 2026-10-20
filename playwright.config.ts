import { defineConfig, devices } from '@playwright/test';

/**
 * E2E, accessibility (@a11y) and visual regression (@visual) tests run against the
 * prerendered docs site. Tag tests in their title so they can be run in isolation:
 *   npm run test:a11y      npm run test:visual      npm run test:visual:update
 */
export default defineConfig({
	testDir: 'e2e',
	testMatch: '**/*.e2e.{ts,js}',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
	expect: {
		// Captures are deterministic on the pinned Chromium; 20 px absorbs sub-pixel flicker but
		// cannot hide a changed glyph or border (the old 0.2% ratio let ~2,000 px slip through).
		toHaveScreenshot: { maxDiffPixels: 20, animations: 'disabled' }
	},
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry',
		colorScheme: 'light',
		// Optional: reuse an existing Chromium when Playwright's download is blocked.
		launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH || undefined }
	},
	webServer: {
		// Docs site only: e2e never needs svelte-package/publint, which `npm run build` also runs.
		command: 'npm run build:docs && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});

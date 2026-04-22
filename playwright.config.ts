import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  
  // Tempo máximo para cada teste completo (30 segundos é o padrão)
  timeout: 60_000,

  // Tempo máximo para assertions (toBeVisible(), toHaveText()) 5 segundos
  expect: {
    timeout: 5_000  // Não vale a pena aumentar porque o teste pode ficar lento no tempo de execução, vale a pensa usar o time explícito
  },
  

  testDir: './playwright/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    //trace => Pacote de evidências que PW grava durante a execução dos testes.
    //Ponto negativo quando ON: O teste vai demorar para rodar porque ele cataloga muito mais informações.
    //Pode ser ligado e desligado para o teste rodar mais rápido: 
    // trace: 'on' => Começando na automação (ou é novidade) e está em implementação
    // 'off' => Automação funciona liso sem problemas.
    // 'on-first-retry'
    // 'retain-on-failure' => Trace somente para os testes que falharem.

    // Tempo máximo para ações interativas como click(), fill()
    // Quando o valor é 0, herda o limite do timeout geral do teste (timeout L17)
    actionTimeout: 5_000,

    // Tempo máximo para navegações como goto(), waitForURL()
    // Quando o valor é 0, herda o limite do timeout geral do teste (timeout L17)
    navigationTimeout: 10_000
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

import { test as base } from "@playwright/test";
import { HomePage } from './pages/HomePage';

interface PageFixtures {
  homePage: HomePage;
}

export const test = base.extend<PageFixtures>({
homePage: async ({ page }, use) => {
  const homePage = new HomePage(page);
  await use(homePage);
}
});
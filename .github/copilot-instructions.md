# Projectcontext

Playwright + TypeScript testproject voor de demo-webshop https://practicesoftwaretesting.com (Online Toolshop). Er zijn UI-tests en API-tests (https://api.practicesoftwaretesting.com/products).

## Structuur

- `pages/HomePage.ts` – Page Object Model (POM): locators, acties en hulpfuncties voor prijzen. Exporteert ook het type `ProductsResponse`.
- `fixtures.ts` – breidt Playwright `test` uit met de fixture `homePage` (een `HomePage`).
- `tests/shop.spec.ts` – UI-tests: zoeken, categorieën, sorteren (naam, prijs, CO2-rating) en prijsslider.
- `tests/shop.api.spec.ts` – API-tests: sortering op naam, prijs en CO2-rating (1 pagina en alle pagina's).
- `playwright.config.ts` – `baseURL`, alleen Chromium, 1 worker, geen retries, HTML-reporter.

## Commando's

- `npm test` – alle tests (`npx playwright test`)
- `npm run test:ui` – Playwright UI-modus
- `npx tsc --noEmit -p .` – typecontrole

## Conventies

- Logica die bij de webshop hoort (locators, prijs formatteren/parsen/vergelijken) staat in de POM, niet in de spec-bestanden.
- Prijshulpfuncties in `HomePage` zijn `static` (`HomePage.formatPrice`, `HomePage.parsePrice`, `HomePage.comparePrices`) zodat API-tests ze zonder `Page` kunnen gebruiken. Instance-members `parsePrice` en `comparePrices` verwijzen naar dezelfde statische functies.
- In specs de statische functies direct aanroepen (`HomePage.formatPrice(...)`), niet destructuren naar een losse `const`.
- UI-tests gebruiken de `homePage` fixture uit `fixtures.ts`.
- Testnamen en `describe`-titels zijn Engels, bijv. `Online Toolshop - API Tests, ...`.
- Communiceer met de gebruiker in het Nederlands.

## Niveau van de gebruiker

De gebruiker is een beginner met Playwright en TypeScript. Schrijf code op beginnersniveau:
- Gebruik eenvoudige, duidelijke code: gewone `function`s of simpele methodes, `for`-loops en losse stappen in plaats van compacte constructies.
- Vermijd geavanceerde patronen, zoals destructuring van classes, `static` members, aliassen, generics of ingewikkelde one-liners, tenzij het echt niet anders kan.
- Kies duidelijke namen en houd het dicht bij de bestaande stijl in het project.
- Leg nieuwe of moeilijke concepten kort uit in gewoon Nederlands, en zeg erbij waarom je het zo doet.
- Maak kleine wijzigingen en doe niet meer dan gevraagd.

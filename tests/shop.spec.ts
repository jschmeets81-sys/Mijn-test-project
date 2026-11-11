import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { getRandomPriceRange } from '../pages/HomePage';
import type { ProductsResponse } from '../pages/HomePage';


test.describe('Online Toolshop - UI tests, search function and categories', () => {

  test('Load the homepage and search for a product', async ({ homePage }) => {
    // test
    await homePage.navigateTo();

    await expect(homePage.page).toHaveTitle(/Practice Software Testing/);
    await expect(homePage.productGrid).toBeVisible();

    console.log('Zoeken naar "Hammer"...');
    await homePage.searchFor('Hammer');

    await expect(homePage.productGrid).toBeVisible();
  });

  test('Test the "categories" menu', async ({ homePage }) => {
    await homePage.navigateTo();

    await homePage.navCategories.click();
    await expect(homePage.navHandTools).toBeVisible();
    await expect(homePage.navPowerTools).toBeVisible();
    await expect(homePage.navOther).toBeVisible();
    await expect(homePage.navSpecialTools).toBeVisible();
    await expect(homePage.navRentals).toBeVisible();
  });

  test('Hand Tools category only displays hand tools', async ({ homePage, request }) => {
    await homePage.checkCategory(request, 'Hand Tools', 'hand-tools', homePage.navHandTools);
  });

  test('Power Tools category only displays power tools', async ({ homePage, request }) => {
    await homePage.checkCategory(request, 'Power Tools', 'power-tools', homePage.navPowerTools);
  });

  test('Other category only displays other products', async ({ homePage, request }) => {
    await homePage.checkCategory(request, 'Other', 'other', homePage.navOther);
  });

  test('Special Tools category only displays special tools', async ({ homePage, request }) => {
    await homePage.checkCategory(request, 'Special Tools', 'special-tools', homePage.navSpecialTools);
  });

  test('Category checkboxes filter products', async ({ homePage, request }) => {
    test.setTimeout(120000);
    await homePage.checkCategoryCheckboxes(request);
  });

  test('ForgeFlex Tools checkbox filters products on 1 page', async ({ homePage }) => {
  await homePage.navigateTo();

  const brandId = await homePage.brandForgeFlexTools.getAttribute('value');

  expect(brandId).not.toBeNull();

  if (!brandId) {
    throw new Error('ForgeFlex Tools checkbox has no brand ID');
  }

  const responsePromise = homePage.page.waitForResponse(response => {
    const url = new URL(response.url());

    if (
      url.hostname !== 'api.practicesoftwaretesting.com' ||
      url.pathname !== '/products'
    ) {
      return false;
    }

    const requestBody: unknown = response.request().postDataJSON();

    if (typeof requestBody !== 'object' || requestBody === null) {
      return false;
    }

    if (!('by_brand' in requestBody)) {
      return false;
    }

    return requestBody.by_brand === brandId;
  });

  await homePage.brandForgeFlexTools.check();
  await expect(homePage.brandForgeFlexTools).toBeChecked();

  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();

  const products = ((await response.json()) as ProductsResponse).data;

  expect(products.length).toBeGreaterThan(0);

  for (const product of products) {
    expect(product.brand.id).toBe(brandId);
  }

  const expectedNames = products.map(product => product.name);
  await expect(homePage.productNames).toHaveText(expectedNames);
});

 test('MightyCraft Hardware checkbox filters products on 1 page', async ({ homePage }) => {
  await homePage.navigateTo();

  const brandId = await homePage.brandMightyCraftHardware.getAttribute('value');

  expect(brandId).not.toBeNull();

  if (!brandId) {
    throw new Error('MightyCraft Hardware checkbox has no brand ID');
  }

  const responsePromise = homePage.page.waitForResponse(response => {
    const url = new URL(response.url());

    if (
      url.hostname !== 'api.practicesoftwaretesting.com' ||
      url.pathname !== '/products'
    ) {
      return false;
    }

    const requestBody: unknown = response.request().postDataJSON();

    if (typeof requestBody !== 'object' || requestBody === null) {
      return false;
    }

    if (!('by_brand' in requestBody)) {
      return false;
    }

    return requestBody.by_brand === brandId;
  });

  await homePage.brandMightyCraftHardware.check();
  await expect(homePage.brandMightyCraftHardware).toBeChecked();

  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();

  const products = ((await response.json()) as ProductsResponse).data;

  expect(products.length).toBeGreaterThan(0);

  for (const product of products) {
    expect(product.brand.id).toBe(brandId);
  }

  const expectedNames = products.map(product => product.name);
  await expect(homePage.productNames).toHaveText(expectedNames);
});

 test('Show only eco-friendly products checkbox filters products on 1 page', async ({ homePage }) => {
  await homePage.navigateTo();

  const responsePromise = homePage.page.waitForResponse(response => {
    const url = new URL(response.url());

    if (
      url.hostname !== 'api.practicesoftwaretesting.com' ||
      url.pathname !== '/products'
    ) {
      return false;
    }

    const requestBody: unknown = response.request().postDataJSON();

    if (typeof requestBody !== 'object' || requestBody === null) {
      return false;
    }

    if (!('eco_friendly' in requestBody)) {
      return false;
    }

    return requestBody.eco_friendly === 'true';
  });

  await homePage.showOnlyEcoFriendly.check();
  await expect(homePage.showOnlyEcoFriendly).toBeChecked();

  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();

  const products = ((await response.json()) as ProductsResponse).data;

  expect(products.length).toBeGreaterThan(0);

  for (const product of products) {
    expect(product.is_eco_friendly).toBe(true);
  }

  const expectedNames = products.map(product => product.name);
  await expect(homePage.productNames).toHaveText(expectedNames);
});

test('ForgeFlex Tools checkbox filters products on all pages', async ({ homePage }) => {
  await homePage.checkBrandProductsOnAllPages('ForgeFlex Tools');
});

test('MightyCraft Hardware checkbox filters products on all pages', async ({ homePage }) => {
  await homePage.checkBrandProductsOnAllPages('MightyCraft Hardware');
});

test('Show only eco-friendly products checkbox filters products on all pages', async ({ homePage }) => {
  test.setTimeout(120000);
  await homePage.checkEcoFriendlyProductsOnAllPages();
});

});

test.describe('Online Toolshop - UI tests, search results', () => {
  test('Search results only contain products matching the keyword', async ({ homePage }) => {
    await homePage.navigateTo();

    const keyword = 'Hammer';
    const names = await homePage.searchAndGetResultNames(keyword);

    expect(names.length).toBeGreaterThan(0);
    expect(names.every(name => name.toLowerCase().includes(keyword.toLowerCase()))).toBeTruthy();
    console.log(names);
  });

  test('Search for a non-existing product shows no results', async ({ homePage }) => {
    await homePage.navigateTo();

    const names = await homePage.searchAndGetResultNames('zzzxqy123');

    expect(names).toHaveLength(0);
    await expect(homePage.productCards).toHaveCount(0);
    await expect(homePage.noResultsMessage).toBeVisible();
  });

  test('Search results in the UI match the API response', async ({ homePage, request }) => {
    await homePage.navigateTo();

    const keyword = 'Hammer';
    const uiNames = await homePage.searchAndGetResultNames(keyword);

    const response = await request.get(
      `https://api.practicesoftwaretesting.com/products/search?q=${keyword}`
    );
    expect(response.ok()).toBeTruthy();
    const apiNames = ((await response.json()) as ProductsResponse).data.map(
      product => product.name.trim()
    );

    expect(uiNames.length).toBeGreaterThan(0);
    expect([...uiNames].sort()).toEqual([...apiNames].sort());
  });  
});

test.describe('Online Toolshop - UI tests, products in alphabetical ascendant and descendant order', () => {
  test('Sort the prducts A-Z on page 1', async ({ homePage }) => {
    await homePage.navigateTo();

    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'name,asc',
      homePage.productNames,
      (left, right) => left.localeCompare(right)
    );

    // Productnamen ophalen
    const products = (await homePage.productNames.allTextContents()).map(name =>
      name.trim()
    );

    // Verwachte volgorde maken (met [...products] maken we een kopie van de array, zodat we de originele array niet wijzigen)
    const sorted = [...products].sort((a, b) => a.localeCompare(b));

    // Vergelijken
    expect(products).toEqual(sorted);

    console.log(products);
  });

  test('Sort the products Z-A on page 1', async ({ homePage }) => {
    await homePage.navigateTo();

    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'name,desc',
      homePage.productNames,
      (left, right) => right.localeCompare(left)
    );

    // Productnamen ophalen
    const products = (await homePage.productNames.allTextContents()).map(name =>
      name.trim()
    );

    // Verwachte volgorde maken (met [...products] maken we een kopie van de array, zodat we de originele array niet wijzigen)
    const sorted = [...products].sort((a, b) => b.localeCompare(a));

    // Vergelijken
    expect(products).toEqual(sorted);

    console.log(products);

  });

  test('Sort the products A-Z on all pages', async ({ homePage }) => {
    await homePage.navigateTo();
    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'name,asc',
      homePage.productNames,
      (left, right) => left.localeCompare(right)
    );

    const products = await homePage.collectAllProductNames();
    const sorted = [...products].sort((a, b) => a.localeCompare(b));

    expect(products).toEqual(sorted);

    console.log(products);

  });

  test('Sort the products Z-A on all pages', async ({ homePage }) => {
    await homePage.navigateTo();
    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'name,desc',
      homePage.productNames,
      (left, right) => right.localeCompare(left)
    );

    const products = await homePage.collectAllProductNames();
    const sorted = [...products].sort((a, b) => b.localeCompare(a));

    expect(products).toEqual(sorted);

    console.log(products);

  });  
});

test.describe('Online Toolshop - UI tests, prices in ascending and descending order', () => {
  test('Sort products by price ascending on page 1', async ({ homePage }) => {
    await homePage.navigateTo();

    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'price,asc',
      homePage.productPrices,
      homePage.comparePrices
    );

    const prices = (await homePage.productPrices.allTextContents()).map(price =>
      price.trim()
    );
    const sorted = [...prices].sort(homePage.comparePrices);

    expect(prices).toEqual(sorted);

    console.log(prices);
  });

  test('Sort products by price descending on page 1', async ({ homePage }) => {
    await homePage.navigateTo();

    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'price,desc',
      homePage.productPrices,
      (left, right) => homePage.comparePrices(right, left)
    );

    const prices = (await homePage.productPrices.allTextContents()).map(price =>
      price.trim()
    );
    const sorted = [...prices].sort((left, right) =>
      homePage.comparePrices(right, left)
    );

    expect(prices).toEqual(sorted);

    console.log(prices);
  });

  test('Sort products by price ascending on all pages', async ({ homePage }) => {
    await homePage.navigateTo();
    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'price,asc',
      homePage.productPrices,
      homePage.comparePrices
    );

    const prices = await homePage.collectAllPrices();
    const sorted = [...prices].sort(homePage.comparePrices);

    expect(prices).toEqual(sorted);

    console.log(prices);
  });

  test('Sort products by price descending on all pages', async ({ homePage }) => {
    await homePage.navigateTo();
    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'price,desc',
      homePage.productPrices,
      (left, right) => homePage.comparePrices(right, left)
    );

    const prices = await homePage.collectAllPrices();
    const sorted = [...prices].sort((a, b) => homePage.comparePrices(b, a));

    expect(prices).toEqual(sorted);

    console.log(prices);

  });
});

test.describe('Online Toolshop - UI tests, CO2 ratings', () => {
  const compareRatings = (left: string, right: string): number =>
    left.localeCompare(right);

  test('Sort products by CO2 rating (A-E), on 1 page', async ({ homePage }) => {
    await homePage.navigateTo();
    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'co2_rating,asc',
      homePage.co2Ratings,
      compareRatings
    );

    const ratings = (await homePage.co2Ratings.allTextContents()).map(rating =>
      rating.trim()
    );
    expect(ratings).toEqual([...ratings].sort(compareRatings));
    console.log(ratings);
  });

  test('Sort products by CO2 rating (E-A), on 1 page', async ({ homePage }) => {
    await homePage.navigateTo();
    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'co2_rating,desc',
      homePage.co2Ratings,
      (left, right) => compareRatings(right, left)
    );

    const ratings = (await homePage.co2Ratings.allTextContents()).map(rating =>
      rating.trim()
    );
    expect(ratings).toEqual(
      [...ratings].sort((left, right) => compareRatings(right, left))
    );
    console.log(ratings);
  });

  test('Sort products by CO2 rating (A-E), on all pages', async ({ homePage }) => {
    await homePage.navigateTo();
    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'co2_rating,asc',
      homePage.co2Ratings,
      compareRatings
    );

    const ratings = await homePage.collectAllCo2Ratings();
    expect(ratings).toEqual([...ratings].sort(compareRatings));
    console.log(ratings);
  });

  test('Sort products by CO2 rating (E-A), on all pages', async ({ homePage }) => {
    await homePage.navigateTo();
    await homePage.selectSortAndWaitForProducts(
      homePage.page,
      'co2_rating,desc',
      homePage.co2Ratings,
      (left, right) => compareRatings(right, left)
    );

    const ratings = await homePage.collectAllCo2Ratings();
    expect(ratings).toEqual(
      [...ratings].sort((left, right) => compareRatings(right, left))
    );
    console.log(ratings);
  });
});

test.describe('Online Toolshop - UI tests, price range slider', () => {

  test('Price range slider filters products on page 1', async ({ homePage }) => {
    const priceRange = getRandomPriceRange();
    await homePage.navigateTo();
    await homePage.setPriceRange(priceRange.minPrice, priceRange.maxPrice);

    const prices = (await homePage.productPrices.allTextContents()).map(price =>
      homePage.parsePrice(price.trim())
    );

    if (prices.length === 0) {
      await expect(homePage.noResultsMessage).toBeVisible();
    } else {
      expect(
        prices.every(
          price => price >= priceRange.minPrice && price <= priceRange.maxPrice
        )
      ).toBeTruthy();
    }
    console.log(prices);
  });

  test('Price range slider filters products on all pages', async ({ homePage }) => {
    const priceRange = getRandomPriceRange();
    await homePage.navigateTo();
    await homePage.setPriceRange(priceRange.minPrice, priceRange.maxPrice);

    const prices = await homePage.collectAllPrices();
    const parsedPrices = prices.map(price => homePage.parsePrice(price.trim()));

    if (parsedPrices.length === 0) {
      await expect(homePage.noResultsMessage).toBeVisible();
    } else {
      expect(
        parsedPrices.every(
          price => price >= priceRange.minPrice && price <= priceRange.maxPrice
        )
      ).toBeTruthy();
    }
    console.log(parsedPrices);
  });

  test('Price range by drag filters products on page 1', async ({ homePage }) => {
    const priceRange = getRandomPriceRange();
    await homePage.navigateTo();
    await homePage.setPriceRangeByDrag(priceRange.minPrice, priceRange.maxPrice);

    const prices = (await homePage.productPrices.allTextContents()).map(price =>
      homePage.parsePrice(price.trim())
    );

    if (prices.length === 0) {
      await expect(homePage.noResultsMessage).toBeVisible();
    } else {
      expect(
        prices.every(
          price => price >= priceRange.minPrice && price <= priceRange.maxPrice
        )
      ).toBeTruthy();
    }
    console.log(prices);
  });

  test('Price range by drag filters products on all pages', async ({ homePage }) => {
    const priceRange = getRandomPriceRange();
    await homePage.navigateTo();
    await homePage.setPriceRangeByDrag(priceRange.minPrice, priceRange.maxPrice);

    const prices = await homePage.collectAllPrices();
    const parsedPrices = prices.map(price => homePage.parsePrice(price.trim()));

    if (parsedPrices.length === 0) {
      await expect(homePage.noResultsMessage).toBeVisible();
    } else {
      expect(
        parsedPrices.every(
          price => price >= priceRange.minPrice && price <= priceRange.maxPrice
        )
      ).toBeTruthy();
    }
    console.log(parsedPrices);
  });

  test('accessibility test pricerange by keyboard', async ({ homePage }) => {
    const priceRange = getRandomPriceRange();
    await homePage.navigateTo();

    await homePage.setPriceByKeyboard(priceRange.minPrice, priceRange.maxPrice);

    const prices = await homePage.collectAllPrices();
    const parsedPrices = prices.map(price => homePage.parsePrice(price.trim()));

    if (parsedPrices.length === 0) {
      await expect(homePage.noResultsMessage).toBeVisible();
    } else {
      expect(
        parsedPrices.every(
          price => price >= priceRange.minPrice && price <= priceRange.maxPrice
        )
      ).toBeTruthy();
    }
    console.log(parsedPrices);
  });

});

test('go to page', async ({ homePage }) => {
  await homePage.navigateTo();
});
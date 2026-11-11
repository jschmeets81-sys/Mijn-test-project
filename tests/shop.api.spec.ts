import { test, expect } from '@playwright/test';
import { HomePage, type ProductsResponse } from '../pages/HomePage';

test.describe('Online Toolshop - API Tests, products in alphabetical ascendant and descendant order', () => {
  
  test('Products alphabetical ascendant A-Z, on 1 page', async ({ request }) => {
    const productNames: string[] = [];
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';

    const firstResponse = await request.get(`${apiUrl}?sort=name%2Casc&page=1`);
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    productNames.push(...firstPage.data.map(product => product.name));

    const alphabeticallySorted = [...productNames].sort((a, b) =>
      a.localeCompare(b)
    );

    expect(productNames).toEqual(alphabeticallySorted);

    console.log(productNames);
  });
  
test('Products alphabetical descendant Z-A, on 1 page', async ({ request }) => {
    const productNames: string[] = [];
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';

    const firstResponse = await request.get(`${apiUrl}?sort=name%2Cdesc&page=1`);
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    productNames.push(...firstPage.data.map(product => product.name));

    const alphabeticallySorted = [...productNames].sort((a, b) =>
      b.localeCompare(a)
    );

    expect(productNames).toEqual(alphabeticallySorted);

    console.log(productNames);
  });

  test('Products alphabetical ascendant A-Z, on all pages', async ({ request }) => {
    const productNames: string[] = [];
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';

    const firstResponse = await request.get(`${apiUrl}?sort=name%2Casc&page=1`);
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    productNames.push(...firstPage.data.map(product => product.name));

    for (let pageNumber = 2; pageNumber <= firstPage.last_page; pageNumber++) {
      const response = await request.get(
        `${apiUrl}?sort=name%2Casc&page=${pageNumber}`
      );
      expect(response.ok()).toBeTruthy();

      const page = (await response.json()) as ProductsResponse;
      productNames.push(...page.data.map(product => product.name));
    }

    const alphabeticallySorted = [...productNames].sort((a, b) =>
      a.localeCompare(b)
    );

    expect(productNames).toEqual(alphabeticallySorted);

    console.log(productNames);
  });

  test('Products alphabetical descendant Z-A, on all pages', async ({ request }) => {
    const productNames: string[] = [];
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';

    const firstResponse = await request.get(`${apiUrl}?sort=name%2Cdesc&page=1`);
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    productNames.push(...firstPage.data.map(product => product.name));

    for (let pageNumber = 2; pageNumber <= firstPage.last_page; pageNumber++) {
      const response = await request.get(
        `${apiUrl}?sort=name%2Cdesc&page=${pageNumber}`
      );
      expect(response.ok()).toBeTruthy();

      const page = (await response.json()) as ProductsResponse;
      productNames.push(...page.data.map(product => product.name));
    }

    const alphabeticallyDescendantSorted = [...productNames].sort((a, b) =>
      b.localeCompare(a)
    );

    expect(productNames).toEqual(alphabeticallyDescendantSorted);

    console.log(productNames);
  });
});

test.describe('Online Toolshop - API Tests, prices in ascendant and descendant order', () => {
  
    test('Products prices ascending, on 1 page', async ({ request }) => {
    const productPrices: string[] = [];
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';

    const firstResponse = await request.get(
      `${apiUrl}?sort=price%2Casc&page=1`
    );
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    productPrices.push(...firstPage.data.map(product =>     HomePage.formatPrice(product.price)));

        const sortedPrices = [...productPrices].sort(HomePage.comparePrices);
    expect(productPrices).toEqual(sortedPrices);

    console.log(productPrices);
  });

    test('Products prices descending, on 1 page', async ({ request }) => {
    const productPrices: string[] = [];
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';

    const firstResponse = await request.get(
      `${apiUrl}?sort=price%2Cdesc&page=1`
    );
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    productPrices.push(...firstPage.data.map(product =>     HomePage.formatPrice(product.price)));

        const sortedPrices = [...productPrices].sort((a, b) => HomePage.comparePrices(b, a));
    expect(productPrices).toEqual(sortedPrices);

    console.log(productPrices);
  });
  
  test('Products prices ascending, on all pages', async ({ request }) => {
    const productPrices: string[] = [];
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';

    const firstResponse = await request.get(
      `${apiUrl}?sort=price%2Casc&page=1`
    );
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    productPrices.push(...firstPage.data.map(product => HomePage.formatPrice(product.price)));

    for (
      let pageNumber = 2;
      pageNumber <= firstPage.last_page;
      pageNumber++
    ) {
      const response = await request.get(
        `${apiUrl}?sort=price%2Casc&page=${pageNumber}`
      );
      expect(response.ok()).toBeTruthy();

      const page = (await response.json()) as ProductsResponse;
      productPrices.push(...page.data.map(product =>       HomePage.formatPrice(product.price)));
    }

          const sortedPrices = [...productPrices].sort(HomePage.comparePrices);
    expect(productPrices).toEqual(sortedPrices);

    console.log(productPrices);
  });

  test('Products prices descending, on all pages', async ({ request }) => {
    const productPrices: string[] = [];
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';

    const firstResponse = await request.get(
      `${apiUrl}?sort=price%2Cdesc&page=1`
    );
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    productPrices.push(...firstPage.data.map(product => HomePage.formatPrice(product.price)));

    for (
      let pageNumber = 2;
      pageNumber <= firstPage.last_page;
      pageNumber++
    ) {
      const response = await request.get(
        `${apiUrl}?sort=price%2Cdesc&page=${pageNumber}`
      );
      expect(response.ok()).toBeTruthy();

      const page = (await response.json()) as ProductsResponse;
      productPrices.push(...page.data.map(product =>       HomePage.formatPrice(product.price)));
    }

          const sortedPrices = [...productPrices].sort((a, b) => HomePage.comparePrices(b, a));
    expect(productPrices).toEqual(sortedPrices);

    console.log(productPrices);
  });
});

test.describe('Online Toolshop - API Tests, CO2 ratings', () => {
  const compareRatings = (left: string, right: string): number =>
    left.localeCompare(right);

  test('Products CO2 ratings ascending, on 1 page', async ({ request }) => {
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';
    const response = await request.get(
      `${apiUrl}?sort=co2_rating%2Casc&page=1`
    );
    expect(response.ok()).toBeTruthy();

    const firstPage = (await response.json()) as ProductsResponse;
    const ratings = firstPage.data.map(product => product.co2_rating);

    expect(ratings).toEqual([...ratings].sort(compareRatings));
    console.log(ratings);
  });

  test('Products CO2 ratings descending, on 1 page', async ({ request }) => {
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';
    const response = await request.get(
      `${apiUrl}?sort=co2_rating%2Cdesc&page=1`
    );
    expect(response.ok()).toBeTruthy();

    const firstPage = (await response.json()) as ProductsResponse;
    const ratings = firstPage.data.map(product => product.co2_rating);

    expect(ratings).toEqual(
      [...ratings].sort((left, right) => compareRatings(right, left))
    );
    console.log(ratings);
  });

  test('Products CO2 ratings ascending, on all pages', async ({ request }) => {
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';
    const firstResponse = await request.get(
      `${apiUrl}?sort=co2_rating%2Casc&page=1`
    );
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    const ratings = firstPage.data.map(product => product.co2_rating);

    for (let pageNumber = 2; pageNumber <= firstPage.last_page; pageNumber++) {
      const response = await request.get(
        `${apiUrl}?sort=co2_rating%2Casc&page=${pageNumber}`
      );
      expect(response.ok()).toBeTruthy();

      const page = (await response.json()) as ProductsResponse;
      ratings.push(...page.data.map(product => product.co2_rating));
    }

    expect(ratings).toEqual([...ratings].sort(compareRatings));
    console.log(ratings);
  });

  test('Products CO2 ratings descending, on all pages', async ({ request }) => {
    const apiUrl = 'https://api.practicesoftwaretesting.com/products';
    const firstResponse = await request.get(
      `${apiUrl}?sort=co2_rating%2Cdesc&page=1`
    );
    expect(firstResponse.ok()).toBeTruthy();

    const firstPage = (await firstResponse.json()) as ProductsResponse;
    const ratings = firstPage.data.map(product => product.co2_rating);

    for (let pageNumber = 2; pageNumber <= firstPage.last_page; pageNumber++) {
      const response = await request.get(
        `${apiUrl}?sort=co2_rating%2Cdesc&page=${pageNumber}`
      );
      expect(response.ok()).toBeTruthy();

      const page = (await response.json()) as ProductsResponse;
      ratings.push(...page.data.map(product => product.co2_rating));
    }

    expect(ratings).toEqual(
      [...ratings].sort((left, right) => compareRatings(right, left))
    );
    console.log(ratings);
  });
});
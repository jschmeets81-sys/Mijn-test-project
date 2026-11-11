import {
  expect,
  type APIRequestContext,
  type Locator,
  type Page,
  type Response as PlaywrightResponse,
} from '@playwright/test';

export class HomePage {
  // Static so API tests can use them without a Page instance
  static formatPrice = (price: number): string => {
    const formattedPrice = price.toFixed(2);
    return `$${formattedPrice}`;
  };

  static parsePrice = (price: string): number => {
    const priceWithoutCurrencySymbol = price.replace(/^\$/, '');
    const trimmedPrice = priceWithoutCurrencySymbol.trim();
    return Number(trimmedPrice);
  };

  static comparePrices = (left: string, right: string): number => {
    const leftPrice = HomePage.parsePrice(left);
    const rightPrice = HomePage.parsePrice(right);
    return leftPrice - rightPrice;
  };

  // Instance aliases so page-based tests can keep using homePage.comparePrices
  parsePrice = HomePage.parsePrice;
  comparePrices = HomePage.comparePrices;

  page: Page;
  navHome: Locator;
  navCategories: Locator;
  navContact: Locator;
  navSignIn: Locator;
  navHandTools: Locator;
  navPowerTools: Locator;
  navOther: Locator;
  navSpecialTools: Locator;
  navRentals: Locator;
  searchInput: Locator;
  searchResetBtn: Locator;
  searchButton: Locator;
  sortSelect: Locator;
  priceSliderMin: Locator;
  priceSliderMax: Locator;
  categoryCheckboxes: Locator;
  brandCheckboxes: Locator;
  productGrid: Locator;
  productCards: Locator;
  productCard1: Locator;
  productCard2: Locator
  productCard3: Locator;
  productCard4: Locator;
  productCard5: Locator;
  productCard6: Locator;
  productCard7: Locator;
  productCard8: Locator;
  productCard9: Locator;
  productTitles: Locator;
  productNames: Locator;
  productPrices: Locator;
  co2Ratings: Locator;
  nextButton: Locator;
  nextButtonDisabled: Locator;
  activePage: Locator;
  sliderBar: Locator;
  noResultsMessage: Locator;
  brandForgeFlexTools: Locator;
  brandMightyCraftHardware: Locator;
  showOnlyEcoFriendly: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header locators 
    this.navHome = page.getByRole('link', { name: 'Home' });
    this.navCategories = page.getByRole('button', { name: 'Categories' });
    this.navContact = page.getByRole('link', { name: 'Contact' });
    this.navSignIn = page.getByRole('link', { name: 'Sign in' });

    //submenu Categories locators
    this.navHandTools = page.getByRole('link', { name: 'Hand Tools' });
    this.navPowerTools = page.getByRole('link', { name: 'Power Tools' });
    this.navOther = page.getByRole('link', { name: 'Other' });
    this.navSpecialTools = page.getByRole('link', { name: 'Special Tools' });
    this.navRentals = page.getByRole('link', { name: 'Rentals' });


    // Searchbar locators
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchResetBtn = page.locator('[data-test="search-reset"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.sortSelect = page.locator('[data-test="sort"]');

    // Filter locators
    this.sliderBar = page.locator('.ngx-slider-bar');
    this.priceSliderMin = page.locator('.ngx-slider-pointer-min');
    this.priceSliderMax = page.locator('.ngx-slider-pointer-max');
    this.categoryCheckboxes = page.locator('.checkbox [data-test^="category-"]');
    this.brandCheckboxes = page.locator('.checkbox [data-test^="brand-"]');

    // Product grid locators
    this.productGrid = page.locator('.col-md-9');
    this.productCards = page.locator('a.card');
    this.productCard1 = page.locator('a.card').nth(0);
    this.productCard2 = page.locator('a.card').nth(1);
    this.productCard3 = page.locator('a.card').nth(2);
    this.productCard4 = page.locator('a.card').nth(3);
    this.productCard5 = page.locator('a.card').nth(4);
    this.productCard6 = page.locator('a.card').nth(5);
    this.productCard7 = page.locator('a.card').nth(6);
    this.productCard8 = page.locator('a.card').nth(7);
    this.productCard9 = page.locator('a.card').nth(8);
    this.productTitles = page.locator('.card-title');

    //Navigation through products locators
    this.nextButton = page.locator('[data-test="pagination-next"]');
    this.activePage = page.locator('li.page-item.active button');
    this.nextButtonDisabled = page.locator('li.page-item.disabled [data-test="pagination-next"]');

    //Product names, prices locators
    this.productNames = page.locator('[data-test="product-name"]');
    this.productPrices = page.locator('[data-test="product-price"]');
    this.co2Ratings = page.locator('[data-test="co2-rating-badge"] .active');
    this.noResultsMessage = page.getByText('There are no products found.');

    // Brand filter locators
    this.brandForgeFlexTools = page.getByLabel('ForgeFlex Tools');
    this.brandMightyCraftHardware = page.getByLabel('MightyCraft Hardware');
    this.showOnlyEcoFriendly = page.getByLabel('Show only eco-friendly products');
  }

  async navigateTo() {
    await this.page.goto('https://practicesoftwaretesting.com');
  }

  async searchFor(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  // Searches and waits for the search response, so results are never read before they are updated
  async searchAndGetResultNames(keyword: string): Promise<string[]> {
    const responsePromise = this.page.waitForResponse(response => {
      const url = new URL(response.url());
      return (
        url.hostname === 'api.practicesoftwaretesting.com' &&
        url.pathname === '/products/search'
      );
    });

    await this.searchFor(keyword);
    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();

    // Wait until the grid shows either results or the "no products" message
    await expect(
      this.productNames.first().or(this.noResultsMessage)
    ).toBeVisible();

    const productNames = await this.productNames.allTextContents();
    const trimmedProductNames: string[] = [];

    for (const productName of productNames) {
      trimmedProductNames.push(productName.trim());
    }

    return trimmedProductNames;
  }


  async collectAllProductNames(): Promise<string[]> {
    const allProducts: string[] = [];
    let currentPage = 1;

    while (true) {
      const productNamesOnPage = await this.productNames.allTextContents();
      for (const productName of productNamesOnPage) {
        allProducts.push(productName.trim());
      }

      if (await this.nextButtonDisabled.count()) {
        break;
      }

      const responsePromise = this.page.waitForResponse(response => {
        const url = new URL(response.url());
        return (
          url.hostname === 'api.practicesoftwaretesting.com' &&
          url.pathname === '/products'
        );
      });

      await this.nextButton.click();
      const response = await responsePromise;
      expect(response.ok()).toBeTruthy();

      currentPage++;
      await expect(this.activePage).toHaveAttribute(
        'aria-label',
        `Page-${currentPage}`
      );
    }

    return allProducts;
  }

  async collectAllPrices(): Promise<string[]> {
    const allPrices: string[] = [];
    let currentPage = 1;

    while (true) {
      const pricesOnPage = await this.productPrices.allTextContents();
      for (const price of pricesOnPage) {
        allPrices.push(price.trim());
      }

      if (
        (await this.nextButton.count()) === 0 ||
        (await this.nextButtonDisabled.count()) > 0
      ) {
        break;
      }

      const nextPage = currentPage + 1;
      const responsePromise = this.page.waitForResponse(response => {
        const url = new URL(response.url());
        return (
          url.hostname === 'api.practicesoftwaretesting.com' &&
          url.pathname === '/products'
        );
      });

      await this.nextButton.click();

      const response = await responsePromise;
      expect(response.ok()).toBeTruthy();

      currentPage = nextPage;
      await expect(this.activePage).toHaveAttribute(
        'aria-label',
        `Page-${currentPage}`
      );
    }

    return allPrices;
  }

  async collectAllCo2Ratings(): Promise<string[]> {
    const allRatings: string[] = [];
    let currentPage = 1;

    while (true) {
      const ratingsOnPage = await this.co2Ratings.allTextContents();
      for (const rating of ratingsOnPage) {
        allRatings.push(rating.trim());
      }

      if (await this.nextButtonDisabled.count()) {
        break;
      }

      const nextPage = currentPage + 1;
      const responsePromise = this.page.waitForResponse(response => {
        const url = new URL(response.url());
        return (
          url.hostname === 'api.practicesoftwaretesting.com' &&
          url.pathname === '/products'
        );
      });

      await this.nextButton.click();

      const response = await responsePromise;
      expect(response.ok()).toBeTruthy();

      currentPage = nextPage;
      await expect(this.activePage).toHaveAttribute(
        'aria-label',
        `Page-${currentPage}`
      );
    }

    return allRatings;
  }

  async setPriceRange(minValue: number, maxValue: number) {
    await this.priceSliderMin.focus();
    const minNow = Number(await this.priceSliderMin.getAttribute('aria-valuenow'));
    await this.priceSliderMax.focus();
    const maxNow = Number(await this.priceSliderMax.getAttribute('aria-valuenow'));

    const rangeChanged = minNow !== minValue || maxNow !== maxValue;
    let responsePromise: Promise<PlaywrightResponse> | undefined;

    if (rangeChanged) {
      responsePromise = this.page.waitForResponse(response => {
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

        if (!('between' in requestBody)) {
          return false;
        }

        const requestedPriceRange = `price,${minValue},${maxValue}`;
        return requestBody.between === requestedPriceRange;
      });
    }

    const moveSlider = async (slider: Locator, value: number) => {
      const pointerBounds = await slider.boundingBox();
      const trackBounds = await slider.locator('..').boundingBox();
      if (!pointerBounds || !trackBounds) {
        throw new Error('Could not determine price slider dimensions');
      }

      const minimumSliderValue = Number(
        await slider.getAttribute('aria-valuemin')
      );
      const maximumSliderValue = Number(
        await slider.getAttribute('aria-valuemax')
      );
      const valueRange = maximumSliderValue - minimumSliderValue;
      const distanceFromMinimum = value - minimumSliderValue;
      const valueRatio = distanceFromMinimum / valueRange;
      const availableTrackWidth = trackBounds.width - pointerBounds.width;
      const targetX =
        trackBounds.x +
        pointerBounds.width / 2 +
        valueRatio * availableTrackWidth;
      const centerY = pointerBounds.y + pointerBounds.height / 2;

      await this.page.mouse.move(
        pointerBounds.x + pointerBounds.width / 2,
        centerY
      );
      await this.page.mouse.down();
      await this.page.mouse.move(targetX, centerY);
      await this.page.mouse.up();

      const currentValue = Number(await slider.getAttribute('aria-valuenow'));
      if (currentValue !== value) {
        await slider.focus();
        if (currentValue < value) {
          await this.page.keyboard.press('ArrowRight');
        } else {
          await this.page.keyboard.press('ArrowLeft');
        }
        await expect(slider).toHaveAttribute('aria-valuenow', String(value));
      }
    };

    if (minValue > maxNow) {
      if (maxNow !== maxValue) {
        await moveSlider(this.priceSliderMax, maxValue);
      }
      if (minNow !== minValue) {
        await moveSlider(this.priceSliderMin, minValue);
      }
    } else {
      if (minNow !== minValue) {
        await moveSlider(this.priceSliderMin, minValue);
      }
      if (maxNow !== maxValue) {
        await moveSlider(this.priceSliderMax, maxValue);
      }
    }

    if (responsePromise) {
      const response = await responsePromise;
      expect(response.ok()).toBeTruthy();
    }

    await expect.poll(async () => {
      const displayedPrices = await this.productPrices.allTextContents();
      const pricesAsNumbers: number[] = [];

      for (const displayedPrice of displayedPrices) {
        const priceWithoutCurrencySymbol = displayedPrice
          .trim()
          .replace(/^\$/, '');
        pricesAsNumbers.push(Number(priceWithoutCurrencySymbol));
      }

      for (const price of pricesAsNumbers) {
        if (price < minValue || price > maxValue) {
          return false;
        }
      }

      return true;
    }).toBe(true);
  }

  async setPriceRangeByDrag(minValue: number, maxValue: number) {
    const minNow = Number(await this.priceSliderMin.getAttribute('aria-valuenow'));
    const maxNow = Number(await this.priceSliderMax.getAttribute('aria-valuenow'));
    const rangeChanged = minNow !== minValue || maxNow !== maxValue;

    let responsePromise: Promise<PlaywrightResponse> | undefined;

    if (rangeChanged) {
      responsePromise = this.page.waitForResponse(response => {
        const url = new URL(response.url());
        if (
          url.hostname !== 'api.practicesoftwaretesting.com' ||
          url.pathname !== '/products'
        ) {
          return false;
        }

        const body: unknown = response.request().postDataJSON();
        if (typeof body !== 'object' || body === null) {
          return false;
        }

        if (!('between' in body)) {
          return false;
        }

        const requestedPriceRange = `price,${minValue},${maxValue}`;
        return body.between === requestedPriceRange;
      });
    }

    const dragTo = async (slider: Locator, value: number) => {
      await slider.scrollIntoViewIfNeeded();
      const handle = await slider.boundingBox();
      const track = await slider.locator('..').boundingBox();

      if (!handle || !track) {
        throw new Error('Could not determine price slider dimensions');
      }

      const minimumSliderValue = Number(
        await slider.getAttribute('aria-valuemin')
      );
      const maximumSliderValue = Number(
        await slider.getAttribute('aria-valuemax')
      );
      const valueRange = maximumSliderValue - minimumSliderValue;
      const distanceFromMinimum = value - minimumSliderValue;
      const valueRatio = distanceFromMinimum / valueRange;
      const availableTrackWidth = track.width - handle.width;
      const targetX =
        track.x + handle.width / 2 + valueRatio * availableTrackWidth;
      const centerY = handle.y + handle.height / 2;

      await this.page.mouse.move(handle.x + handle.width / 2, centerY);
      await this.page.mouse.down();
      await this.page.mouse.move(targetX, centerY, { steps: 10 });
      await this.page.mouse.up();

      const currentValue = Number(await slider.getAttribute('aria-valuenow'));
      if (currentValue !== value) {
        await slider.focus();
        if (currentValue < value) {
          await this.page.keyboard.press('ArrowRight');
        } else {
          await this.page.keyboard.press('ArrowLeft');
        }
        await expect(slider).toHaveAttribute('aria-valuenow', String(value));
      }
    };

    if (minValue > maxNow) {
      if (maxNow !== maxValue) {
        await dragTo(this.priceSliderMax, maxValue);
      }
      if (minNow !== minValue) {
        await dragTo(this.priceSliderMin, minValue);
      }
    } else {
      if (minNow !== minValue) {
        await dragTo(this.priceSliderMin, minValue);
      }
      if (maxNow !== maxValue) {
        await dragTo(this.priceSliderMax, maxValue);
      }
    }

    if (responsePromise) {
      const response = await responsePromise;
      expect(response.ok()).toBeTruthy();
    }

    await expect.poll(async () => {
      const displayedPrices = await this.productPrices.allTextContents();
      const pricesAsNumbers: number[] = [];

      for (const displayedPrice of displayedPrices) {
        const priceWithoutCurrencySymbol = displayedPrice
          .trim()
          .replace(/^\$/, '');
        pricesAsNumbers.push(Number(priceWithoutCurrencySymbol));
      }

      for (const price of pricesAsNumbers) {
        if (price < minValue || price > maxValue) {
          return false;
        }
      }

      return true;
    }).toBe(true);
  }

  async setPriceByKeyboard(minValue: number, maxValue: number) {
    const minNow = Number(await this.priceSliderMin.getAttribute('aria-valuenow'));
    const maxNow = Number(await this.priceSliderMax.getAttribute('aria-valuenow'));
    const rangeChanged = minNow !== minValue || maxNow !== maxValue;

    let responsePromise: Promise<PlaywrightResponse> | undefined;

    if (rangeChanged) {
      responsePromise = this.page.waitForResponse(response => {
        const url = new URL(response.url());
        if (
          url.hostname !== 'api.practicesoftwaretesting.com' ||
          url.pathname !== '/products'
        ) {
          return false;
        }

        const body: unknown = response.request().postDataJSON();
        if (typeof body !== 'object' || body === null) {
          return false;
        }

        if (!('between' in body)) {
          return false;
        }

        const requestedPriceRange = `price,${minValue},${maxValue}`;
        return body.between === requestedPriceRange;
      });
    }

    await this.priceSliderMin.focus();

    if (minValue > maxNow) {
      await this.priceSliderMax.focus();
      if (maxNow !== maxValue) {
        for (let i = maxNow; i < maxValue; i++) {
          await this.priceSliderMax.press('ArrowRight');
        }
      }
      await expect(this.priceSliderMax).toHaveAttribute(
        'aria-valuenow',
        String(maxValue)
      );

      await this.priceSliderMin.focus();
      if (minNow !== minValue) {
        for (let i = minNow; i < minValue; i++) {
          await this.priceSliderMin.press('ArrowRight');
        }
      }
      await expect(this.priceSliderMin).toHaveAttribute(
        'aria-valuenow',
        String(minValue)
      );
    } else {
      await this.priceSliderMin.focus();
      if (minNow !== minValue) {
        for (let i = minNow; i > minValue; i--) {
          await this.priceSliderMin.press('ArrowLeft');
        }
        for (let i = minNow; i < minValue; i++) {
          await this.priceSliderMin.press('ArrowRight');
        }
      }
      await expect(this.priceSliderMin).toHaveAttribute(
        'aria-valuenow',
        String(minValue)
      );

      await this.priceSliderMax.focus();
      if (maxNow !== maxValue) {
        for (let i = maxNow; i > maxValue; i--) {
          await this.priceSliderMax.press('ArrowLeft');
        }
        for (let i = maxNow; i < maxValue; i++) {
          await this.priceSliderMax.press('ArrowRight');
        }
      }
      await expect(this.priceSliderMax).toHaveAttribute(
        'aria-valuenow',
        String(maxValue)
      );
    }

    if (responsePromise) {
      const response = await responsePromise;
      expect(response.ok()).toBeTruthy();
    }

    await expect.poll(async () => {
      const displayedPrices = await this.productPrices.allTextContents();
      const pricesAsNumbers: number[] = [];

      for (const displayedPrice of displayedPrices) {
        const priceWithoutCurrencySymbol = displayedPrice
          .trim()
          .replace(/^\$/, '');
        pricesAsNumbers.push(Number(priceWithoutCurrencySymbol));
      }

      for (const price of pricesAsNumbers) {
        if (price < minValue || price > maxValue) {
          return false;
        }
      }

      return true;
    }).toBe(true);
  }

  async selectSortAndWaitForProducts(
    page: Page,
    sortOption: string,
    products: Locator,
    compare: (left: string, right: string) => number
  ) {
    await expect(products.first()).toBeVisible();

    const responsePromise = page.waitForResponse(response => {
      const url = new URL(response.url());
      if (url.hostname !== 'api.practicesoftwaretesting.com') {
        return false;
      }

      if (url.pathname !== '/products') {
        return false;
      }

      return true;
    });

    await this.sortSelect.selectOption(sortOption);

    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();

    await expect.poll(async () => {
      const displayedValues = await products.allTextContents();
      const values: string[] = [];

      for (const displayedValue of displayedValues) {
        values.push(displayedValue.trim());
      }

      if (values.length === 0) {
        return false;
      }

      for (let index = 1; index < values.length; index++) {
        const previousValue = values[index - 1];
        const currentValue = values[index];
        const comparisonResult = compare(previousValue, currentValue);

        if (comparisonResult > 0) {
          return false;
        }
      }

      return true;
    }).toBe(true);
  }

  async checkCategory(
    request: APIRequestContext,
    categoryName: string,
    categorySlug: string,
    categoryLink: Locator
  ) {
    const categoriesResponse = await request.get(
      'https://api.practicesoftwaretesting.com/categories'
    );
    expect(categoriesResponse.ok()).toBeTruthy();
    const categories = (await categoriesResponse.json()) as CategoryResponse[];

    await this.navigateTo();
    await this.navCategories.click();

    const productsResponsePromise = this.page.waitForResponse(response => {
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

      if (!('by_category_slug' in requestBody)) {
        return false;
      }

      return requestBody.by_category_slug === categorySlug;
    });

    await categoryLink.click();
    const productsResponse = await productsResponsePromise;
    expect(productsResponse.ok()).toBeTruthy();
    await expect(this.page).toHaveURL(`/category/${categorySlug}`);

    const products = ((await productsResponse.json()) as ProductsResponse).data;
    if (products.length === 0) {
      await expect(this.productCards).toHaveCount(0);
      await expect(this.noResultsMessage).toBeVisible();
    } else {
      let category: CategoryResponse | undefined;
      for (const item of categories) {
        if (item.name === categoryName) {
          category = item;
          break;
        }
      }

      if (!category) {
        throw new Error(`${categoryName} category was not returned by the API`);
      }

      const subcategoryIds: string[] = [];
      for (const item of categories) {
        if (item.parent_id === category.id) {
          subcategoryIds.push(item.id);
        }
      }

      expect(subcategoryIds.length).toBeGreaterThan(0);

      let allProductsBelongToSubcategory = true;
      for (const product of products) {
        const productBelongsToSubcategory = subcategoryIds.includes(
          product.category.id
        );
        if (!productBelongsToSubcategory) {
          allProductsBelongToSubcategory = false;
          break;
        }
      }
      expect(allProductsBelongToSubcategory).toBeTruthy();

      const expectedProductNames: string[] = [];
      for (const product of products) {
        expectedProductNames.push(product.name);
      }

      await expect(this.productNames).toHaveText(expectedProductNames);
    }
  }

  async checkCategoryCheckboxes(request: APIRequestContext) {
    const categoriesResponse = await request.get(
      'https://api.practicesoftwaretesting.com/categories'
    );
    expect(categoriesResponse.ok()).toBeTruthy();
    const categories = (await categoriesResponse.json()) as CategoryResponse[];

    await this.navigateTo();
    await expect(this.categoryCheckboxes.first()).toBeVisible();
    const categoryIds = await this.categoryCheckboxes.evaluateAll(checkboxes => {
      const ids: Array<string | null> = [];

      for (const checkbox of checkboxes) {
        ids.push(checkbox.getAttribute('value'));
      }

      return ids;
    });
    expect(categoryIds.length).toBeGreaterThan(0);

    for (const categoryId of categoryIds) {
      if (!categoryId) {
        throw new Error('A category checkbox has no category ID');
      }

      let category: CategoryResponse | undefined;
      for (const item of categories) {
        if (item.id === categoryId) {
          category = item;
          break;
        }
      }

      if (!category) {
        throw new Error(`Category ${categoryId} was not returned by the API`);
      }

      await this.navigateTo();
      const categoryValueLocator = this.page.locator(`[value="${categoryId}"]`);
      const categoryCheckbox = this.categoryCheckboxes.and(categoryValueLocator);
      await expect(categoryCheckbox).toBeVisible();

      const responsePromise = this.page.waitForResponse(response => {
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

        if (!('by_category' in requestBody)) {
          return false;
        }

        const selectedCategoryIds = requestBody.by_category;
        if (typeof selectedCategoryIds !== 'string') {
          return false;
        }

        const categoryIds = selectedCategoryIds.split(',');
        return categoryIds.includes(categoryId);
      });

      await categoryCheckbox.check();
      await expect(categoryCheckbox).toBeChecked();
      const response = await responsePromise;
      expect(response.ok(), `Product request for ${category.name}`).toBeTruthy();
      const products = ((await response.json()) as ProductsResponse).data;

      if (products.length === 0) {
        await expect(this.productCards).toHaveCount(0);
        await expect(this.noResultsMessage).toBeVisible();
      } else {
        const allowedCategoryIds = [categoryId];
        for (const item of categories) {
          if (item.parent_id === categoryId) {
            allowedCategoryIds.push(item.id);
          }
        }

        let allProductsBelongToAllowedCategory = true;
        for (const product of products) {
          const productBelongsToAllowedCategory = allowedCategoryIds.includes(
            product.category.id
          );
          if (!productBelongsToAllowedCategory) {
            allProductsBelongToAllowedCategory = false;
            break;
          }
        }

        expect(
          allProductsBelongToAllowedCategory,
          `Products for ${category.name} must belong to that category`
        ).toBeTruthy();

        const expectedProductNames: string[] = [];
        for (const product of products) {
          expectedProductNames.push(product.name);
        }

        await expect(this.productNames).toHaveText(expectedProductNames);
      }
      console.log(`Checked category: ${category.name}`);
    }
  }

  async checkBrandProductsOnAllPages(brandName: string) {
  await this.navigateTo();

  const brandCheckbox = this.page.getByLabel(brandName, { exact: true });
  const brandId = await brandCheckbox.getAttribute('value');

  if (!brandId) {
    throw new Error(`${brandName} checkbox has no brand ID`);
  }

  // Herken het productverzoek met het geselecteerde merkfilter.
  const isBrandResponse = (response: PlaywrightResponse) => {
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
  };

  // Begin met wachten voordat de checkbox wordt aangevinkt.
  const firstResponsePromise = this.page.waitForResponse(isBrandResponse);

  await brandCheckbox.check();
  await expect(brandCheckbox).toBeChecked();

  let response = await firstResponsePromise;
  expect(response.ok()).toBeTruthy();

  let productsResponse = (await response.json()) as ProductsResponse;

  const lastPage = productsResponse.last_page;
  expect(lastPage).toBeGreaterThan(0);

  for (let currentPage = 1; currentPage <= lastPage; currentPage++) {
    // Controleer of het API-antwoord bij de verwachte pagina hoort.
    expect(productsResponse.current_page).toBe(currentPage);

    await expect(brandCheckbox).toBeChecked();

    if (lastPage > 1) {
      await expect(this.activePage).toHaveAttribute(
        'aria-label',
        `Page-${currentPage}`
      );
    }

    const products = productsResponse.data;
    expect(products.length).toBeGreaterThan(0);

    const expectedNames: string[] = [];

    for (const product of products) {
      expect(product.brand.id).toBe(brandId);
      expectedNames.push(product.name);
    }

    // Wacht totdat de productnamen van deze pagina zichtbaar zijn.
    await expect(this.productNames).toHaveText(expectedNames);

    console.log(`Checked ${brandName} products on page ${currentPage}`);

    // Haal alleen een volgende pagina op als die er is.
    if (currentPage < lastPage) {
      const nextResponsePromise = this.page.waitForResponse(isBrandResponse);

      await this.nextButton.click();

      response = await nextResponsePromise;
      expect(response.ok()).toBeTruthy();

      productsResponse = (await response.json()) as ProductsResponse;
    }
  }
}

  async checkEcoFriendlyProductsOnAllPages() {
  await this.navigateTo();

  const isEcoFriendlyResponse = (response: PlaywrightResponse) => {
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
  };

  const firstResponsePromise = this.page.waitForResponse(isEcoFriendlyResponse);

  await this.showOnlyEcoFriendly.check();
  await expect(this.showOnlyEcoFriendly).toBeChecked();

  let response = await firstResponsePromise;
  expect(response.ok()).toBeTruthy();

  let productsResponse = (await response.json()) as ProductsResponse;
  const lastPage = productsResponse.last_page;
  expect(lastPage).toBeGreaterThan(0);

  for (let currentPage = 1; currentPage <= lastPage; currentPage++) {
    expect(productsResponse.current_page).toBe(currentPage);
    await expect(this.showOnlyEcoFriendly).toBeChecked();

    // Na het filteren geeft de webshop pagina 1 niet direct als actief aan.
    if (currentPage > 1) {
      await expect(this.activePage).toHaveAttribute(
        'aria-label',
        `Page-${currentPage}`
      );
    }

    const products = productsResponse.data;
    expect(products.length).toBeGreaterThan(0);

    const expectedNames: string[] = [];

    for (const product of products) {
      expect(product.is_eco_friendly).toBe(true);
      expectedNames.push(product.name);
    }

    await expect(this.productNames).toHaveText(expectedNames);
    console.log(`Checked eco-friendly products on page ${currentPage}`);

    if (currentPage < lastPage) {
      const nextResponsePromise = this.page.waitForResponse(isEcoFriendlyResponse);
      const nextPageButton = this.page.getByRole('button', {
        name: `Page-${currentPage + 1}`,
        exact: true,
      });

      await nextPageButton.click();

      response = await nextResponsePromise;
      expect(response.ok()).toBeTruthy();

      productsResponse = (await response.json()) as ProductsResponse;
      }
  }
}
}

export interface ProductsResponse {
  current_page: number;
  last_page: number;
  data: Array<{
    name: string;
    price: number;
    co2_rating: string;
    category: { id: string; name: string; slug: string };
    brand: {
      id: string;
      name: string;
    };
    is_eco_friendly: boolean;
  }>;
}

export interface CategoryResponse {
  id: string;
  name: string;
  parent_id: string | null;
}

export function getRandomPriceRange() {
  const minimumPossiblePrice = 0;
  const maximumPossiblePrice = 200;
  const numberOfPossiblePrices = maximumPossiblePrice - minimumPossiblePrice + 1;
  const firstRandomNumber = Math.random() * numberOfPossiblePrices;
  const firstPrice = Math.floor(firstRandomNumber) + minimumPossiblePrice;

  let secondPrice = firstPrice;
  while (secondPrice === firstPrice) {
    const nextRandomNumber = Math.random() * numberOfPossiblePrices;
    secondPrice = Math.floor(nextRandomNumber) + minimumPossiblePrice;
  }

  let minPrice = firstPrice;
  let maxPrice = secondPrice;
  if (firstPrice > secondPrice) {
    minPrice = secondPrice;
    maxPrice = firstPrice;
  }

  return { minPrice, maxPrice };
}

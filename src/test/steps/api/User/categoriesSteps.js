import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// ===========================
// USER CATEGORY API OPERATIONS
// ===========================

// ---------- User GET Requests ----------
// Note: User sets the endpoint is handled by plantSteps.js {word} generic step

When('User sends GET request', async function () {
  // Build URL with query parameters if they exist
  let url = this.endpoint;
  if (this.queryParams) {
    const params = new URLSearchParams(this.queryParams);
    url = `${this.endpoint}?${params.toString()}`;
  }

  this.response = await this.apiContext.get(url);

  try {
    this.responseBody = await this.response.json();
  } catch (error) {
    this.responseBody = {};
  }
});

Given('User sets query parameters', function (dataTable) {
  this.queryParams = {};
  const rows = dataTable.rawTable.slice(1); // Skip header row
  
  rows.forEach(([key, value]) => {
    if (value !== '') { // Only add non-empty values
      this.queryParams[key] = value;
    }
  });
});

// ---------- User Assertions ----------

Then('Response body should be a non-empty array', function () {
  expect(Array.isArray(this.responseBody)).toBe(true);
  expect(this.responseBody.length).toBeGreaterThan(0);
});

Then('Each category should have properties {string}, {string}, {string}', function (prop1, prop2, prop3) {
  expect(Array.isArray(this.responseBody)).toBe(true);
  expect(this.responseBody.length).toBeGreaterThan(0);
  
  this.responseBody.forEach((category, index) => {
    expect(category).toHaveProperty(prop1);
    expect(category).toHaveProperty(prop2);
    expect(category).toHaveProperty(prop3);
  });
});

Then('Each category should have properties {string}, {string}', function (prop1, prop2) {
  expect(Array.isArray(this.responseBody)).toBe(true);
  expect(this.responseBody.length).toBeGreaterThan(0);
  
  this.responseBody.forEach((category, index) => {
    expect(category).toHaveProperty(prop1);
    expect(category).toHaveProperty(prop2);
  });
});

Then('Response body should have pagination structure', function () {
  expect(this.responseBody).toHaveProperty('content');
  expect(Array.isArray(this.responseBody.content)).toBe(true);
  expect(this.responseBody).toHaveProperty('totalElements');
  expect(this.responseBody).toHaveProperty('totalPages');
  expect(this.responseBody).toHaveProperty('size');
  expect(this.responseBody).toHaveProperty('number');
  expect(this.responseBody).toHaveProperty('first');
  expect(this.responseBody).toHaveProperty('last');
});

Then('Each category should have no parent', function () {
  this.responseBody.forEach((cat, index) => {
    const parentValue = cat.parentId ?? cat.parentName ?? null;
    expect(parentValue).toBeNull();
  });
});

Then('Number of records should be less than or equal to {int}', function (size) {
  expect(this.responseBody.content.length).toBeLessThanOrEqual(size);
});

Then('Results should be sorted by {string} in {string} order', function (field, dir) {
  const data = this.responseBody.content;
  
  if (data.length < 2) {
    return; // Cannot verify sorting with less than 2 items
  }

  // Log all values to debug
  console.log(`\nVerifying ${dir.toUpperCase()} sort order for field: ${field}`);
  console.log(`Total records: ${data.length}`);
  
  let violations = [];
  
  for (let i = 1; i < data.length; i++) {
    const current = data[i][field];
    const previous = data[i - 1][field];
    
    // Handle null/undefined values
    if (current == null || previous == null) continue;
    
    // String comparison using case-insensitive localeCompare
    if (typeof current === 'string' && typeof previous === 'string') {
      const comparison = previous.toLowerCase().localeCompare(current.toLowerCase());
      
      if (dir.toLowerCase() === 'asc') {
        // For ascending: previous should be <= current, so comparison should be <= 0
        if (comparison > 0) {
          violations.push(`  [${i-1}→${i}]: "${previous}" > "${current}"`);
        }
      } else {
        // For descending: previous should be >= current, so comparison should be >= 0
        if (comparison < 0) {
          violations.push(`  [${i-1}→${i}]: "${previous}" < "${current}"`);
        }
      }
    } else {
      // Numeric comparison
      if (dir.toLowerCase() === 'asc') {
        if (current < previous) {
          violations.push(`  [${i-1}→${i}]: ${previous} > ${current}`);
        }
      } else {
        if (current > previous) {
          violations.push(`  [${i-1}→${i}]: ${previous} < ${current}`);
        }
      }
    }
  }
  
  if (violations.length > 0) {
    console.log(`\n⚠ Sorting violations found (${violations.length}):`);
    violations.forEach(v => console.log(v));
    throw new Error(`Results are not sorted by "${field}" in "${dir}" order.\nFound ${violations.length} violation(s):\n${violations.join('\n')}`);
  } else {
    console.log(`✓ All ${data.length} records are correctly sorted in ${dir.toUpperCase()} order`);
  }
});

// ---------- User POST Request (For Access Denial Test) ----------

When('User sends POST request for categories with payload', async function (docString) {
  const payload = JSON.parse(docString);

  this.response = await this.apiContext.post(this.endpoint, {
    data: payload
  });

  try {
    this.responseBody = await this.response.json();
  } catch (error) {
    this.responseBody = {};
  }
});

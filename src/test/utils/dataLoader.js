import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testDataPath = join(__dirname, '..', 'testdata');

export function loadCredentials(role = 'admin') {
    const data = JSON.parse(readFileSync(join(testDataPath, 'credentials.json'), 'utf-8'));
    return data[role.toLowerCase()];
}

export function loadConfig() {
    return JSON.parse(readFileSync(join(testDataPath, 'config.json'), 'utf-8'));
}

export function loadCategoryData(scenario = null) {
    const data = JSON.parse(readFileSync(join(testDataPath, 'categories.json'), 'utf-8'));
    if (scenario) {
        return data.validCategories[scenario] || data.invalidCategories[scenario] || data.testCategories.find(c => c.name === scenario);
    }
    return data;
}

export function loadPlantData(scenario = null) {
    const data = JSON.parse(readFileSync(join(testDataPath, 'plants.json'), 'utf-8'));
    if (scenario) {
        return data.validPlants[scenario] || data.invalidPlants[scenario];
    }
    return data;
}

export function loadSalesData(scenario = null) {
    const data = JSON.parse(readFileSync(join(testDataPath, 'sales.json'), 'utf-8'));
    if (scenario) {
        return data.validSales[scenario] || data.invalidSales[scenario];
    }
    return data;
}

import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';
import { clickActionButton } from '../utils/commonActions.js';

export class PlantsPage extends BasePage {
    constructor(page) {
        super(page);
        this.addPlantButton = 'Add a Plant';
        this.plantNameInput = 'input[name="name"]';
        this.categoryDropdown = '#categoryId';
        this.priceInput = 'input[name="price"]';
        this.quantityInput = 'input[name="quantity"]';
        this.saveButton = 'Save';
        this.cancelButton = 'Cancel';
        this.pagination = 'ul.pagination';
        this.plantTable = 'table';
    }

    async clickAddPlant() {
        await this.clickButtonByText(this.addPlantButton);
    }

    async fillPlantForm(plantData) {
        if (plantData.name !== undefined) {
            await this.fill(this.plantNameInput, plantData.name);
        }
        if (plantData.price !== undefined) {
            await this.fill(this.priceInput, plantData.price);
        }
        if (plantData.category && plantData.category.trim() !== '') {
            await this.select(this.categoryDropdown, { index: 1 });
        }
        if (plantData.quantity !== undefined) {
            await this.fill(this.quantityInput, plantData.quantity);
        }
    }

    async clickSaveButton() {
        await this.clickButtonByText(this.saveButton);
    }

    async clickCancelButton() {
        await this.clickButtonByText(this.cancelButton);
    }

    async clickEditForFirstRecord() {
        const firstRow = this.getLocator('tbody tr').first();
        await this.verifyVisible(firstRow);
        await clickActionButton(firstRow, 'Edit');
    }

    async clickDeleteForFirstRecord() {
        const firstRow = this.getLocator('tbody tr').first();
        await this.verifyVisible(firstRow);

        const dialogPromise = this.handleDialog('dismiss', true);
        await clickActionButton(firstRow, 'Delete');
        return await dialogPromise;
    }

    async clickActionButtonInFirstRow(buttonName) {
        const firstRow = this.getLocator('tbody tr').first();
        await this.verifyVisible(firstRow);

        if (buttonName === 'Delete') {
            const dialogPromise = this.handleDialog('dismiss', true);
            await clickActionButton(firstRow, buttonName);
            return await dialogPromise;
        } else {
            await clickActionButton(firstRow, buttonName);
        }
    }

    async verifyPlantExists(plantName) {
        if (plantName && plantName.trim() !== '') {
            const plantCell = this.getLocator('table').getByRole('cell', { name: plantName, exact: true });
            await this.verifyVisible(plantCell);
        }
    }

    async verifyPlantNotExists(plantName) {
        if (plantName && plantName.trim() !== '') {
            const plantCell = this.getLocator('table').getByRole('cell', { name: plantName, exact: true });
            await this.verifyNotVisible(plantCell);
        }
    }

    async verifyErrorMessage(message) {
        await this.verifyMessage(message);
    }

    async verifySuccessMessage(message) {
        await this.verifyMessage(message);
    }

    async verifyPaginationVisible() {
        const pagination = this.getLocator(this.pagination);
        await this.verifyVisible(pagination);
    }

    async clickNextPage() {
        await this.clickButtonByText('Next');
    }

    async verifyCurrentActivePage(pageNumber) {
        const activePage = this.getLocator('ul.pagination .active');
        await this.verifyText(activePage, pageNumber);
    }

    async verifyAddPlantButtonVisible() {
        const button = this.getByRole('link', { name: this.addPlantButton });
        await this.verifyVisible(button);
    }

    async verifyCurrentPlantDetails() {
        expect(this.page.url()).toContain('/edit');
        await expect(this.getLocator('#name')).not.toBeEmpty();
        await expect(this.getLocator('#price')).not.toBeEmpty();
        await expect(this.getLocator('#quantity')).not.toBeEmpty();
        await expect(this.getLocator('#categoryId')).not.toHaveValue('');
    }

    async verifyOnPlantsPage() {
        await this.verifyURL('/ui/plants');
    }

    async verifyDeleteConfirmation(expectedMessage) {
        return expectedMessage;
    }
}

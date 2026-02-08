import { BasePage } from './BasePage.js';
import { clickActionButton } from '../utils/commonActions.js';

export class SalesPage extends BasePage {
    constructor(page) {
        super(page);
        this.addSaleButton = 'Add Sale';
        this.plantDropdown = 'select[name="plantId"]';
        this.quantityInput = 'input[name="quantity"]';
        this.customerNameInput = 'input[name="customerName"]';
        this.customerEmailInput = 'input[name="customerEmail"]';
        this.saveButton = 'Save';
        this.cancelButton = 'Cancel';
        this.salesTable = 'table';
        this.pagination = '.pagination';
    }

    async clickAddSale() {
        await this.clickButtonByText(this.addSaleButton);
    }

    async fillSaleForm(saleData) {
        if (saleData.plant) {
            await this.select(this.plantDropdown, { label: saleData.plant });
        }
        if (saleData.quantity !== undefined) {
            await this.fill(this.quantityInput, saleData.quantity);
        }
        if (saleData.customerName) {
            await this.fill(this.customerNameInput, saleData.customerName);
        }
        if (saleData.customerEmail) {
            await this.fill(this.customerEmailInput, saleData.customerEmail);
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

    async verifyErrorMessage(message) {
        await this.verifyMessage(message);
    }

    async verifySuccessMessage(message) {
        await this.verifyMessage(message);
    }

    async verifySalesTableVisible() {
        await this.verifyVisible(this.salesTable);
    }

    async verifyPaginationVisible() {
        await this.verifyVisible(this.pagination);
    }

    async verifyOnSalesPage() {
        await this.verifyURL('/ui/sales');
    }
}

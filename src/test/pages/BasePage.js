import { expect } from "@playwright/test";

export class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigateTo(url) {
        await this.page.goto(url);
    }

    // Extracted the complex generic button click logic from your existing steps
    async clickGenericButton(buttonName) {
        // Try to handle dialogs if this is a Delete action
        if (buttonName === "Delete") {
            this.page.once('dialog', async dialog => {
                this.page.lastDialogMessage = dialog.message();
                await dialog.dismiss();
            });
        }

        const firstRow = this.page.locator('tbody tr').first();

        // Strategy 1: Global button/link (e.g., "Add a Plant")
        const globalBtn = this.page.getByRole('button', { name: buttonName });
        const globalLink = this.page.getByRole('link', { name: buttonName });

        // Strategy 2: Action buttons inside the table (e.g., Edit/Delete)
        const actionBtn = firstRow.getByRole('button', { name: buttonName });
        const actionLink = firstRow.getByRole('link', { name: buttonName });
        const actionTitle = firstRow.locator(`[title="${buttonName}"]`);
        const actionAria = firstRow.locator(`[aria-label="${buttonName}"]`);
        const actionHref = firstRow.locator(`a[href*="/${buttonName.toLowerCase()}/"]`);

        if (await globalBtn.count() > 0 && await globalBtn.isVisible()) {
            await globalBtn.click();
        }
        else if (await globalLink.count() > 0 && await globalLink.isVisible()) {
            await globalLink.click();
        }
        else if (await firstRow.isVisible()) {
            // Check table actions
            if (await actionBtn.count() > 0) await actionBtn.click();
            else if (await actionLink.count() > 0) await actionLink.click();
            else if (await actionTitle.count() > 0) await actionTitle.click();
            else if (await actionAria.count() > 0) await actionAria.click();
            else if (await actionHref.count() > 0) await actionHref.click();
            else throw new Error(`Failed to find button: ${buttonName}`);
        } else {
            throw new Error(`Failed to find button: ${buttonName}`);
        }
    }

    async verifyUrlContains(urlPart) {
        await expect(this.page).toHaveURL(new RegExp(urlPart));
    }

    async verifyTextVisible(text) {
        const messageLocator = this.page.getByText(text, { exact: false });
        await expect(messageLocator).toBeVisible();
    }
}

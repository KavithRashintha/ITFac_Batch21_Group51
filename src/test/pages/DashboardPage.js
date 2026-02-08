import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async verifyDashboardLoaded() {
        await this.verifyURL('/ui/dashboard');
    }

    async navigateToModule(moduleName) {
        const moduleMap = {
            'categories': '/ui/categories',
            'plants': '/ui/plants',
            'sales': '/ui/sales'
        };

        const path = moduleMap[moduleName.toLowerCase()];
        if (path) {
            await this.navigateTo(path);
        } else {
            throw new Error(`Unknown module: ${moduleName}`);
        }
    }
    async clickSidebarMenu(menuName) {
        const menuItem = this.page.locator(`text=${menuName}`).first();
        await menuItem.click();
    }

    async verifyCurrentUrl(route) {
        await this.verifyURL(route);
    }
}

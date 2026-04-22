import { Page } from '@playwright/test'

export class OrderLockupPage {
    //Construtor é o método ou função que é executado automaticamente quando eu ativo a classe.
    constructor(private page: Page) { }

    async searchOrder(code: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
    }
}
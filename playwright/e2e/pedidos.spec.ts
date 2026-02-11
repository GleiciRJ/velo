import { test, expect } from '@playwright/test'

/// AAA - Arrange, Act, Assert --> (PAV - Preparar, Agir, Verificar)

test('deve consultar um pedido aprovado', async ({ page }) => {
 
  //Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  //Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-J0OFVJ')
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

  //Assert
  /*await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10_000})
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-J0OFVJ')*/   
  
  /*await expect(page.getByTestId('order-result-status')).toBeVisible()
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')*/
  
  //** DESAFIO 1: AULA - SOBREVIVA SEM DATA TEST IDs***

  //SOLUÇÃO 1: 
  /*RESPOSTA: Neste caso, que não existe o data-testid, eu só tenho o nome da classe que pode ser repetida em outros parágrafos,
              logo, a utilização do filter se faz necessária para que seja considerado apenas o texto vísivel no resultado da consulta, 
              ou seja, o número do pedido que estou passando em hasText*/
  await expect(page.locator('p.font-mono.font-medium').filter({ hasText: 'VLO-J0OFVJ' })).toBeVisible()
  
  /*RESPOSTA: Aqui mesmo esquema que a justificativa acima, porém, é uma div e possui mais de uma classe.
              Foi necessário utilizar as classes mais estáveis que representam o texto do status e não representação visual.
              E, após localizar a div, novamente foi utilizado o filter para considerar o status visível do pedido no resultado da consulta. */
  await expect(page.locator('div.font-medium.text-sm').filter({ hasText: 'APROVADO' })).toBeVisible()


  /*SOLUÇÃO 2: Utilizando os mesmos locators mas sem filtrar (filter) pelo nome do elemento visível no resultado da consulta.
               O risco aqui é o CSS se repetir em algum outro ponto da tela e isso quebraria o teste.
               E também não estou garantindo que o texto informado em toHaveText é exclusivo do CSS informado. 
               Essa garantia eu tenho com o uso do filter na SOLUÇÃO 1.*/
  //await expect(page.locator('p.font-mono.font-medium')).toHaveText ('VLO-J0OFVJ')
  //await expect(page.locator('div.font-medium.text-sm')).toHaveText ('APROVADO')

})
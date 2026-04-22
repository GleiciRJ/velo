import { test, expect } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'   // ../ => sai da pasta e2e

import { OrderLockupPage } from '../support/pages/OrderLockupPage'  

/// AAA - Arrange, Act, Assert --> (PAV - Preparar, Agir, Verificar)

// Funciona como se fosse um agrupador de testes automatizados, como se fosse uma suite, um GRUPO
test.describe('Consulta de Pedido', () => {

  //Implementando os Hooks (ganchos)

  //Este gancho será responsável por acessar a página do Velo e acionar o link de consulta de pedido
  //e será executado antes de cada teste.
  test.beforeEach(async ({ page }) => {
    console.log(
      'beforeEach: roda antes de cada teste.'
    )

    //Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  /* // Estes ganchos não serão utilizados neste momento.

  test.beforeAll(async() => {
    console.log(
      'beforeAll: roda uma vez antes de todos os testes.'
    ) 
  }) 

  test.afterEach(async() => {
    console.log(
      'afterEach: roda depois de cada teste.'
    )
  })

  test.afterAll(async() => {
    console.log(
      'afterAll: roda uma vez depois de todos os testes.'
    ) 
  */

  // 2 Testes com cenários distintos, porém, com comportamento igual.
  test('deve consultar um pedido aprovado', async ({ page }) => {

    //Test Data
    // Essa constante recebe um texto.
    // const order = "VLO-J0OFVJ"

    // IMPORTANTE: NO TESTE DE SOFTWARE A CLAREZA É MAIS IMPORTANTE QUE O CÓDIGO!!! NUNCA USAR IFs TESTANDO CONDIÇÕES DIFERENTES EM UM MESMO TESTE!!
    // REPETIR BLOCOS PARA DEIXAR O CENÁRIO MAIS SIMPLES E FÁCIL DE ENTENDER! REPITA SEM DÓ NEM PIEDADE!!! 
    // NÃO CRIE CÓDIGOS DA NASA!

    // Essa super constante será um objeto
    const order = {
      number: 'VLO-J0OFVJ',
      status: 'APROVADO',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Gleici Rodrigues',
        email: 'gleici@velo.dev'
      },
      payment: 'À Vista'
    }

    //Arrange - Código de acesso à página e clique no link de consulta pedido foi movido para o gancho/hook beforeEach para organização do código.

    //Act - Duplicado em ambos os testes mas não foi para o gancho porque trabalha com dados diferentes em cada teste.
    // Código original: Aqui especificamente um pedido aprovado.
    // await page.getByRole('textbox', { name: 'Código do Pedido' }).fill(order.number)
    // await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    // Proposta 1 Chat GPT: Chamada pela função searchOrder do código acima que foi customizado no Helpers
    // para fazer manutenção em um único local quando o nome do elemento mudar.
    // await searchOrder(page, order.number)

    //Proposta 3 Chat GPT: Page Objects (código mais organizado por classes, reúso e encapsulamento)
    const orderLockupPage = new OrderLockupPage(page)  //Page é passado somente na instância da classe.
    await orderLockupPage.searchOrder(order.number) // E aqui não é necessário passar page porque a constante já ganhou a sessão do navegador.

    //Assert

    //ABORDAGEM II (produtividade): Assert Snapshot (by codegen) - Valida por completo todos os elementos em um determinado local da página(bloco html ou componente completo), 
    // exatamente na ordem de posicionamento dos elementos (disposição renderizada do elemento).
    // Caractere ` => backtick (diferente das aspas simples) - é possível customizar expressões regulares e interpolar valores.
    // Possibilita retirar o dado hard coded (número do pedido por exemplo) e substituir pela constante order que já possui o valor do número do pedido
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number} 
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    //Double-Check para verificar o status específico. Obtendo o badge pelo valor do status.
    const statusBadge = page.getByRole('status').filter({ hasText: order.status })

    //Classe entre barras significa que ele usa o contains para uma classe específica entre as barras.
    //Com aspas simples, ele pega todas as classes existentes e gera um erro na execução.
    await expect(statusBadge).toHaveClass(/bg-green-100/)  //Verifica se o fundo é verde.
    await expect(statusBadge).toHaveClass(/text-green-700/)  //Verificar se o texto é verde escuro.

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide lucide-circle-check-big/)  //Verifica se o ícone é a imagem de check.

    /* ABORDAGEM I (abordagem mais convencional item por item): Valida o código do pedido e o status a nível de texto.
      RESOLUÇÃO DO DESAFIO 1 BY PAPITO:
      const containerPedido = page.getByRole('paragraph')
        .filter({ hasText: /^Pedido$/ }) // Expressão regular: ^começa com -- $termina com (senão usar, pega o container do título "Consulta Pedido" que também tem a palavra pedido.)
        .locator('..') // Sobe para o elemento pai (a div que agrupa ambos)  
  
      await expect(containerPedido).toContainText(order, { timeout: 10_000 })
      await expect(page.getByText('APROVADO')).toBeVisible() 
    */

    /* CÓDIGO ORIGINAL & MINHA SOLUÇÃO DO DESAFIO 1
   
    // CÓDIGO ORIGINAL
    //await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10_000})
    //await expect(page.getByTestId('order-result-id')).toContainText('VLO-J0OFVJ')   
    
    //await expect(page.getByTestId('order-result-status')).toBeVisible()
    //await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')
    
    //** DESAFIO 1: AULA - SOBREVIVA SEM DATA TEST IDs***
   
    //SOLUÇÃO 1: 
    //RESPOSTA: Neste caso, que não existe o data-testid, eu só tenho o nome da classe que pode ser repetida em outros parágrafos,
    //          logo, a utilização do filter se faz necessária para que seja considerado apenas o texto vísivel no resultado da consulta, 
    //          ou seja, o número do pedido que estou passando em hasText
    //await expect(page.locator('p.font-mono.font-medium').filter({ hasText: 'VLO-J0OFVJ' })).toBeVisible()
    
    /*RESPOSTA: Aqui mesmo esquema que a justificativa acima, porém, é uma div e possui mais de uma classe.
    //          Foi necessário utilizar as classes mais estáveis que representam o texto do status e não representação visual.
    //          E, após localizar a div, novamente foi utilizado o filter para considerar o status visível do pedido no resultado da consulta.
    //await expect(page.locator('div.font-medium.text-sm').filter({ hasText: 'APROVADO' })).toBeVisible()
   
   
    /*SOLUÇÃO 2: Utilizando os mesmos locators mas sem filtrar (filter) pelo nome do elemento visível no resultado da consulta.
    //           O risco aqui é o CSS se repetir em algum outro ponto da tela e isso quebraria o teste.
    //           E também não estou garantindo que o texto informado em toHaveText é exclusivo do CSS informado. 
    //           Essa garantia eu tenho com o uso do filter na SOLUÇÃO 1.
    //await expect(page.locator('p.font-mono.font-medium')).toHaveText ('VLO-J0OFVJ')
    //await expect(page.locator('div.font-medium.text-sm')).toHaveText ('APROVADO')
    */
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    //Test Data (ENTRADA DE DADOS)
    //const order = "VLO-17K12Z"

    const order = {
      number: 'VLO-17K12Z',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Gatitha Batata',
        email: 'gatitha@velo.com'
      },
      payment: 'À Vista'
    }

    //Arrange

    //Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    //Assert (SAÍDA DE DADOS)
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    const statusBadge = page.getByRole('status').filter({ hasText: order.status })

    await expect(statusBadge).toHaveClass(/bg-red-100/)
    await expect(statusBadge).toHaveClass(/text-red-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide lucide-circle-x/)
  })

  test('deve consultar um pedido em análise', async ({ page }) => {

    //Test Data (ENTRADA DE DADOS)

    const order = {
      number: 'VLO-GTIHV5',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Sérgio Lemos',
        email: 'sergio@velo.dev'
      },
      payment: 'À Vista'
    }

    //Arrange

    //Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    //Assert (SAÍDA DE DADOS)
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    const statusBadge = page.getByRole('status').filter({ hasText: order.status })

    await expect(statusBadge).toHaveClass(/bg-amber-100/)
    await expect(statusBadge).toHaveClass(/text-amber-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-clock/)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
    const order = generateOrderCode()

    //Arrange - Código de acesso à página e clique no link de consulta pedido foi movido para o gancho/hook beforeEach para organização do código.

    //Act - Duplicado em ambos os testes mas não foi para o gancho porque trabalha com dados diferentes em cada teste.
    //Aqui especificamente um pedido qualquer gerado dinamicamente.
    /* await page.getByRole('textbox', { name: 'Código do Pedido' }).fill(order)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click() */
    
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order)

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
            `); // level-3 => Nível do tipo de título.

    /* Forma original e outras formas:
    // Original:
    // await expect(page.locator('#root')).toContainText('Pedido não encontrado')
    // await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente')

    // Outras Formas:
     const title = page.getByRole('heading', {name: 'Pedido não encontrado', level: 3})
     await expect(title).toBeVisible()
   
     const message = page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente'}) //Forma mais elegante.
     await expect(message).toBeVisible()

    //const message = page.locator('//p[text()="Verifique o número do pedido e tente novamente"]') //Usandp xPath 
    */
  })
})
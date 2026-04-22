
// export => Exporta a função que tem a geração de código do pedido

//Função que gera número do pedido dinamicamente, no formato esperado do app Velo. (by chat GPT)
export function generateOrderCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  function getRandomChars(source, length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * source.length);
      result += source[randomIndex];
    }
    return result;
  }

  const prefix = getRandomChars(letters, 3);   // Ex: VLO
  const middle = getRandomChars(letters, 3);   // Ex: ABC
  const suffix = getRandomChars(numbers, 3);   // Ex: 123

  return `${prefix}-${middle}${suffix}`;
}
/**
 * Retorna a data formatada do primeiro dia do mês, recuado pelo número especificado de meses.
 * @param {number} mesesAnteriores - O número de meses para retroceder a partir da data atual.
 * @returns {string} - Uma string no formato "ano-mes-dia" representando o primeiro dia do mês retrocedido.
 */

export default function getCurrentCompt(mesesAnteriores) {

  let today = new Date();
  if (mesesAnteriores > 0) {
    today.setDate(1);
    today.setMonth(today.getMonth() - mesesAnteriores);
  }

  return today.toISOString().slice(0, 10);
}

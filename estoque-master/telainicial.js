var _produtos = getTable_ls('produto');
var _saida = getTable_ls('saida');
var lucroProduto = 0;
var qtdProdutosSaida = 0;

if (_saida) {
    _saida.forEach(function (_produto) {
        if (_produto) {
            if (_produto.preco) {
                var precoProduto = _produto.preco.toString().replace(',', '.'),
                    valorSaidaProduto = _produto.valorSaida.toString().replace(',', '.'),
                    quantidadeSaida = _produto.quantidadeSaida,
                    valorEntrada = Number(precoProduto),
                    valorSaida = Number(valorSaidaProduto),
                    lucro = (quantidadeSaida * valorSaida) - (quantidadeSaida * valorEntrada);

                lucroProduto += lucro;
                qtdProdutosSaida += quantidadeSaida;
            }
        }
    });
}

document.querySelector('.saida-produtos').innerHTML = qtdProdutosSaida;
document.querySelector('.qtd-lucro').innerHTML = 'R$' + lucroProduto.toFixed(2).toString().replace('.', ',');
document.querySelector('.qtd-produtos').innerHTML = _produtos?.length ?? 0;


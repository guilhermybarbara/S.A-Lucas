let tabela = document.querySelector('#tabela_saida tbody');

document.querySelector('#data_saida').valueAsDate = new Date();

function formatarData(data, showScreen) {
    let dataObj = new Date(data);

    let dia = dataObj.getUTCDate().toString().padStart(2, '0');
    let mes = (dataObj.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    let ano = dataObj.getUTCFullYear();

    if (showScreen) {
        return `${dia}/${mes}/${ano}`;
    } else {
        return `${ano}-${mes}-${dia}`;
    }
}

function gerarTabela() {
    var _produtos = getTable_ls('saida');

    tabela.innerHTML = '';

    if (_produtos) {
        _produtos.forEach(function (_produto) {
            if (_produto.preco) {
                var precoProduto = _produto.preco.toString().replace(',', '.'),
                    valorSaidaProduto = _produto.valorSaida.toString().replace(',', '.'),
                    quantidadeSaida = _produto.quantidadeSaida,
                    valorEntrada = Number(precoProduto),
                    valorSaida = Number(valorSaidaProduto),
                    lucro = (quantidadeSaida * valorSaida) - (quantidadeSaida * valorEntrada);

                tabela.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><input type="radio" name="check_item" value="${_produto.id}"></td>
                    <td>${_produto.id}</td>
                    <td>${_produto.nome}</td>
                    <td>${quantidadeSaida}</td>
                    <td>R$${valorEntrada.toFixed(2).replace('.', ',')}</td>
                    <td>R$${valorSaida.toFixed(2).replace('.', ',')}</td>
                    <td>R$${lucro.toFixed(2).replace('.', ',')}</td>
                    <td>${formatarData(_produto.validade, true)}</td>
                </tr>
            `);
            }
        });
    }
}

gerarTabela();

document.querySelector('#id_produto').addEventListener('change', function (e) {
    var idProduto = this.value,
        _produto = getData_ls('produto', idProduto);

    document.querySelector('#nome').value = _produto.nome;
    document.querySelector('#quantidade').value = _produto.quantidade;
    document.querySelector('#preco').value = _produto.preco;
    document.querySelector('#validade').value = formatarData(_produto.validade, false);
});

// Evento para editar produto ao selecionar o radio button
tabela.addEventListener('change', function (e) {
    if (e.target && e.target.type === 'radio') {
        var produtoId = e.target.value;
        var produto = getData_ls('saida', produtoId);
        document.querySelector('#id_produto').value = produtoId;
        document.querySelector('#nome').value = produto.nome;
        document.querySelector('#quantidade_saida').value = produto.quantidadeSaida;
        document.querySelector('#valor_saida').value = produto.valorSaida;
        document.querySelector('#validade').value = formatarData(produto.validade, false);
    }
});

document.querySelector('#btnLancarSaida').addEventListener('click', function (e) {
    var idProduto = document.querySelector('#id_produto').value,
        _produto = getData_ls('produto', idProduto),
        _produtoSaida = JSON.parse(JSON.stringify(_produto)),
        quantidade_saida = Number(document.querySelector('#quantidade_saida').value),
        valor_saida = Number(document.querySelector('#valor_saida').value),
        data_saida = document.querySelector('#data_saida').value;

    if (idProduto == '') {
        alert('Informe o id do produto');
        return;
    }

    if (quantidade_saida == '' || quantidade_saida == 0) {
        alert('Informe a quantidade');
        return;
    }

    delete _produtoSaida.id;
    delete _produtoSaida.quantidade;
    delete _produtoSaida.quantminima;

    _produto.quantidade = Number(_produto.quantidade) - quantidade_saida;
    _produtoSaida.quantidadeSaida = quantidade_saida;
    _produtoSaida.valorSaida = valor_saida;
    _produtoSaida.dataSaida = data_saida;

    save_ls('produto', _produto);
    save_ls('saida', _produtoSaida);

    document.querySelector('#wrap').querySelectorAll('input').forEach(function (_input) {
        _input.value = '';
    });

    gerarTabela();
});

// Função para excluir produtos selecionados
document.querySelector('#btnExcluir').addEventListener('click', function () {
    var selecionado = document.querySelector(`input[name="check_item"]:checked`);
    if (selecionado) {
        var produtoId = selecionado.value;
        deleteData_ls('saida', produtoId);
        gerarTabela();
        limparCampos();
    } else {
        alert('Por favor, selecione um produto para excluir.');
    }
});

// Função para editar um produto selecionado
document.querySelector('#btnEditar').addEventListener('click', function () {
    var selecionado = document.querySelector(`input[name="check_item"]:checked`);
    if (selecionado) {
        var produtoId = selecionado.value;
        var produto = getData_ls('saida', produtoId);
        produto.nome = document.querySelector('#nome').value;
        produto.quantidadeSaida = Number(document.querySelector('#quantidade_saida').value);
        produto.valorSaida = Number(document.querySelector('#valor_saida').value);
        produto.validade = new Date(document.querySelector('#validade').value).toISOString().substr(0, 10);

        save_ls('saida', produto);
        gerarTabela();
        limparCampos();
    } else {
        alert('Por favor, selecione um produto para editar.');
    }
});

function limparCampos() {
    document.querySelector('#id_produto').value = '';
    document.querySelector('#nome').value = '';
    document.querySelector('#quantidade_saida').value = '';
    document.querySelector('#valor_saida').value = '';
    document.querySelector('#validade').value = '';
}
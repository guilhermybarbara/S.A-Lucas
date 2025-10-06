// Função para montar a tabela com os dados
function montarTabelaProdutos(textoPesquisa) {
    var _produtos = getTable_ls('produto'),
        _produto = '';

    tabelaProdutos.querySelector('tbody').innerHTML = '';

    if (_produtos) {
        for (let i = 0; i < _produtos.length; i++) {
            let classeQuantidade = "";
            _produto = _produtos[i];

            if (_produto) {
                if (_produto.nome) {


                    if (textoPesquisa && !_produto.nome.includes(textoPesquisa)) {
                        continue;
                    }

                    if (_produto.quantidade <= _produto.quantminima) {
                        classeQuantidade = "low-stock";
                    }

                    let classeValidade = "";
                    let hoje = new Date();
                    hoje.setHours(0, 0, 0, 0); // Remover as horas da data atual

                    let validadeProduto = new Date(_produto.validade);
                    validadeProduto.setHours(0, 0, 0, 0); // Remover as horas da validade do produto

                    let diffDias = Math.floor(
                        (validadeProduto - hoje) / (1000 * 60 * 60 * 24)
                    );

                    if (diffDias <= 30 && diffDias >= 0) {
                        classeValidade = "proxima-validade";
                    } else if (diffDias < 0) {
                        classeValidade = "expired";
                    }

                    // Formatar o preço com duas casas decimais
                    let precoFormatado = Number(_produto.preco).toFixed(2);

                    tabelaProdutos.querySelector('tbody').innerHTML += `
            <tr>
                <td><input type="radio" id="${_produto.id}" name="check_item" onchange="verificar(${_produto.id})"></td>
                <td>${_produto.id}</td>
                <td>${_produto.nome}</td>
                <td class="${classeQuantidade}">${_produto.quantidade}</td>
                <td>${_produto.quantminima}</td>
                <td>${precoFormatado}</td>
                <td class="${classeValidade}">${formatarData(_produto.validade)}</td>
            </tr>`;
                }
            }
        }

    }
}

// Função para formatar a data
function formatarData(data) {
    let dataObj = new Date(data);
    dataObj.setMinutes(dataObj.getMinutes() + dataObj.getTimezoneOffset());
    let dia = dataObj.getDate().toString().padStart(2, '0');
    let mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    let ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para cadastrar um novo produto
btnCadastrar.onclick = function () {
    let produto = {
        nome: nome.value,
        quantidade: Number(quantidade.value),
        preco: Number(preco.value).toFixed(2),
        quantminima: Number(quantminima.value),
        validade: new Date(validade.value).toISOString().substr(0, 10)
    };

    if (produto.nome && produto.quantidade && produto.quantminima && produto.preco && produto.validade) {
        save_ls('produto', produto);
        montarTabelaProdutos();
        limparCampos();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
};

// Função para excluir produtos selecionados
btnExcluir.onclick = function () {
    var selecionado = document.querySelector(`input[name="check_item"]:checked`);
    if (selecionado) {
        deleteData_ls('produto', selecionado.id);
        montarTabelaProdutos();
        limparCampos();
    }
};

// Função para editar um produto selecionado
btnEditar.onclick = function (e) {
    var selecionado = document.querySelector(`input[name="check_item"]:checked`);
    if (selecionado) {
        var produto = getData_ls('produto', selecionado.id);
        produto.nome = nome.value;
        produto.quantidade = Number(quantidade.value);
        produto.preco = Number(preco.value).toFixed(2),
            produto.quantminima = Number(quantminima.value),
            produto.validade = new Date(validade.value).toISOString().substr(0, 10)

        save_ls('produto', produto);
        montarTabelaProdutos();
        limparCampos();
    }
};

//Pesquisar
btnPesquisar.onclick = function (e) {
    e.preventDefault();
    var pesquisa = document.querySelector('#txt-pesquisar').value;
    montarTabelaProdutos(pesquisa);
}

// Função para verificar o item selecionado e carregar seus dados nos campos de entrada
function verificar(id) {
    let cont = 0;
    let elemento = document.querySelector(`#saida table tr td input[id="${id}"]`);
    if (elemento.checked) {
        var produto = getData_ls('produto', id);
        nome.value = produto.nome;
        quantidade.value = produto.quantidade;
        quantminima.value = produto.quantminima;
        preco.value = produto.preco;
        validade.value = new Date(produto.validade).toISOString().substr(0, 10);
        cont++;
    }
}

// Função para limpar os campos de entrada
function limparCampos() {
    nome.value = '';
    quantidade.value = '';
    quantminima.value = '';
    preco.value = '';
    validade.value = '';
}

// Função para filtrar a tabela conforme o valor da pesquisa
function filtrarTabela() {
    var input = document.getElementById('searchInput');
    var filtro = input.value.toUpperCase();
    var tr = tabelaProdutos.getElementsByTagName('tr');

    for (var i = 1; i < tr.length; i++) {
        var tdNome = tr[i].getElementsByTagName('td')[1];
        var tdQuant = tr[i].getElementsByTagName('td')[2];
        var tdPreco = tr[i].getElementsByTagName('td')[3];
        var tdValidade = tr[i].getElementsByTagName('td')[4];

        if (tdNome || tdQuant || tdPreco || tdValidade) {
            var txtValueNome = tdNome.textContent || tdNome.innerText;
            var txtValueQuant = tdQuant.textContent || tdQuant.innerText;
            var txtValuePreco = tdPreco.textContent || tdPreco.innerText;
            var txtValueValidade = tdValidade.textContent || tdValidade.innerText;

            if (txtValueNome.toUpperCase().indexOf(filtro) > -1 ||
                txtValueQuant.toUpperCase().indexOf(filtro) > -1 ||
                txtValuePreco.toUpperCase().indexOf(filtro) > -1 ||
                txtValueValidade.toUpperCase().indexOf(filtro) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Inicializar a tabela na carga da página
montarTabelaProdutos();

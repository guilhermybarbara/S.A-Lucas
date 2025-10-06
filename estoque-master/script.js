// Variáveis globais
let BD = JSON.parse(localStorage.getItem('BD')) || [];

// COMANDO PARA SALVAR OS DADOS DO LOCALSTORAGE EM UM ARQUIVO DE TEXTO
// localStorage.controleEstoque

// Referências aos elementos HTML
let btnCadastrar = document.getElementById('btnCadastrar');
let btnExcluir = document.getElementById('btnExcluir');
let btnEditar = document.getElementById('btnEditar');
let nome = document.getElementById('nome');
let quantidade = document.getElementById('quantidade');
let quantminima = document.getElementById('quantminima');
let preco = document.getElementById('preco');
let validade = document.getElementById('validade');
let _tabelaProdutos = document.getElementById('tabela_produtos');
let boxBuscar = document.querySelector('.buscar-box');
let lupa = document.querySelector('.lupa-buscar');
let btnFechar = document.querySelector('.btn-fechar');

// lupa.addEventListener('click', ()=> {
//     boxBuscar.classList.add('ativar')
// })

// btnFechar.addEventListener('click', ()=> {
//     boxBuscar.classList.remove('ativar')
// })

// Função para montar a tabela com os dados do BD
function montarTabelaProdutos() {
    if (_tabelaProdutos) {
        _tabelaProdutos.innerHTML = `
        <tr>
            <th width="30px">#</th>
            <th>Nome</th>
            <th>Quant.</th>
            <th width="150px">Quant. minima</th>
            <th>Preço</th>
            <th>Validade</th>
        </tr>`;
        for (let i = 0; i < BD.length; i++) {
            let classeQuantidade = ""; // Classe CSS para a quantidade
            if (BD[i].quantidade < 50) { // Se a quantidade for menor que 50, adicione a classe low-stock
                classeQuantidade = "low-stock";
            }
            _tabelaProdutos.innerHTML += `
        <tr>
            <td><input type="checkbox" id="${i}" onchange="verificar(${i})"></td>
            <td>${BD[i].nome}</td>
            <td class="${classeQuantidade}">${BD[i].quantidade}</td>
            <td>50</td>
            <td>${BD[i].preco}</td>
            <td>${formatarData(BD[i].validade)}</td>
        </tr>`;
        }
    }
}

// Função para formatar a data
function formatarData(data) {
    let dataObj = new Date(data);
    dataObj.setMinutes(dataObj.getMinutes() + dataObj.getTimezoneOffset());
    let dia = dataObj.getDate().toString().padStart(2, '0');
    let mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    let ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para cadastrar um novo produto
btnCadastrar.onclick = function () {
    let produto = {
        nome: nome.value,
        quantidade: quantidade.value,
        preco: preco.value,
        quantminima: quantminima,
        validade: new Date(validade.value).toISOString(), // Armazene a data como string ISO
        id: BD.length
    };

    console.dir(produto)

    if (produto.nome && produto.quantidade && produto.quantminima && produto.preco && produto.validade) {
        BD.push(produto);
        localStorage.setItem('BD', JSON.stringify(BD));
        montarTabelaProdutos();
        limparCampos();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
};

// Função para excluir produtos selecionados
btnExcluir.onclick = function () {
    for (let i = BD.length - 1; i >= 0; i--) {
        let elemento = document.querySelector(`#saida table tr td input[id="${i}"]`);
        if (elemento.checked) {
            BD.splice(i, 1);
        }
    }
    localStorage.setItem('BD', JSON.stringify(BD));
    montarTabelaProdutos();
};

// Função para editar um produto selecionado
btnEditar.onclick = function () {
    for (let i = 0; i < BD.length; i++) {
        let elemento = document.querySelector(`#saida table tr td input[id="${i}"]`);
        if (elemento.checked) {
            BD[i].nome = nome.value;
            BD[i].quantidade = quantidade.value;
            BD[i].preco = preco.value;
            BD[i].validade = new Date(validade.value).toISOString(); // Armazene a data como string ISO
            localStorage.setItem('BD', JSON.stringify(BD));
            montarTabelaProdutos();
        }
    }
};

// Função para verificar o item selecionado e carregar seus dados nos campos de entrada
function verificar(id) {
    let cont = 0;
    for (let i = 0; i < BD.length; i++) {
        let elemento = document.querySelector(`#saida table tr td input[id="${i}"]`);
        if (elemento.checked) {
            nome.value = BD[i].nome;
            quantidade.value = BD[i].quantidade;
            preco.value = BD[i].preco;
            validade.value = new Date(BD[i].validade).toISOString().substr(0, 10); // Ajuste a data para o formato de entrada
            cont++;

        }
    }
}

// Função para limpar os campos de entrada
function limparCampos() {
    nome.value = '';
    quantidade.value = '';
    preco.value = '';
    validade.value = '';
}

// Função para filtrar a tabela conforme o valor da pesquisa
function filtrarTabela() {
    var input = document.getElementById('searchInput');
    var filtro = input.value.toUpperCase();
    var tr = _tabelaProdutos.getElementsByTagName('tr');

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



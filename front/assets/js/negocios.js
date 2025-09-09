const main = document.querySelector('#lista-servicos');
let servicos = [];

// Função para adicionar ao carrinho
function adicionarAoCarrinho(id, nome, descricao, preco, imagem) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const index = carrinho.findIndex((item) => item.id === id);
    if (index !== -1) {
        carrinho[index].quantidade += 1;
    } else {
        carrinho.push({ id, nome, descricao, preco, imagem, quantidade: 1 });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarPainelLateral(nome, imagem);
}

// Função para mostrar o painel lateral
function mostrarPainelLateral(nomeProduto, imagemProduto) {
    const painel = document.getElementById('carrinho-sidebar');
    const textoProduto = document.getElementById('produto-adicionado');
    const imagemElemento = document.createElement('img');

    textoProduto.textContent = nomeProduto;

    const imagemExistente = painel.querySelector('.imagem-produto-adicionado');
    if (imagemExistente) {
        imagemExistente.remove();
    }

    imagemElemento.src = imagemProduto;
    imagemElemento.alt = nomeProduto;
    imagemElemento.classList.add('imagem-produto-adicionado');
    textoProduto.insertAdjacentElement('beforebegin', imagemElemento);

    painel.classList.add('ativo');

    setTimeout(() => {
        painel.classList.remove('ativo');
    }, 5000);
}

// Função para fechar o carrinho
function fecharCarrinho() {
    const painel = document.getElementById('carrinho-sidebar');
    painel.classList.remove('ativo');
}
function verHorario() {
    window.location.href = "horario.html"; 
    painel.classList.add('ativo');
}

// Carregar os serviços do JSON
fetch("assets/json/negocios.json")
    .then(response => response.json())
    .then(data => {
        servicos = data;
        exibirCards();
    })
    .catch(error => console.error("Erro ao carregar JSON:", error));

// Função para exibir os cards dos serviços
function exibirCards() {
    servicos.forEach(servico => {
        const precoAntigo = servico.precoAntigo.toFixed(2).replace('.', ',');
        const preco = servico.preco.toFixed(2).replace('.', ',');

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${servico.imagem}" alt="${servico.alt}">
            <h2>${servico.nome}</h2>
            <p>${servico.descricao}</p>
            <p>
              <span style="text-decoration: line-through; color: gray;">R$ ${precoAntigo}</span><br>
              <span style="color: #c4520c; font-weight: bold;">R$ ${preco}</span>
            </p>
            <button class="add-to-cart-button">${servico.button}</button>
        `;

        const button = card.querySelector('.add-to-cart-button');
        button.addEventListener('click', () => {
            adicionarAoCarrinho(servico.id, servico.nome, servico.descricao, servico.preco, servico.imagem);
        });

        main.appendChild(card);
    });
}
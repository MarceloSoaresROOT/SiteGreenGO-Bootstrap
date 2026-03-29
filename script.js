document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA DO CARRINHO ---
    let carrinho = JSON.parse(localStorage.getItem('greengo_cart')) || [];
    const spanContador = document.getElementById('cart-count');

    function atualizarContador() {
        if (spanContador) {
            spanContador.innerText = carrinho.length;
        }
        localStorage.setItem('greengo_cart', JSON.stringify(carrinho));
    }

    // Sincronizar contador quando o localStorage é modificado
    window.addEventListener('storage', function(e) {
        if (e.key === 'greengo_cart') {
            carrinho = JSON.parse(e.newValue) || [];
            atualizarContador();
        }
    });

    // --- LÓGICA DA BARRA DE PESQUISA (se existir) ---
    const inputPesquisa = document.getElementById('inputPesquisa');
    if (inputPesquisa) {
        const cardsProdutos = document.querySelectorAll('[data-product-id]'); // Seleciona os cards com data-product-id

        inputPesquisa.addEventListener('input', () => {
            const termo = inputPesquisa.value.toLowerCase();

            cardsProdutos.forEach(card => {
                const nomeProduto = card.querySelector('.card-title').innerText.toLowerCase();
                const descricaoProduto = card.querySelector('.card-text').innerText.toLowerCase();

                if (nomeProduto.includes(termo) || descricaoProduto.includes(termo)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // --- FUNCIONALIDADE DE CLIQUE NOS PRODUTOS (para ir à página de detalhes) ---
    document.querySelectorAll('[data-product-id]').forEach(card => {
        card.addEventListener('click', (e) => {
            // Não redirecionar se clicou na estrela de favoritos ou no botão
            if (!e.target.closest('.btn') && !e.target.closest('svg')) {
                const produtoId = card.getAttribute('data-product-id');
                window.location.href = `produto.html?id=${produtoId}`;
            }
        });
    });

    // --- LÓGICA DOS BOTÕES "ADICIONAR AO CARRINHO" ---
    document.querySelectorAll('.btn-danger').forEach((botao) => {
        botao.type = "button"; // Evita que o form recarregue a página
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Evita que o clique propague para o card pai
            
            // Pega os dados do card onde o botão foi clicado
            const card = botao.closest('[data-product-id]');
            const produtoId = parseInt(card.getAttribute('data-product-id'));
            
            // Encontra o produto na base de dados
            if (typeof produtos !== 'undefined') {
                const produto = produtos.find(p => p.id === produtoId);
                if (produto) {
                    carrinho.push({
                        id: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        imagem: produto.imagem
                    });
                }
            }

            atualizarContador();

            // Efeito visual simples de "adicionado"
            const textoOriginal = botao.innerHTML;
            botao.innerHTML = "✓ Adicionado";
            botao.classList.replace('btn-danger', 'btn-success');
            
            setTimeout(() => {
                botao.innerHTML = textoOriginal;
                botao.classList.replace('btn-success', 'btn-danger');
            }, 1000);
        });
    });

    // Inicializa o contador ao carregar a página
    atualizarContador();
});
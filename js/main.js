import { fetchRepositories } from './githubApi.js';
import { createBook, dicionarioRunas } from './bookFactory.js';

async function iniciarBiblioteca() {
    const movelEstante = document.getElementById('portfolio-shelf');
    const molde = document.getElementById('book-template');
    const filtrosContainer = document.getElementById('language-filters');

    if (!movelEstante || !molde) return;

    const repositorios = await fetchRepositories();

    if (repositorios.length === 0) {
        movelEstante.innerHTML = '<p style="color: var(--text-light); text-align: center;">A biblioteca está vazia.</p>';
        return;
    }

    movelEstante.innerHTML = ''; 
    const LIVROS_POR_ANDAR = 5;

    // 1. CONSTRÓI AS PRATELEIRAS E OS LIVROS
    for (let i = 0; i < repositorios.length; i += LIVROS_POR_ANDAR) {
        const pedaco = repositorios.slice(i, i + LIVROS_POR_ANDAR);
        const andar = document.createElement('div');
        andar.classList.add('shelf-row');

        pedaco.forEach(projeto => {
            const livro = createBook(projeto, molde);
            andar.appendChild(livro);
        });

        movelEstante.appendChild(andar);
    }

    // 2. A LÓGICA DE VISIBILIDADE (Culling)
    const vigiaDeScroll = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('is-visible');
                vigiaDeScroll.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.1 });

    const todosAndares = document.querySelectorAll('.shelf-row');
    todosAndares.forEach(andar => {
        vigiaDeScroll.observe(andar);
    });

    // 3. CONSTRÓI O CÍRCULO DE PEDRAS (Filtros)
    if (!filtrosContainer) return;

    const linguagensSet = new Set();
    repositorios.forEach(repo => {
        if (repo.language && repo.language !== 'Desconhecida') {
            linguagensSet.add(repo.language);
        }
    });
    
    const linguagensUnicas = Array.from(linguagensSet).sort();

    const criarPedraRunica = (lang, texto, isAtivo = false) => {
        const btn = document.createElement('button');
        btn.classList.add('filter-btn');
        if (isAtivo) btn.classList.add('active');
        btn.dataset.lang = lang;
        
        const caractereRunico = dicionarioRunas[lang] || 'ᛣ';
        
        btn.innerHTML = `
            <span class="rune">${caractereRunico}</span>
            <span class="lang-name">${texto}</span>
        `;
        return btn;
    };

    filtrosContainer.appendChild(criarPedraRunica('all', 'Todos os Tomos', true));

    linguagensUnicas.forEach(lang => {
        filtrosContainer.appendChild(criarPedraRunica(lang, lang));
    });

    const todosBotoes = document.querySelectorAll('.filter-btn');
    const todosLivros = document.querySelectorAll('.book');

    // Correção de Fluidez (Escudo Anti-Travamento)
    todosLivros.forEach(livro => {
        livro.addEventListener('mouseleave', () => {
            livro.blur(); 
        });
    });

    let passoAtual = 0;

    // 4. A LÓGICA DE AURA E SOMBRA DOS FILTROS
    todosBotoes.forEach(btn => {
        btn.addEventListener('click', () => {
            todosBotoes.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const linguagemSelecionada = btn.dataset.lang;
            passoAtual = 0; 

            todosLivros.forEach(livro => {
                const badge = livro.querySelector('[data-book-lang]');
                const langDoLivro = badge ? badge.textContent : '';

                if (linguagemSelecionada === 'all') {
                    livro.classList.remove('dimmed', 'aura-active');
                } else {
                    if (langDoLivro === linguagemSelecionada) {
                        livro.classList.remove('dimmed');
                        livro.classList.add('aura-active');
                    } else {
                        livro.classList.add('dimmed');
                        livro.classList.remove('aura-active');
                    }
                }
            });
        });
    });

    // 5. O SEGREDO DOS CLIQUES (O Enigma do Alfabeto Futhark)
    const totalDeLivros = todosLivros.length;
    
    if (totalDeLivros >= 3) {
        const sequenciaSecreta = [];
        
        while (sequenciaSecreta.length < 3) {
            const numeroSorteado = Math.floor(Math.random() * totalDeLivros);
            if (!sequenciaSecreta.includes(numeroSorteado)) {
                sequenciaSecreta.push(numeroSorteado);
            }
        }

        const ordemFuthark = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];
        const mainContainer = document.querySelector('main');

        sequenciaSecreta.forEach((numeroSorteado, index) => {
            const runaPedra = document.createElement('div');
            runaPedra.classList.add('hidden-rune');
            
            const runaFuthark = ordemFuthark[numeroSorteado % 24];
            const pontosOrdem = '·'.repeat(index + 1);
            runaPedra.innerHTML = `${runaFuthark}<br><span class="rune-order">${pontosOrdem}</span>`;

            const posX = Math.floor(Math.random() * 80) + 5; 
            const posY = Math.floor(Math.random() * 80) + 5; 
            const rotacao = Math.floor(Math.random() * 40) - 20; 
            const escala = (Math.random() * 0.6) + 0.7; 
            const atrasoAnimacao = Math.random() * 5;

            runaPedra.style.left = `${posX}%`;
            runaPedra.style.top = `${posY}%`;
            runaPedra.style.transform = `rotate(${rotacao}deg) scale(${escala})`;
            runaPedra.style.animationDelay = `${atrasoAnimacao}s`; 

            mainContainer.appendChild(runaPedra);
        });

        const limparEnigma = () => {
            passoAtual = 0;
            todosLivros.forEach((l, i) => {
                if (sequenciaSecreta.includes(i)) {
                    l.classList.remove('aura-active');
                }
            });
        };

        todosLivros.forEach((livro, index) => {
            livro.addEventListener('click', () => {
                const filtroAtual = document.querySelector('.filter-btn.active');
                if (filtroAtual && filtroAtual.dataset.lang !== 'all') return;

                if (livro.classList.contains('aura-active')) {
                    if (passoAtual > 0 && index === sequenciaSecreta[passoAtual - 1]) {
                        livro.classList.remove('aura-active');
                        passoAtual--;
                    } else {
                        limparEnigma();
                    }
                    return;
                }

                const numeroCorretoAtual = sequenciaSecreta[passoAtual];

                if (index === numeroCorretoAtual) {
                    livro.classList.add('aura-active');
                    passoAtual++; 

                    if (passoAtual === 3) {
                        setTimeout(() => {
                            alert("O Enigma foi resolvido! O Segredo acontecerá aqui.");
                            limparEnigma();
                        }, 150);
                    }
                } else {
                    limparEnigma();
                }
            });
        });
    }

    // 6. O PERGAMINHO DE TRADUÇÃO (Modal)
    const btnPergaminho = document.getElementById('btn-pergaminho');
    const modalFuthark = document.getElementById('modal-futhark');
    const btnCloseModal = document.getElementById('btn-close-modal');

    if (btnPergaminho && modalFuthark && btnCloseModal) {
        // Abre o modal ao clicar no botão
        btnPergaminho.addEventListener('click', () => {
            modalFuthark.classList.add('active');
        });

        // Fecha o modal ao clicar no 'X'
        btnCloseModal.addEventListener('click', () => {
            modalFuthark.classList.remove('active');
        });

        // Fecha o modal se o usuário clicar na área preta fora da imagem
        modalFuthark.addEventListener('click', (e) => {
            if (e.target === modalFuthark) {
                modalFuthark.classList.remove('active');
            }
        });
    }
}

iniciarBiblioteca();
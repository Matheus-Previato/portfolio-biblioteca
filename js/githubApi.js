// O nome de usuário de onde os dados serão lidos
const GITHUB_USER = 'Matheus-Previato'; 

// A sua lista de prioridades (Agora aceita forks VIPs!)
const LIVROS_DESTAQUE = [
    'Arquivo-Jujutsu',
    'house-manager-bot',
    'Jogo-PenasEmFuga'
    // Pode colocar o nome do seu fork aqui que ele vai passar!
];

// Pega os repositórios mais recentes
const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`;

export async function fetchRepositories() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Falha na comunicação: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // --- O NOVO PORTEIRO INTELIGENTE ---
        const projetosValidos = data.filter(repo => {
            // Se for um projeto original seu (não é fork), deixa entrar direto
            if (!repo.fork) return true;
            
            // Se FOR um fork, mas estiver na sua lista VIP, ganha passe livre!
            if (LIVROS_DESTAQUE.includes(repo.name)) return true;
            
            // Se for fork e não for VIP, barra a entrada
            return false;
        });

        // Criamos duas caixas vazias para separar os livros
        const destaques = [];
        const restantes = [];

        // Lógica de separação usando os projetos que passaram pelo porteiro
        projetosValidos.forEach(repo => {
            if (LIVROS_DESTAQUE.includes(repo.name)) {
                destaques.push(repo);
            } else {
                restantes.push(repo);
            }
        });

        // Ordena a caixa de destaques para ficar exatamente na mesma ordem da sua lista escrita lá em cima
        destaques.sort((a, b) => {
            return LIVROS_DESTAQUE.indexOf(a.name) - LIVROS_DESTAQUE.indexOf(b.name);
        });

        // Junta as duas caixas em uma fila só
        const filaCompleta = [...destaques, ...restantes];

        // Formata os dados para o formato limpo que a nossa estante entende
        const formattedBooks = filaCompleta.map(repo => {
            return {
                id: repo.id,
                title: repo.name,
                description: repo.description || 'Um tomo misterioso ainda sem decifração...',
                language: repo.language || 'Desconhecida',
                url: repo.html_url,
                stars: repo.stargazers_count
            };
        });

        return formattedBooks;

    } catch (error) {
        console.error("Não foi possível buscar as informações:", error);
        return []; 
    }
}
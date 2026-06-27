// O Dicionário Rúnico Mestre
export const dicionarioRunas = {
    'Java': 'ᛃ',        // Jera
    'JavaScript': 'ᛃ',  // Jera
    'HTML': 'ᚺ',        // Hagalaz
    'CSS': 'ᚳ',         // Cen
    'C': 'ᚲ',         // Kaunan
    'Python': 'ᛈ',      // Peorth
    'all': 'ᛟ'          // Odal (Herança/Todos)
};

export function createBook(repo, template) {
    const clone = template.content.cloneNode(true);

    const titles = clone.querySelectorAll('[data-book-title]');
    const description = clone.querySelector('[data-book-desc]');
    const language = clone.querySelector('[data-book-lang]');
    const link = clone.querySelector('[data-book-link]');
    const spineRune = clone.querySelector('[data-book-rune]');

    titles.forEach(el => el.textContent = repo.title);
    description.textContent = repo.description;
    
    if (repo.language && repo.language !== 'Desconhecida') {
        language.textContent = repo.language;
        // Se a linguagem estiver no dicionário, usa a runa. Se não, usa a runa padrão ᛣ
        spineRune.textContent = dicionarioRunas[repo.language] || 'ᛣ';
    } else {
        language.textContent = 'Desconhecida';
        spineRune.textContent = 'ᛣ'; 
    }
    
    link.href = repo.url;

    return clone;
}
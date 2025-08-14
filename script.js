// Array de objetos com as recomendações de filmes
const filmes = [
    {
        titulo: "Homem-Aranha no Aranhaverso",
        sinopse: "Miles Morales, um adolescente do Brooklyn, se torna o Homem-Aranha e se junta a versões de outras dimensões para salvar a realidade.",
        imagem: "https://example.com/caminho-da-imagem-do-aranhaverso.jpg" // Troque pelo URL de uma imagem real
    },
    {
        titulo: "Guardiões da Galáxia Vol. 3",
        sinopse: "Os Guardiões embarcam em uma missão para salvar Rocket de seu passado sombrio, enfrentando um novo inimigo.",
        imagem: "https://example.com/caminho-da-imagem-do-guardioes.jpg" // Troque pelo URL de uma imagem real
    },
    {
        titulo: "Duna",
        sinopse: "Em um futuro distante, o filho de um nobre é enviado para um planeta deserto para proteger o recurso mais valioso da galáxia.",
        imagem: "https://example.com/caminho-da-imagem-do-duna.jpg" // Troque pelo URL de uma imagem real
    }
    // Você pode adicionar mais objetos de filme aqui, com a sinopse e uma imagem que represente o filme.
];

// Função que cria um card para cada filme e adiciona na página
function exibirFilmes() {
    const containerFilmes = document.getElementById('filmes');

    // Para cada filme na nossa lista, criamos um elemento na página
    filmes.forEach(filme => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${filme.imagem}" alt="Cartaz do filme ${filme.titulo}">
            <h3>${filme.titulo}</h3>
            <p>${filme.sinopse}</p>
        `;

        containerFilmes.appendChild(card);
    });
}

// Chamamos a função para exibir os filmes quando a página carregar
window.onload = exibirFilmes;
const form = document.getElementById("recomendacaoForm");
const lista = document.getElementById("lista");

function carregarRecomendacoes() {
  const dados = JSON.parse(localStorage.getItem("recomendacoes")) || [];
  lista.innerHTML = "";
  dados.forEach((rec) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${rec.titulo}</strong><br>${rec.descricao}<br><a href="${rec.link}" target="_blank">${rec.link}</a>`;
    lista.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const link = document.getElementById("link").value;

  const nova = { titulo, descricao, link };
  const recomendacoes = JSON.parse(localStorage.getItem("recomendacoes")) || [];
  recomendacoes.push(nova);
  localStorage.setItem("recomendacoes", JSON.stringify(recomendacoes));

  form.reset();
  carregarRecomendacoes();
});

carregarRecomendacoes();

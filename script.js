const titulo = document.getElementById("titulo_principal");
const subtitulo = document.querySelector("#subtitulo");
const campoBusca = document.querySelector("#campo_busca");
const filtroArea = document.querySelector("#filtro_area");
const mensagem = document.querySelector("#mensagem");
const lista = document.querySelector("#lista_cursos");
const formulario = document.querySelector("#form_cadastro");
const btnTema = document.querySelector("#btn_tema");
const btnLimpar = document.querySelector("#btn_limpar");

function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.classList.remove("mensagem_sucesso", "mensagem_erro");

    if (tipo) {
        mensagem.classList.add(`mensagem_${tipo}`);
    }
}

function aplicarFiltros() {
    const termo = campoBusca.value.trim().toLowerCase();
    const areaSelecionada = filtroArea.value;
    let visiveis = 0;

    lista.querySelectorAll(".card_curso").forEach((card) => {
        const nome = card.querySelector("h2").textContent.toLowerCase();
        const areaCorresponde = areaSelecionada === "todos"
            || card.dataset.area === areaSelecionada;
        const buscaCorresponde = nome.includes(termo);
        const deveMostrar = areaCorresponde && buscaCorresponde;

        card.hidden = !deveMostrar;
        if (deveMostrar) {
            visiveis += 1;
        }
    });

    if (visiveis === 0) {
        mostrarMensagem("Nenhum curso encontrado.", "erro");
    } else {
        mostrarMensagem(`${visiveis} curso(s) encontrado(s).`);
    }
}

btnTema.addEventListener("click", () => {
    document.body.classList.toggle("tema_alternativo");
    btnTema.textContent = document.body.classList.contains("tema_alternativo")
        ? "Remover destaque"
        : "Alternar destaque";
    mostrarMensagem("Tema atualizado.", "sucesso");
});

btnLimpar.addEventListener("click", () => {
    campoBusca.value = "";
    filtroArea.value = "todos";
    aplicarFiltros();
    campoBusca.focus();
});

campoBusca.addEventListener("input", aplicarFiltros);
filtroArea.addEventListener("change", aplicarFiltros);

lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");
    if (!botao || !lista.contains(botao)) {
        return;
    }

    const card = botao.closest(".card_curso");
    if (!card) {
        return;
    }

    if (botao.dataset.acao === "detalhes ocultos") {
        const detalhes = card.querySelector(".detalhes");
        const oculto = detalhes.classList.toggle("oculto");
        card.classList.toggle("expandido", !oculto);
        botao.textContent = oculto ? "Ver detalhes" : "Ocultar detalhes";
    }

    if (botao.dataset.acao === "remover") {
        card.remove();
        aplicarFiltros();
        mostrarMensagem("Curso removido.", "sucesso");
    }
});

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = formulario.querySelector("#nome_curso").value.trim();
    const area = formulario.querySelector("#area_curso").value;
    const areaTexto = formulario.querySelector("#area_curso")
        .selectedOptions[0].textContent;

    if (!nome || !area) {
        mostrarMensagem("Preencha o nome e a área do curso.", "erro");
        return;
    }

    const card = document.createElement("article");
    card.className = "card_curso";
    card.dataset.area = area;
    card.innerHTML = `
        <h2></h2>
        <p class="descricao">Curso cadastrado pelo formulário.</p>
        <button class="botao botao_principal" type="button" data-acao="detalhes ocultos">Ver detalhes</button>
        <p class="detalhes oculto"></p>
        <button class="botao botao_perigo" type="button" data-acao="remover">Remover</button>
    `;
    card.querySelector("h2").textContent = nome;
    card.querySelector(".detalhes").textContent = `Área: ${areaTexto}.`;
    lista.append(card);

    formulario.reset();
    aplicarFiltros();
    mostrarMensagem(`Curso "${nome}" cadastrado.`, "sucesso");
});

aplicarFiltros();



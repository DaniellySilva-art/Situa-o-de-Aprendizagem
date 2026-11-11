
// ARMAZENAMENTO DOS DADOS
let moradores = JSON.parse(localStorage.getItem("moradores")) || [];
let atividades = JSON.parse(localStorage.getItem("atividades")) || [];
let solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

// CLASSE DE REGISTRO
class Registro {
    constructor(id) {
        this.id = id;
    }
}

// NAVEGAÇÃO ENTRE TELAS
function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    document.getElementById(id).classList.add("ativa");

    atualizarPainel();
}

// ATUALIZAR PAINEL
function atualizarPainel() {
    document.getElementById("totalMoradores").textContent = moradores.length;
    document.getElementById("totalAtividades").textContent = atividades.length;
    document.getElementById("totalSolicitacoes").textContent = solicitacoes.length;
}

// SALVAR DADOS
function salvarDados() {
    localStorage.setItem("moradores", JSON.stringify(moradores));
    localStorage.setItem("atividades", JSON.stringify(atividades));
    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));

    atualizarPainel();
}

// CADASTRAR MORADOR
document.getElementById("formMorador").addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("moradorId").value;
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !cpf || !telefone || !endereco) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const cpfExistente = moradores.some(m =>
        m.cpf === cpf && String(m.id) !== id
    );

    if (cpfExistente) {
        alert("Este CPF já está cadastrado!");
        return;
    }

    if (id) {
        const morador = moradores.find(m => String(m.id) === id);

        if (morador) {
            morador.nome = nome;
            morador.cpf = cpf;
            morador.telefone = telefone;
            morador.endereco = endereco;
            morador.email = email;
        }
    } else {
        moradores.push({
            id: Date.now(),
            nome,
            cpf,
            telefone,
            endereco,
            email
        });
    }

    salvarDados();
    listarMoradores();
    atualizarSelectMoradores();

    this.reset();
    document.getElementById("moradorId").value = "";

    alert("Morador salvo com sucesso!");
});

// LISTAR MORADORES
function listarMoradores() {
    const lista = document.getElementById("listaMoradores");

    lista.innerHTML = "";

    moradores.forEach(morador => {
        const div = document.createElement("div");
        div.className = "registro";

        const titulo = document.createElement("strong");
        titulo.textContent = morador.nome;

        const dados = document.createElement("p");
        dados.textContent = `CPF: ${morador.cpf} | Telefone: ${morador.telefone} | Endereço: ${morador.endereco} | E-mail: ${morador.email || "Não informado"}`;

        const editar = document.createElement("button");
        editar.className = "editar";
        editar.textContent = "Editar";
        editar.onclick = () => editarMorador(morador.id);

        const excluir = document.createElement("button");
        excluir.className = "excluir";
        excluir.textContent = "Excluir";
        excluir.onclick = () => excluirMorador(morador.id);

        div.append(titulo, dados, editar, excluir);
        lista.appendChild(div);
    });
}

// EDITAR MORADOR
function editarMorador(id) {
    const morador = moradores.find(m => m.id === id);

    if (!morador) return;

    document.getElementById("moradorId").value = morador.id;
    document.getElementById("nome").value = morador.nome;
    document.getElementById("cpf").value = morador.cpf;
    document.getElementById("telefone").value = morador.telefone;
    document.getElementById("endereco").value = morador.endereco;
    document.getElementById("email").value = morador.email;

    mostrarTela("moradores");
}

// EXCLUIR MORADOR
function excluirMorador(id) {
    if (confirm("Deseja excluir este morador?")) {
        moradores = moradores.filter(m => m.id !== id);

        salvarDados();
        listarMoradores();
        atualizarSelectMoradores();
    }
}

// CADASTRAR ATIVIDADE
document.getElementById("formAtividade").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nomeAtividade").value.trim();
    const data = document.getElementById("dataAtividade").value;
    const local = document.getElementById("localAtividade").value.trim();

    atividades.push({
        id: Date.now(),
        nome,
        data,
        local
    });

    salvarDados();
    listarAtividades();
    this.reset();

    alert("Atividade cadastrada!");
});

// LISTAR ATIVIDADES
function listarAtividades() {
    const lista = document.getElementById("listaAtividades");

    lista.innerHTML = "";

    atividades.forEach(atividade => {
        const div = document.createElement("div");
        div.className = "registro";

        const titulo = document.createElement("strong");
        titulo.textContent = atividade.nome;

        const dados = document.createElement("p");
        dados.textContent = `Data: ${atividade.data} | Local: ${atividade.local}`;

        const excluir = document.createElement("button");
        excluir.className = "excluir";
        excluir.textContent = "Excluir";

        excluir.onclick = () => {
            if (confirm("Excluir esta atividade?")) {
                atividades = atividades.filter(a => a.id !== atividade.id);
                salvarDados();
                listarAtividades();
            }
        };

        div.append(titulo, dados, excluir);
        lista.appendChild(div);
    });
}

// ATUALIZAR LISTA DE MORADORES NO SELECT
function atualizarSelectMoradores() {
    const select = document.getElementById("moradorSolicitacao");

    select.innerHTML = '<option value="">Selecione um morador</option>';

    moradores.forEach(morador => {
        const opcao = document.createElement("option");
        opcao.value = morador.id;
        opcao.textContent = morador.nome;
        select.appendChild(opcao);
    });
}

// CADASTRAR SOLICITAÇÃO
document.getElementById("formSolicitacao").addEventListener("submit", function(event) {
    event.preventDefault();

    const moradorId = Number(document.getElementById("moradorSolicitacao").value);
    const descricao = document.getElementById("descricao").value.trim();
    const status = document.getElementById("status").value;

    const morador = moradores.find(m => m.id === moradorId);

    if (!morador) {
        alert("Selecione um morador cadastrado!");
        return;
    }

    solicitacoes.push({
        id: Date.now(),
        moradorId,
        nomeMorador: morador.nome,
        descricao,
        status
    });

    salvarDados();
    listarSolicitacoes();
    this.reset();

    alert("Solicitação registrada!");
});

// LISTAR SOLICITAÇÕES
function listarSolicitacoes() {
    const lista = document.getElementById("listaSolicitacoes");

    lista.innerHTML = "";

    solicitacoes.forEach(solicitacao => {
        const div = document.createElement("div");
        div.className = "registro";

        const titulo = document.createElement("strong");
        titulo.textContent = solicitacao.nomeMorador;

        const dados = document.createElement("p");
        dados.textContent = solicitacao.descricao;

        const status = document.createElement("p");
        status.textContent = "Status: " + solicitacao.status;

        const select = document.createElement("select");

        ["Pendente", "Em andamento", "Concluída"].forEach(opcao => {
            const option = document.createElement("option");
            option.value = opcao;
            option.textContent = opcao;
            select.appendChild(option);
        });

        select.value = solicitacao.status;

        select.onchange = () => {
            solicitacao.status = select.value;
            salvarDados();
            listarSolicitacoes();
        };

        const excluir = document.createElement("button");
        excluir.className = "excluir";
        excluir.textContent = "Excluir";

        excluir.onclick = () => {
            if (confirm("Excluir esta solicitação?")) {
                solicitacoes = solicitacoes.filter(s => s.id !== solicitacao.id);
                salvarDados();
                listarSolicitacoes();
            }
        };

        div.append(titulo, dados, status, select, excluir);
        lista.appendChild(div);
    });
}

// INICIALIZAÇÃO DO SISTEMA
listarMoradores();
listarAtividades();
listarSolicitacoes();
atualizarSelectMoradores();
atualizarPainel();

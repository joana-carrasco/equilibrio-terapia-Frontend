function aplicarMascaraData(event) {
    const input = event.target;
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 2 && valor.length <= 4) {
        valor = valor.slice(0, 2) + '/' + valor.slice(2);
    } else if (valor.length > 4) {
        valor = valor.slice(0, 2) + '/' + valor.slice(2, 4) + '/' + valor.slice(4, 8);
    }

    input.value = valor;
}

function limparCampos() {
   
    document.getElementById("ano").value = "";
    document.getElementById("aniversario").value = "";

    document.getElementById("resultado").innerHTML = "";
    document.getElementById("chamada-cadastro").style.display = "none";

    const linkHistorico = document.getElementById("link-historico");
    if (linkHistorico) linkHistorico.style.display = "none";
    document.getElementById("formulario-inicial").style.display = "block";  
    window.scrollTo({ top: 0, behavior: "smooth" });
}


function cadastrarUsuario() {
    const nome = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const mensagem = document.getElementById("mensagemCadastro");

    if (!nome || nome.split(" ").length < 2) {
        mensagem.innerText = "Por favor, informe seu nome completo (nome e sobrenome).";
        mensagem.style.color = "red";
        return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email || !emailValido) {
        mensagem.innerText = "Por favor, informe um e-mail válido.";
        mensagem.style.color = "red";
        return;
    }

    const dados = { nome: nome || null, email: email || null };

    fetch('http://localhost:5000/consulentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(response => response.json().then(data => {
        if (response.ok) {
            mensagem.innerText = data.mensagem || "Usuário cadastrado com sucesso!";
            mensagem.style.color = "green";
            document.getElementById("nome").value = "";
            document.getElementById("email").value = "";
        } else {
            mensagem.innerText = data.erro || "Erro ao cadastrar.";
            mensagem.style.color = "red";
        }
    }))
    .catch(error => {
        console.error("Erro ao cadastrar:", error);
        mensagem.innerText = "Erro ao cadastrar usuário.";
        mensagem.style.color = "red";
    });
}

let gerandoConselho = false;

function gerarConselho() {
    if (gerandoConselho) return;
    gerandoConselho = true;

    const anoStr = document.getElementById("ano").value.trim();
    const aniversario = document.getElementById("aniversario").value.trim();
    const botao = document.querySelector('button[onclick="gerarConselho()"]');
    const anoAtual = new Date().getFullYear();

    if (!anoStr || !aniversario) {
        alert("Por favor, preencha todos os campos!");
        gerandoConselho = false;
        return;
    }
   
    if (!/^\d{4}$/.test(anoStr)) {
        alert("Ano inválido. O ano deve conter exatamente 4 dígitos numéricos.");
        gerandoConselho = false;
        return;
    }

    const ano = parseInt(anoStr);

    if (isNaN(ano) || ano < anoAtual || ano > anoAtual + 5) {
        alert(`Ano inválido. Só é permitido gerar conselhos entre ${anoAtual} e ${anoAtual + 5}.`);
        gerandoConselho = false;
        return;
    }


    const partesData = aniversario.split('/');
    if (partesData.length === 3) {
        const anoNascimento = parseInt(partesData[2]);
        if (anoNascimento > anoAtual) {
            alert("A data de nascimento não pode ser no futuro.");
            gerandoConselho = false;
            return;
        }
    }

    botao.disabled = true;

    const dados = { ano: anoStr, aniversario };

    fetch('http://localhost:5000/conselho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(response => response.json().then(data => {
        if (!response.ok) {
            alert(data.erro || "Erro ao buscar conselho.");
            return;
        }

        const imagemArcano = `/imagens/${data.numero}.jpg`;
        document.getElementById("resultado").innerHTML = `
            <div class="modal-conselho">
                <h2>Seu Conselho:</h2>
                <h3>${data.nome}</h3>
                <img src="${imagemArcano}" alt="${data.nome}" style="width:200px; height:auto; margin:20px 0;">
                <p>${data.conselho}</p>
            </div>
        `;
        document.getElementById("resultado").scrollIntoView({ behavior: 'smooth' });
        document.getElementById("chamada-cadastro").style.display = "block";
        document.getElementById("link-historico").style.display = "block";
    }))
    .catch(error => {
        console.error("Erro ao buscar dados da API:", error);
        alert("Ocorreu um erro ao buscar o conselho.");
        document.getElementById("formulario-inicial").style.display = "none";
    })
    .finally(() => {
        botao.disabled = false;
        gerandoConselho = false;
    });
}

function mostrarFormularioCadastro() {
    document.getElementById("modalCadastro").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalCadastro").style.display = "none";
}

function abrirHistorico() {
    fetch('http://localhost:5000/historico')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                document.getElementById("resultado").innerHTML = `
                    <div class="modal-conselho">
                        <button onclick="voltarParaInicio()" style="margin-bottom: 10px;">← Voltar</button>
                        <h3>Nenhum conselho encontrado.</h3>
                    </div>
                `;
                return;
            }

            let html = `<div class="modal-conselho">
                <button onclick="voltarParaInicio()" style="margin-bottom: 10px;">← Voltar</button>
                <h2>Histórico de Conselhos</h2>`;

            const vistos = new Set();
            data.forEach(item => {
                const chave = `${item.ano}-${item.aniversario}-${item.numero_arcano}-${item.data_geracao}`;
                if (!vistos.has(chave)) {
                    vistos.add(chave);
                    html += `
                        <div style="margin-bottom: 20px; text-align: left;">
                            <strong>${item.nome_arcano} (Arcano ${item.numero_arcano})</strong>
                            <button onclick="excluirConselho(${item.id})" title="Excluir"
                            style="float: right; background: none; border: none; cursor: pointer;">
                            <i class="fas fa-trash-alt" style="color: #b22222; font-size: 1.2em;"></i>
                            </button>
                            <p>${item.conselho}</p>
                            <small>
                                Ano: ${item.ano} |
                                Nascimento: ${item.aniversario} |
                                Gerado em: ${item.data_geracao}
                            </small>
                            <hr>
                        </div>
                    `;
                }
            });

            html += `</div>`;

            document.getElementById("resultado").innerHTML = html;
            document.getElementById("resultado").scrollIntoView({ behavior: 'smooth' });
            document.getElementById("formulario-inicial").style.display = "none";
        })
        .catch(error => {
            console.error("Erro ao carregar histórico:", error);
            alert("Erro ao carregar o histórico.");
        });
}

function voltarParaInicio() {
    window.location.reload();
}

function excluirConselho(id) {
    if (!confirm("Tem certeza que deseja excluir este conselho do histórico?")) return;

    fetch(`http://localhost:5000/historico/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao excluir conselho.");
        }
        return response.json();
    })
    .then(data => {
        alert(data.mensagem || "Conselho excluído com sucesso.");
        abrirHistorico();
    })
    .catch(error => {
        console.error("Erro ao excluir conselho:", error);
        alert("Erro ao excluir o conselho.");
    });
}

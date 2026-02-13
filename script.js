let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let totalVendas = JSON.parse(localStorage.getItem("totalVendas")) || 0;
let vendasPorProduto = JSON.parse(localStorage.getItem("vendasPorProduto")) || {};
let grafico;

// =============================
// ADICIONAR PRODUTO
// =============================
function adicionarProduto() {
  const nome = document.getElementById("nome").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  if (!nome || !preco || !quantidade) {
    alert("Preencha todos os campos!");
    return;
  }

  const produto = { nome, preco, quantidade };
  produtos.push(produto);

  salvarDados();
  listarProdutos();
  atualizarSelect();
  limparCampos();
}

// =============================
// REGISTRAR VENDA
// =============================
function registrarVenda() {
  const index = document.getElementById("produtoVenda").value;
  const quantidadeVendida = parseInt(document.getElementById("quantidadeVenda").value);

  if (!quantidadeVendida || quantidadeVendida <= 0) {
    alert("Informe uma quantidade válida!");
    return;
  }

  if (produtos[index].quantidade < quantidadeVendida) {
    alert("Estoque insuficiente!");
    return;
  }

  produtos[index].quantidade -= quantidadeVendida;

  const valorVenda = produtos[index].preco * quantidadeVendida;
  totalVendas += valorVenda;

  // salvar vendas por produto
  const nomeProduto = produtos[index].nome;
  vendasPorProduto[nomeProduto] =
    (vendasPorProduto[nomeProduto] || 0) + quantidadeVendida;

  salvarDados();
  salvarGrafico();
  listarProdutos();
  atualizarSelect();
  atualizarTotal();

  alert(`Venda registrada! R$ ${valorVenda.toFixed(2)}`);

  document.getElementById("quantidadeVenda").value = "";
}

// =============================
// LISTAR PRODUTOS
// =============================
function listarProdutos() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  produtos.forEach((p, index) => {
    let alerta = p.quantidade <= 3
      ? `<span style="color:red;">⚠ Estoque baixo</span>`
      : "";

    lista.innerHTML += `
      <li>
        <strong>${p.nome}</strong><br>
        R$ ${p.preco.toFixed(2)}<br>
        Estoque: ${p.quantidade} ${alerta}<br>
        <button onclick="excluirProduto(${index})">❌ Excluir</button>
      </li>
    `;
  });
}

// =============================
// EXCLUIR PRODUTO
// =============================
function excluirProduto(index) {
  if (confirm("Deseja excluir este produto?")) {
    produtos.splice(index, 1);
    salvarDados();
    listarProdutos();
    atualizarSelect();
    atualizarGrafico();
  }
}

// =============================
// SELECT DE PRODUTOS
// =============================
function atualizarSelect() {
  const select = document.getElementById("produtoVenda");
  select.innerHTML = "";

  produtos.forEach((p, index) => {
    select.innerHTML += `<option value="${index}">${p.nome}</option>`;
  });
}

// =============================
// TOTAL VENDIDO
// =============================
function atualizarTotal() {
  document.getElementById("totalVendas").innerText =
    `💰 Total Vendido: R$ ${totalVendas.toFixed(2)}`;
}

// =============================
// GRÁFICO
// =============================
function salvarGrafico() {
  localStorage.setItem("vendasPorProduto", JSON.stringify(vendasPorProduto));
  atualizarGrafico();
}

function atualizarGrafico() {
  const canvas = document.getElementById("grafico");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(vendasPorProduto),
      datasets: [{
        label: "Quantidade Vendida",
        data: Object.values(vendasPorProduto),
      }]
    }
  });
}

// =============================
// SALVAR DADOS
// =============================
function salvarDados() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
  localStorage.setItem("totalVendas", JSON.stringify(totalVendas));
}

// =============================
// LIMPAR CAMPOS
// =============================
function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("quantidade").value = "";
}

// =============================
// INICIALIZAÇÃO
// =============================
listarProdutos();
atualizarSelect();
atualizarTotal();
atualizarGrafico();

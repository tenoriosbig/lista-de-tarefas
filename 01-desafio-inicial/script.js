const entradaTarefa = document.getElementById('entradaTarefa');
const botaoAdicionar = document.getElementById('botaoAdicionar');
const listaTarefas = document.getElementById('listaTarefas');
const botoesFiltro = document.querySelectorAll('.botao-filtro');
const totalEl = document.getElementById('total');
const pendentesEl = document.getElementById('pendentes');
const concluidasEl = document.getElementById('concluidas');

// Lista de tarefas e status do filtro
let tarefas = []; 
let filtroAtual = 'todas';
const CHAVE_STORAGE = 'tarefas_lista';

// Inicialização da lista
document.addEventListener('DOMContentLoaded', () => {
  carregarTarefas();
  renderizarTarefas();
});

// Adicionando os eventos
botaoAdicionar.addEventListener('click', adicionarTarefa);
entradaTarefa.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') adicionarTarefa();
});

botoesFiltro.forEach(botao => {
  botao.addEventListener('click', () => {
    filtroAtual = botao.dataset.filtro;
    definirFiltroAtivo(botao);
    renderizarTarefas();
  });
});

// Realizando as funções principais para as tarefas
function adicionarTarefa() {
  const texto = entradaTarefa.value.trim();
  if (!texto) {
    alert('Digite uma tarefa!');
    entradaTarefa.focus();
    return;
  }

  const nova = { id: Date.now().toString(), texto, concluida: false };
  tarefas.push(nova);
  salvarTarefas();
  renderizarTarefas();
  entradaTarefa.value = '';
  entradaTarefa.focus();
}

// Cria a lista de tarefas na tela
function criarElementoTarefa(tarefa) {
  const li = document.createElement('li');
  li.className = 'item-tarefa';
  if (tarefa.concluida) li.classList.add('concluida');

  const span = document.createElement('span');
  span.className = 'texto-tarefa';
  span.textContent = tarefa.texto;
  li.appendChild(span);

  const acoes = document.createElement('div');
  acoes.className = 'botoes-acao';

  // Botão para concluir ou dar um refresh na tarefa
  const botaoConcluir = document.createElement('button');
  botaoConcluir.className = 'botao-concluir';
  botaoConcluir.textContent = tarefa.concluida ? '↺' : '✔';
  botaoConcluir.title = tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída';
  botaoConcluir.onclick = () => alternarTarefa(tarefa.id);

  // Botão para remover a tarefa
  const botaoRemover = document.createElement('button');
  botaoRemover.className = 'botao-remover';
  botaoRemover.textContent = 'X';
  botaoRemover.title = 'Remover tarefa';
  botaoRemover.onclick = () => removerTarefa(tarefa.id);

  acoes.appendChild(botaoConcluir);
  acoes.appendChild(botaoRemover);
  li.appendChild(acoes);

  return li;
}

// Renderiza a lista de tarefas com base no filtro do status atual
function renderizarTarefas() {
  listaTarefas.innerHTML = '';

  const filtradas = tarefas.filter(t => {
    if (filtroAtual === 'todas') return true;
    if (filtroAtual === 'pendentes') return !t.concluida;
    if (filtroAtual === 'concluidas') return t.concluida;
  });

  if (filtradas.length === 0) {
    const vazio = document.createElement('div');
    vazio.className = 'tarefa-vazia';
    vazio.textContent = 'Nenhuma tarefa encontrada.';
    listaTarefas.appendChild(vazio);
  } 
  else {
    filtradas.forEach(t => listaTarefas.appendChild(criarElementoTarefa(t)));
  }

  atualizarContadores();
  salvarTarefas();
}

// Alterna o status de concluída para pendente e vice-versa
function alternarTarefa(id) {
  tarefas = tarefas.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t);
  renderizarTarefas();
}

// Remove a tarefa da lista
function removerTarefa(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  renderizarTarefas();
}

// Salva e carrega as tarefas do armazenamento local
function salvarTarefas() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
}

// Carrega as tarefas do armazenamento local
function carregarTarefas() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  tarefas = dados ? JSON.parse(dados) : [];
}

// Define o botão de filtro ativo
function definirFiltroAtivo(botaoAtivo) {
  botoesFiltro.forEach(b => b.classList.remove('ativo'));
  botaoAtivo.classList.add('ativo');
}

// Atualiza os contadores de tarefas
function atualizarContadores() {
  const total = tarefas.length;
  const concluidas = tarefas.filter(t => t.concluida).length;
  const pendentes = total - concluidas;

  // Atualiza o texto dos contadores
  totalEl.textContent = `Total: ${total}`; // Sempre mostrar o total
  pendentesEl.textContent = ` • Pendentes: ${pendentes}`; // Sempre mostrar pendentes
  concluidasEl.textContent = ` • Concluídas: ${concluidas}`; // Sempre mostrar concluídas
}
// ===================== PENDÊNCIAS · DASHBOARD DEDUCA =====================
// Guarda as justificativas de tarefas "Em Andamento" numa planilha Google.
// Instalação: veja apps-script/LEIA-ME.md.
//
// Porta única: POST com JSON { acao, ... }.
//   listar {}                                         → todos os registros
//   registrar { idTarefa, titulo, motivo, detalhe, nome } → novo registro aberto
//   resolver { id, nome }                             → marca o registro como resolvido
// Resposta: { ok: true, dados } ou { ok: false, erro }.

const ABA = 'Pendencias';
const COLUNAS = ['id', 'idTarefa', 'titulo', 'motivo', 'detalhe', 'registradoPor', 'registradoEm', 'status', 'resolvidoPor', 'resolvidoEm'];

// Mesma lista do index.html (MOTIVOS_PENDENCIA). Se mudar lá, mude aqui.
const MOTIVOS = [
  'Aguardando professor/conteudista',
  'Aguardando outro setor',
  'Problema técnico / sistema',
  'Aguardando aprovação da gestão',
  'Outro',
];

/** Rode uma vez pelo editor para criar a aba com o cabeçalho. */
function configurar() {
  aba_();
}

/** Só para conferir se o servidor está no ar. */
function doGet() {
  return ContentService.createTextOutput('Servidor de pendências do Dashboard Deduca: no ar.');
}

function doPost(e) {
  let resposta;
  try {
    const p = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    resposta = { ok: true, dados: executar_(p) };
  } catch (err) {
    // Mensagens nossas (falha_) vão para a tela; erros internos ficam só no log.
    if (!(err && err.paraUsuario)) console.error(err);
    resposta = { ok: false, erro: err && err.paraUsuario ? err.message : 'Erro no servidor. Tente de novo em instantes.' };
  }
  return ContentService.createTextOutput(JSON.stringify(resposta)).setMimeType(ContentService.MimeType.JSON);
}

function executar_(p) {
  switch (p.acao) {
    case 'listar':    return listar_();
    case 'registrar': return comTrava_(function () { return registrar_(p); });
    case 'resolver':  return comTrava_(function () { return resolver_(p); });
    default: falha_('Ação desconhecida.');
  }
}

// ===================== AÇÕES =====================
function listar_() {
  const sh = aba_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, COLUNAS.length).getValues().map(linhaParaObjeto_);
}

function registrar_(p) {
  const idTarefa = texto_(p.idTarefa, 20);
  const motivo = texto_(p.motivo, 80);
  const detalhe = texto_(p.detalhe, 500);
  const nome = texto_(p.nome, 80);
  if (!/^\d+$/.test(idTarefa)) falha_('Tarefa inválida.');
  if (MOTIVOS.indexOf(motivo) < 0) falha_('Escolha um motivo da lista.');
  if (!nome) falha_('Informe quem está registrando.');
  if (motivo === 'Outro' && !detalhe) falha_('Para "Outro", descreva o motivo.');

  const aberta = listar_().filter(function (r) { return r.idTarefa === idTarefa && r.status === 'aberta'; })[0];
  if (aberta) falha_('Esta tarefa já tem uma pendência aberta. Resolva-a antes de registrar outra.');

  const reg = {
    id: Utilities.getUuid(),
    idTarefa: idTarefa,
    titulo: texto_(p.titulo, 200),
    motivo: motivo,
    detalhe: detalhe,
    registradoPor: nome,
    registradoEm: new Date().toISOString(),
    status: 'aberta',
    resolvidoPor: '',
    resolvidoEm: '',
  };
  aba_().appendRow(COLUNAS.map(function (c) { return seguro_(reg[c]); }));
  return reg;
}

function resolver_(p) {
  const id = texto_(p.id, 60);
  const nome = texto_(p.nome, 80);
  if (!nome) falha_('Informe quem está resolvendo.');

  const sh = aba_();
  const n = sh.getLastRow() - 1;
  if (n < 1) falha_('Pendência não encontrada.');
  const ids = sh.getRange(2, 1, n, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) !== id) continue;
    const linha = i + 2;
    const reg = linhaParaObjeto_(sh.getRange(linha, 1, 1, COLUNAS.length).getValues()[0]);
    if (reg.status !== 'aberta') falha_('Esta pendência já foi resolvida.');
    reg.status = 'resolvida';
    reg.resolvidoPor = nome;
    reg.resolvidoEm = new Date().toISOString();
    const col = COLUNAS.indexOf('status') + 1;
    sh.getRange(linha, col, 1, 3).setValues([[reg.status, seguro_(reg.resolvidoPor), reg.resolvidoEm]]);
    return reg;
  }
  falha_('Pendência não encontrada.');
}

// ===================== AUXILIARES =====================
function aba_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);
  if (!sh) {
    sh = ss.insertSheet(ABA);
    sh.appendRow(COLUNAS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function linhaParaObjeto_(linha) {
  const o = {};
  COLUNAS.forEach(function (c, i) {
    const v = linha[i];
    o[c] = v instanceof Date ? v.toISOString() : String(v == null ? '' : v);
  });
  return o;
}

function comTrava_(fn) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) falha_('Servidor ocupado. Tente de novo em instantes.');
  try { return fn(); } finally { lock.releaseLock(); }
}

function texto_(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

// Evita que um texto começando com = + - @ vire fórmula na planilha.
function seguro_(v) {
  const s = String(v == null ? '' : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function falha_(msg) {
  const err = new Error(msg);
  err.paraUsuario = true;
  throw err;
}

// src/routes/api.js
const express = require('express');
const router = express.Router();

// Import engine functions
const {
  processRadarPipeline,
  calculateEventOpportunityScore,
  calculateHotelFitScore,
  calculateTaxiFitScore,
  calculateVanFitScore,
  calculateTMCFitScore,
  generateCPQPackages,
} = require('../engine/miceEngine');

const {
  listarEventos,
  listarEventosCanonicos,
  listarOcorrencias,
  salvarEvento,
  obterEventoPorId,
} = require('../modules/radarCollector');

const { listarFornecedores, salvarFornecedor, removerFornecedor, obterEstatisticasRede } = require('../modules/supplierManager');
const { listarDeals, salvarDeal, atualizarFaseDeal, calcularMetricasCRM, listarDeals: listAllDeals } = require('../modules/dealPipeline');
const { gerarPropostaExecutivaHTML } = require('../modules/proposalGenerator');
const { calcularMapaCalorGeografico, calcularMapaCalorTemporal, gerarRelatorioInteligenciaHotel } = require('../modules/heatmapEngine');
const {
  obterEstatisticasPreditivas,
  gerarPipelinePreditivo,
  projetarProximaEdicao,
  obterDebriefingHistorico,
} = require('../engine/predictiveEngine');
const { obterLogisticaMobilidadePolos } = require('../modules/mobilityLogistics');
const { gerarDossieGeralHTML } = require('../modules/dossierReportGenerator');
const { generateProgressReportHTML } = require('../modules/progressReportGenerator');
const { calcularImpactoESG, calcularAuditoriaSaving } = require('../modules/esgCarbonCalculator');
const { gerarRoomBlockShield } = require('../modules/roomBlockShield');
const { gerarPitchesCopilotPorSegmento } = require('../modules/leadEnricher');
const {
  listarFontesVarredura,
  executarVarreduraRadar,
  obterDescobertasStaging,
  aprovarDescobertaParaPipeline,
  aprovarTodasDescobertas,
  descartarDescoberta,
  obterStatusScraper,
} = require('../modules/eventScraper');
const { orquestrarJornadaCompleta } = require('../engine/demandOrchestrator');
const {
  executarSentinelaMercado,
  executarPrevisaoYield,
  executarHunterOutreach,
  executarOrquestradorCPQ,
  executarGuardiaoShield,
  executarTorreMobilidade,
  executarAuditorESG,
  processarComandoMultiAgente,
} = require('../engine/agentsEngine');

// --- API: CATÁLOGO CANÔNICO & GOVERNANÇA MICE ---
router.get('/canonical/events', (req, res) => {
  try {
    const eventos = listarEventosCanonicos(req.query);
    res.json({ total: eventos.length, events: eventos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/canonical/occurrences', (req, res) => {
  try {
    const ocorrencias = listarOcorrencias(req.query);
    res.json({ total: ocorrencias.length, occurrences: ocorrencias });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API: RADAR & PIPELINE ---
router.get('/pipeline', (req, res) => {
  try {
    const pipelineData = processRadarPipeline();
    const fornecedores = listarFornecedores();
    res.json({ pipeline: pipelineData, fornecedores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API: MAPA DE CALOR (GEOGRÁFICO & TEMPORAL) ---
router.get('/heatmap', (req, res) => {
  try {
    const heatGeo = calcularMapaCalorGeografico();
    const heatTemp = calcularMapaCalorTemporal();
    res.json({ geografico: heatGeo, temporal: heatTemp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/heatmap/relatorio-hotel/:poloId', (req, res) => {
  const relatorio = gerarRelatorioInteligenciaHotel(req.params.poloId);
  res.json(relatorio || { error: 'Polo não encontrado' });
});

// --- API: ANÁLISE PREDITIVA DE RECORRÊNCIA ---
router.get(['/predictive', '/preditivo'], (req, res) => {
  try {
    const anoAlvo = parseInt(req.query.ano) || 2027;
    const stats = obterEstatisticasPreditivas(anoAlvo);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/preditivo/debriefing', (req, res) => {
  try {
    const eventoId = req.query.eventoId || 'EVT-2026-046';
    const debriefing = obterDebriefingHistorico(eventoId);
    res.json(debriefing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API: LOGÍSTICA DE MOBILIDADE & BOLSÕES DE TÁXI ---
router.get('/logistica-mobilidade', (req, res) => {
  try {
    const dados = obterLogisticaMobilidadePolos();
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API: ORQUESTRADOR DE JORNADA COMPLETA 360° (MULTIHOTEL & MULTIFROTA) ---
router.get('/orchestrator', (req, res) => {
  try {
    const target = req.query.target || 'EVT-2026-005';
    const pax = parseInt(req.query.pax) || 1000;
    const dias = req.query.dias ? parseInt(req.query.dias) : null;
    const plano = orquestrarJornadaCompleta(target, pax, dias);
    res.json(plano);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orchestrator', (req, res) => {
  try {
    const { target = 'EVT-2026-005', pax = 1000, dias = null, overrides = null } = req.body || {};
    const plano = orquestrarJornadaCompleta(target, pax, dias, overrides);
    res.json(plano);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao processar alocação personalizada: ' + err.message });
  }
});

// --- API: FORNECEDORES (CRUD) ---
router.get('/fornecedores', (req, res) => {
  const tipo = req.query.tipo || null;
  const lista = listarFornecedores(tipo);
  const stats = obterEstatisticasRede();
  res.json({ fornecedores: lista, estatisticas: stats });
});

router.post('/fornecedores', (req, res) => {
  try {
    const salvo = salvarFornecedor(req.body);
    res.status(201).json(salvo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/fornecedores/:id', (req, res) => {
  const ok = removerFornecedor(req.params.id);
  res.status(ok ? 200 : 404).json({ success: ok });
});

// --- API: CRM & DEALS ---
router.get('/deals', (req, res) => {
  const metricas = calcularMetricasCRM();
  res.json(metricas);
});

router.post('/deals', (req, res) => {
  try {
    const salvo = salvarDeal(req.body);
    res.status(201).json(salvo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/deals/:dealId/status', (req, res) => {
  try {
    const { novaFase } = req.body;
    const atualizado = atualizarFaseDeal(req.params.dealId, novaFase);
    if (atualizado) {
      res.json(atualizado);
    } else {
      res.status(404).json({ error: 'Deal não encontrado' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API: ESG & PEGADA DE CARBONO ---
router.get('/esg-metrics/:eventoId', (req, res) => {
  try {
    const participantes = parseInt(req.query.p) || 100;
    const evento = obterEventoPorId(req.params.eventoId);
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    const esgData = calcularImpactoESG(evento, participantes);
    res.json(esgData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API: MICE OUTREACH COPILOT (PITCHES POR SETOR) ---
router.get('/outreach-copilot/:eventoId', (req, res) => {
  try {
    const participantes = parseInt(req.query.p) || 100;
    const evento = obterEventoPorId(req.params.eventoId);
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    const fornecedores = listarFornecedores();
    const hotelScores = fornecedores
      .filter(f => f.tipo === 'hotel')
      .map(h => calculateHotelFitScore(h, evento))
      .sort((a, b) => b.fitScore - a.fitScore);
    const pitches = gerarPitchesCopilotPorSegmento(evento, participantes, hotelScores[0]);
    res.json(pitches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API: ROOM BLOCK SHIELD & ATTRITION BUFFER ---
router.get('/room-block-shield/:eventoId', (req, res) => {
  try {
    const quartos = parseInt(req.query.quartos) || 50;
    const valorDiaria = parseFloat(req.query.diaria) || 440.0;
    const evento = obterEventoPorId(req.params.eventoId);
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    const shieldData = gerarRoomBlockShield(evento, quartos, valorDiaria);
    res.json(shieldData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API: ACEITE DIGITAL ONLINE DA PROPOSTA ---
router.post('/proposta/:eventoId/aceite', (req, res) => {
  try {
    const dadosAceite = req.body;
    const evento = obterEventoPorId(req.params.eventoId);
    const deals = listAllDeals();
    const deal = deals.find(d => d.eventoId === req.params.eventoId);
    if (deal) {
      atualizarFaseDeal(deal.id, 'CONTRATO_FECHADO');
    } else if (evento) {
      salvarDeal({
        eventoId: evento.id,
        eventoNome: evento.nome,
        cliente: evento.empresa_organizadora,
        fase: 'CONTRATO_FECHADO',
        valorEstimado: dadosAceite.participantes * 1500,
        receitaPrevista: dadosAceite.participantes * 150,
        probabilidade: 1.0,
        decisor: dadosAceite.responsavel || 'Decisor Formal',
        proximaAcao: 'Emitir faturamento e formalizar room block',
      });
    }
    res.json({
      success: true,
      status: 'CONTRATO_FECHADO',
      mensagem: 'Aceite digital registrado com sucesso!',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API: RADAR AUTÔNOMO DE VARREDURA & WEB SCRAPER ---
router.get('/scraper/status', (req, res) => {
  try {
    const statusData = obterStatusScraper();
    res.json(statusData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/scraper/run', (req, res) => {
  try {
    const scanResult = executarVarreduraRadar();
    res.json(scanResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/scraper/approve/:eventoId', (req, res) => {
  try {
    const resultado = aprovarDescobertaParaPipeline(req.params.eventoId);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/scraper/approve-all', (req, res) => {
  try {
    const scoreMin = parseInt(req.query.score) || 70;
    const resultado = aprovarTodasDescobertas(scoreMin);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/scraper/discard/:eventoId', (req, res) => {
  try {
    const resultado = descartarDescoberta(req.params.eventoId);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API: SQUAD DE AGENTES DE IA AUTÔNOMOS ---
router.get('/agents/status', (req, res) => {
  try {
    const statusAgents = {
      squadStatus: 'OPERACIONAL_ONLINE_24_7',
      totalAgentes: 7,
      agentesAtivos: 7,
      acoesExecutadasHoje: 142,
      savingsAcumuladosReais: 4820000,
      agentes: [
        { id: 'sentinela_mercado', nome: 'Sentinela de Mercado & Sinal', icone: 'radar', cor: 'indigo', status: 'MONITORANDO', descricao: 'Varredura autônoma de calendários de pavilhões e diários oficiais de SP.', ultimaAcao: 'Varredura concluída há 4 minutos (76 eventos ativos).' },
        { id: 'yield_forecaster', nome: 'Previsão de Yield & Curva de Esgotamento', icone: 'trending-up', cor: 'purple', status: 'CALCULANDO', descricao: 'Monitoramento preditivo de tarifas e risco de esgotamento D-90.', ultimaAcao: 'Alerta disparado: saturação de 92% na hotelaria de Ribeirão Preto.' },
        { id: 'hunter_outreach', nome: 'Hunter Comercial & Negociador B2B', icone: 'target', cor: 'emerald', status: 'PRONTO', descricao: 'Mapeamento de decisores no LinkedIn e geração autônoma de pitches MICE.', ultimaAcao: '18 pitches executivos parametrizados para Diretores de Compras.' },
        { id: 'cpq_orchestrator', nome: 'Orquestrador Combinatorial CPQ 360°', icone: 'sliders', cor: 'cyan', status: 'PRONTO', descricao: 'Otimização matemática de divisão multihotel, frota de táxis e faturamento.', ultimaAcao: 'Proposta parametrizada para 250 pax com saving de 24.5% gerada.' },
        { id: 'room_block_shield', nome: 'Guardião Room Block Shield', icone: 'shield-check', cor: 'amber', status: 'PROTEGIDO', descricao: 'Auditoria de réguas de devolução escalonadas contra multas de attrition.', ultimaAcao: 'Zero multas contratuais registradas na esteira de 2026/27.' },
        { id: 'live_dispatcher', nome: 'Torre de Mobilidade & Despacho', icone: 'car', cor: 'rose', status: 'STANDBY', descricao: 'Dimensionamento ao vivo de bolsões prioritários de táxis com faixas de ônibus.', ultimaAcao: 'Bolsões prioritários prontos com SLA de 6 min vs 52 min Uber.' },
        { id: 'esg_finance_auditor', nome: 'Auditor Financeiro & Conciliação ESG', icone: 'leaf', cor: 'teal', status: 'CONCILIADO', descricao: 'Cruzamento contábil de faturas e certificação de carbono poupado.', ultimaAcao: 'Dossiê ESG Classe A emitido com redução de 48 ton de CO₂.' },
      ],
    };
    res.json(statusAgents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/agents/run/:agentId', (req, res) => {
  try {
    const agentId = req.params.agentId;
    const params = req.body || {};
    let resultado;
    if (agentId === 'sentinela_mercado') resultado = executarSentinelaMercado(params);
    else if (agentId === 'yield_forecaster') resultado = executarPrevisaoYield(params.eventoId || 'evt-001');
    else if (agentId === 'hunter_outreach') resultado = executarHunterOutreach(params.eventoId || 'evt-001', params.decisor);
    else if (agentId === 'cpq_orchestrator') resultado = executarOrquestradorCPQ(params.pax || 250, params.dias || 3, params.regiao);
    else if (agentId === 'room_block_shield') resultado = executarGuardiaoShield(params.eventoId || 'evt-001', params.diasParaEvento || 45, params.quartosBloqueados || 300, params.quartosConfirmados || 210);
    else if (agentId === 'live_dispatcher') resultado = executarTorreMobilidade(params.eventoId || 'evt-001', params.pax || 400);
    else if (agentId === 'esg_finance_auditor') resultado = executarAuditorESG(params.eventoId || 'evt-001', params.totalCorridas || 450, params.totalRoomNights || 900);
    else throw new Error(`Agente ${agentId} não reconhecido`);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/agents/copilot/chat', (req, res) => {
  try {
    const { mensagem } = req.body || {};
    const resposta = processarComandoMultiAgente(mensagem);
    res.json(resposta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

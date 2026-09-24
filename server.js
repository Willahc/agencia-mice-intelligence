const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const {
  processRadarPipeline,
  calculateEventOpportunityScore,
  calculateHotelFitScore,
  calculateTaxiFitScore,
  calculateVanFitScore,
  calculateTMCFitScore,
  generateCPQPackages
} = require('./src/engine/miceEngine');

const {
  listarEventos,
  listarEventosCanonicos,
  listarOcorrencias,
  salvarEvento,
  obterEventoPorId
} = require('./src/modules/radarCollector');
const { listarFornecedores, salvarFornecedor, removerFornecedor, obterEstatisticasRede } = require('./src/modules/supplierManager');
const { listarDeals, salvarDeal, atualizarFaseDeal, calcularMetricasCRM } = require('./src/modules/dealPipeline');
const { gerarPropostaExecutivaHTML } = require('./src/modules/proposalGenerator');
const { calcularMapaCalorGeografico, calcularMapaCalorTemporal, gerarRelatorioInteligenciaHotel } = require('./src/modules/heatmapEngine');
const {
  obterEstatisticasPreditivas,
  gerarPipelinePreditivo,
  projetarProximaEdicao,
  obterDebriefingHistorico
} = require('./src/engine/predictiveEngine');
const { obterLogisticaMobilidadePolos } = require('./src/modules/mobilityLogistics');
const { gerarDossieGeralHTML } = require('./src/modules/dossierReportGenerator');
const { generateProgressReportHTML } = require('./src/modules/progressReportGenerator');
const { calcularImpactoESG, calcularAuditoriaSaving } = require('./src/modules/esgCarbonCalculator');
const { gerarRoomBlockShield } = require('./src/modules/roomBlockShield');
const { gerarPitchesCopilotPorSegmento } = require('./src/modules/leadEnricher');
const {
  listarFontesVarredura,
  executarVarreduraRadar,
  obterDescobertasStaging,
  aprovarDescobertaParaPipeline,
  aprovarTodasDescobertas,
  descartarDescoberta,
  obterStatusScraper
} = require('./src/modules/eventScraper');

const { orquestrarJornadaCompleta } = require('./src/engine/demandOrchestrator');
const {
  executarSentinelaMercado,
  executarPrevisaoYield,
  executarHunterOutreach,
  executarOrquestradorCPQ,
  executarGuardiaoShield,
  executarTorreMobilidade,
  executarAuditorESG,
  processarComandoMultiAgente
} = require('./src/engine/agentsEngine');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API: CATÁLOGO CANÔNICO & GOVERNANÇA MICE ---
  if (pathname === '/api/canonical/events' && req.method === 'GET') {
    try {
      const eventos = listarEventosCanonicos(parsedUrl.query);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ total: eventos.length, events: eventos }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/canonical/occurrences' && req.method === 'GET') {
    try {
      const ocorrencias = listarOcorrencias(parsedUrl.query);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ total: ocorrencias.length, occurrences: ocorrencias }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --- API: RADAR & PIPELINE ---
  if (pathname === '/api/pipeline' && req.method === 'GET') {
    try {
      const pipelineData = processRadarPipeline();
      const fornecedores = listarFornecedores();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ pipeline: pipelineData, fornecedores }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --- API: MAPA DE CALOR (GEOGRÁFICO & TEMPORAL) ---
  if (pathname === '/api/heatmap' && req.method === 'GET') {
    try {
      const heatGeo = calcularMapaCalorGeografico();
      const heatTemp = calcularMapaCalorTemporal();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ geografico: heatGeo, temporal: heatTemp }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname.startsWith('/api/heatmap/relatorio-hotel/') && req.method === 'GET') {
    const poloId = pathname.replace('/api/heatmap/relatorio-hotel/', '');
    const relatorio = gerarRelatorioInteligenciaHotel(poloId);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(relatorio || { error: 'Polo não encontrado' }));
    return;
  }

  // --- API: ANÁLISE PREDITIVA DE RECORRÊNCIA ---
  if ((pathname === '/api/predictive' || pathname === '/api/preditivo') && req.method === 'GET') {
    try {
      const anoAlvo = parseInt(parsedUrl.query.ano) || 2027;
      const stats = obterEstatisticasPreditivas(anoAlvo);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(stats));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --- API: DEBRIEFING PÓS-EVENTO & RESULTADOS HISTÓRICOS ---
  if (pathname === '/api/preditivo/debriefing' && req.method === 'GET') {
    try {
      const eventoId = parsedUrl.query.eventoId || 'EVT-2026-046';
      const debriefing = obterDebriefingHistorico(eventoId);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(debriefing));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --- API: LOGÍSTICA DE MOBILIDADE & BOLSÕES DE TÁXI ---
  if (pathname === '/api/logistica-mobilidade' && req.method === 'GET') {
    try {
      const dados = obterLogisticaMobilidadePolos();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(dados));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --- API: ORQUESTRADOR DE JORNADA COMPLETA 360° (MULTIHOTEL & MULTIFROTA) ---
  if (pathname === '/api/orchestrator' && req.method === 'GET') {
    try {
      const target = parsedUrl.query.target || 'EVT-2026-005';
      const pax = parseInt(parsedUrl.query.pax) || 1000;
      const dias = parsedUrl.query.dias ? parseInt(parsedUrl.query.dias) : null;
      const plano = orquestrarJornadaCompleta(target, pax, dias);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(plano));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/orchestrator' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const dados = JSON.parse(body || '{}');
        const target = dados.target || 'EVT-2026-005';
        const pax = parseInt(dados.pax) || 1000;
        const dias = dados.dias ? parseInt(dados.dias) : null;
        const overrides = dados.overrides || null;
        const plano = orquestrarJornadaCompleta(target, pax, dias, overrides);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(plano));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao processar alocação personalizada: ' + err.message }));
      }
    });
    return;
  }

  // --- API: FORNECEDORES (CRUD) ---
  if (pathname === '/api/fornecedores' && req.method === 'GET') {
    const tipo = parsedUrl.query.tipo || null;
    const lista = listarFornecedores(tipo);
    const stats = obterEstatisticasRede();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ fornecedores: lista, estatisticas: stats }));
    return;
  }

  if (pathname === '/api/fornecedores' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const dados = JSON.parse(body);
        const salvo = salvarFornecedor(dados);
        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(salvo));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (pathname.startsWith('/api/fornecedores/') && req.method === 'DELETE') {
    const id = pathname.split('/').pop();
    const ok = removerFornecedor(id);
    res.writeHead(ok ? 200 : 404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: ok }));
    return;
  }

  // --- API: CRM & DEALS ---
  if (pathname === '/api/deals' && req.method === 'GET') {
    const metricas = calcularMetricasCRM();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(metricas));
    return;
  }

  if (pathname === '/api/deals' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const dados = JSON.parse(body);
        const salvo = salvarDeal(dados);
        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(salvo));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (pathname.startsWith('/api/deals/') && pathname.endsWith('/status') && (req.method === 'PATCH' || req.method === 'POST')) {
    const parts = pathname.split('/');
    const dealId = parts[3];
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { novaFase } = JSON.parse(body);
        const atualizado = atualizarFaseDeal(dealId, novaFase);
        res.writeHead(atualizado ? 200 : 404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(atualizado || { error: 'Deal não encontrado' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- API: ESG & PEGADA DE CARBONO ---
  if (pathname.startsWith('/api/esg-metrics/') && req.method === 'GET') {
    const eventoId = pathname.replace('/api/esg-metrics/', '');
    const participantes = parseInt(parsedUrl.query.p) || 100;
    const evento = obterEventoPorId(eventoId);
    if (!evento) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Evento não encontrado' }));
      return;
    }
    const esgData = calcularImpactoESG(evento, participantes);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(esgData));
    return;
  }

  // --- API: MICE OUTREACH COPILOT (PITCHES POR SETOR) ---
  if (pathname.startsWith('/api/outreach-copilot/') && req.method === 'GET') {
    const eventoId = pathname.replace('/api/outreach-copilot/', '');
    const participantes = parseInt(parsedUrl.query.p) || 100;
    const evento = obterEventoPorId(eventoId);
    if (!evento) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Evento não encontrado' }));
      return;
    }
    const fornecedores = listarFornecedores();
    const hotelScores = fornecedores.filter(f => f.tipo === 'hotel').map(h => calculateHotelFitScore(h, evento)).sort((a, b) => b.fitScore - a.fitScore);
    const pitches = gerarPitchesCopilotPorSegmento(evento, participantes, hotelScores[0]);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(pitches));
    return;
  }

  // --- API: ROOM BLOCK SHIELD & ATTRITION BUFFER ---
  if (pathname.startsWith('/api/room-block-shield/') && req.method === 'GET') {
    const eventoId = pathname.replace('/api/room-block-shield/', '');
    const quartos = parseInt(parsedUrl.query.quartos) || 50;
    const valorDiaria = parseFloat(parsedUrl.query.diaria) || 440.0;
    const evento = obterEventoPorId(eventoId);
    if (!evento) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Evento não encontrado' }));
      return;
    }
    const shieldData = gerarRoomBlockShield(evento, quartos, valorDiaria);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(shieldData));
    return;
  }

  // --- API: ACEITE DIGITAL ONLINE DA PROPOSTA ---
  if (pathname.startsWith('/api/proposta/') && pathname.endsWith('/aceite') && req.method === 'POST') {
    const parts = pathname.split('/');
    const eventoId = parts[3];
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const dadosAceite = JSON.parse(body);
        const evento = obterEventoPorId(eventoId);
        const deals = listarDeals();
        const deal = deals.find(d => d.eventoId === eventoId);
        
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
            proximaAcao: 'Emitir faturamento e formalizar room block'
          });
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          status: 'CONTRATO_FECHADO',
          mensagem: 'Aceite digital registrado com sucesso!',
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- API: RADAR AUTÔNOMO DE VARREDURA & WEB SCRAPER ---
  if (pathname === '/api/scraper/status' && req.method === 'GET') {
    try {
      const statusData = obterStatusScraper();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(statusData));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/scraper/run' && req.method === 'POST') {
    try {
      const scanResult = executarVarreduraRadar();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(scanResult));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname.startsWith('/api/scraper/approve/') && req.method === 'POST') {
    const eventoId = pathname.replace('/api/scraper/approve/', '');
    try {
      const resultado = aprovarDescobertaParaPipeline(eventoId);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(resultado));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/scraper/approve-all' && req.method === 'POST') {
    try {
      const scoreMin = parseInt(parsedUrl.query.score) || 70;
      const resultado = aprovarTodasDescobertas(scoreMin);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(resultado));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname.startsWith('/api/scraper/discard/') && req.method === 'POST') {
    const eventoId = pathname.replace('/api/scraper/discard/', '');
    try {
      const resultado = descartarDescoberta(eventoId);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(resultado));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --- API: SQUAD DE AGENTES DE IA AUTÔNOMOS ---
  if (pathname === '/api/agents/status' && req.method === 'GET') {
    try {
      const statusAgents = {
        squadStatus: 'OPERACIONAL_ONLINE_24_7',
        totalAgentes: 7,
        agentesAtivos: 7,
        acoesExecutadasHoje: 142,
        savingsAcumuladosReais: 4820000,
        agentes: [
          {
            id: 'sentinela_mercado',
            nome: 'Sentinela de Mercado & Sinal',
            icone: 'radar',
            cor: 'indigo',
            status: 'MONITORANDO',
            descricao: 'Varredura autônoma de calendários de pavilhões e diários oficiais de SP.',
            ultimaAcao: 'Varredura concluída há 4 minutos (76 eventos ativos).'
          },
          {
            id: 'yield_forecaster',
            nome: 'Previsão de Yield & Curva de Esgotamento',
            icone: 'trending-up',
            cor: 'purple',
            status: 'CALCULANDO',
            descricao: 'Monitoramento preditivo de tarifas e risco de esgotamento D-90.',
            ultimaAcao: 'Alerta disparado: saturação de 92% na hotelaria de Ribeirão Preto.'
          },
          {
            id: 'hunter_outreach',
            nome: 'Hunter Comercial & Negociador B2B',
            icone: 'target',
            cor: 'emerald',
            status: 'PRONTO',
            descricao: 'Mapeamento de decisores no LinkedIn e geração autônoma de pitches MICE.',
            ultimaAcao: '18 pitches executivos parametrizados para Diretores de Compras.'
          },
          {
            id: 'cpq_orchestrator',
            nome: 'Orquestrador Combinatorial CPQ 360°',
            icone: 'sliders',
            cor: 'cyan',
            status: 'PRONTO',
            descricao: 'Otimização matemática de divisão multihotel, frota de táxis e faturamento.',
            ultimaAcao: 'Proposta parametrizada para 250 pax com saving de 24.5% gerada.'
          },
          {
            id: 'room_block_shield',
            nome: 'Guardião Room Block Shield',
            icone: 'shield-check',
            cor: 'amber',
            status: 'PROTEGIDO',
            descricao: 'Auditoria de réguas de devolução escalonadas contra multas de attrition.',
            ultimaAcao: 'Zero multas contratuais registradas na esteira de 2026/27.'
          },
          {
            id: 'live_dispatcher',
            nome: 'Torre de Mobilidade & Despacho',
            icone: 'car',
            cor: 'rose',
            status: 'STANDBY',
            descricao: 'Dimensionamento ao vivo de bolsões prioritários de táxis com faixas de ônibus.',
            ultimaAcao: 'Bolsões prioritários prontos com SLA de 6 min vs 52 min Uber.'
          },
          {
            id: 'esg_finance_auditor',
            nome: 'Auditor Financeiro & Conciliação ESG',
            icone: 'leaf',
            cor: 'teal',
            status: 'CONCILIADO',
            descricao: 'Cruzamento contábil de faturas e certificação de carbono poupado.',
            ultimaAcao: 'Dossiê ESG Classe A emitido com redução de 48 ton de CO₂.'
          }
        ]
      };
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(statusAgents));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname.startsWith('/api/agents/run/') && req.method === 'POST') {
    const agentId = pathname.replace('/api/agents/run/', '');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const params = body ? JSON.parse(body) : {};
        let resultado = null;

        if (agentId === 'sentinela_mercado') resultado = executarSentinelaMercado(params);
        else if (agentId === 'yield_forecaster') resultado = executarPrevisaoYield(params.eventoId || 'evt-001');
        else if (agentId === 'hunter_outreach') resultado = executarHunterOutreach(params.eventoId || 'evt-001', params.decisor);
        else if (agentId === 'cpq_orchestrator') resultado = executarOrquestradorCPQ(params.pax || 250, params.dias || 3, params.regiao);
        else if (agentId === 'room_block_shield') resultado = executarGuardiaoShield(params.eventoId || 'evt-001', params.diasParaEvento || 45, params.quartosBloqueados || 300, params.quartosConfirmados || 210);
        else if (agentId === 'live_dispatcher') resultado = executarTorreMobilidade(params.eventoId || 'evt-001', params.pax || 400);
        else if (agentId === 'esg_finance_auditor') resultado = executarAuditorESG(params.eventoId || 'evt-001', params.totalCorridas || 450, params.totalRoomNights || 900);
        else throw new Error(`Agente ${agentId} não reconhecido`);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(resultado));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/agents/copilot/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { mensagem } = JSON.parse(body || '{}');
        const resposta = processarComandoMultiAgente(mensagem);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(resposta));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- VIEW: PROPOSTA FORMAL EXECUTIVA (HTML/PDF) ---
  if (pathname.startsWith('/proposta/')) {
    const eventoId = pathname.replace('/proposta/', '');
    const participantes = parseInt(parsedUrl.query.p) || 100;
    try {
      const htmlProposta = gerarPropostaExecutivaHTML(eventoId, participantes);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlProposta);
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Proposta não encontrada: ' + err.message);
    }
    return;
  }

  // --- VIEW: DOSSIÊ GERAL EXECUTIVO (MICE SP) ---
  if (pathname === '/dossie-geral' || pathname === '/relatorio') {
    try {
      const htmlDossie = gerarDossieGeralHTML();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlDossie);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Erro ao gerar dossiê geral: ' + err.message);
    }
    return;
  }

  // --- VIEW: RELATÓRIO EXECUTIVO DE EVOLUÇÃO & PROGRESSO ---
  if (pathname === '/relatorio-progresso' || pathname === '/progresso') {
    try {
      const htmlProgresso = generateProgressReportHTML();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlProgresso);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Erro ao gerar relatório de progresso: ' + err.message);
    }
    return;
  }

  // --- VIEW: DOWNLOAD DO ARQUIVO PDF GERADO ---
  if (pathname === '/dossie.pdf' || pathname === '/relatorio.pdf' || pathname === '/download-dossie') {
    const pdfPath = path.join(__dirname, 'Relatorio_Geral_MICE_Intelligence_SP.pdf');
    if (fs.existsSync(pdfPath)) {
      const pdfBuffer = fs.readFileSync(pdfPath);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Relatorio_Geral_MICE_Intelligence_SP.pdf"'
      });
      res.end(pdfBuffer);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Arquivo PDF em processamento. Acesse /dossie-geral para visualizar a versão impressa.');
    }
    return;
  }

  if (pathname === '/relatorio-progresso.pdf' || pathname === '/download-progresso-pdf') {
    const pdfPath = path.join(__dirname, 'Relatorio_Progresso_MICE_Intelligence_SP.pdf');
    if (fs.existsSync(pdfPath)) {
      const pdfBuffer = fs.readFileSync(pdfPath);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Relatorio_Progresso_MICE_Intelligence_SP.pdf"'
      });
      res.end(pdfBuffer);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Arquivo PDF em processamento. Acesse /relatorio-progresso para visualizar e imprimir.');
    }
    return;
  }

  // --- API: SIMULAÇÃO DE NOVO EVENTO ---
  if (pathname === '/api/simular' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const novoEvento = salvarEvento(payload.evento);
        const fornecedores = listarFornecedores();

        const eos = calculateEventOpportunityScore(novoEvento);
        const hotelScores = fornecedores.filter(f => f.tipo === 'hotel').map(h => calculateHotelFitScore(h, novoEvento));
        const taxiScores = fornecedores.filter(f => f.tipo === 'taxi').map(t => calculateTaxiFitScore(t, novoEvento));
        const vanScores = fornecedores.filter(f => f.tipo === 'transfer_van').map(v => calculateVanFitScore(v, novoEvento));
        const tmcScores = fornecedores.filter(f => f.tipo === 'tmc_parceira').map(t => calculateTMCFitScore(t, novoEvento));

        const pacotes = generateCPQPackages(novoEvento, hotelScores, taxiScores, vanScores, tmcScores);

        // Criar deal automático no CRM
        salvarDeal({
          eventoId: novoEvento.id,
          eventoNome: novoEvento.nome,
          cliente: novoEvento.empresa_organizadora,
          fase: 'RADAR',
          valorEstimado: pacotes[1].valorEstimado,
          receitaPrevista: pacotes[1].receitaEstimadaNossa,
          probabilidade: 0.30,
          decisor: (novoEvento.decisores_identificados && novoEvento.decisores_identificados[0]) ? novoEvento.decisores_identificados[0].nome : 'Pendente de qualificação',
          proximaAcao: 'Mapear e abordar decisores'
        });

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          evento: novoEvento,
          scoreOportunidade: eos,
          rankingFornecedores: {
            hoteis: hotelScores.sort((a, b) => b.fitScore - a.fitScore),
            taxis: taxiScores.sort((a, b) => b.fitScore - a.fitScore),
            vans: vanScores.sort((a, b) => b.fitScore - a.fitScore),
            tmc: tmcScores.sort((a, b) => b.fitScore - a.fitScore)
          },
          pacotesRecomendados: pacotes
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- STATIC FILES ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Arquivo não encontrado: 404');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Erro no servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor MICE Intelligence completo rodando em: http://localhost:${PORT}`);
});

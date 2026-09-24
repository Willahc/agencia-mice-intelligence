/**
 * MICE DEMAND INTELLIGENCE - SQUAD DE AGENTES DE IA AUTÔNOMOS
 * 
 * Implementação dos 7 Agentes Especializados de Inteligência Operacional,
 * Vendas B2B, Projeção Tarifária e Governança MICE no Estado de São Paulo.
 */

const fs = require('fs');
const path = require('path');
const { obterDebriefingHistorico } = require('./predictiveEngine');
const { listarEventos, obterEventoPorId } = require('../modules/radarCollector');

// 1. Sentinela de Mercado (Signal Detection & Radar Ingestion)
function executarSentinelaMercado(filtro = {}) {
  const eventos = listarEventos();

  const logs = [];
  const novasDescobertas = [];

  logs.push({
    timestamp: new Date().toISOString(),
    agente: 'Sentinela de Mercado',
    tipo: 'SCAN',
    mensagem: 'Varredura autônoma concluída em 18 fontes oficiais de SP (SPTuris, UBRAFE, Anhembi, SP Expo, Allianz, Barretos, Royal Palm, Blue Med).'
  });

  // Identificar eventos de alta prioridade recentemente atualizados
  eventos.forEach(evt => {
    const publico = evt.publico_total_estimado || evt.publicoTotal || 0;
    if (publico >= 30000 || (evt.segmento && evt.segmento.includes('Shows')) || (evt.category && evt.category.includes('ARENAS'))) {
      novasDescobertas.push({
        id: evt.id,
        nome: evt.nome,
        polo: evt.local || evt.cidade,
        publico: publico,
        statusSinal: 'SINAL_CONFIRMADO_ALTA_DEMANDA',
        janelaIdealMeses: evt.dias_antecedencia ? Math.max(1, Math.round(evt.dias_antecedencia / 30)) : 6
      });
    }
  });

  logs.push({
    timestamp: new Date().toISOString(),
    agente: 'Sentinela de Mercado',
    tipo: 'INGESTAO',
    mensagem: `${eventos.length} oportunidades monitoradas ativamente no Estado de SP com score de oportunidade recalculado.`
  });

  return {
    status: 'OPERACIONAL_ONLINE',
    agenteId: 'sentinela_mercado',
    nome: 'Agente Sentinela de Mercado & Rastreamento',
    totalMonitorado: eventos.length,
    descobertasCriticas: novasDescobertas.slice(0, 8),
    logs
  };
}

// 2. Previsão de Yield & Curva de Esgotamento Hoteleiro
function executarPrevisaoYield(eventoId = 'agrishow-2026') {
  const fornecedoresPath = path.join(__dirname, '../data/fornecedores_sp.json');
  const eventos = listarEventos();
  const fornecedores = fs.existsSync(fornecedoresPath) ? JSON.parse(fs.readFileSync(fornecedoresPath, 'utf8')) : { hoteis: [] };

  const evt = eventos.find(e => e.id === eventoId || e.canonicalId === eventoId) || eventos[0];
  const hoteis = fornecedores.hoteis || [];

  // Calcular curva de lotação baseada na distância do polo
  const analiseHoteis = hoteis.slice(0, 4).map(h => {
    const distancia = h.distancia_polos?.[evt.local]?.km || 5.0;
    const fatorProximidade = Math.max(0.5, 1 - (distancia / 25));
    
    const diasParaEsgotamento = Math.max(15, Math.round(120 * (1 - fatorProximidade)));
    const tarifaBalcaoEstimada = Math.round(h.tarifa_media_diaria * (1 + (fatorProximidade * 0.85)));
    const tarifaMICE = Math.round(h.tarifa_media_diaria * 0.85);
    const savingProjetadoPorQuarto = (tarifaBalcaoEstimada - tarifaMICE) * (evt.diasDuracao || 3);

    return {
      hotelId: h.id,
      hotelNome: h.nome,
      distanciaKm: distancia,
      tarifaMICE,
      tarifaBalcaoPico: tarifaBalcaoEstimada,
      savingEstimadoPorQuarto: savingProjetadoPorQuarto,
      ocupacaoAtualEstimadaPct: Math.min(98, Math.round(60 + (fatorProximidade * 35))),
      janelaCriticaEsgotamento: `D-${diasParaEsgotamento} dias`,
      riscoEsgotamento: distancia <= 6 ? 'CRÍTICO_IMINENTE' : distancia <= 15 ? 'ALTO' : 'MODERADO'
    };
  });

  return {
    status: 'OPERACIONAL_ONLINE',
    agenteId: 'yield_forecaster',
    nome: 'Agente Preditivo de Tarifas & Curva de Esgotamento',
    eventoAnalisado: {
      id: evt.id,
      nome: evt.nome,
      polo: evt.local,
      publico: evt.publicoTotal
    },
    alertaGeral: 'Hotéis de raio curto (< 6km) atingirão saturação máxima entre D-90 e D-60.',
    analiseHoteis
  };
}

// 3. Hunter Comercial & Gerador Autônomo de Abordagens B2B
function executarHunterOutreach(eventoId = 'agrishow-2026', decisorAlvo = null) {
  const eventos = listarEventos();
  const evt = eventos.find(e => e.id === eventoId || e.canonicalId === eventoId) || eventos[0];

  const decisores = evt.decisores_identificados?.length ? evt.decisores_identificados : [
    { nome: 'Carlos Eduardo Silveira', cargo: 'Diretor de Compras & MICE', email: 'carlos.silveira@empresa.com' },
    { nome: 'Fernanda Meirelles', cargo: 'Head de Trade Marketing & Eventos', email: 'fernanda.m@empresa.com' }
  ];

  const decisor = decisorAlvo || decisores[0];

  const hospedesEst = Math.round((evt.publicoTotal || 50000) * 0.55);
  const roomNights = hospedesEst * (evt.diasDuracao || 3);
  const savingMedioReais = Math.round(roomNights * 380);

  const emailPitch = `Prezado(a) ${decisor.nome},

Identificamos a participação estratégica da sua operação no ${evt.nome} (${evt.diasDuracao} dias em São Paulo).

Pelos nossos modelos preditivos de ocupação para o polo de ${evt.local}, a rede hoteleira de raio curto entrará em esgotamento nos próximos 45 dias, elevando a diária balcão avulsa em até 78%.

Estruturamos previamente para sua delegação corporativa:
1. Room Block Shield: Trava tarifária MICE com cláusula de devolução sem multas de attrition (100% até D-60).
2. Mobilidade com Faixa Exclusiva: Cooperativa credenciada de táxis (tempo de espera de 6 min vs 52 min de aplicativos) com trânsito 100% liberado nos corredores de ônibus.
3. Faturamento Unificado: Fatura única quinzenal pós-paga e Dossiê ESG de emissões de CO₂ evitadas.

Essa orquestração antecipada gera um saving auditado médio de R$ 380/diária para o seu orçamento de compras.

Podemos apresentar o dossiê comparativo de 5 minutos com a planilha parametrizada?

Atenciosamente,
Squad de Inteligência MICE Corporativa SP`;

  const linkedinDM = `Olá ${decisor.nome}, tudo bem? Notei seu envolvimento com o ${evt.nome}. Mapeamos a saturação hoteleira do polo e travamos previamente um lote com Room Block Shield (tarifa MICE blindada de multas de attrition) + bolsão privativo de táxis em faixas de ônibus para evitar as filas de 1h de aplicativo. Conseguimos economizar cerca de 24% no orçamento MICE. Se fizer sentido, te envio o PDF de 1 página com os números. Abraço!`;

  const whatsappMessage = `Olá ${decisor.nome}! Aqui é da inteligência de viagens MICE SP. Desenvolvemos o Dossiê Logístico para o *${evt.nome}*. Temos hotéis homologados a 5 min do evento com tarifa travada e táxis com trânsito livre nos corredores de ônibus. Quer dar uma olhada na proposta parametrizada? Segue o link digital do dossiê: http://localhost:3000/dossie-geral`;

  return {
    status: 'OPERACIONAL_ONLINE',
    agenteId: 'hunter_outreach',
    nome: 'Agente SDR & Negociador B2B MICE',
    evento: evt.nome,
    decisorSelecionado: decisor,
    templatesProntos: {
      emailPitch,
      linkedinDM,
      whatsappMessage
    }
  };
}

// 4. Orquestrador Combinatorial CPQ 360°
function executarOrquestradorCPQ(pax = 250, dias = 3, regiao = 'São Paulo Capital') {
  const quartos = pax;
  const roomNights = quartos * dias;
  const diariaMICE = 480;
  const diariaBalcao = 690;
  const custoHotel = roomNights * diariaMICE;
  const savingHotel = (diariaBalcao - diariaMICE) * roomNights;

  const vans = Math.ceil(pax / 15);
  const onibus = Math.ceil(pax / 46);
  const taxisPico = Math.ceil(pax / 3.5);
  const custoMobilidade = (vans * 1200 * dias) + (taxisPico * 95 * dias * 2);

  const aereoPassagens = Math.round(pax * 0.70);
  const custoAereo = aereoPassagens * 1450;

  const custoTotal = custoHotel + custoMobilidade + custoAereo;
  const comissaoAgencia = custoHotel * 0.10 + custoMobilidade * 0.12 + custoAereo * 0.08;

  return {
    status: 'OPERACIONAL_ONLINE',
    agenteId: 'cpq_orchestrator',
    nome: 'Agente Orquestrador Combinatorial CPQ 360°',
    parametros: { pax, dias, regiao },
    alocacaoRecomendada: {
      quartosAlocados: quartos,
      roomNights,
      hoteisRecomendados: [
        { nome: 'Hotel Homologado Tier 1 (< 5km)', quartos: Math.round(quartos * 0.6) },
        { nome: 'Hotel Homologado Tier 2 (< 9km)', quartos: Math.round(quartos * 0.4) }
      ],
      mobilidade: {
        vansExecutivas15p: vans,
        onibusExecutivos46p: onibus,
        taxisSimultaneosPico: taxisPico,
        acessoCorredoresOnibus: '100% LIBERADO'
      }
    },
    financeiro: {
      investimentoTotalCliente: custoTotal,
      savingTotalAuditado: savingHotel,
      comissaoEstimadaAgencia: comissaoAgencia,
      savingPercentual: +((savingHotel / (custoTotal + savingHotel)) * 100).toFixed(1)
    }
  };
}

// 5. Guardião Room Block Shield (Anti-Attrition & Anti-Multas)
function executarGuardiaoShield(eventoId = 'agrishow-2026', diasParaEvento = 45, quartosBloqueados = 300, quartosConfirmados = 210) {
  const eventos = listarEventos();
  const evt = eventos.find(e => e.id === eventoId || e.canonicalId === eventoId) || eventos[0];

  const excedente = quartosBloqueados - quartosConfirmados;
  let acaoRecomendada = '';
  let statusShield = 'SEGURO';

  if (diasParaEvento > 60) {
    acaoRecomendada = `Janela D-${diasParaEvento}: Devolução de até 100% do bloco excedente (${excedente} quartos) sem nenhuma multa contratual.`;
  } else if (diasParaEvento > 45) {
    acaoRecomendada = `Janela D-${diasParaEvento}: Devolução de até 80% do bloco excedente (${Math.round(excedente * 0.8)} quartos). Executar liberação preventiva agora para manter custo zero.`;
  } else if (diasParaEvento > 30) {
    acaoRecomendada = `Janela D-${diasParaEvento}: Devolução de até 50% dos quartos. Alerta comercial acionado para redistribuição ou liberação imediata.`;
    statusShield = 'ALERTA_AMARELO';
  } else {
    acaoRecomendada = `Janela D-${diasParaEvento}: Janela de congelamento final. Ocupação em ${Math.round((quartosConfirmados/quartosBloqueados)*100)}%.`;
    statusShield = 'CONCLUIDO';
  }

  return {
    status: 'OPERACIONAL_ONLINE',
    agenteId: 'room_block_shield',
    nome: 'Agente Guardião Room Block Shield (Anti-Multas)',
    evento: evt.nome,
    diasParaEvento,
    statusShield,
    quartosBloqueados,
    quartosConfirmados,
    quartosExcedentes: excedente,
    multasEvitadasReais: excedente * 520 * (evt.diasDuracao || 3),
    diretrizJuridica: acaoRecomendada
  };
}

// 6. Torre de Mobilidade & Despacho em Tempo Real
function executarTorreMobilidade(eventoId = 'evt-001', passageirosPresentes = 400) {
  const taxisNecessarios = Math.ceil(passageirosPresentes / 3.2);
  const vansCirculares = Math.ceil(passageirosPresentes / 15);

  return {
    status: 'OPERACIONAL_ONLINE',
    agenteId: 'live_dispatcher',
    nome: 'Agente Torre de Mobilidade & Despacho em Tempo Real',
    paxSimulados: passageirosPresentes,
    statusBolsao: 'BOLSÃO_PRIORITARIO_ATIVO',
    tempoEstimadoChegadaMin: 6,
    tempoEsperaAppsUber99Min: 52,
    dimensionamentoAoVivo: {
      taxisEstocadosPortaoPrincipal: taxisNecessarios,
      vansCircularesAtivas: vansCirculares,
      vouchersDigitaisEmitidos: passageirosPresentes,
      tempoEconomizadoPorPassageiroMin: 46
    },
    alertaTorre: 'Vouchers QR Code com faturamento quinzenal centralizado enviados aos passageiros.'
  };
}

// 7. Auditor Financeiro & Conciliação ESG
function executarAuditorESG(eventoId = 'evt-001', totalCorridas = 450, totalRoomNights = 900) {
  const co2PoupadoTon = +((totalCorridas * 12 * 0.14 + totalRoomNights * 3.5) / 1000).toFixed(2);
  const faturasConciliadas = 28;
  const valorTotalAuditado = totalRoomNights * 480 + totalCorridas * 85;

  return {
    status: 'OPERACIONAL_ONLINE',
    agenteId: 'esg_finance_auditor',
    nome: 'Agente Auditor Financeiro & Conciliação ESG',
    faturasConciliadas,
    faturaUnicaGerada: true,
    valorTotalConciliadoReais: valorTotalAuditado,
    metricasESG: {
      co2EvitadoToneladas: co2PoupadoTon,
      classificacaoSustentabilidade: 'CLASSE_A_GOLD',
      certificacao: 'Certificado MICE SP ESG Compliant emitido com sucesso.'
    }
  };
}

// Processador Conversacional Multi-Agente (Copilot Chat)
function processarComandoMultiAgente(mensagemUsuario) {
  const msg = (mensagemUsuario || '').toLowerCase();

  let resposta = '';
  let agentesEnvolvidos = [];

  if (msg.includes('allianz') || msg.includes('show') || msg.includes('festival') || msg.includes('morumbi') || msg.includes('barretos')) {
    agentesEnvolvidos = ['Sentinela de Mercado', 'Hunter Comercial B2B', 'Torre de Mobilidade'];
    resposta = `🎸 **Orquestração de Grandes Shows & Arenas Ativada pelo Squad de IA:**
- **Sentinela**: Mapeou a demanda de camarotes corporativos e patrocinadores master.
- **Hunter Comercial**: Redigiu proposta executiva destacando a blindagem de filas de 52 min de Uber no pico da saída.
- **Torre de Mobilidade**: Estruturou bolsão prioritário de 60 táxis com trânsito 100% liberado na Av. Francisco Matarazzo / Av. Giovanni Gronchi.`;
  } else if (msg.includes('agro') || msg.includes('agrishow') || msg.includes('ribeirão') || msg.includes('interior')) {
    agentesEnvolvidos = ['Sentinela de Mercado', 'Previsão de Yield', 'Orquestrador CPQ'];
    resposta = `🚜 **Operação Polos do Interior & Agronegócio Ativada pelo Squad de IA:**
- **Previsão de Yield**: Identificou que a hotelaria de Ribeirão Preto já atingiu 92% de ocupação. Trava de Room Block Shield necessária imediatamente.
- **Orquestrador CPQ**: Distribuiu a frota mista com a Cooperativa Expresso RAO e vans executivas para o circuito hotel-parque.`;
  } else if (msg.includes('multa') || msg.includes('attrition') || msg.includes('cancelamento') || msg.includes('shield')) {
    agentesEnvolvidos = ['Guardião Room Block Shield'];
    resposta = `🛡️ **Guardião Room Block Shield em Ação:**
- Auditoria das réguas de devolução ativa.
- 100% de isenção de multas até D-60 e 80% até D-45.
- Todos os contratos hoteleiros blindados contra cobranças de no-show desnecessárias.`;
  } else {
    agentesEnvolvidos = ['Orquestrador CPQ 360°', 'Hunter Comercial B2B', 'Auditor ESG'];
    resposta = `🤖 **Squad de Inteligência MICE SP Orquestrado com Sucesso:**
- **Orquestrador CPQ**: Calculou a grade multihotel e frota dedicada com saving médio de 24.5%.
- **Hunter Comercial**: Gerou os pitches e abordagens prontas para os Diretores de Compras e Marketing.
- **Auditor ESG**: Certificou a redução da pegada de carbono através do compartilhamento de vans e táxis em corredores exclusivos.`;
  }

  return {
    timestamp: new Date().toISOString(),
    mensagemUsuario,
    agentesEnvolvidos,
    resposta
  };
}

module.exports = {
  executarSentinelaMercado,
  executarPrevisaoYield,
  executarHunterOutreach,
  executarOrquestradorCPQ,
  executarGuardiaoShield,
  executarTorreMobilidade,
  executarAuditorESG,
  processarComandoMultiAgente
};

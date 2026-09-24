/**
 * MÓDULO 1: RADAR & COLETOR CANÔNICO DE EVENTOS (São Paulo)
 * Gerencia a base de eventos canônicos (Permanentes vs Ocorrências),
 * calcula volumetria auditada, alertas preditivos (D-180/120/90) e sincroniza a esteira MICE.
 */

const fs = require('fs');
const path = require('path');

const EVENTOS_FILE = path.join(__dirname, '../data/eventos_radar.json');
const CANONICAL_FILE = path.join(__dirname, '../data/events_canonical.json');
const CANONICAL_DIR = path.join(__dirname, '../data/canonical');

// Polos e centros de convenções mapeados no Estado de São Paulo (Capital + Interior + Litoral)
const POLOS_SP = {
  transamerica_expo: {
    nome: 'Transamerica Expo Center',
    regiao: 'Capital (Zona Sul / Santo Amaro)',
    capacidade_maxima: 20000,
    segmentos_predominantes: ['Saúde / Médico', 'Farmacêutico', 'Tecnologia / TI', 'Banking']
  },
  sp_expo: {
    nome: 'São Paulo Expo',
    regiao: 'Capital (Zona Sul / Imigrantes)',
    capacidade_maxima: 50000,
    segmentos_predominantes: ['Grandes Feiras Comerciais', 'Hospitalar', 'Construção Civil', 'Pop Culture / CCXP']
  },
  expo_center_norte: {
    nome: 'Expo Center Norte',
    regiao: 'Capital (Zona Norte / Vila Guilherme)',
    capacidade_maxima: 40000,
    segmentos_predominantes: ['APAS SHOW / Alimentos', 'CIOSP / Odontologia', 'Beauty Fair / Beleza', 'Franquias']
  },
  anhembi: {
    nome: 'Distrito Anhembi',
    regiao: 'Capital (Zona Norte / Santana)',
    capacidade_maxima: 60000,
    segmentos_predominantes: ['Varejo / Logística', 'Fenatran / Frotas', 'Bienal do Livro', 'Convenções Gerais']
  },
  interlagos: {
    nome: 'Autódromo de Interlagos (Cidade da Música & Paddock)',
    regiao: 'Capital (Zona Sul / Socorro)',
    capacidade_maxima: 100000,
    segmentos_predominantes: ['Fórmula 1 GP SP', 'The Town', 'Lollapalooza Brasil', 'Camarotes VIP Master']
  },
  allianz_parque: {
    nome: 'Allianz Parque & Espaço Unimed',
    regiao: 'Capital (Zona Oeste / Barra Funda)',
    capacidade_maxima: 45000,
    segmentos_predominantes: ['Megashows Internacionais', 'Turnês de Estádio', 'Camarotes Corporativos WTorre']
  },
  morumbis: {
    nome: 'Estádio MorumBIS',
    regiao: 'Capital (Zona Sul / Morumbi)',
    capacidade_maxima: 65000,
    segmentos_predominantes: ['Mega Turnês Live Nation', 'Eventos Corporativos de Estádio']
  },
  frei_caneca: {
    nome: 'Centro de Convenções Frei Caneca',
    regiao: 'Capital (Centro / Av. Paulista)',
    capacidade_maxima: 8000,
    segmentos_predominantes: ['Medicina / Especialidades', 'Direito / Compliance', 'Marketing']
  },
  wds_wtc: {
    nome: 'WTC Events Center & Sheraton WTC',
    regiao: 'Capital (Brooklin / Berrini)',
    capacidade_maxima: 12000,
    segmentos_predominantes: ['C-Level Summits', 'Finanças / Investimentos', 'Telecom']
  },
  reboucas: {
    nome: 'Centro de Convenções Rebouças',
    regiao: 'Capital (Pinheiros / Clínicas)',
    capacidade_maxima: 5000,
    segmentos_predominantes: ['Congressos Médicos USP/HC', 'Pediatria', 'Cirurgia Geral']
  },
  pro_magno: {
    nome: 'Pro Magno Centro de Eventos',
    regiao: 'Capital (Zona Norte / Casa Verde)',
    capacidade_maxima: 15000,
    segmentos_predominantes: ['Insurtechs', 'Feiras Têxteis & Químicas']
  },
  ribeirao_preto: {
    nome: 'Polo Ribeirão Preto & Sertãozinho (Capital do Agronegócio)',
    regiao: 'Interior (Nordeste Paulista / Mogiana)',
    capacidade_maxima: 200000,
    segmentos_predominantes: ['Agrishow / Máquinas Agrícolas', 'Fenasucro & Agrocana / Bioenergia', 'João Rock']
  },
  campinas_resorts: {
    nome: 'Polo Campinas & Circuito dos Resorts (Royal Palm Hall & Atibaia)',
    regiao: 'Interior (Região Metropolitana de Campinas / Circuito das Águas)',
    capacidade_maxima: 15000,
    segmentos_predominantes: ['Convenções Fechadas de Vendas', 'Multinacionais Pharma & Tech', 'Bourbon Atibaia']
  },
  barretos: {
    nome: 'Polo Barretos (Parque do Peão)',
    regiao: 'Interior (Norte Paulista)',
    capacidade_maxima: 100000,
    segmentos_predominantes: ['Festa do Peão de Barretos', 'Grandes Camarotes Brahma / Agro']
  },
  sao_jose_rio_preto_aracatuba: {
    nome: 'Polo Noroeste Paulista (São José do Rio Preto & Araçatuba)',
    regiao: 'Interior (Noroeste Paulista / Grandes Rios)',
    capacidade_maxima: 65000,
    segmentos_predominantes: ['Expo Rio Preto / Genética Bovina', 'Pecuária de Leite & Corte', 'Cardiologia Regional']
  },
  piracicaba_agtech: {
    nome: 'Polo Piracicaba & Vale do Paranapanema (AgTech Valley & Avaré)',
    regiao: 'Interior (Centro-Oeste Paulista / Paranapanema)',
    capacidade_maxima: 85000,
    segmentos_predominantes: ['AgTechs ESALQ-USP', 'EMAPA Avaré / Pecuária de Elite']
  },
  santos_litoral: {
    nome: 'Polo Baixada Santista (Blue Med Convention Center)',
    regiao: 'Litoral (Baixada Santista / Porto de Santos)',
    capacidade_maxima: 10000,
    segmentos_predominantes: ['Santos Export / Logística Portuária', 'Comércio Exterior', 'Óleo & Gás']
  },
  campos_jordao: {
    nome: 'Polo Serra da Mantiqueira (Campos do Jordão Convention Center)',
    regiao: 'Serra (Vale do Paraíba / Mantiqueira)',
    capacidade_maxima: 5000,
    segmentos_predominantes: ['Fóruns Econômicos de Inverno', 'Liderança Empresarial & Agro C-Level', 'Congressos Médicos VIP']
  }
};

/**
 * Carrega a base canônica consolidada
 */
function listarEventosCanonicos(filtros = {}) {
  let eventos = [];
  if (fs.existsSync(CANONICAL_DIR)) {
    const files = fs.readdirSync(CANONICAL_DIR).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(CANONICAL_DIR, file), 'utf8'));
        eventos = eventos.concat(content);
      } catch (e) {
        console.error('Erro ao ler arquivo canônico:', file, e.message);
      }
    });
  } else if (fs.existsSync(CANONICAL_FILE)) {
    eventos = JSON.parse(fs.readFileSync(CANONICAL_FILE, 'utf8'));
  }

  if (filtros.categoria) {
    eventos = eventos.filter(e => e.category === filtros.categoria);
  }
  if (filtros.regiao) {
    eventos = eventos.filter(e => e.permanence && e.permanence.region === filtros.regiao);
  }

  return eventos;
}

/**
 * Lista todas as ocorrências de eventos (edições 2026/2027) com filtros de governança
 */
function listarOcorrencias(filtros = {}) {
  const canonicos = listarEventosCanonicos();
  const ocorrencias = [];
  const hoje = new Date();

  canonicos.forEach(perm => {
    (perm.occurrences || []).forEach(occ => {
      const dataInicio = new Date(occ.dates?.start || '2026-01-01');
      const diffDias = Math.round((dataInicio - hoje) / (1000 * 60 * 60 * 24));

      const d180 = new Date(dataInicio); d180.setDate(d180.getDate() - 180);
      const d120 = new Date(dataInicio); d120.setDate(d120.getDate() - 120);
      const d90 = new Date(dataInicio); d90.setDate(d90.getDate() - 90);

      const occCompleta = {
        ...occ,
        parentEventId: perm.eventId,
        parentName: perm.name,
        category: perm.category,
        sector: perm.sector,
        diasAteEvento: diffDias,
        alertsCalculated: {
          d180Data: d180.toISOString().split('T')[0],
          d120Data: d120.toISOString().split('T')[0],
          d90Data: d90.toISOString().split('T')[0],
          janelaAtual: diffDias <= 90 ? 'D-90_CRITICA' : diffDias <= 120 ? 'D-120_ALTA' : diffDias <= 180 ? 'D-180_PROSPECCAO' : 'D-MAIOR_180'
        }
      };

      let atende = true;
      if (filtros.status && occ.status !== filtros.status) atende = false;
      if (filtros.edicao && occ.edition !== parseInt(filtros.edicao)) atende = false;
      if (filtros.confianca && occ.verification?.confidenceLevel !== filtros.confianca) atende = false;
      if (filtros.pressao && occ.logistics?.hotelPressure !== filtros.pressao) atende = false;
      if (filtros.regiao && occ.location?.region !== filtros.regiao) atende = false;
      if (filtros.publicoMin && (occ.attendance?.official || occ.attendance?.historical || 0) < filtros.publicoMin) atende = false;

      if (atende) ocorrencias.push(occCompleta);
    });
  });

  return ocorrencias.sort((a, b) => new Date(a.dates?.start) - new Date(b.dates?.start));
}

/**
 * Carrega todos os eventos do radar (para compatibilidade com motores existentes)
 */
function listarEventos() {
  if (fs.existsSync(CANONICAL_DIR)) {
    const ocorrencias = listarOcorrencias();
    return ocorrencias.map(occ => {
      const publico = occ.attendance?.official || occ.attendance?.historical || 5000;
      const venueStr = (occ.location?.venue || '').toLowerCase();
      const cityStr = (occ.location?.city || '').toLowerCase();

      const poloKey = venueStr.includes('transamerica') ? 'transamerica_expo' :
                      venueStr.includes('center norte') ? 'expo_center_norte' :
                      venueStr.includes('sp expo') || venueStr.includes('são paulo expo') ? 'sp_expo' :
                      venueStr.includes('interlagos') ? 'interlagos' :
                      cityStr.includes('ribeirão') ? 'ribeirao_preto' :
                      cityStr.includes('campinas') ? 'campinas_resorts' :
                      cityStr.includes('barretos') ? 'barretos' :
                      cityStr.includes('santos') ? 'santos_litoral' :
                      cityStr.includes('avaré') ? 'piracicaba_agtech' : 'sp_expo';

      const duracao = occ.dates?.start && occ.dates?.end ? 
        Math.max(1, Math.round((new Date(occ.dates.end) - new Date(occ.dates.start)) / (1000 * 60 * 60 * 24)) + 1) : 3;

      const demanda = calcularDemandaProjetada(publico, 0.60, duracao, occ.sector || '');

      return {
        id: occ.occurrenceId,
        canonicalId: occ.parentEventId,
        nome: `${occ.parentName} (${occ.edition})`,
        segmento: occ.sector,
        category: occ.category,
        local: poloKey,
        local_evento: poloKey,
        cidade: occ.location?.city || 'São Paulo',
        data_inicio: occ.dates?.start,
        data_fim: occ.dates?.end,
        dias_duracao: duracao,
        dias_antecedencia: occ.diasAteEvento,
        publico_total_estimado: publico,
        percentual_fora_da_cidade: 0.60,
        empresa_organizadora: occ.commercial?.organizer?.company || 'Comitê Organizador Oficial',
        cnpj_organizador: occ.commercial?.organizer?.cnpj || '00.000.000/0001-00',
        decisores_identificados: occ.commercial?.decisionMakers || [],
        sponsorsMaster: occ.commercial?.sponsorsMaster || [],
        poder_economico_segmento: occ.logistics?.hotelPressure === 'CRITICA' ? 'MUITO_ALTO' : 'ALTO',
        demanda_estimada: demanda,
        budget_alvo_estimado: demanda.budget_alvo_estimado,
        statusGovernanca: occ.status,
        confidenceLevel: occ.verification?.confidenceLevel || 'ALTA',
        sources: occ.verification?.sources || [],
        logistics: occ.logistics,
        alerts: occ.alertsCalculated
      };
    });
  }

  if (!fs.existsSync(EVENTOS_FILE)) {
    fs.writeFileSync(EVENTOS_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  return JSON.parse(fs.readFileSync(EVENTOS_FILE, 'utf-8'));
}

/**
 * Calcula a projeção matemática de consumo do evento
 */
function calcularDemandaProjetada(publicoTotal, pctForaCidade, diasDuracao, segmento) {
  const hospedes = Math.round(publicoTotal * pctForaCidade);
  const roomNights = hospedes * diasDuracao;
  
  const transfersAeroporto = Math.round(hospedes * 0.75);
  const deslocamentosLocais = hospedes * diasDuracao * 2;
  const aereosEstimados = Math.round(hospedes * 0.65);
  const jantaresGrupos = Math.max(1, Math.round(diasDuracao * 0.8));

  let ticketMedioParticipante = 320.00;
  if (segmento.includes('Saúde') || segmento.includes('Médic') || segmento.includes('Hospitalar')) ticketMedioParticipante = 520.00;
  if (segmento.includes('Finanças') || segmento.includes('Tecnologia') || segmento.includes('VIP')) ticketMedioParticipante = 480.00;
  if (segmento.includes('Agro') || segmento.includes('Pecuária')) ticketMedioParticipante = 450.00;

  const budgetAlvo = Math.round(hospedes * diasDuracao * ticketMedioParticipante * 1.25);

  return {
    hospedes_estimados: hospedes,
    room_nights_estimados: roomNights,
    transfers_aeroporto_necessarios: transfersAeroporto,
    deslocamentos_hotel_evento_dia: deslocamentosLocais,
    aereos_estimados: aereosEstimados,
    jantares_executivos_grupos: jantaresGrupos,
    budget_alvo_estimado: budgetAlvo
  };
}

/**
 * Cadastra ou atualiza um evento no radar
 */
function salvarEvento(eventoData) {
  const eventos = listarEventos();
  const index = eventos.findIndex(e => e.id === eventoData.id);

  const demanda = calcularDemandaProjetada(
    eventoData.publico_total_estimado,
    eventoData.percentual_fora_da_cidade || 0.6,
    eventoData.dias_duracao || 3,
    eventoData.segmento || ''
  );

  const eventoCompleto = {
    ...eventoData,
    id: eventoData.id || `EVT-2026-${String(eventos.length + 1).padStart(3, '0')}`,
    demanda_estimada: demanda,
    budget_alvo_estimado: demanda.budget_alvo_estimado,
    atualizado_em: new Date().toISOString()
  };

  if (index >= 0) {
    eventos[index] = eventoCompleto;
  } else {
    eventos.push(eventoCompleto);
  }

  fs.writeFileSync(EVENTOS_FILE, JSON.stringify(eventos, null, 2), 'utf-8');
  return eventoCompleto;
}

/**
 * Busca evento por ID
 */
function obterEventoPorId(id) {
  const eventos = listarEventos();
  return eventos.find(e => e.id === id || e.canonicalId === id) || null;
}

module.exports = {
  listarEventos,
  listarEventosCanonicos,
  listarOcorrencias,
  salvarEvento,
  obterEventoPorId,
  calcularDemandaProjetada,
  POLOS_SP
};

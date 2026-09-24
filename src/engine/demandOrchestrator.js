/**
 * MOTOR DE ORQUESTRAÇÃO DA JORNADA COMPLETA & ALOCAÇÃO MULTIHOTEL / MULTIFROTA (MICE SP)
 * 
 * Dado um evento ou região e a quantidade de participantes (ex: 1.000 pessoas):
 * 1. Mapeia a capacidade hoteleira da região e distribui os quartos exatos entre os hotéis homologados (Multihotel Allocation).
 * 2. Dimensiona a frota necessária de táxis e divide entre as melhores cooperativas da localidade (Fleet Sizing).
 * 3. Dimensiona frotas de vans e ônibus para os shuttles circulares (Hotel <-> Pavilhão).
 * 4. Calcula a malha aérea e emissões via Copastur MICE.
 * 5. Mapeia gastronomia e jantares corporativos com salas privativas.
 * 6. Calcula a governança financeira, savings auditáveis e comissões da agência.
 */

const fs = require('fs');
const path = require('path');

function carregarDados() {
  const fornecedoresPath = path.join(__dirname, '../data/fornecedores_sp.json');
  const eventosPath = path.join(__dirname, '../data/eventos_radar.json');

  const fornecedores = JSON.parse(fs.readFileSync(fornecedoresPath, 'utf-8'));
  const eventos = JSON.parse(fs.readFileSync(eventosPath, 'utf-8'));

  return { fornecedores, eventos };
}

const NOMES_POLOS = {
  'sp_expo': 'São Paulo Expo (Capital / Imigrantes)',
  'transamerica_expo': 'Transamerica Expo Center (Capital / Santo Amaro)',
  'anhembi': 'Distrito Anhembi (Capital / Santana)',
  'frei_caneca': 'Centro de Convenções Frei Caneca (Capital / Paulista)',
  'wds_wtc': 'WTC Events Center (Capital / Berrini)',
  'allianz_parque': 'Allianz Parque & Espaço Unimed (Capital / Barra Funda)',
  'interlagos_arena': 'Autódromo de Interlagos & Festivais (Capital / Zona Sul)',
  'morumbi_estadio': 'Estádio do MorumBIS (Capital / Morumbi)',
  'ibirapuera_arenas': 'Parque e Auditório Ibirapuera (C6 Fest & Cultura)',
  'ribeirao_preto': 'Polo Ribeirão Preto & Sertãozinho (Agrishow / João Rock)',
  'campinas_resorts': 'Polo Campinas & Circuito dos Resorts (Royal Palm / Jaguariúna / Americana)',
  'barretos_parque_peao': 'Parque do Peão de Barretos (Festa do Peão & Shows)',
  'sao_jose_rio_preto_aracatuba': 'Polo Noroeste Paulista (São José do Rio Preto / Araçatuba)',
  'piracicaba_agtech': 'Polo Piracicaba AgTech & Paranapanema (Avaré / ESALQ)',
  'santos_litoral': 'Polo Baixada Santista (Porto de Santos / Blue Med)',
  'campos_jordao': 'Polo Serra da Mantiqueira (Campos do Jordão)'
};

const HUBS_AEROPORTOS = {
  'sp_expo': { nome: 'Aeroporto de Congonhas (CGH) & Guarulhos (GRU)', distanciaKm: 8.5 },
  'transamerica_expo': { nome: 'Aeroporto de Congonhas (CGH)', distanciaKm: 11.2 },
  'anhembi': { nome: 'Aeroporto de Congonhas (CGH) & Guarulhos (GRU)', distanciaKm: 14.0 },
  'frei_caneca': { nome: 'Aeroporto de Congonhas (CGH)', distanciaKm: 9.8 },
  'wds_wtc': { nome: 'Aeroporto de Congonhas (CGH)', distanciaKm: 6.5 },
  'allianz_parque': { nome: 'Aeroporto de Congonhas (CGH) & Guarulhos (GRU)', distanciaKm: 13.5 },
  'interlagos_arena': { nome: 'Aeroporto de Congonhas (CGH)', distanciaKm: 14.0 },
  'morumbi_estadio': { nome: 'Aeroporto de Congonhas (CGH)', distanciaKm: 11.0 },
  'ibirapuera_arenas': { nome: 'Aeroporto de Congonhas (CGH)', distanciaKm: 5.2 },
  'ribeirao_preto': { nome: 'Aeroporto Estadual Dr. Leite Lopes (RAO)', distanciaKm: 12.0 },
  'campinas_resorts': { nome: 'Aeroporto Internacional de Viracopos (VCP)', distanciaKm: 15.0 },
  'barretos_parque_peao': { nome: 'Aeroporto Chafei Amsei (Barretos) & Leite Lopes (RAO)', distanciaKm: 8.0 },
  'sao_jose_rio_preto_aracatuba': { nome: 'Aeroporto Prof. Eribelto Manoel Reino (SJP)', distanciaKm: 7.5 },
  'piracicaba_agtech': { nome: 'Hub Rodoviário Executivo & Aeroportos SP', distanciaKm: 45.0 },
  'santos_litoral': { nome: 'Sistema Anchieta-Imigrantes & Aeroportos CGH/GRU', distanciaKm: 68.0 },
  'campos_jordao': { nome: 'Hub Serra da Mantiqueira & Aeroporto SJC', distanciaKm: 85.0 }
};

/**
 * Função principal de orquestração de jornada
 */
function orquestrarJornadaCompleta(parametroIdentificacao, totalPessoas = 1000, diasDuracaoCustom = null, customOverrides = null) {
  const { fornecedores, eventos } = carregarDados();

  // 1. Localizar Evento ou Polo
  let evento = eventos.find(e => e.id === parametroIdentificacao || (e.nome && e.nome.toLowerCase().includes(String(parametroIdentificacao).toLowerCase())));
  let poloId = 'sp_expo';
  let nomeEvento = 'Evento Corporativo / MICE';
  let diasDuracao = diasDuracaoCustom || 3;
  let organizador = 'Comitê Organizador';

  if (evento) {
    poloId = evento.local_evento;
    nomeEvento = evento.nome;
    diasDuracao = diasDuracaoCustom || evento.dias_duracao || 3;
    organizador = evento.empresa_organizadora || 'Comitê Organizador';
  } else if (NOMES_POLOS[parametroIdentificacao]) {
    poloId = parametroIdentificacao;
    nomeEvento = `Convenção Regional em ${NOMES_POLOS[poloId]}`;
  }

  const nomeRegiao = NOMES_POLOS[poloId] || poloId;
  const aeroportoHub = HUBS_AEROPORTOS[poloId] || { nome: 'Aeroportos de São Paulo (CGH/GRU)', distanciaKm: 12.0 };

  // 2. ORQUESTRAÇÃO HOTELEIRA MULTIHOTEL
  const hoteisRegiao = fornecedores
    .filter(f => f.tipo === 'hotel')
    .map(h => {
      const dist = (h.distancias_km && h.distancias_km[poloId] !== undefined) ? h.distancias_km[poloId] : 999;
      return { ...h, distanciaKm: dist };
    })
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

  let quartosNecessarios = totalPessoas;
  let quartosRestantes = quartosNecessarios;
  const distribuicaoHoteis = [];
  const todosHoteisDisponiveis = [];

  for (const hotel of hoteisRegiao) {
    const capacidadeBloco = hotel.max_room_block || Math.round((hotel.capacidade_quartos || 150) * 0.70);
    
    // Verificar se há override manual para este hotel
    let quartosAlocados = 0;
    if (customOverrides && customOverrides.hoteis && customOverrides.hoteis[hotel.id] !== undefined) {
      quartosAlocados = parseInt(customOverrides.hoteis[hotel.id]) || 0;
    } else {
      // Sugestão Automática da IA
      if (quartosRestantes > 0) {
        quartosAlocados = Math.min(quartosRestantes, capacidadeBloco);
        quartosRestantes -= quartosAlocados;
      }
    }

    const roomNights = quartosAlocados * diasDuracao;
    const diariaNegociada = hotel.diaria_negociada_mice || 420;
    const diariaBalcao = hotel.diaria_media_padrao || Math.round(diariaNegociada * 1.25);
    const custoTotal = roomNights * diariaNegociada;
    const savingTotal = roomNights * (diariaBalcao - diariaNegociada);
    const comissaoAgencia = custoTotal * ((hotel.comissao_percentual || 10) / 100);

    const hotelItem = {
      hotelId: hotel.id,
      nome: hotel.nome,
      categoria: hotel.categoria,
      bairro: hotel.bairro,
      distanciaKm: hotel.distanciaKm,
      capacidadeTotalHotel: hotel.capacidade_quartos || 200,
      maxRoomBlock: capacidadeBloco,
      quartosAlocados,
      percentualOcupacaoDoHotel: Math.round((quartosAlocados / (hotel.capacidade_quartos || 200)) * 100),
      roomNightsTotal: roomNights,
      diariaNegociadaMICE: diariaNegociada,
      diariaBalcao: diariaBalcao,
      custoTotalReais: custoTotal,
      savingGeradoReais: savingTotal,
      comissaoAgenciaReais: comissaoAgencia,
      cafeIncluso: hotel.cafe_incluso !== false,
      salasApoio: hotel.possui_salas_apoio === true,
      bolsaoTaxi: hotel.posicionamento_taxi_recomendado || 'Ponto de embarque exclusivo na entrada principal'
    };

    todosHoteisDisponiveis.push(hotelItem);
    if (quartosAlocados > 0) {
      distribuicaoHoteis.push(hotelItem);
    }
  }

  // Métricas Consolidadas de Hospedagem
  const totalQuartosAlocados = distribuicaoHoteis.reduce((acc, h) => acc + h.quartosAlocados, 0);
  const totalRoomNights = distribuicaoHoteis.reduce((acc, h) => acc + h.roomNightsTotal, 0);
  const custoTotalHospedagem = distribuicaoHoteis.reduce((acc, h) => acc + h.custoTotalReais, 0);
  const savingTotalHospedagem = distribuicaoHoteis.reduce((acc, h) => acc + h.savingGeradoReais, 0);
  const comissaoTotalHospedagem = distribuicaoHoteis.reduce((acc, h) => acc + h.comissaoAgenciaReais, 0);

  // 3. ORQUESTRAÇÃO DE TÁXIS & COOPERATIVAS HOMOLOGADAS
  const todosTaxis = fornecedores.filter(f => f.tipo === 'taxi');
  let cooperativasAlocadas = [];

  if (poloId === 'ribeirao_preto') {
    cooperativasAlocadas = todosTaxis.filter(f => f.id === 'TAXI-006' || f.nome.includes('Ribeirão Preto'));
  } else if (poloId === 'campinas_resorts') {
    cooperativasAlocadas = todosTaxis.filter(f => f.id === 'TAXI-007' || f.nome.includes('Campinas'));
  } else if (poloId === 'sao_jose_rio_preto_aracatuba') {
    cooperativasAlocadas = todosTaxis.filter(f => f.id === 'TAXI-008' || f.nome.includes('Rio Preto'));
  } else if (poloId === 'santos_litoral') {
    cooperativasAlocadas = todosTaxis.filter(f => f.id === 'TAXI-009' || f.nome.includes('Santos'));
  } else if (poloId === 'piracicaba_agtech') {
    cooperativasAlocadas = todosTaxis.filter(f => f.id === 'TAXI-007' || f.id === 'TAXI-006');
  } else {
    // São Paulo Capital
    cooperativasAlocadas = todosTaxis.filter(f => f.id === 'TAX-003' || f.id === 'TAX-001' || f.id === 'TAX-002' || f.id === 'TAXI-004');
  }

  if (!cooperativasAlocadas.length) {
    cooperativasAlocadas = [todosTaxis[0]];
  }

  // Cálculo da Volumetria de Táxis
  const passageirosViaAereo = Math.round(totalPessoas * 0.80);
  const corridasAeroportoChegada = Math.ceil(passageirosViaAereo / 2); // 2 executivos por táxi
  const corridasAeroportoRetorno = corridasAeroportoChegada;
  const corridasExecutivasDiarias = Math.round(totalPessoas * 0.15 * diasDuracao); // Corridas extras para jantares/reuniões
  const totalCorridasTaxis = corridasAeroportoChegada + corridasAeroportoRetorno + corridasExecutivasDiarias;

  // Frota Simultânea Necessária nos Picos
  const taxisSimultaneosNecessarios = Math.min(350, Math.ceil(totalPessoas / 4));

  // Distribuir demanda entre as cooperativas da região (ou aplicar override manual)
  const todasCooperativasDisponiveis = cooperativasAlocadas.map((coop, idx) => {
    const proporcao = cooperativasAlocadas.length === 1 ? 1.0 : (idx === 0 ? 0.70 : 0.30);
    
    let veiculosMobilizados = 0;
    if (customOverrides && customOverrides.taxis && customOverrides.taxis[coop.id] !== undefined) {
      veiculosMobilizados = parseInt(customOverrides.taxis[coop.id]) || 0;
    } else {
      veiculosMobilizados = Math.round(taxisSimultaneosNecessarios * proporcao);
    }

    const corridasAlocadas = Math.round(totalCorridasTaxis * (veiculosMobilizados / Math.max(1, taxisSimultaneosNecessarios)));
    const tarifaMedia = coop.tarifa_media_aeroporto_gru || coop.tarifa_media_cgh_hotel || 95;
    const custoCooperativa = corridasAlocadas * tarifaMedia;

    return {
      cooperativaId: coop.id,
      nome: coop.nome,
      frotaTotalDisponivel: coop.frota_disponivel || coop.frota_total_veiculos || 250,
      veiculosMobilizados,
      corridasAlocadas,
      slaMedioMinutos: coop.sla_medio_minutos || 5,
      tarifaMediaEstimada: tarifaMedia,
      custoTotalReais: custoCooperativa,
      comissaoAgenciaReais: custoCooperativa * 0.085, // 8.5% take rate de mobilidade
      corredorOnibusLiberado: coop.corredor_onibus_autorizado !== false,
      modalidadeVoucher: 'Voucher digital corporativo via QR Code (100% faturado quinzenalmente)',
      posicionamentoBolsao: coop.bolsao_aeroporto_gru || coop.posicionamento_taxi_recomendado || 'Bolsão de espera prioritário nos terminais e hotéis'
    };
  });

  const distribuicaoCooperativas = todasCooperativasDisponiveis.filter(c => c.veiculosMobilizados > 0);
  const custoTotalTaxis = distribuicaoCooperativas.reduce((acc, c) => acc + c.custoTotalReais, 0);
  const comissaoTotalTaxis = distribuicaoCooperativas.reduce((acc, c) => acc + c.comissaoAgenciaReais, 0);

  // 4. ORQUESTRAÇÃO DE FRETAMENTO: VANS & ÔNIBUS EXECUTIVOS (Hotel <-> Pavilhão)
  const todasVans = fornecedores.filter(f => f.tipo === 'transfer_van');
  let empresaVan = null;
  if (poloId === 'ribeirao_preto') {
    empresaVan = todasVans.find(f => f.id === 'VAN-007' || f.nome.includes('Ribeirão'));
  } else if (poloId === 'santos_litoral') {
    empresaVan = todasVans.find(f => f.id === 'VAN-008' || f.nome.includes('Litoral'));
  } else if (poloId === 'campinas_resorts') {
    empresaVan = todasVans.find(f => f.id === 'VAN-004' || f.nome.includes('Campinas'));
  } else {
    empresaVan = todasVans.find(f => f.id === 'VAN-001' || f.id === 'VAN-003');
  }

  if (!empresaVan) empresaVan = todasVans[0];

  const totalOnibus46Lugares = (customOverrides && customOverrides.veiculos && customOverrides.veiculos.onibus !== undefined)
    ? parseInt(customOverrides.veiculos.onibus)
    : Math.ceil((totalPessoas * 0.60) / 46);

  const totalVans15Lugares = (customOverrides && customOverrides.veiculos && customOverrides.veiculos.vans !== undefined)
    ? parseInt(customOverrides.veiculos.vans)
    : Math.ceil((totalPessoas * 0.40) / 15);

  const diariaVanValor = empresaVan.diaria_padrao_van || empresaVan.diaria_van_10h || 750;
  const diariaOnibusValor = empresaVan.diaria_onibus_10h || (diariaVanValor * 2.2);

  const custoTotalFretamento = (totalVans15Lugares * diariaVanValor * diasDuracao) + (totalOnibus46Lugares * diariaOnibusValor * diasDuracao);
  const comissaoTotalFretamento = custoTotalFretamento * 0.11; // 11% take rate

  // 5. ORQUESTRAÇÃO AÉREA (TMC COPASTUR)
  const tmc = fornecedores.find(f => f.tipo === 'tmc_parceira') || {
    nome: 'Copastur MICE & Corporate',
    fee_emissao_aereo_nac: 32.0,
    comissao_repasse_parceria: 45.0
  };

  const totalPassagensAereas = (customOverrides && customOverrides.aereo && customOverrides.aereo.passagens !== undefined)
    ? parseInt(customOverrides.aereo.passagens)
    : passageirosViaAereo;

  const feeTotalAereo = totalPassagensAereas * tmc.fee_emissao_aereo_nac;
  const comissaoTotalAereo = feeTotalAereo * ((tmc.comissao_repasse_parceria || 45) / 100);

  // 6. GASTRONOMIA MICE (Jantares Corporativos)
  const todosRestaurantes = fornecedores.filter(f => f.tipo === 'restaurante_espaco');
  let restaurante = null;
  if (customOverrides && customOverrides.gastronomia && customOverrides.gastronomia.restauranteId) {
    restaurante = todosRestaurantes.find(f => f.id === customOverrides.gastronomia.restauranteId);
  }
  if (!restaurante) {
    if (poloId === 'ribeirao_preto') {
      restaurante = todosRestaurantes.find(f => f.id === 'REST-005' || f.nome.includes('Taiwan'));
    } else if (poloId === 'campinas_resorts') {
      restaurante = todosRestaurantes.find(f => f.id === 'REST-007' || f.nome.includes('Vila Paraíso'));
    } else if (poloId === 'santos_litoral') {
      restaurante = todosRestaurantes.find(f => f.id === 'REST-009' || f.nome.includes('Mar del Plata'));
    } else {
      restaurante = todosRestaurantes.find(f => f.id === 'REST-001' || f.id === 'REST-003');
    }
  }

  if (!restaurante) restaurante = todosRestaurantes[0] || {
    nome: 'Espaço Gastronômico & Convenções Homologado',
    capacidade_max_pessoas: 800,
    valor_por_pessoa_fechado: 240
  };

  const totalJantares = (customOverrides && customOverrides.gastronomia && customOverrides.gastronomia.jantares !== undefined)
    ? parseInt(customOverrides.gastronomia.jantares)
    : Math.max(1, Math.round(diasDuracao * 0.5));

  const custoGastronomiaTotal = totalPessoas * totalJantares * (restaurante.valor_por_pessoa_fechado || 220);
  const comissaoGastronomiaTotal = custoGastronomiaTotal * 0.10;

  // 7. ESG & GOVERNANÇA
  const co2TotalKg = Math.round(totalPessoas * diasDuracao * 12.8);
  const arvoresSalvas = Math.max(1, Math.round(co2TotalKg / 140));

  // 8. RESUMO FINANCEIRO GLOBAL
  const custoTotalCliente = custoTotalHospedagem + custoTotalTaxis + custoTotalFretamento + feeTotalAereo + custoGastronomiaTotal;
  const savingTotalConsolidado = savingTotalHospedagem + (custoTotalTaxis * 0.15);
  const receitaComissaoAgenciaTotal = comissaoTotalHospedagem + comissaoTotalTaxis + comissaoTotalFretamento + comissaoTotalAereo + comissaoGastronomiaTotal;

  return {
    evento: {
      id: evento ? evento.id : 'SIM-CUSTOM',
      nome: nomeEvento,
      regiao: nomeRegiao,
      poloId,
      organizador,
      diasDuracao,
      totalPessoas
    },
    hubLogistico: {
      aeroportoPrincipal: aeroportoHub.nome,
      distanciaMediaAoPavilhaoKm: aeroportoHub.distanciaKm,
      gestaoAerea: {
        tmcParceira: tmc.nome,
        passagensEstimadas: totalPassagensAereas,
        feeUnitario: tmc.fee_emissao_aereo_nac,
        feeTotal: feeTotalAereo,
        comissaoAgencia: comissaoTotalAereo,
        beneficios: 'Emissão direta IATA com tarifa de grupo, relatórios de Best Fare, franquia de bagagem inclusa e plantão 24h.'
      }
    },
    orquestracaoHospedagem: {
      totalPessoas,
      totalQuartosAlocados,
      totalRoomNights,
      hoteisUtilizadosQtd: distribuicaoHoteis.length,
      custoTotalHospedagem,
      savingTotalHospedagem,
      comissaoTotalHospedagem,
      clausulaProtecao: 'Room Block Shield com trava anti-attrition (0% multa até D-60) e café da manhã incluso.',
      gradeHoteis: distribuicaoHoteis,
      todosHoteisDisponiveis: todosHoteisDisponiveis
    },
    orquestracaoTaxis: {
      totalPessoas,
      taxisSimultaneosPico: taxisSimultaneosNecessarios,
      totalCorridasEstimadas: totalCorridasTaxis,
      custoTotalTaxis,
      comissaoTotalTaxis,
      cooperativasUtilizadasQtd: distribuicaoCooperativas.length,
      beneficiosChave: 'Acesso 100% liberado a corredores exclusivos de ônibus, tempo médio de chegada de 4 a 6 minutos e faturamento unificado pós-pago via Voucher Digital QR Code.',
      gradeCooperativas: distribuicaoCooperativas,
      todasCooperativasDisponiveis: todasCooperativasDisponiveis
    },
    orquestracaoShuttles: {
      empresaResponsavel: empresaVan.nome,
      veiculosAlocados: {
        onibusExecutivos46Lugares: totalOnibus46Lugares,
        vansExecutivas15Lugares: totalVans15Lugares,
        totalVeiculos: totalOnibus46Lugares + totalVans15Lugares
      },
      escalaHorarios: 'Giros circulares contínuos nos horários de pico (07h30-09h30 na abertura e 17h30-19h30 no encerramento).',
      custoTotalFretamento,
      comissaoTotalFretamento,
      governanca: 'Telemetria GPS em tempo real, motoristas uniformizados/bilíngues e coordenadores de pista nos hotéis e pavilhão.',
      todasEmpresasDisponiveis: todasVans
    },
    orquestracaoGastronomia: {
      restaurantePrincipal: restaurante.nome,
      restauranteId: restaurante.id,
      totalJantaresPlanejados: totalJantares,
      capacidadeSalas: restaurante.capacidade_max_pessoas || 800,
      custoTotalGastronomia: custoGastronomiaTotal,
      comissaoTotalGastronomia: comissaoGastronomiaTotal,
      detalhes: 'Espaço corporativo privativo para jantar de gala e networking com infraestrutura completa de som e projeção.',
      todosRestaurantesDisponiveis: todosRestaurantes
    },
    esgSustentabilidade: {
      co2EvitadoKg: co2TotalKg,
      arvoresPreservadas: arvoresSalvas,
      classificacao: 'Classe A (Padrão GHG Protocol Brasil)'
    },
    consolidadoFinanceiro: {
      investimentoTotalCliente: custoTotalCliente,
      investimentoPorParticipante: Math.round(custoTotalCliente / totalPessoas),
      savingTotalAuditavel: savingTotalConsolidado,
      savingPercentual: +((savingTotalConsolidado / (custoTotalCliente + savingTotalConsolidado)) * 100).toFixed(1),
      receitaComissaoAgenciaTotal: receitaComissaoAgenciaTotal,
      faturamentoModalidade: 'Fatura Única Quinzenal consolidada (Hotelaria + Táxis + Fretamento + Aéreo + Gastronomia)'
    }
  };
}

module.exports = {
  orquestrarJornadaCompleta,
  NOMES_POLOS,
  HUBS_AEROPORTOS
};
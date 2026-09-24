/**
 * MOTOR DE INTELIGÊNCIA E ORQUESTRAÇÃO MICE (São Paulo)
 * Calcula:
 * 1. Event Opportunity Score (EOS)
 * 2. Supplier Fit Score por Modalidade (Hotel, Táxi, Transfer/Van, TMC/Aéreo)
 * 3. Gerador de Pacotes CPQ (Econômico, Executivo, Premium) com Explicabilidade
 */

const fs = require('fs');
const path = require('path');

// Carregar datasets
const fornecedores = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/fornecedores_sp.json'), 'utf-8')
);
const eventos = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/eventos_radar.json'), 'utf-8')
);

/**
 * 1. CALCULA O EVENT OPPORTUNITY SCORE (EOS)
 */
function calculateEventOpportunityScore(event) {
  let score = 0;
  const breakdown = {};

  // Público estimado (max 15 pts)
  if (event.publico_total_estimado >= 3000) breakdown.publico = 15;
  else if (event.publico_total_estimado >= 1500) breakdown.publico = 12;
  else if (event.publico_total_estimado >= 500) breakdown.publico = 8;
  else breakdown.publico = 4;
  score += breakdown.publico;

  // Participantes de fora da cidade (max 15 pts)
  const pctFora = event.percentual_fora_da_cidade || 0;
  if (pctFora >= 0.50) breakdown.foraCidade = 15;
  else if (pctFora >= 0.35) breakdown.foraCidade = 12;
  else if (pctFora >= 0.20) breakdown.foraCidade = 8;
  else breakdown.foraCidade = 4;
  score += breakdown.foraCidade;

  // Duração (max 10 pts)
  if (event.dias_duracao >= 3) breakdown.duracao = 10;
  else if (event.dias_duracao === 2) breakdown.duracao = 7;
  else breakdown.duracao = 4;
  score += breakdown.duracao;

  // Antecedência (max 10 pts)
  if (event.dias_antecedencia >= 60) breakdown.antecedencia = 10;
  else if (event.dias_antecedencia >= 30) breakdown.antecedencia = 7;
  else breakdown.antecedencia = 4;
  score += breakdown.antecedencia;

  // Organizador Identificado (max 10 pts)
  breakdown.organizador = event.cnpj_organizador ? 10 : 5;
  score += breakdown.organizador;

  // Decisores Mapeados (max 10 pts)
  const numDecisores = (event.decisores_identificados || []).length;
  if (numDecisores >= 2) breakdown.decisores = 10;
  else if (numDecisores === 1) breakdown.decisores = 7;
  else breakdown.decisores = 0;
  score += breakdown.decisores;

  // Poder Econômico do Segmento (max 10 pts)
  if (event.poder_economico_segmento === 'ALTO') breakdown.poderEconomico = 10;
  else if (event.poder_economico_segmento === 'MEDIO') breakdown.poderEconomico = 7;
  else breakdown.poderEconomico = 4;
  score += breakdown.poderEconomico;

  // Demanda Hoteleira (max 8 pts)
  if (event.demanda_estimada.room_nights_estimados >= 2000) breakdown.demandaHospedagem = 8;
  else if (event.demanda_estimada.room_nights_estimados >= 800) breakdown.demandaHospedagem = 6;
  else breakdown.demandaHospedagem = 3;
  score += breakdown.demandaHospedagem;

  // Demanda Mobilidade (max 7 pts)
  if (event.demanda_estimada.transfers_aeroporto_necessarios >= 800) breakdown.demandaMobilidade = 7;
  else if (event.demanda_estimada.transfers_aeroporto_necessarios >= 300) breakdown.demandaMobilidade = 5;
  else breakdown.demandaMobilidade = 2;
  score += breakdown.demandaMobilidade;

  // Demanda Aérea (max 5 pts)
  if (event.demanda_estimada.aereos_estimados >= 800) breakdown.demandaAerea = 5;
  else if (event.demanda_estimada.aereos_estimados >= 300) breakdown.demandaAerea = 3;
  else breakdown.demandaAerea = 1;
  score += breakdown.demandaAerea;

  let tier = '';
  let acao = '';
  if (score >= 90) {
    tier = 'OURO 🏆';
    acao = 'Atacar imediatamente com equipe comercial e proposta pré-configurada.';
  } else if (score >= 70) {
    tier = 'PRATA 🥈';
    acao = 'Enriquecer contatos dos decisores de compras/MICE e iniciar abordagem.';
  } else if (score >= 50) {
    tier = 'BRONZE 🥉';
    acao = 'Manter em monitoramento passivo no pipeline.';
  } else {
    tier = 'RADAR 📡';
    acao = 'Lead inicial em maturação.';
  }

  return {
    scoreTotal: score,
    tier,
    acao,
    breakdown
  };
}

/**
 * 2. MOTORES DE FIT SCORE POR MODALIDADE DE FORNECEDOR
 */

// A) Fit Score para Hotéis
function calculateHotelFitScore(hotel, event) {
  const distKm = (hotel.distancias_km && hotel.distancias_km[event.local_evento]) || 15.0;
  
  // Distância (Peso 35%)
  let scoreDist = 0;
  if (distKm <= 3.0) scoreDist = 100;
  else if (distKm <= 6.0) scoreDist = 85;
  else if (distKm <= 12.0) scoreDist = 60;
  else if (distKm <= 18.0) scoreDist = 30;
  else scoreDist = 10;

  // Preço e Economia vs Padrão (Peso 25%)
  const savingPct = ((hotel.diaria_media_padrao - hotel.diaria_negociada_mice) / hotel.diaria_media_padrao) * 100;
  const scorePreco = Math.min(100, Math.max(50, 60 + savingPct * 2.5));

  // Capacidade de Room Block vs Demanda (Peso 20%)
  const scoreCapacidade = Math.min(100, (hotel.max_room_block / 150) * 100);

  // SLA, Cancelamento e Facilidades (Peso 10%)
  let scoreFacilidades = 60;
  if (hotel.cafe_incluso) scoreFacilidades += 15;
  if (hotel.possui_salas_apoio) scoreFacilidades += 15;
  if (hotel.sla_resposta_horas <= 3) scoreFacilidades += 10;
  scoreFacilidades = Math.min(100, scoreFacilidades);

  // Qualidade e Avaliação (Peso 10%)
  const scoreQualidade = (hotel.avaliacao_qualidade / 10) * 100;

  const totalFit = Math.round(
    (scoreDist * 0.35) +
    (scorePreco * 0.25) +
    (scoreCapacidade * 0.20) +
    (scoreFacilidades * 0.10) +
    (scoreQualidade * 0.10)
  );

  return {
    fornecedorId: hotel.id,
    nome: hotel.nome,
    tipo: 'hotel',
    categoria: hotel.categoria,
    fitScore: totalFit,
    distanciaKm: distKm,
    diariaNegociada: hotel.diaria_negociada_mice,
    comissaoPct: hotel.comissao_percentual,
    justificativa: `${distKm} km do evento, diária negociada R$ ${hotel.diaria_negociada_mice} (${savingPct.toFixed(0)}% saving), room block de até ${hotel.max_room_block} aptos e nota ${hotel.avaliacao_qualidade}/10.`
  };
}

// B) Fit Score para Táxis / Cooperativas
function calculateTaxiFitScore(taxi, event) {
  const slaMin = taxi.sla_tempo_chegada_min || taxi.sla_medio_minutos || 8;
  const capPico = taxi.capacidade_pico_simultanea || Math.round((taxi.frota_disponivel || 100) * 0.4);
  const temFaturamento = taxi.faturamento_pos_pago_voucher !== false && taxi.voucher_digital !== false;

  // Cobertura CGH / GRU (Peso 30%)
  let scoreCobertura = 50;
  if (taxi.cobertura_cgh && taxi.cobertura_gru) scoreCobertura = 100;
  else if (taxi.cobertura_gru || taxi.tarifa_media_gru_hotel) scoreCobertura = 85;
  else if (taxi.cobertura_cgh || taxi.tarifa_media_cgh_hotel) scoreCobertura = 80;

  // Faturamento e Voucher Corporativo (Peso 25%)
  const scoreFaturamento = temFaturamento ? 100 : 40;

  // Capacidade de Pico Simultânea (Peso 20%)
  const scoreCapacidade = Math.min(100, (capPico / 200) * 100);

  // SLA de Chegada (Peso 15%)
  let scoreSLA = 60;
  if (slaMin <= 7) scoreSLA = 100;
  else if (slaMin <= 12) scoreSLA = 85;
  else scoreSLA = 70;

  // Qualidade e Atendimento 24h (Peso 10%)
  const scoreQualidade = ((taxi.avaliacao_qualidade || 9.0) / 10) * 100;

  const totalFit = Math.round(
    (scoreCobertura * 0.30) +
    (scoreFaturamento * 0.25) +
    (scoreCapacidade * 0.20) +
    (scoreSLA * 0.15) +
    (scoreQualidade * 0.10)
  );

  return {
    fornecedorId: taxi.id,
    nome: taxi.nome,
    tipo: 'taxi',
    fitScore: totalFit,
    tarifaGru: taxi.tarifa_media_gru_hotel,
    tarifaCgh: taxi.tarifa_media_cgh_hotel,
    comissaoPct: taxi.comissao_percentual,
    justificativa: `Frota de ${taxi.frota_disponivel} veículos, suporte 24h com faturamento pós-pago via voucher, SLA de chegada em ${slaMin} min e comissão de ${taxi.comissao_percentual}%.`
  };
}

// C) Fit Score para Transfers Executivos / Vans
function calculateVanFitScore(van, event) {
  // Frota e Capacidade (Peso 30%)
  const totalFrota = (van.frota_vans_15lugares || 0) + (van.frota_microonibus_28lugares || 0) + (van.frota_onibus_46lugares || 0);
  const scoreFrota = Math.min(100, (totalFrota / 40) * 100);

  // Rastreamento GPS e Plantão (Peso 25%)
  let scoreTecnologia = 50;
  if (van.rastreamento_gps_tempo_real) scoreTecnologia += 25;
  if (van.atendimento_24h || van.seguro_passageiro_incluso) scoreTecnologia += 25;

  // Custo da Diária / Transfer (Peso 20%)
  const scorePreco = (van.diaria_van_10h || 750) <= 800 ? 95 : 75;

  // Motoristas Bilíngues / Perfil Executivo (Peso 15%)
  const scoreBilingue = van.motoristas_bilingues ? 100 : 65;

  // Qualidade e Histórico de Eventos (Peso 10%)
  const scoreQualidade = ((van.avaliacao_qualidade || 9.0) / 10) * 100;
  const histEventos = van.historico_eventos_grandes || van.historico_grandes_eventos || 45;

  const totalFit = Math.round(
    (scoreFrota * 0.30) +
    (scoreTecnologia * 0.25) +
    (scorePreco * 0.20) +
    (scoreBilingue * 0.15) +
    (scoreQualidade * 0.10)
  );

  return {
    fornecedorId: van.id,
    nome: van.nome,
    tipo: 'transfer_van',
    fitScore: totalFit,
    diariaVan: van.diaria_van_10h,
    diariaOnibus: van.diaria_onibus_10h,
    comissaoPct: van.comissao_percentual,
    justificativa: `Frota completa (${totalFrota} unidades), rastreamento GPS em tempo real, ${van.motoristas_bilingues ? 'motoristas bilíngues inclusos' : 'motoristas executivos'}, histórico de ${histEventos} grandes eventos.`
  };
}

// D) Fit Score para TMC / Emissões Aéreas Parceiras
function calculateTMCFitScore(tmc, event) {
  // Código IATA e Consolidadoras (Peso 35%)
  const scoreIATA = (tmc.codigo_iata_ativo && tmc.acordo_bsp_consolidadoras.length >= 2) ? 100 : 50;

  // Fee de Emissão Competitivo (Peso 25%)
  const scoreFee = tmc.fee_emissao_aereo_nac <= 40 ? 95 : 70;

  // Plantão 24/7 e Gestor Dedicado (Peso 20%)
  let scoreSuporte = 50;
  if (tmc.plantao_emergencial_24h) scoreSuporte += 25;
  if (tmc.gestor_contas_dedicado) scoreSuporte += 25;

  // Faturamento e OBT (Peso 10%)
  let scoreFaturamento = 60;
  if (tmc.politica_faturamento_dias >= 21) scoreFaturamento += 20;
  if (tmc.sistema_obt_integrado) scoreFaturamento += 20;
  scoreFaturamento = Math.min(100, scoreFaturamento);

  // Qualidade Geral (Peso 10%)
  const scoreQualidade = (tmc.avaliacao_qualidade / 10) * 100;

  const totalFit = Math.round(
    (scoreIATA * 0.35) +
    (scoreFee * 0.25) +
    (scoreSuporte * 0.20) +
    (scoreFaturamento * 0.10) +
    (scoreQualidade * 0.10)
  );

  return {
    fornecedorId: tmc.id,
    nome: tmc.nome,
    tipo: 'tmc_parceira',
    fitScore: totalFit,
    feeEmissaoNac: tmc.fee_emissao_aereo_nac,
    comissaoRepasse: tmc.comissao_repasse_parceria,
    justificativa: `IATA ativo com conexão BSP direta (${tmc.acordo_bsp_consolidadoras.join(', ')}), fee nacional de R$ ${tmc.fee_emissao_aereo_nac}, suporte 24h e repasse de ${tmc.comissao_repasse_parceria}% dos fees.`
  };
}

/**
 * 3. GERADOR DE PACOTES CPQ & DIMENSIONAMENTO DO CICLO OPERACIONAL 360°
 */
function generateCPQPackages(event, hotelScores, taxiScores, vanScores, tmcScores, amostraParticipantes = 100) {
  const sortedHotels = [...hotelScores].sort((a, b) => b.fitScore - a.fitScore);
  const sortedTaxis = [...taxiScores].sort((a, b) => b.fitScore - a.fitScore);
  const sortedVans = [...vanScores].sort((a, b) => b.fitScore - a.fitScore);
  const bestTMC = tmcScores[0] || { nome: 'Copastur MICE & Corporate', feeEmissaoNac: 32.0, comissaoRepasse: 45.0 };

  const participantes = amostraParticipantes;
  const noites = event.dias_duracao || 3;
  const pctFora = event.percentual_fora_da_cidade || 0.80;

  // Cálculos de dimensionamento da delegação
  const passagensEstimadas = Math.round(participantes * pctFora);
  const totalTaxisAeroporto = Math.ceil(passagensEstimadas / 2); // 2 executivos por corrida compartilhada
  const totalRoomNights = participantes * noites;
  const totalVansNecessarias = Math.max(1, Math.ceil(participantes / 15));
  const totalOnibusNecessarios = Math.max(1, Math.ceil(participantes / 45));
  const jantaresMICE = Math.max(1, Math.round(noites * 0.5));

  // Determinar aeroporto hub pelo polo
  const aeroportoHub = (event.local_evento === 'campinas_resorts') ? 'Aeroporto de Viracopos (VCP)'
    : (event.local_evento === 'ribeirao_preto') ? 'Aeroporto Estadual Leite Lopes (RAO)'
    : (event.local_evento === 'sao_jose_rio_preto_aracatuba') ? 'Aeroporto Prof. Eribelto Manoel Reino (SJP)'
    : 'Aeroportos de Congonhas (CGH) & Guarulhos (GRU)';

  // --- PACOTE 1: ECONÔMICO INTELIGENTE ---
  const hotelEco = sortedHotels.find(h => h.categoria === '3_estrelas') || sortedHotels[sortedHotels.length - 1];
  const vanEco = sortedVans[sortedVans.length - 1] || sortedVans[0];
  const taxiEco = sortedTaxis[0];

  const diariaBalcaoEco = (hotelEco.diariaNegociada || 260) * 1.22;
  const custoHotelEco = participantes * noites * hotelEco.diariaNegociada;
  const savingHotelEco = participantes * noites * (diariaBalcaoEco - hotelEco.diariaNegociada);

  const custoVansEco = (noites * 2 * (vanEco.diariaVan || 700) * Math.ceil(totalVansNecessarias * 0.7));
  const custoTaxisEco = (totalTaxisAeroporto * (taxiEco.tarifaCgh || 95));
  const custoMobilidadeEco = custoVansEco + custoTaxisEco;
  const custoAereoFeeEco = passagensEstimadas * bestTMC.feeEmissaoNac;
  const totalCustoEco = custoHotelEco + custoMobilidadeEco + custoAereoFeeEco;
  const receitaComissaoEco = (custoHotelEco * (hotelEco.comissaoPct / 100)) + (custoTaxisEco * 0.085) + (custoVansEco * 0.11) + (custoAereoFeeEco * 0.45);

  // --- PACOTE 2: EXECUTIVO CORPORATIVO (RECOMENDADO) ---
  const hotelExec = sortedHotels.find(h => h.categoria === '4_estrelas') || sortedHotels[0];
  const vanExec = sortedVans[0];
  const taxiExec = sortedTaxis[0];

  const diariaBalcaoExec = (hotelExec.diariaNegociada || 420) * 1.25;
  const custoHotelExec = participantes * noites * hotelExec.diariaNegociada;
  const savingHotelExec = participantes * noites * (diariaBalcaoExec - hotelExec.diariaNegociada);

  const custoVansExec = (noites * 3 * (vanExec.diariaVan || 750) * totalVansNecessarias);
  const custoTaxisExec = (totalTaxisAeroporto * 1.5 * (taxiExec.tarifaGru || 140));
  const custoMobilidadeExec = custoVansExec + custoTaxisExec;
  const custoAereoFeeExec = passagensEstimadas * bestTMC.feeEmissaoNac;
  const custoJantaresExec = participantes * jantaresMICE * 220.0;
  const totalCustoExec = custoHotelExec + custoMobilidadeExec + custoAereoFeeExec + custoJantaresExec;
  const receitaComissaoExec = (custoHotelExec * (hotelExec.comissaoPct / 100)) + (custoTaxisExec * 0.085) + (custoVansExec * 0.11) + (custoAereoFeeExec * 0.45) + (custoJantaresExec * 0.10);

  // --- PACOTE 3: PREMIUM SPEAKER & BOARD (VIP C-LEVEL) ---
  const hotelPrem = sortedHotels.find(h => h.categoria && h.categoria.includes('5_estrelas')) || sortedHotels[0];
  const vanPrem = sortedVans[0];
  const taxiPrem = sortedTaxis[0];

  const diariaBalcaoPrem = (hotelPrem.diariaNegociada || 750) * 1.30;
  const custoHotelPrem = participantes * noites * hotelPrem.diariaNegociada;
  const savingHotelPrem = participantes * noites * (diariaBalcaoPrem - hotelPrem.diariaNegociada);

  const custoVansPrem = (noites * 4 * (vanPrem.diariaVan || 800) * totalVansNecessarias);
  const custoTaxisPrem = (totalTaxisAeroporto * 2.0 * (taxiPrem.tarifaGru || 160));
  const custoMobilidadePrem = custoVansPrem + custoTaxisPrem;
  const custoAereoFeePrem = passagensEstimadas * (bestTMC.feeEmissaoNac + 25.0);
  const custoJantaresPrem = participantes * jantaresMICE * 290.0;
  const totalCustoPrem = custoHotelPrem + custoMobilidadePrem + custoAereoFeePrem + custoJantaresPrem;
  const receitaComissaoPrem = (custoHotelPrem * (hotelPrem.comissaoPct / 100)) + (custoTaxisPrem * 0.085) + (custoVansPrem * 0.11) + (custoAereoFeePrem * 0.45) + (custoJantaresPrem * 0.10);

  return [
    {
      nome: 'Pacote Econômico Inteligente',
      categoria: 'ECONÔMICO',
      valorEstimado: totalCustoEco,
      receitaEstimadaNossa: receitaComissaoEco,
      savingEstimadoCliente: savingHotelEco,
      composicao: {
        hotel: `${hotelEco.nome} (${hotelEco.distanciaKm} km) - R$ ${hotelEco.diariaNegociada}/diária`,
        mobilidade: `${totalVansNecessarias} Vans em horários fixos (${vanEco.nome}) + ${totalTaxisAeroporto} Táxis via voucher (${taxiEco.nome})`,
        aereo: `${passagensEstimadas} emissões aéreas com suporte 24h via ${bestTMC.nome}`
      },
      cicloOperacional360: {
        participantes,
        diasDuracao: noites,
        aereo: {
          passagensEstimadas,
          aeroportoHub,
          tmcParceira: bestTMC.nome,
          feeUnitario: bestTMC.feeEmissaoNac,
          detalhe: `Gestão centralizada de ${passagensEstimadas} bilhetes aéreos, relatórios de Best Fare corporativo e franquia de bagagem inclusa.`
        },
        receptivoTaxi: {
          cooperativaNome: taxiEco.nome,
          taxisNecessarios: totalTaxisAeroporto,
          corridasTotais: totalTaxisAeroporto,
          slaChegadaMin: taxiEco.sla_medio_minutos || 6,
          modalidadeFaturamento: 'Voucher digital corporativo com faturamento pós-pago quinzenal e uso liberado de faixas exclusivas.'
        },
        hospedagem: {
          hotelNome: hotelEco.nome,
          categoria: hotelEco.categoria,
          distanciaKm: hotelEco.distanciaKm,
          quartosBloqueados: participantes,
          totalRoomNights,
          diariaNegociada: hotelEco.diariaNegociada,
          savingTotalHospedagem: savingHotelEco,
          clausulaProtecao: 'Room Block Shield com cancelamento sem multa escalonado até D-60.'
        },
        transfersHotelEvento: {
          frotaEmpresa: vanEco.nome,
          veiculosDimensionados: `${totalVansNecessarias} Vans Executivas`,
          girosPico: 'Shuttles em horários fixos de abertura e encerramento do pavilhão.',
          telemetriaGPS: 'Rastreamento em tempo real.'
        },
        esg: {
          co2EvitadoKg: Math.round(participantes * noites * 8.5),
          arvoresPreservadas: Math.max(1, Math.round((participantes * noites * 8.5) / 140))
        }
      },
      destaque: 'Melhor custo-benefício financeiro garantindo segurança, controle e faturamento unificado.'
    },
    {
      nome: 'Pacote Executivo Corporativo (Recomendado)',
      categoria: 'EXECUTIVO',
      recomendado: true,
      valorEstimado: totalCustoExec,
      receitaEstimadaNossa: receitaComissaoExec,
      savingEstimadoCliente: savingHotelExec,
      composicao: {
        hotel: `${hotelExec.nome} (${hotelExec.distanciaKm} km) - R$ ${hotelExec.diariaNegociada}/diária com café e salas`,
        mobilidade: `Shuttle dedicado contínuo com ${totalVansNecessarias} vans/ônibus (${vanExec.nome}) + ${totalTaxisAeroporto} Táxis (${taxiExec.nome})`,
        aereo: `Emissão e conciliação direta IATA com Best Fare via ${bestTMC.nome}`,
        gastronomia: `${jantaresMICE} Jantares executivos em restaurante parceiro com espaço privativo`
      },
      cicloOperacional360: {
        participantes,
        diasDuracao: noites,
        aereo: {
          passagensEstimadas,
          aeroportoHub,
          tmcParceira: bestTMC.nome,
          feeUnitario: bestTMC.feeEmissaoNac,
          detalhe: `Emissão de ${passagensEstimadas} aéreos com SLA prioritário de 2h, marcação de assentos conjunta da delegação e suporte a remarcações 24/7.`
        },
        receptivoTaxi: {
          cooperativaNome: taxiExec.nome,
          taxisNecessarios: totalTaxisAeroporto,
          corridasTotais: Math.round(totalTaxisAeroporto * 1.5),
          slaChegadaMin: taxiExec.sla_medio_minutos || 5,
          modalidadeFaturamento: 'Voucher digital corporativo Chame Táxi com leitor QR code, faturamento quinzenal e trânsito livre em corredores de ônibus.'
        },
        hospedagem: {
          hotelNome: hotelExec.nome,
          categoria: hotelExec.categoria,
          distanciaKm: hotelExec.distanciaKm,
          quartosBloqueados: participantes,
          totalRoomNights,
          diariaNegociada: hotelExec.diariaNegociada,
          savingTotalHospedagem: savingHotelExec,
          clausulaProtecao: 'Room Block Shield com trava anti-attrition, café incluso e salas de apoio privativas.'
        },
        transfersHotelEvento: {
          frotaEmpresa: vanExec.nome,
          veiculosDimensionados: `${totalVansNecessarias} Vans Executivas / ${totalOnibusNecessarios} Ônibus`,
          girosPico: 'Shuttle circular contínuo das 07h30 às 10h00 e das 17h00 às 20h00.',
          telemetriaGPS: 'Telemetria GPS em tempo real e motoristas executivos uniformizados.'
        },
        gastronomia: {
          jantaresInclusos: jantaresMICE,
          detalhe: `${jantaresMICE} jantares executivos para ${participantes} pessoas com buffet completo, bebidas e sala privativa com projetor/som.`
        },
        esg: {
          co2EvitadoKg: Math.round(participantes * noites * 12.8),
          arvoresPreservadas: Math.max(1, Math.round((participantes * noites * 12.8) / 140))
        }
      },
      destaque: 'Equilíbrio perfeito entre proximidade ao evento, conforto dos participantes, gastronomia e governança operacional.'
    },
    {
      nome: 'Pacote Premium Speaker & Board',
      categoria: 'PREMIUM',
      valorEstimado: totalCustoPrem,
      receitaEstimadaNossa: receitaComissaoPrem,
      savingEstimadoCliente: savingHotelPrem,
      composicao: {
        hotel: `${hotelPrem.nome} (${hotelPrem.distanciaKm} km) - Hotel 5 Estrelas Luxo com atendimento VIP`,
        mobilidade: `Carros executivos sob demanda + ${totalVansNecessarias} Vans VIP com motoristas bilíngues (${vanPrem.nome})`,
        aereo: `Concierge aéreo exclusivo com check-in prioritário e remarcações instantâneas`,
        gastronomia: `${jantaresMICE} Jantares de gala exclusivos com menu degustação e sommelier`
      },
      cicloOperacional360: {
        participantes,
        diasDuracao: noites,
        aereo: {
          passagensEstimadas,
          aeroportoHub,
          tmcParceira: bestTMC.nome,
          feeUnitario: bestTMC.feeEmissaoNac + 25.0,
          detalhe: `Atendimento VIP Concierge dedicado a palestrantes internacionais, líderes médicos e executivos C-level com emissões flexíveis.`
        },
        receptivoTaxi: {
          cooperativaNome: taxiPrem.nome,
          taxisNecessarios: totalTaxisAeroporto,
          corridasTotais: totalTaxisAeroporto * 2,
          slaChegadaMin: 3,
          modalidadeFaturamento: 'Atendimento prioritário com carros executivos executivos/blindados sob demanda e receptivo personalizado nos aeroportos.'
        },
        hospedagem: {
          hotelNome: hotelPrem.nome,
          categoria: hotelPrem.categoria,
          distanciaKm: hotelPrem.distanciaKm,
          quartosBloqueados: participantes,
          totalRoomNights,
          diariaNegociada: hotelPrem.diariaNegociada,
          savingTotalHospedagem: savingHotelPrem,
          clausulaProtecao: 'Room Block Shield VIP, upgrade garantido para diretores e late check-out homologado.'
        },
        transfersHotelEvento: {
          frotaEmpresa: vanPrem.nome,
          veiculosDimensionados: `${totalVansNecessarias} Vans VIP com Wi-Fi e água premium`,
          girosPico: 'Motoristas bilíngues dedicados em escala exclusiva 24h.',
          telemetriaGPS: 'Link de rastreamento exclusivo e coordenação presencial no receptivo.'
        },
        gastronomia: {
          jantaresInclusos: jantaresMICE,
          detalhe: `${jantaresMICE} jantares de alto padrão com menu fechado, vinhos selecionados e salas nobres exclusivas.`
        },
        esg: {
          co2EvitadoKg: Math.round(participantes * noites * 15.5),
          arvoresPreservadas: Math.max(1, Math.round((participantes * noites * 15.5) / 140))
        }
      },
      destaque: 'Projetado para palestrantes internacionais, liderança C-level e comitivas de alta relevância estratégica.'
    }
  ];
}

/**
 * 4. PIPELINE COMPLETO DE ORQUESTRAÇÃO
 */
function processRadarPipeline(eventosCustom = null, fornecedoresCustom = null) {
  const eventosLista = eventosCustom || (fs.existsSync(path.join(__dirname, '../data/eventos_radar.json'))
    ? JSON.parse(fs.readFileSync(path.join(__dirname, '../data/eventos_radar.json'), 'utf-8'))
    : []);
  const fornecedoresLista = fornecedoresCustom || (fs.existsSync(path.join(__dirname, '../data/fornecedores_sp.json'))
    ? JSON.parse(fs.readFileSync(path.join(__dirname, '../data/fornecedores_sp.json'), 'utf-8'))
    : []);

  const resultados = eventosLista.map(evento => {
    const eos = calculateEventOpportunityScore(evento);
    
    const hotelScores = fornecedoresLista
      .filter(f => f.tipo === 'hotel')
      .map(h => calculateHotelFitScore(h, evento));

    const taxiScores = fornecedoresLista
      .filter(f => f.tipo === 'taxi')
      .map(t => calculateTaxiFitScore(t, evento));

    const vanScores = fornecedoresLista
      .filter(f => f.tipo === 'transfer_van')
      .map(v => calculateVanFitScore(v, evento));

    const tmcScores = fornecedoresLista
      .filter(f => f.tipo === 'tmc_parceira')
      .map(tmc => calculateTMCFitScore(tmc, evento));

    const pacotesCPQ = generateCPQPackages(evento, hotelScores, taxiScores, vanScores, tmcScores);

    return {
      evento: {
        id: evento.id,
        nome: evento.nome,
        segmento: evento.segmento,
        local: evento.local_evento,
        dataInicio: evento.data_inicio,
        dataFim: evento.data_fim,
        publicoTotal: evento.publico_total_estimado,
        diasDuracao: evento.dias_duracao,
        empresaOrganizadora: evento.empresa_organizadora,
        decisores: evento.decisores_identificados
      },
      scoreOportunidade: eos,
      rankingFornecedores: {
        hoteis: hotelScores.sort((a, b) => b.fitScore - a.fitScore),
        taxis: taxiScores.sort((a, b) => b.fitScore - a.fitScore),
        vans: vanScores.sort((a, b) => b.fitScore - a.fitScore),
        tmc: tmcScores.sort((a, b) => b.fitScore - a.fitScore)
      },
      pacotesRecomendados: pacotesCPQ
    };
  });

  return resultados;
}

// Executar e exibir saída detalhada somente se chamado diretamente
if (require.main === module) {
  const pipelineOutput = processRadarPipeline();

  pipelineOutput.forEach((item, idx) => {
    console.log(`[EVENTO #${idx + 1}] ${item.evento.nome}`);
    console.log(`📍 Local: ${item.evento.local.toUpperCase()} | Segmento: ${item.evento.segmento} | Público: ${item.evento.publicoTotal}`);
    console.log(`📊 Event Opportunity Score: ${item.scoreOportunidade.scoreTotal}/100 [Classificação: ${item.scoreOportunidade.tier}]`);
    console.log(`🎯 Ação Recomendada: ${item.scoreOportunidade.acao}`);
    console.log('\n--- RANKING DE FIT DE FORNECEDORES ---');
    
    console.log('🏨 HOTÉIS:');
    item.rankingFornecedores.hoteis.forEach(h => {
      console.log(`  • [Fit: ${h.fitScore}/100] ${h.nome} -> ${h.justificativa}`);
    });

    console.log('\n🚕 MOBILIDADE & TÁXI:');
    item.rankingFornecedores.taxis.forEach(t => {
      console.log(`  • [Fit: ${t.fitScore}/100] ${t.nome} -> ${t.justificativa}`);
    });

    console.log('\n🚐 VANS & TRANSFERS:');
    item.rankingFornecedores.vans.forEach(v => {
      console.log(`  • [Fit: ${v.fitScore}/100] ${v.nome} -> ${v.justificativa}`);
    });

    console.log('\n✈️ TMC / AÉREO:');
    item.rankingFornecedores.tmc.forEach(tmc => {
      console.log(`  • [Fit: ${tmc.fitScore}/100] ${tmc.nome} -> ${tmc.justificativa}`);
    });

    console.log('\n📦 PACOTES GERADOS PELO MOTOR CPQ (Amostra 100 participantes):');
    item.pacotesRecomendados.forEach(p => {
      console.log(`  ▶ ${p.nome.toUpperCase()} ${p.recomendado ? '⭐' : ''}`);
      console.log(`    Valor Total Cliente: R$ ${p.valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Receita Estimada (Comissão/Fee): R$ ${p.receitaEstimadaNossa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      console.log(`    Composição: Hotel [${p.composicao.hotel}] | Mobilidade [${p.composicao.mobilidade}]`);
      console.log(`    Destaque: ${p.destaque}\n`);
    });

    console.log('----------------------------------------------------------------\n');
  });
}

// Exportar módulo para uso em API ou scripts
module.exports = {
  processRadarPipeline,
  calculateEventOpportunityScore,
  calculateHotelFitScore,
  calculateTaxiFitScore,
  calculateVanFitScore,
  calculateTMCFitScore,
  generateCPQPackages
};

/**
 * MÓDULO 6: MOTOR DE MAPA DE CALOR GEOGRÁFICO & TEMPORAL (Heatmap Engine)
 * Consolida a densidade espacial de demanda em São Paulo e analisa os picos de sazonalidade e capacidade hoteleira.
 */

const { listarEventos, POLOS_SP } = require('./radarCollector');
const { listarFornecedores } = require('./supplierManager');

/**
 * Calcula o mapa de calor geográfico por polo de São Paulo
 */
function calcularMapaCalorGeografico() {
  const eventos = listarEventos();
  const fornecedores = listarFornecedores();
  const hoteis = fornecedores.filter(f => f.tipo === 'hotel');
  const taxis = fornecedores.filter(f => f.tipo === 'taxi');
  const vans = fornecedores.filter(f => f.tipo === 'transfer_van');

  const polosMap = {};

  // Inicializar estrutura dos polos
  Object.keys(POLOS_SP).forEach(key => {
    polosMap[key] = {
      id: key,
      nome: POLOS_SP[key].nome,
      regiao: POLOS_SP[key].regiao,
      capacidadePavilhao: POLOS_SP[key].capacidade_maxima,
      segmentos: POLOS_SP[key].segmentos_predominantes,
      eventosAtivos: [],
      totalParticipantes: 0,
      totalHospedesEstimados: 0,
      totalRoomNights: 0,
      totalTransfersNecessarios: 0,
      budgetEstimadoRegiao: 0,
      hoteisNoRaio: [],
      capacidadeRoomBlockRede: 0,
      taxaCoberturaRedePct: 0,
      nivelSaturacao: 'BAIXO'
    };
  });

  // Distribuir eventos por polo
  eventos.forEach(evt => {
    const poloKey = evt.local_evento;
    if (polosMap[poloKey]) {
      polosMap[poloKey].eventosAtivos.push({
        id: evt.id,
        nome: evt.nome,
        dataInicio: evt.data_inicio,
        dataFim: evt.data_fim,
        duracao: evt.dias_duracao,
        publico: evt.publico_total_estimado,
        segmento: evt.segmento
      });

      const dem = evt.demanda_estimada || {};
      polosMap[poloKey].totalParticipantes += evt.publico_total_estimado || 0;
      polosMap[poloKey].totalHospedesEstimados += dem.hospedes_estimados || 0;
      polosMap[poloKey].totalRoomNights += dem.room_nights_estimados || 0;
      polosMap[poloKey].totalTransfersNecessarios += dem.transfers_aeroporto_necessarios || 0;
      polosMap[poloKey].budgetEstimadoRegiao += evt.budget_alvo_estimado || 0;
    }
  });

  // Mapear hotéis no raio (< 8 km de cada polo)
  Object.keys(polosMap).forEach(key => {
    const polo = polosMap[key];
    
    hoteis.forEach(h => {
      const dist = (h.distancias_km && h.distancias_km[key]) !== undefined ? h.distancias_km[key] : 15.0;
      if (dist <= 8.0) {
        polo.hoteisNoRaio.push({
          id: h.id,
          nome: h.nome,
          distanciaKm: dist,
          diariaMice: h.diaria_negociada_mice,
          roomBlock: h.max_room_block,
          comissaoPct: h.comissao_percentual
        });
        polo.capacidadeRoomBlockRede += h.max_room_block;
      }
    });

    // Calcular taxa de cobertura da rede e nível de saturação
    if (polo.totalHospedesEstimados > 0) {
      polo.taxaCoberturaRedePct = Math.min(100, Math.round((polo.capacidadeRoomBlockRede / polo.totalHospedesEstimados) * 100));
    }

    if (polo.totalRoomNights >= 5000) {
      polo.nivelSaturacao = 'CRÍTICO / ALTA PRESSÃO';
    } else if (polo.totalRoomNights >= 2500) {
      polo.nivelSaturacao = 'MODERADO';
    } else {
      polo.nivelSaturacao = 'BAIXO';
    }
  });

  return Object.values(polosMap);
}

/**
 * Calcula a timeline e distribuição temporal de demanda (Sazonalidade) para todo o ano de 2026
 */
function calcularMapaCalorTemporal() {
  const eventos = listarEventos();
  const mesesMap = {};

  const nomesMeses = {
    '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março',
    '04': 'Abril', '05': 'Maio', '06': 'Junho',
    '07': 'Julho', '08': 'Agosto', '09': 'Setembro',
    '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
  };

  eventos.forEach(evt => {
    const dataStr = evt.data_inicio || '2026-10-01';
    const anoMes = dataStr.slice(0, 7);
    const mesNum = anoMes.split('-')[1] || '10';
    const mesFormatado = `${nomesMeses[mesNum] || 'Mês'} ${anoMes.split('-')[0]}`;

    if (!mesesMap[anoMes]) {
      mesesMap[anoMes] = {
        anoMes,
        mesNome: mesFormatado,
        totalEventos: 0,
        participantes: 0,
        roomNights: 0,
        status: 'ESTÁVEL',
        alerta: ''
      };
    }

    const dem = evt.demanda_estimada || {};
    mesesMap[anoMes].totalEventos += 1;
    mesesMap[anoMes].participantes += evt.publico_total_estimado || 0;
    mesesMap[anoMes].roomNights += dem.room_nights_estimados || 0;
  });

  // Ordenar cronologicamente
  const mesesOrdenados = Object.values(mesesMap).sort((a, b) => a.anoMes.localeCompare(b.anoMes));

  // Ajustar status de intensidade e alertas
  mesesOrdenados.forEach(m => {
    if (m.roomNights >= 20000) {
      m.status = 'PICO EXTREMO & DIÁRIAS ELEVADAS';
      m.alerta = 'Superlotação na rede hoteleira de SP. Risco crítico de indisponibilidade de vans e quartos.';
    } else if (m.roomNights >= 8000) {
      m.status = 'ALTA DEMANDA CORPORATIVA';
      m.alerta = 'Fluxo corporativo intenso. Bloqueios prévios recomendados com antecedência de 90 dias.';
    } else {
      m.status = 'DEMANDA MODERADA / ESTÁVEL';
      m.alerta = 'Capacidade operacional confortável na rede hoteleira e de mobilidade.';
    }
  });

  return mesesOrdenados;
}

/**
 * Gera relatório de oportunidade de inteligência para fornecedores hoteleiros de uma região
 */
function gerarRelatorioInteligenciaHotel(poloId) {
  const polos = calcularMapaCalorGeografico();
  const polo = polos.find(p => p.id === poloId);

  if (!polo) return null;

  return {
    poloNome: polo.nome,
    regiao: polo.regiao,
    totalEventosMapeados: polo.eventosAtivos.length,
    volumeParticipantesTotal: polo.totalParticipantes,
    demandaRoomNightsPotencial: polo.totalRoomNights,
    budgetCorporativoMapeado: polo.budgetEstimadoRegiao,
    eventos: polo.eventosAtivos,
    pitchComercial: `Identificamos ${polo.eventosAtivos.length} grandes eventos corporativos confirmados no ${polo.nome}, com demanda mapeada de ${polo.totalRoomNights.toLocaleString('pt-BR')} room nights. Estruturamos o credenciamento de bloqueios preferenciais para canalizar hóspedes diretos.`
  };
}

module.exports = {
  calcularMapaCalorGeografico,
  calcularMapaCalorTemporal,
  gerarRelatorioInteligenciaHotel
};

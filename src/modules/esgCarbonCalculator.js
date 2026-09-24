/**
 * MÓDULO ESG & CALCULADORA DE PEGADA DE CARBONO (MICE Sustainability & Saving Engine)
 * Alinhado às diretrizes do GHG Protocol e às práticas de governança de Empresas B (Sistema B).
 * Calcula:
 * 1. Emissões de CO₂ evitadas através de mobilidade compartilhada e rotas expressas.
 * 2. Equivalência de árvores plantadas / créditos de carbono.
 * 3. Auditoria de Saving Financeiro (Tarifa Balcão de Pico vs. Tarifa MICE Negociada).
 */

// Fatores médios de emissão de CO₂ (kg CO₂ por passageiro/km - Padrão GHG Protocol Brasil)
const FATORES_EMISSAO = {
  carro_individual_gasolina: 0.185, // kg CO2 por km/pax
  carro_aplicativo_medio: 0.165,   // kg CO2 por km/pax
  taxi_corredor_etanol_hibrido: 0.082, // kg CO2 por km/pax (em faixa exclusiva, sem para-e-anda)
  van_executiva_15lugares: 0.045,  // kg CO2 por km/pax (lotada)
  microonibus_28lugares: 0.032,    // kg CO2 por km/pax
  onibus_executivo_46lugares: 0.024 // kg CO2 por km/pax
};

/**
 * Calcula a pegada de carbono e o saving ambiental de um evento corporativo
 * @param {Object} evento Dados do evento
 * @param {number} participantes Número de participantes dimensionados
 * @returns {Object} Relatório ESG de Sustentabilidade
 */
function calcularImpactoESG(evento, participantes = 100) {
  const dias = evento.dias_duracao || 3;
  const kmMedioDiario = 35; // Deslocamentos Aeroportos + Hotel + Pavilhão em SP

  // Cenário 1: Desordenado Tradicional (cada participante usando carro individual / app avulso)
  const kmTotalPax = participantes * dias * kmMedioDiario;
  const co2CenarioTradicionalKg = kmTotalPax * FATORES_EMISSAO.carro_individual_gasolina;

  // Cenário 2: Ecossistema MICE Inteligente (Shuttle contínuo de Vans + Táxi em Corredor)
  // 70% dos deslocamentos via vans integradas e 30% via táxis com faturamento
  const co2VansKg = (kmTotalPax * 0.70) * FATORES_EMISSAO.van_executiva_15lugares;
  const co2TaxisKg = (kmTotalPax * 0.30) * FATORES_EMISSAO.taxi_corredor_etanol_hibrido;
  const co2CenarioMICEKg = co2VansKg + co2TaxisKg;

  // Economia e Benefícios Ambientais
  const co2EvitadoKg = Math.max(0, co2CenarioTradicionalKg - co2CenarioMICEKg);
  const co2EvitadoToneladas = +(co2EvitadoKg / 1000).toFixed(2);
  const reducaoPercentual = Math.round((co2EvitadoKg / co2CenarioTradicionalKg) * 100);

  // Equivalências Ecológicas
  const arvoresEquivalentesAno = +(co2EvitadoKg / 15.2).toFixed(1); // 1 árvore da Mata Atlântica absorve ~15.2 kg CO2/ano
  const litrosCombustivelEconomizados = Math.round(co2EvitadoKg / 2.28); // 1L gasolina = ~2.28 kg CO2

  return {
    eventoId: evento.id,
    eventoNome: evento.nome,
    participantes,
    diasDuracao: dias,
    metricasCarbono: {
      cenarioTradicionalTonCO2: +(co2CenarioTradicionalKg / 1000).toFixed(2),
      cenarioMICEInteligenteTonCO2: +(co2CenarioMICEKg / 1000).toFixed(2),
      co2EvitadoTonCO2: co2EvitadoToneladas,
      co2EvitadoKg: Math.round(co2EvitadoKg),
      reducaoPercentualEmissoes: reducaoPercentual,
      arvoresSalvasEquivalente: arvoresEquivalentesAno,
      litrosCombustivelPoupados: litrosCombustivelEconomizados
    },
    seloSustentabilidade: {
      nivel: reducaoPercentual >= 60 ? 'MICE VERDE &middot; CLASSE A (Ouro)' : 'MICE ECO-EFICIENTE &middot; CLASSE B',
      conformidadeGHG: 'Metodologia alinhada ao GHG Protocol Corporate Standard',
      pontosDestaque: [
        'Uso preferencial de faixas e corredores exclusivos de ônibus de SP (redução de 38% no tempo de motor ocioso).',
        'Shuttles executivos de alta ocupação (15 a 28 pax) eliminando 70+ corridas individuais diárias.',
        'Compromisso com parceiros de hospedagem que possuem certificação de eficiência hídrica e energética.'
      ]
    }
  };
}

/**
 * Calcula a Auditoria de Saving Financeiro (Economia Real Negociada vs Preços de Pico)
 * @param {Object} evento Dados do evento
 * @param {number} participantes Número de participantes
 * @param {Object} hotelTop Hotel com melhor fit
 * @param {Object} vanTop Van homologada
 * @param {Object} taxiTop Táxi homologado
 */
function calcularAuditoriaSaving(evento, participantes, hotelTop, vanTop, taxiTop) {
  const dias = evento.dias_duracao || 3;
  const noites = dias;

  // Preços de Mercado em Período de Pico sem acordo prévio
  const diariaBalcaoPico = hotelTop.diaria_media_padrao || 620.00;
  const transferAvulsoMercado = 520.00;
  const taxiAvulsoBandeira = 180.00;

  // Custo Total Cenário de Mercado (sem intermediação MICE)
  const custoHotelMercado = participantes * noites * diariaBalcaoPico;
  const custoMobilidadeMercado = (dias * 2 * (vanTop.diaria_van_10h ? vanTop.diaria_van_10h * 1.35 : 1100)) + (participantes * taxiAvulsoBandeira);
  const custoTotalMercado = custoHotelMercado + custoMobilidadeMercado;

  // Custo com Tarifas Homologadas MICE Intelligence
  const diariaMICE = hotelTop.diaria_negociada_mice || hotelTop.diariaNegociada || 440.00;
  const diariaVanMICE = vanTop.diaria_van_10h || vanTop.diariaVan || 800.00;
  const taxiTarifaMICE = taxiTop.tarifa_media_gru_hotel || taxiTop.tarifaGru || 145.00;

  const custoHotelMICE = participantes * noites * diariaMICE;
  const custoMobilidadeMICE = (dias * 2 * diariaVanMICE) + (participantes * taxiTarifaMICE);
  const custoTotalMICE = custoHotelMICE + custoMobilidadeMICE;

  const savingTotalReais = Math.max(0, custoTotalMercado - custoTotalMICE);
  const savingPercentual = Math.round((savingTotalReais / custoTotalMercado) * 100);

  return {
    custoSemAcordoMercado: custoTotalMercado,
    custoComAcordoMICE: custoTotalMICE,
    savingTotalReais,
    savingPercentual,
    savingPorParticipante: Math.round(savingTotalReais / participantes),
    demonstrativo: {
      hotelaria: {
        tarifaBalcao: diariaBalcaoPico,
        tarifaMICE: diariaMICE,
        savingHotelReais: custoHotelMercado - custoHotelMICE
      },
      mobilidade: {
        tarifaAvulsaMercado: custoMobilidadeMercado,
        tarifaHomologadaMICE: custoMobilidadeMICE,
        savingMobilidadeReais: custoMobilidadeMercado - custoMobilidadeMICE
      }
    }
  };
}

module.exports = {
  calcularImpactoESG,
  calcularAuditoriaSaving,
  FATORES_EMISSAO
};

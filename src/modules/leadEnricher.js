/**
 * MÓDULO 2: MOTOR DE ENRIQUECIMENTO DE DECISORES & MICE OUTREACH COPILOT
 * Mapeia os dados cadastrais da empresa organizadora e as personas de decisão de compras indiretas/MICE.
 * Gera pitches hiperpersonalizados por setor (Saúde, Finanças, TI, Varejo, Jurídico) para E-mail e WhatsApp.
 */

const { calcularImpactoESG, calcularAuditoriaSaving } = require('./esgCarbonCalculator');
const { gerarRoomBlockShield } = require('./roomBlockShield');

const PERSONAS_COMPRAS_MICE = [
  {
    cargo_tipo: 'Compras Indiretas / Procurement',
    titulo: 'Gerente / Diretor de Compras Indiretas',
    foco: 'Otimização de custos, conformidade de faturamento, SLA, saving auditável e relatórios ESG.',
    canal_preferencial: 'E-mail corporativo / RFP prévia'
  },
  {
    cargo_tipo: 'Gestão de Viagens & Eventos (MICE)',
    titulo: 'Head de Eventos Corporativos / Travel Manager',
    foco: 'Disponibilidade de room block garantido, rotas de transfer sem fricção e segurança/Duty of Care dos participantes.',
    canal_preferencial: 'LinkedIn & Reunião rápida de alinhamento'
  },
  {
    cargo_tipo: 'Relações Médicas / Institucionais',
    titulo: 'Diretor de Relações Médicas & Sociedades Científicas',
    foco: 'Atendimento VIP para palestrantes (speakers), conformidade Interfarma/Anvisa, hospedagem premium e discrição.',
    canal_preferencial: 'Apresentação formal da minuta executiva'
  },
  {
    cargo_tipo: 'Marketing & Live Marketing',
    titulo: 'Gerente de Marketing e Patrocínios',
    foco: 'Experiência dos convidados de honra, pontualidade nos auditórios e jantares corporativos de relacionamento.',
    canal_preferencial: 'Apresentação de cenários executivos e WhatsApp direto'
  }
];

/**
 * Enriquece os dados do evento com personas e canais de abordagem ideais
 */
function enriquecerEventoComDecisores(evento) {
  const decisoresExistentes = evento.decisores_identificados || [];
  
  // Calcular janela ideal de abordagem
  const diasAntecedencia = evento.dias_antecedencia || 60;
  let statusJanela = 'IDEAL';
  let recomendacaoTiming = 'Janela ótima para negociação de tarifas e bloqueio de room block.';

  if (diasAntecedencia > 90) {
    statusJanela = 'ANTECIPADA';
    recomendacaoTiming = 'Excelente momento para garantir as melhores tarifas corporativas com folga.';
  } else if (diasAntecedencia < 30) {
    statusJanela = 'URGENTE';
    recomendacaoTiming = 'Abordagem expressa: bloqueios hoteleiros próximos ao esgotamento.';
  }

  // Mapear estratégia de abordagem por segmento
  let estrategiaSegmento = 'Corporativo Padrão';
  if (evento.segmento && (evento.segmento.includes('Saúde') || evento.segmento.includes('Hospitalar') || evento.segmento.includes('Médic'))) {
    estrategiaSegmento = 'Foco em Compliance Farmacêutico (Interfarma/Anvisa), transfers privativos para Speakers e hotéis 5 estrelas.';
  } else if (evento.segmento && (evento.segmento.includes('Finan') || evento.segmento.includes('Banc') || evento.segmento.includes('Tech'))) {
    estrategiaSegmento = 'Foco em agilidade de mobilidade, faturamento via voucher digital (faixas de ônibus) e hotéis do eixo Berrini/Paulista.';
  } else if (evento.segmento && (evento.segmento.includes('Varejo') || evento.segmento.includes('Aliment'))) {
    estrategiaSegmento = 'Foco em caravanas de alta volumetria, otimização de custo por assento em micro-ônibus e Holiday Inn Anhembi.';
  }

  return {
    eventoId: evento.id,
    empresaOrganizadora: evento.empresa_organizadora,
    cnpj: evento.cnpj_organizador || 'Em processo de qualificação cadastral',
    timingAbordagem: {
      diasAntecedencia,
      statusJanela,
      recomendacaoTiming
    },
    estrategiaSegmento,
    decisoresMapeados: decisoresExistentes,
    personasRecomendadas: PERSONAS_COMPRAS_MICE
  };
}

/**
 * MICE OUTREACH COPILOT: Gera scripts inteligentes e customizados de abordagem comercial
 * @param {Object} evento Dados do evento
 * @param {number} participantes Número de participantes dimensionados
 * @param {Object} hotelTop Hotel com melhor fit
 */
function gerarPitchesCopilotPorSegmento(evento, participantes = 100, hotelTop = null) {
  const decisor = (evento.decisores_identificados && evento.decisores_identificados[0]) 
    ? evento.decisores_identificados[0] 
    : { nome: 'Diretoria de Compras & Eventos', cargo: 'Gestão MICE' };

  const nomeHotel = hotelTop ? hotelTop.nome : 'Rede Hoteleira Credenciada de SP';
  const diariaMice = hotelTop ? (hotelTop.diaria_negociada_mice || hotelTop.diariaNegociada || 440) : 440;
  const esg = calcularImpactoESG(evento, participantes);
  const shield = gerarRoomBlockShield(evento, Math.round(participantes * 0.8), diariaMice);

  const segmento = (evento.segmento || '').toLowerCase();

  // Customização setorial
  let ganchoSetorial = 'otimização de custos e governança de ponta a ponta';
  let dorSetorial = 'custos inflacionados de última hora e dispersão de participantes';
  let diferencialSetorial = 'saving médio de 22,5% e relatórios de auditoria financeira';

  if (segmento.includes('saúde') || segmento.includes('médic') || segmento.includes('hospitalar')) {
    ganchoSetorial = 'conformidade rigorosa com normas de compliance médico (Interfarma/Anvisa) e acolhimento de alto padrão para palestrantes';
    dorSetorial = 'risco de no-show de médicos convidados e hotéis com padrões incompatíveis com a política farmacêutica';
    diferencialSetorial = 'atendimento VIP a Speakers, faturamento direto hospitalar e garantia Room Block Shield sem multas de attrition';
  } else if (segmento.includes('finan') || segmento.includes('banc') || segmento.includes('tech') || segmento.includes('telecom')) {
    ganchoSetorial = 'máxima agilidade em trânsito e faturamento 100% digital via vouchers corporativos';
    dorSetorial = 'perda de tempo de executivos no trânsito de SP e atrasos nos painéis principais';
    diferencialSetorial = 'frotas com trânsito liberado em corredores exclusivos de ônibus, hotéis integrados aos complexos corporativos (WTC/Berrini) e emissões Copastur';
  } else if (segmento.includes('varejo') || segmento.includes('aliment') || segmento.includes('frotas')) {
    ganchoSetorial = 'economia de escala para grandes caravanas de expositores e compradores';
    dorSetorial = 'estouro de budget com hospedagens fragmentadas e logística desordenada';
    diferencialSetorial = 'bloqueios maciços de até 350 apartamentos pé-no-pavilhão e shuttles circulares com custo por passageiro até 60% menor';
  }

  // 1. E-mail Corporativo Formal
  const emailAssunto = `Solução Estruturada MICE & Hospedagem Corporativa: ${evento.nome} — [Saving e Governança]`;
  const emailCorpo = `Prezado(a) ${decisor.nome} (${decisor.cargo}),

Mapeamos que a ${evento.empresa_organizadora || 'sua organização'} está coordenando a participação e delegações para o ${evento.nome}, em São Paulo.

Em grandes convenções no ${evento.local_evento.replace(/_/g, ' ').toUpperCase()}, um dos principais desafios enfrentados por Compras Indiretas e Facilities é ${dorSetorial}.

Para assegurar ${ganchoSetorial}, estruturamos previamente uma matriz operacional pronta para atendimento à sua equipe:

1. HOSPEDAGEM HOMOLOGADA COM ECONOMIA REAL:
• Bloqueio prévio no ${nomeHotel} com tarifa corporativa acordada de R$ ${diariaMice.toFixed(2)}/diária.
• Proteção Room Block Shield: Cláusula de devolução escalonada sem multas de attrition até D-30.

2. MOBILIDADE INTELIGENTE (CHAME TÁXI & TRANSFERS):
• Shuttles contínuos e vouchers corporativos 100% digitais com trânsito livre nos corredores de ônibus de SP (redução de até 40% no tempo de percurso).
• Emissões aéreas em lote e gestão de grupos integrada através da Copastur (IATA).

3. SUSTENTABILIDADE & RELATÓRIO ESG (GHG PROTOCOL):
• Redução estimada de ${esg.metricasCarbono.reducaoPercentualEmissoes}% nas emissões de CO₂ da delegação (${esg.metricasCarbono.co2EvitadoTonCO2} toneladas de CO₂ evitadas).

Disponibilizamos o acesso à proposta executiva digital parametrizada com os 3 cenários orçamentários:
http://localhost:3000/proposta/${evento.id}?p=${participantes}

Podemos agendar uma rápida conversa de 15 minutos para apresentar os cenários e liberar o faturamento direto para a sua organização?

Atenciosamente,
Coordenação de Inteligência & Operações MICE SP`;

  // 2. WhatsApp Pitch Executivo (Direto e Ágil)
  const whatsappTexto = `Olá, *${decisor.nome}*, tudo bem?

Identificamos a participação da *${evento.empresa_organizadora}* no *${evento.nome}* em SP.

Estruturamos previamente uma solução completa de *hospedagem credenciada* (${nomeHotel}) com *saving de até 22,5%*, logística de shuttles e vouchers corporativos da *Cooper Chame Táxi* com trânsito liberado nas faixas de ônibus de SP.

🛡️ *Garantia:* Contrato com cláusula de cancelamento sem multas de attrition (Room Block Shield) e faturamento direto quinzenal.
🌱 *ESG:* Redução de ${esg.metricasCarbono.reducaoPercentualEmissoes}% na pegada de carbono da delegação.

Acesse a proposta executiva pronta com 3 cenários orçamentários:
👉 http://localhost:3000/proposta/${evento.id}?p=${participantes}

Podemos validar uma amostra de bloqueio para a sua diretoria?`;

  return {
    eventoId: evento.id,
    eventoNome: evento.nome,
    decisorNome: decisor.nome,
    decisorCargo: decisor.cargo,
    segmentoFormatado: ganchoSetorial,
    email: {
      assunto: emailAssunto,
      corpo: emailCorpo
    },
    whatsapp: {
      texto: whatsappTexto
    },
    argumentosChave: [
      diferencialSetorial,
      `Economia comprovada com tarifa MICE de R$ ${diariaMice.toFixed(2)} vs Tarifa Balcão de Pico.`,
      `Relatório de Sustentabilidade ESG (${esg.metricasCarbono.co2EvitadoTonCO2} ton CO₂ evitadas).`,
      `Garantia Room Block Shield com liberação flexível de quartos sem multa.`
    ]
  };
}

module.exports = {
  enriquecerEventoComDecisores,
  gerarPitchesCopilotPorSegmento,
  PERSONAS_COMPRAS_MICE
};

/**
 * MÓDULO ROOM BLOCK SHIELD & GESTÃO DE ATTRITION (MICE Risk Protection)
 * Protege o comprador corporativo contra multas contratuais de no-show e cancelamento de bloqueios hoteleiros.
 * Estrutura:
 * 1. Cronograma de réguas de corte sem ônus (D-60 a D-15).
 * 2. Cálculo de exposição a risco financeiro e buffer de contingência.
 * 3. Matriz de redistribuição de excedentes (Marketplace MICE).
 */

/**
 * Gera o plano de proteção de bloqueio hoteleiro (Room Block Shield)
 * @param {Object} evento Dados do evento
 * @param {number} quartosBloqueados Quantidade de quartos bloqueados
 * @param {number} valorDiaria Valor da diária MICE negociada
 */
function gerarRoomBlockShield(evento, quartosBloqueados = 50, valorDiaria = 440.00) {
  const noites = evento.dias_duracao || 3;
  const valorTotalBloqueio = quartosBloqueados * noites * valorDiaria;

  // Réguas de corte contratual garantidas no acordo MICE
  const marcosCorte = [
    {
      marco: 'D-60 (60 dias antes do check-in)',
      percentualLiberacaoSemMulta: 100,
      quartosLiberaveis: quartosBloqueados,
      statusRisco: 'RISCO ZERO',
      corBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      diretriz: 'Liberação integral de qualquer volume de quartos sem incidência de qualquer penalidade ou multa.'
    },
    {
      marco: 'D-45 (45 dias antes do check-in)',
      percentualLiberacaoSemMulta: 80,
      quartosLiberaveis: Math.round(quartosBloqueados * 0.80),
      statusRisco: 'RISCO MÍNIMO',
      corBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      diretriz: 'Ajuste de até 80% do contingenciamento inicial. Ideal para recalibrar após envio dos convites aos palestrantes/delegações.'
    },
    {
      marco: 'D-30 (30 dias antes do check-in)',
      percentualLiberacaoSemMulta: 50,
      quartosLiberaveis: Math.round(quartosBloqueados * 0.50),
      statusRisco: 'PONTO DE DECISÃO CRÍTICO',
      corBadge: 'bg-amber-50 text-amber-800 border-amber-300',
      diretriz: 'Trava de 50% da grade de hospedagem. Acionamento do marketplace de redistribuição da Gisele caso haja sobra.'
    },
    {
      marco: 'D-15 (15 dias antes do check-in)',
      percentualLiberacaoSemMulta: 15,
      quartosLiberaveis: Math.round(quartosBloqueados * 0.15),
      statusRisco: 'FECHAMENTO FINAL (ROOMING LIST)',
      corBadge: 'bg-slate-100 text-slate-800 border-slate-300',
      diretriz: 'Envio da Rooming List definitiva com nomes dos hóspedes. Quotas residuais congeladas.'
    }
  ];

  // Buffer de contingência sugerido
  const margemSegurancaQuartos = Math.max(5, Math.round(quartosBloqueados * 0.10));
  const riscoExposicaoEvitadoReais = Math.round(valorTotalBloqueio * 0.35);

  return {
    eventoId: evento.id,
    eventoNome: evento.nome,
    parametrosBloqueio: {
      quartosBloqueados,
      noites,
      valorDiaria,
      valorTotalBloqueio
    },
    blindagemContratual: {
      titulo: 'Garantia Room Block Shield & Zero Multa de Attrition',
      descricao: 'Contratos intermediados com cláusula de proteção de devolução escalonada de quartos.',
      bufferSegurancaQuartos: margemSegurancaQuartos,
      riscoExposicaoEvitadoReais,
      marcosCorte
    },
    redeRedistribuicaoAtiva: {
      descricao: 'Caso sua organização não utilize 100% dos quartos reservados em D-30, nossa central de operações redistribui automaticamente o excedente para outras delegações cadastradas no mesmo evento em SP, neutralizando multas de no-show.',
      coberturaRede: '17 eventos corporativos monitorados simultaneamente em São Paulo.'
    }
  };
}

module.exports = {
  gerarRoomBlockShield
};

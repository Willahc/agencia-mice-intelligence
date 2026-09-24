/**
 * MÓDULO 5: CRM & FUNIL DE OPORTUNIDADES MICE (Deal Pipeline)
 * Gerencia o ciclo de vida comercial desde a captação no radar até a liquidação de comissões.
 */

const fs = require('fs');
const path = require('path');

const DEALS_FILE = path.join(__dirname, '../data/pipeline_deals.json');

const FASES_FUNIL = [
  { id: 'RADAR', nome: '1. Descoberta no Radar', cor: 'slate' },
  { id: 'QUALIFICADO', nome: '2. Decisor Qualificado', cor: 'blue' },
  { id: 'PROPOSTA_ENVIADA', nome: '3. Minuta Entregue', cor: 'amber' },
  { id: 'NEGOCIACAO', nome: '4. Em Negociação', cor: 'indigo' },
  { id: 'CONTRATO_FECHADO', nome: '5. Acordo Fechado', cor: 'emerald' },
  { id: 'LIQUIDADO', nome: '6. Comissão Liquidada', cor: 'teal' }
];

/**
 * Lista todos os negócios no CRM
 */
function listarDeals() {
  if (!fs.existsSync(DEALS_FILE)) {
    fs.writeFileSync(DEALS_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  return JSON.parse(fs.readFileSync(DEALS_FILE, 'utf-8'));
}

/**
 * Salva ou atualiza um negócio
 */
function salvarDeal(dealData) {
  const deals = listarDeals();
  if (!dealData.id) {
    dealData.id = `DEAL-${String(deals.length + 1).padStart(3, '0')}`;
    dealData.dataCriacao = new Date().toISOString().split('T')[0];
  }

  const index = deals.findIndex(d => d.id === dealData.id);
  if (index >= 0) {
    deals[index] = { ...deals[index], ...dealData };
  } else {
    deals.push(dealData);
  }

  fs.writeFileSync(DEALS_FILE, JSON.stringify(deals, null, 2), 'utf-8');
  return dealData;
}

/**
 * Atualiza apenas a fase do funil de um negócio
 */
function atualizarFaseDeal(dealId, novaFase) {
  const deals = listarDeals();
  const index = deals.findIndex(d => d.id === dealId);
  if (index >= 0) {
    deals[index].fase = novaFase;
    deals[index].atualizadoEm = new Date().toISOString();
    fs.writeFileSync(DEALS_FILE, JSON.stringify(deals, null, 2), 'utf-8');
    return deals[index];
  }
  return null;
}

/**
 * Calcula métricas consolidadas do CRM
 */
function calcularMetricasCRM() {
  const deals = listarDeals();
  const totalVolumeGeral = deals.reduce((acc, d) => acc + (d.valorEstimado || 0), 0);
  const totalReceitaPrevista = deals.reduce((acc, d) => acc + (d.receitaPrevista || 0), 0);
  const pipelinePonderado = deals.reduce((acc, d) => acc + ((d.receitaPrevista || 0) * (d.probabilidade || 0)), 0);

  const porFase = {};
  FASES_FUNIL.forEach(f => {
    porFase[f.id] = deals.filter(d => d.fase === f.id);
  });

  return {
    totalDeals: deals.length,
    totalVolumeGeral,
    totalReceitaPrevista,
    pipelinePonderado,
    fases: FASES_FUNIL,
    porFase
  };
}

module.exports = {
  listarDeals,
  salvarDeal,
  atualizarFaseDeal,
  calcularMetricasCRM,
  FASES_FUNIL
};

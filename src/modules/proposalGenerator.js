/**
 * MÓDULO 4: GERADOR DE PROPOSTAS EXECUTIVAS MICE (Proposal & ESG Generator)
 * Cria a minuta de proposta formal de alto padrão em HTML executivo pronto para impressão em PDF ou aprovação online.
 * Incorpora métricas ESG (CO₂ evitado), Auditoria de Saving Financeiro e Cláusula Room Block Shield.
 */

const { obterEventoPorId } = require('./radarCollector');
const { listarFornecedores } = require('./supplierManager');
const {
  calculateHotelFitScore,
  calculateTaxiFitScore,
  calculateVanFitScore,
  calculateTMCFitScore,
  generateCPQPackages
} = require('../engine/miceEngine');
const { calcularImpactoESG, calcularAuditoriaSaving } = require('./esgCarbonCalculator');
const { gerarRoomBlockShield } = require('./roomBlockShield');
const { orquestrarJornadaCompleta } = require('../engine/demandOrchestrator');

function gerarPropostaExecutivaHTML(eventoId, participantes = 100, customOverrides = null) {
  const evento = obterEventoPorId(eventoId);
  if (!evento) {
    throw new Error('Evento não localizado para geração de proposta.');
  }

  const plano = orquestrarJornadaCompleta(eventoId, participantes, evento.dias_duracao, customOverrides);
  const fornecedores = listarFornecedores();
  const hotelScores = fornecedores.filter(f => f.tipo === 'hotel').map(h => calculateHotelFitScore(h, evento)).sort((a, b) => b.fitScore - a.fitScore);
  const taxiScores = fornecedores.filter(f => f.tipo === 'taxi').map(t => calculateTaxiFitScore(t, evento)).sort((a, b) => b.fitScore - a.fitScore);
  const vanScores = fornecedores.filter(f => f.tipo === 'transfer_van').map(v => calculateVanFitScore(v, evento)).sort((a, b) => b.fitScore - a.fitScore);
  const tmcScores = fornecedores.filter(f => f.tipo === 'tmc_parceira').map(t => calculateTMCFitScore(t, evento)).sort((a, b) => b.fitScore - a.fitScore);

  const pacotes = generateCPQPackages(evento, hotelScores, taxiScores, vanScores, tmcScores);
  const mult = participantes / 100;

  const hotelTop = hotelScores[0];
  const vanTop = vanScores[0];
  const taxiTop = taxiScores[0];
  const tmcTop = tmcScores[0];

  const esg = calcularImpactoESG(evento, participantes);
  const saving = calcularAuditoriaSaving(evento, participantes, hotelTop, vanTop, taxiTop);
  const shield = gerarRoomBlockShield(evento, Math.round(participantes * 0.8), hotelTop.diariaNegociada);

  const decisorPrincipal = (evento.decisores_identificados && evento.decisores_identificados[0]) 
    ? evento.decisores_identificados[0] 
    : { nome: 'Comitê Organizador & Diretoria', cargo: 'Gestão de Compras e Eventos', email: 'contato@organizacao.com.br' };

  const dataEmissao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Proposta Executiva MICE — ${evento.nome}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      margin: 0;
      padding: 16px;
      line-height: 1.45;
      font-size: 11.5px;
    }
    .no-break, tr, .kpi-box, .pkg-card, .info-grid {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .header-box {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title { font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
    .prop-meta { text-align: right; font-size: 11px; color: #64748b; }
    .section-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
    }
    .info-item label { display: block; font-size: 9.5pt; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .info-item span { font-weight: 600; color: #0f172a; font-size: 11.5px; }
    
    /* KPIs Executivos */
    .kpi-strip {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .kpi-box {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
    }
    .kpi-box.green { background: #f0fdf4; border-color: #86efac; }
    .kpi-box.dark { background: #0f172a; color: #ffffff; border-color: #0f172a; }
    .kpi-val { font-size: 16px; font-weight: 800; line-height: 1.2; }
    .kpi-lbl { font-size: 10px; text-transform: uppercase; font-weight: 600; margin-top: 3px; }
    .kpi-sub { font-size: 9.5px; color: #64748b; margin-top: 2px; }

    .packages-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 10px;
      margin-bottom: 20px;
    }
    .package-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .package-card.recommended {
      border: 2px solid #0f172a;
      background: #f8fafc;
    }
    .tag {
      display: inline-block;
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      background: #e2e8f0;
      color: #334155;
      margin-bottom: 6px;
    }
    .tag.rec { background: #0f172a; color: #ffffff; }
    .card-price {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 11.5px; }
    th { background: #f1f5f9; text-align: left; padding: 6px 8px; font-size: 10px; color: #475569; border-bottom: 1px solid #cbd5e1; text-transform: uppercase; }
    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }

    .badge-pill {
      display: inline-block;
      padding: 1px 6px;
      font-size: 9px;
      font-weight: 700;
      border-radius: 3px;
    }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-slate { background: #e2e8f0; color: #334155; }

    .action-buttons {
      position: fixed;
      top: 16px;
      right: 16px;
      display: flex;
      gap: 8px;
      z-index: 100;
    }
    .btn-action {
      background: #0f172a;
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 11.5px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      transition: all 0.2s;
    }
    .btn-action.approve { background: #047857; }
    .btn-action.approve:hover { background: #065f46; }
    .btn-action:hover { background: #1e293b; }

    @media print {
      .action-buttons { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>

  <div class="action-buttons">
    <button class="btn-action" onclick="window.print()">🖨️ Imprimir Proposta (PDF)</button>
    <button class="btn-action approve" onclick="registrarAceiteDigital()">✅ Aprovar Proposta Online</button>
  </div>

  <div class="header-box">
    <div>
      <div class="brand-title">MICE DEMAND INTELLIGENCE & ORCHESTRATION</div>
      <div class="brand-sub">Coordenação de Compras Indiretas & Hospedagem Corporativa &middot; São Paulo</div>
    </div>
    <div class="prop-meta">
      <div><strong>Proposta Nº:</strong> PROP-${evento.id.replace('EVT-', '')}-${participantes}P</div>
      <div><strong>Emissão:</strong> ${dataEmissao}</div>
      <div><strong>Validade:</strong> 15 dias úteis</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-item">
      <label>Evento &middot; Demanda</label>
      <span>${evento.nome}</span>
    </div>
    <div class="info-item">
      <label>Organização &middot; Solicitante</label>
      <span>${evento.empresa_organizadora}</span>
    </div>
    <div class="info-item">
      <label>Destinatário / Decisor</label>
      <span>${decisorPrincipal.nome} (${decisorPrincipal.cargo})</span>
    </div>
    <div class="info-item">
      <label>Local em SP</label>
      <span>${evento.local_evento.replace(/_/g, ' ').toUpperCase()}</span>
    </div>
    <div class="info-item">
      <label>Delegação Dimensionada</label>
      <span>${participantes} participantes (${evento.dias_duracao} dias)</span>
    </div>
    <div class="info-item">
      <label>Room Nights Mapeadas</label>
      <span>${participantes * evento.dias_duracao} diárias de hotel</span>
    </div>
  </div>

  <!-- KPI Strip de Alto Impacto (Saving + ESG + Blindagem) -->
  <div class="kpi-strip">
    <div class="kpi-box green">
      <div class="kpi-val" style="color: #065f46;">R$ ${saving.savingTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
      <div class="kpi-lbl" style="color: #047857;">Saving Auditável (${saving.savingPercentual}% de Economia)</div>
      <div class="kpi-sub" style="color: #065f46;">Economia de R$ ${saving.savingPorParticipante.toLocaleString('pt-BR')}/participante vs. Tarifas de Pico</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-val" style="color: #0f172a;">${esg.metricasCarbono.co2EvitadoTonCO2} Toneladas CO₂</div>
      <div class="kpi-lbl" style="color: #334155;">Emissões Evitadas (${esg.metricasCarbono.reducaoPercentualEmissoes}% Menos Carbono)</div>
      <div class="kpi-sub">Equivalente a ${esg.metricasCarbono.arvoresSalvasEquivalente} árvores/ano (Padrão GHG Protocol)</div>
    </div>
    <div class="kpi-box dark">
      <div class="kpi-val">Garantia Room Block Shield</div>
      <div class="kpi-lbl" style="color: #cbd5e1;">Zero Multa de Attrition</div>
      <div class="kpi-sub" style="color: #94a3b8;">Liberação escalonada sem ônus até D-30</div>
    </div>
  </div>

  <div class="section-title">1. Cenários Orçamentários Estruturados (CPQ)</div>
  <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">
    Três cenários parametrizados com fornecedores homologados da rede, faturamento unificado e tarifas corporativas:
  </p>

  <div class="packages-container">
    ${pacotes.map(p => {
      const valor = p.valorEstimado * mult;
      return `
        <div class="package-card ${p.recomendado ? 'recommended' : ''}">
          <div>
            <span class="tag ${p.recomendado ? 'rec' : ''}">${p.categoria} ${p.recomendado ? '· Recomendado' : ''}</span>
            <div style="font-weight: 700; font-size: 12.5px; color: #0f172a; margin-bottom: 3px;">${p.nome.replace('⭐', '')}</div>
            <div style="font-size: 10.5px; color: #64748b; margin-bottom: 8px;">${p.destaque}</div>
            
            <div style="font-size: 10.5px; border-top: 1px dashed #e2e8f0; padding-top: 6px; margin-top: 6px; space-y-1;">
              <div><strong>🏨 Hotel:</strong> ${p.composicao.hotel}</div>
              <div style="margin-top: 3px;"><strong>🚐 Mobilidade:</strong> ${p.composicao.mobilidade}</div>
              ${p.composicao.gastronomia ? `<div style="margin-top: 3px;"><strong>🍽️ Gastronomia:</strong> ${p.composicao.gastronomia}</div>` : ''}
            </div>
          </div>
          <div class="card-price">
            <div style="font-size: 9.5px; color: #64748b; font-weight: normal; text-transform: uppercase;">Investimento Total Estimado (${participantes} pax)</div>
            R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      `;
    }).join('')}
  </div>

  <div class="section-title">2. Engenharia de Viagem & Alocação Multihotel / Multifrota (${participantes} Participantes)</div>
  <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">
    Dimensionamento logístico e hoteleiro balanceado por proximidade ao pavilhão com garantia Room Block Shield e faturamento quinzenal:
  </p>

  <!-- Grade 1: Alocação Hoteleira Multihotel -->
  <div style="font-size: 11px; font-weight: 700; color: #1e293b; margin: 10px 0 4px 0;">🏨 Distribuição Hoteleira Homologada (${plano.orquestracaoHospedagem.hoteisUtilizadosQtd} Hotéis na Região)</div>
  <table style="margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="width: 32%;">Hotel Homologado</th>
        <th style="width: 14%; text-align: center;">Distância</th>
        <th style="width: 18%; text-align: center;">Quartos Alocados</th>
        <th style="width: 16%; text-align: right;">Diária MICE</th>
        <th style="width: 20%; text-align: right;">Saving Gerado</th>
      </tr>
    </thead>
    <tbody>
      ${plano.orquestracaoHospedagem.gradeHoteis.map(h => `
        <tr>
          <td>
            <strong>${h.nome}</strong>
            <div style="font-size: 9.5px; color: #64748b;">${h.bairro} &middot; ${h.cafeIncluso ? 'Café Incluso' : ''}</div>
          </td>
          <td style="text-align: center; font-family: monospace;">${h.distanciaKm} km</td>
          <td style="text-align: center; font-weight: 700; color: #1e1b4b; background: #e0e7ff;">${h.quartosAlocados} quartos (${h.roomNightsTotal} noites)</td>
          <td style="text-align: right; font-family: monospace;">R$ ${h.diariaNegociadaMICE.toFixed(2)}</td>
          <td style="text-align: right; font-weight: 700; color: #047857;">R$ ${h.savingGeradoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        </tr>
      `).join('')}
      <tr style="background: #f8fafc; font-weight: 700; border-top: 2px solid #cbd5e1;">
        <td>TOTAL HOSPEDAGEM (${plano.orquestracaoHospedagem.totalQuartosAlocados} QUARTOS)</td>
        <td style="text-align: center;">&mdash;</td>
        <td style="text-align: center; color: #4338ca;">${plano.orquestracaoHospedagem.totalRoomNights} Room Nights</td>
        <td style="text-align: right;">R$ ${plano.orquestracaoHospedagem.custoTotalHospedagem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: #047857;">R$ ${plano.orquestracaoHospedagem.savingTotalHospedagem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      </tr>
    </tbody>
  </table>

  <!-- Grade 2: Mobilidade, Táxis & Shuttles -->
  <div style="font-size: 11px; font-weight: 700; color: #1e293b; margin: 10px 0 4px 0;">🚕 Mobilidade, Cooperativas de Táxi & Shuttles Hotel ↔ Pavilhão</div>
  <table style="margin-bottom: 16px;">
    <thead>
      <tr>
        <th style="width: 25%;">Modalidade</th>
        <th style="width: 28%;">Fornecedor Homologado</th>
        <th style="width: 22%;">Dimensionamento Físico</th>
        <th style="width: 25%;">Governança & SLA</th>
      </tr>
    </thead>
    <tbody>
      ${plano.orquestracaoTaxis.gradeCooperativas.map(c => `
        <tr>
          <td><strong>Receptivo / Táxis</strong></td>
          <td>${c.nome}</td>
          <td><strong>${c.veiculosMobilizados} táxis dedicados</strong> (${c.corridasAlocadas} corridas)</td>
          <td>SLA: ${c.slaMedioMinutos} min &middot; Faixa de ônibus 100% liberada &middot; Voucher QR Code</td>
        </tr>
      `).join('')}
      <tr>
        <td><strong>Shuttles Circulares</strong></td>
        <td>${plano.orquestracaoShuttles.empresaResponsavel}</td>
        <td><strong>${plano.orquestracaoShuttles.veiculosAlocados.onibusExecutivos46Lugares} Ônibus (46p) + ${plano.orquestracaoShuttles.veiculosAlocados.vansExecutivas15Lugares} Vans (15p)</strong></td>
        <td>Giros nos horários de pico (07h30-09h30 e 17h30-19h30) com telemetria GPS.</td>
      </tr>
      <tr>
        <td><strong>Logística Aérea</strong></td>
        <td>${plano.hubLogistico.gestaoAerea.tmcParceira} (Hub: ${plano.hubLogistico.aeroportoPrincipal})</td>
        <td><strong>${plano.hubLogistico.gestaoAerea.passagensEstimadas} bilhetes emitidos</strong></td>
        <td>Tarifa corporativa de grupo, Best Fare, franquia 23kg inclusa e plantão 24/7.</td>
      </tr>
      <tr>
        <td><strong>Gastronomia Corporativa</strong></td>
        <td>${plano.orquestracaoGastronomia.restaurantePrincipal}</td>
        <td><strong>${plano.orquestracaoGastronomia.totalJantaresPlanejados} Jantares p/ ${participantes} pax</strong></td>
        <td>Salas privativas com infraestrutura AV para networking e encerramento.</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">3. Auditoria Financeira de Saving (Mercado Balcão vs. MICE)</div>
  <table>
    <thead>
      <tr>
        <th>Modalidade de Custo</th>
        <th>Tarifa Balcão Pico (Sem Acordo)</th>
        <th>Tarifa Homologada MICE</th>
        <th style="text-align: right;">Saving Gerado</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Hospedagem (${hotelTop.nome})</strong></td>
        <td>R$ ${saving.demonstrativo.hotelaria.tarifaBalcao.toFixed(2)} / diária</td>
        <td><strong>R$ ${saving.demonstrativo.hotelaria.tarifaMICE.toFixed(2)} / diária</strong></td>
        <td style="text-align: right; font-weight: 700; color: #047857;">R$ ${saving.demonstrativo.hotelaria.savingHotelReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr>
        <td><strong>Mobilidade Integrada (Shuttles + Táxi)</strong></td>
        <td>R$ ${saving.demonstrativo.mobilidade.tarifaAvulsaMercado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td><strong>R$ ${saving.demonstrativo.mobilidade.tarifaHomologadaMICE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
        <td style="text-align: right; font-weight: 700; color: #047857;">R$ ${saving.demonstrativo.mobilidade.savingMobilidadeReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr style="background: #f8fafc; font-weight: 800;">
        <td><strong>TOTAL CONSOLIDADO</strong></td>
        <td>R$ ${saving.custoSemAcordoMercado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td>R$ ${saving.custoComAcordoMICE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-size: 13px; color: #047857;">R$ ${saving.savingTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${saving.savingPercentual}%)</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">3. Grade Técnica de Fornecedores Homologados</div>
  <table>
    <thead>
      <tr>
        <th>Fornecedor Homologado</th>
        <th>Modalidade</th>
        <th>Aderência</th>
        <th>Especificação Operacional</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${hotelTop.nome}</strong></td>
        <td>Hotelaria Corporativa</td>
        <td><span class="badge-pill badge-slate">${hotelTop.fitScore}% FIT</span></td>
        <td>${hotelTop.justificativa}</td>
      </tr>
      <tr>
        <td><strong>${vanTop.nome}</strong></td>
        <td>Transfers / Vans</td>
        <td><span class="badge-pill badge-slate">${vanTop.fitScore}% FIT</span></td>
        <td>${vanTop.justificativa}</td>
      </tr>
      <tr>
        <td><strong>${taxiTop.nome}</strong></td>
        <td>Mobilidade Táxi</td>
        <td><span class="badge-pill badge-slate">${taxiTop.fitScore}% FIT</span></td>
        <td>${taxiTop.justificativa}</td>
      </tr>
      <tr>
        <td><strong>${tmcTop.nome}</strong></td>
        <td>Emissão Aérea (TMC)</td>
        <td><span class="badge-pill badge-slate">${tmcTop.fitScore}% FIT</span></td>
        <td>${tmcTop.justificativa}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">4. Governança, Proteção Room Block Shield & Diretrizes Contratuais</div>
  <ul style="font-size: 11px; color: #334155; padding-left: 18px; margin: 4px 0;">
    <li><strong>Room Block Shield (Sem Multa de Attrition):</strong> Liberação integral sem ônus até D-60 e flexibilidade de até 50% dos quartos até D-30 com redistribuição automatizada de excedentes.</li>
    <li><strong>Faturamento Direto Consolidado:</strong> Conciliação via voucher digital e faturamento direto com NF única e centro de custo discriminado.</li>
    <li><strong>Corredores Expressos de SP:</strong> Deslocamento com trânsito autorizado nas faixas exclusivas de ônibus de SP (Cooper Chame Táxi), reduzindo o tempo de percurso em até 40%.</li>
    <li><strong>Plantão Duty of Care 24/7:</strong> Coordenador dedicado para contingências de malha aérea e monitoramento de trânsito em tempo real.</li>
  </ul>

  <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 14px; display: flex; justify-content: space-between; font-size: 10.5px; color: #64748b;">
    <div>
      <div>___________________________________________________</div>
      <div style="font-weight: bold; color: #0f172a; margin-top: 3px;">MICE Demand Intelligence & Orchestration</div>
      <div>Coordenação de Operações Corporativas SP</div>
    </div>
    <div style="text-align: right;" id="area-assinatura-cliente">
      <div>___________________________________________________</div>
      <div style="font-weight: bold; color: #0f172a; margin-top: 3px;">De Acordo &middot; ${evento.empresa_organizadora}</div>
      <div id="status-aceite-texto">Pendente de assinatura digital</div>
    </div>
  </div>

  <script>
    async function registrarAceiteDigital() {
      const nome = prompt("Digite o nome completo do responsável para assinatura digital:", "${decisorPrincipal.nome}");
      if (!nome) return;
      const cargo = prompt("Digite o cargo do responsável:", "${decisorPrincipal.cargo}");
      
      try {
        const res = await fetch("/api/proposta/${evento.id}/aceite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            responsavel: nome,
            cargo: cargo || "Gestão Corporativa",
            participantes: ${participantes},
            pacoteSelecionado: "Pacote Executivo Corporativo"
          })
        });
        const data = await res.json();
        alert("✅ Proposta aceita e registrada com sucesso no CRM MICE Intelligence!");
        document.getElementById("status-aceite-texto").innerHTML = "<strong style='color:#047857;'>✓ Aprovado digitalmente por " + nome + " em " + new Date().toLocaleDateString('pt-BR') + "</strong>";
      } catch (err) {
        alert("Erro ao registrar aceite: " + err.message);
      }
    }
  </script>

</body>
</html>`;
}

module.exports = {
  gerarPropostaExecutivaHTML
};

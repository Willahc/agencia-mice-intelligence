/**
 * GERADOR DO DOSSIÊ GERAL EXECUTIVO (MICE DEMAND INTELLIGENCE SP)
 * Produz o documento HTML profissional pronto para impressão e conversão direta em PDF.
 */

const { listarEventos } = require('./radarCollector');
const { listarFornecedores } = require('./supplierManager');
const { obterEstatisticasPreditivas } = require('../engine/predictiveEngine');
const { obterLogisticaMobilidadePolos } = require('./mobilityLogistics');
const { calcularMetricasCRM } = require('./dealPipeline');
const { processRadarPipeline } = require('../engine/miceEngine');

function gerarDossieGeralHTML() {
  const eventos = listarEventos();
  const fornecedores = listarFornecedores();
  const preditivo2027 = obterEstatisticasPreditivas(2027);
  const logistica = obterLogisticaMobilidadePolos();
  const crm = calcularMetricasCRM();
  const pipeline = processRadarPipeline();

  let totalPublico = 0;
  let totalRoomNights = 0;
  eventos.forEach(e => {
    totalPublico += e.publico_total_estimado || 0;
    const dem = e.demanda_estimada || {};
    totalRoomNights += dem.room_nights_estimados || Math.round((e.publico_total_estimado * 0.55) * e.dias_duracao);
  });

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Dossiê Geral MICE Demand Intelligence SP</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 12mm 12mm 12mm 12mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      line-height: 1.45;
      font-size: 10pt;
      margin: 0;
      padding: 0;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .no-break, tr, .highlight-box, .cover-kpi-card {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Capa Executiva */
    .cover-container {
      min-height: 235mm;
      max-height: 245mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 2px solid #0f172a;
      padding: 35px;
      background: #f8fafc;
      page-break-after: always;
      break-after: page;
    }

    .cover-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
    }

    .cover-badge {
      display: inline-block;
      background-color: #0f172a;
      color: #ffffff;
      font-size: 8.5pt;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      margin: 0 0 10px 0;
    }

    .cover-subtitle {
      font-size: 13pt;
      color: #475569;
      margin: 0;
      font-weight: 400;
    }

    .cover-kpis {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin: 30px 0;
    }

    .cover-kpi-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 15px;
      border-radius: 6px;
    }

    .cover-kpi-val {
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
    }

    .cover-kpi-lbl {
      font-size: 8.5pt;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      margin-top: 4px;
    }

    .cover-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 9.5pt;
      color: #475569;
    }

    /* Estrutura de Seções */
    h2.section-title {
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6px;
      margin-top: 30px;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    h3.subsection-title {
      font-size: 12pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 20px;
      margin-bottom: 10px;
      border-left: 4px solid #0f172a;
      padding-left: 8px;
    }

    p {
      margin: 0 0 10px 0;
      color: #334155;
      text-align: justify;
      font-size: 10pt;
    }

    .highlight-box {
      background-color: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #0f172a;
      padding: 12px 15px;
      border-radius: 4px;
      margin: 15px 0;
      font-size: 9.5pt;
    }

    /* Tabelas */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 8.5pt;
    }

    table.data-table th {
      background-color: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 7px 8px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 7.5pt;
      letter-spacing: 0.5px;
    }

    table.data-table td {
      padding: 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    table.data-table tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 7.5pt;
      font-weight: 700;
      border-radius: 3px;
      text-transform: uppercase;
    }

    .badge-dark { background-color: #0f172a; color: #ffffff; }
    .badge-gray { background-color: #e2e8f0; color: #334155; }
    .badge-green { background-color: #065f46; color: #ffffff; }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 15px 0;
    }

    .card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px;
      font-size: 9pt;
    }

    .card-title {
    .no-print {
      display: block;
    }

    @media print {
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <!-- Barra de Ações Rápidas (Apenas Visualização Web, oculta na impressão) -->
  <div class="no-print" style="position: sticky; top: 0; z-index: 999; background: #0b0f19; color: #f8fafc; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; font-family: 'Inter', sans-serif;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-weight: 800; font-size: 13px; color: #ffffff;">📄 Dossiê Geral Executivo MICE SP</span>
      <span style="color: #64748b; font-size: 12px;">(Pronto para Impressão e PDF Oficial)</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
        🖨️ Salvar como PDF / Imprimir
      </button>
      <button onclick="window.close()" style="background: #1e293b; color: #cbd5e1; border: 1px solid #334155; padding: 8px 14px; border-radius: 8px; font-weight: 600; font-size: 12px; cursor: pointer;">
        Fechar
      </button>
    </div>
  </div>

  <!-- ================= CAPA ================= -->
  <div class="cover-container">
    <div>
      <div class="cover-header">
        <span class="cover-badge">Documento Oficial &middot; Dossiê de Inteligência MICE</span>
        <h1 class="cover-title">MICE Demand Intelligence & Orquestração Corporativa</h1>
        <p class="cover-subtitle">Mapeamento Exaustivo de Eventos, Rede Homologada de Fornecedores, Inteligência Preditiva de Recorrência e Logística em São Paulo</p>
      </div>

      <div class="cover-kpis">
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">${eventos.length} Megaeventos</div>
          <div class="cover-kpi-lbl">Monitorados em SP 2026</div>
        </div>
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">${(totalPublico / 1000).toFixed(0)}k Pax</div>
          <div class="cover-kpi-lbl">Volume de Participantes</div>
        </div>
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">${(totalRoomNights / 1000).toFixed(0)}k Diárias</div>
          <div class="cover-kpi-lbl">Demanda Room Nights</div>
        </div>
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">${preditivo2027.taxaMediaRecorrenciaPct}%</div>
          <div class="cover-kpi-lbl">Taxa Média Recorrência</div>
        </div>
      </div>

      <div class="highlight-box">
        <strong>Tese de Negócio & Posicionamento Asset-Light:</strong><br>
        Estruturação de um ecossistema inteligente de viagens e eventos corporativos sem ativos físicos pesados. Substituição do modelo tradicional de agência interna (39 posições CLT do Sírio-Libanês) por uma operação conectada de inteligência preditiva, capturando margens líquidas de 10% a 12% em hotelaria, 8.5% na Cooper Chame Táxi e 45% nos fees de emissão da Copastur.
      </div>
    </div>

    <div class="cover-footer">
      <div>
        <strong>Coordenação Geral:</strong> Gestão de Inteligência & Operações MICE (Gisele & Equipe)<br>
        <strong>Praça de Atuação:</strong> Região Metropolitana de São Paulo (Polos Sul, Marginal, Berrini, Norte e Paulista)
      </div>
      <div style="text-align: right;">
        <strong>Data de Emissão:</strong> 20 de Agosto de 2026<br>
        <strong>Ciclo Analítico:</strong> 2026 / 2027 / 2028
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ================= SEÇÃO 1: TESE DO MODELO DE NEGÓCIOS ================= -->
  <h2 class="section-title">1. Tese do Modelo de Negócios MICE & Operação Asset-Light</h2>
  
  <p>O mercado de viagens, incentivos, congressos e exposições (MICE) em São Paulo é o maior da América Latina, movimentando bilhões de reais anualmente. O modelo tradicional adotado por grandes corporações e hospitais (como demonstrado no edital do Hospital Sírio-Libanês) incorre em custos operacionais excessivos com 39 posições de trabalho dedicadas (emissões, consultoria de eventos, plantão de crises e supervisão presencial).</p>

  <p>Nossa plataforma inverte essa lógica através de uma <strong>arquitetura orientada a dados e inteligência preditiva</strong>:</p>

  <div class="grid-2 no-break">
    <div class="card">
      <div class="card-title">❌ Modelo Tradicional (Passivo & Pesado)</div>
      <ul style="padding-left: 15px; margin: 0; font-size: 8.5pt; color: #475569;">
        <li>Espera passiva pela abertura de RFPs e cotações (D-30).</li>
        <li>Compra em momentos de pico com tarifas inflacionadas.</li>
        <li>Alto custo fixo com equipe interna de atendimento.</li>
        <li>Processo manual e descentralizado de reembolsos.</li>
      </ul>
    </div>
    <div class="card" style="border-left: 4px solid #0f172a;">
      <div class="card-title">✅ Modelo MICE Intelligence (Ativo & Asset-Light)</div>
      <ul style="padding-left: 15px; margin: 0; font-size: 8.5pt; color: #0f172a;">
        <li><strong>Antecipação Preditiva (D-180):</strong> Abordagem antes da concorrência.</li>
        <li><strong>Saving Médio de 22.5%:</strong> Bloqueios prévios de tarifas de baixa temporada.</li>
        <li><strong>Faturamento Direto:</strong> Conciliação via voucher digital e NF única.</li>
        <li><strong>Margem Garantida:</strong> Repasses automáticos da rede homologada.</li>
      </ul>
    </div>
  </div>

  <h3 class="subsection-title">Matriz de Receitas & Monetização da Gisele</h3>
  <table class="data-table no-break">
    <thead>
      <tr>
        <th>Modalidade / Fornecedor</th>
        <th>Modelo de Governança B2B</th>
        <th>Percentual / Fee Acordado</th>
        <th>Média de Retorno p/ Evento (100 pax)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Hotelaria Credenciada</strong><br>(Grand Hyatt, Hilton, Transamerica, Bourbon)</td>
        <td>Tarifário corporativo MICE com faturamento pós-pago e room block garantido.</td>
        <td><strong>10.0% a 12.0%</strong> sobre o faturamento total de diárias</td>
        <td>R$ 17.500,00 a R$ 32.000,00</td>
      </tr>
      <tr>
        <td><strong>Cooper Chame Táxi SP</strong><br>(Base de 125 sedans + Rede Federada)</td>
        <td>Voucher digital corporativo via portal online, eliminando reembolsos de corrida.</td>
        <td><strong>8.5%</strong> de comissão sobre o volume faturado</td>
        <td>R$ 3.800,00 a R$ 6.500,00</td>
      </tr>
      <tr>
        <td><strong>Copastur Viagens e Turismo</strong><br>(TMC Corporativa IATA Global)</td>
        <td>Emissão aérea em lote, acordos BSP e OBT integrado (SAP Concur / ArgoIT).</td>
        <td><strong>45.0%</strong> de repasse sobre os Transaction Fees</td>
        <td>R$ 2.500,00 a R$ 5.000,00</td>
      </tr>
      <tr>
        <td><strong>Vans & Fretamento</strong><br>(Urubupungá / VIP Transfer)</td>
        <td>Shuttles circulares hotel-evento e traslados receptivos aeroportuários.</td>
        <td><strong>9.0% a 10.0%</strong> sobre diárias de veículos e micro-ônibus</td>
        <td>R$ 2.800,00 a R$ 5.500,00</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ================= SEÇÃO 2: RADAR DE EVENTOS 2026 ================= -->
  <h2 class="section-title">2. Calendário Completo de Megaeventos Corporativos em SP (2026)</h2>
  
  <p>Mapeamento exaustivo de 17 megaeventos confirmados na Região Metropolitana de São Paulo, cobrindo todos os pavilhões e centros de convenções de classe internacional.</p>

  <table class="data-table no-break">
    <thead>
      <tr>
        <th>Tier / Score</th>
        <th>Evento & Segmento</th>
        <th>Local / Pavilhão</th>
        <th>Datas (2026)</th>
        <th style="text-align: right;">Público</th>
        <th style="text-align: right;">Room Nights</th>
        <th style="text-align: right;">Budget MICE Estimado</th>
      </tr>
    </thead>
    <tbody>
      ${eventos.map(e => {
        const item = pipeline.find(p => p.evento.id === e.id) || { scoreOportunidade: { scoreTotal: 90, tier: 'TIER 1' } };
        const hospedes = Math.round((e.publico_total_estimado || 20000) * 0.55);
        const rn = hospedes * (e.dias_duracao || 3);
        const budget = e.budget_alvo_estimado || (rn * 450);
        return `
          <tr>
            <td><span class="badge ${item.scoreOportunidade.scoreTotal >= 90 ? 'badge-dark' : 'badge-gray'}">${item.scoreOportunidade.scoreTotal} &middot; ${item.scoreOportunidade.tier}</span></td>
            <td><strong>${e.nome}</strong><br><span style="font-size: 7.5pt; color: #64748b;">${e.segmento}</span></td>
            <td>${e.local_evento.replace(/_/g, ' ').toUpperCase()}</td>
            <td>${e.data_inicio} (${e.dias_duracao}d)</td>
            <td style="text-align: right; font-weight: 600;">${(e.publico_total_estimado || 0).toLocaleString('pt-BR')}</td>
            <td style="text-align: right; font-weight: 600;">${rn.toLocaleString('pt-BR')}</td>
            <td style="text-align: right; font-weight: 700;">R$ ${(budget).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ================= SEÇÃO 3: MOTOR PREDITIVO DE RECORRÊNCIA ================= -->
  <h2 class="section-title">3. Inteligência Preditiva de Recorrência & Antecipação Pré-RFP (Ciclo 2027)</h2>

  <p>Mais de 85% dos grandes eventos corporativos de São Paulo ocorrem em ciclos anuais contínuos. O motor preditivo calcula a probabilidade matemática ponderada de realização da próxima edição e projeta o crescimento de demanda via taxa composta (CAGR), acionando o cronograma de abordagem antes do mercado.</p>

  <div class="highlight-box no-break">
    <strong>Fórmula de Ponderação Matemática de Probabilidade:</strong><br>
    <code>Score = (Assiduidade Histórica &times; 35%) + (Estabilidade da Organizadora &times; 25%) + (Relevância Setorial &times; 25%) + (Regularidade de Pavilhão &times; 15%)</code>
  </div>

  <table class="data-table no-break">
    <thead>
      <tr>
        <th>Probabilidade</th>
        <th>Edição Prevista (2027)</th>
        <th>Mês / Pavilhão</th>
        <th style="text-align: right;">Público Projetado</th>
        <th style="text-align: right;">Demanda Room Nights</th>
        <th>Janela Ideal de Contato</th>
        <th>Comissão Projetada</th>
      </tr>
    </thead>
    <tbody>
      ${preditivo2027.eventos.map(evt => `
        <tr>
          <td><span class="badge badge-green">${evt.probabilidadeRecorrencia}% &middot; TIER 1</span></td>
          <td><strong>${evt.nomeEdicaoProjetada}</strong><br><span style="font-size: 7.5pt; color: #64748b;">${evt.segmento}</span></td>
          <td>${evt.dataInicioEstimada} (${evt.localProvavel.toUpperCase()})</td>
          <td style="text-align: right; font-weight: 600;">${evt.demandaProjetada.publicoTotal.toLocaleString('pt-BR')} pax</td>
          <td style="text-align: right; font-weight: 600;">${evt.demandaProjetada.roomNights.toLocaleString('pt-BR')} qts</td>
          <td><span class="badge badge-dark">D-${evt.personasDecisorasMapeadas[0]?.janelaAntecedenciaDias || 180} DIAS</span></td>
          <td style="text-align: right; font-weight: 700; color: #065f46;">R$ ${evt.comissaoEstimadaGisele.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h3 class="subsection-title">Cronograma Reverso de Abordagem Pré-RFP</h3>
  <div class="grid-2 no-break">
    <div class="card">
      <div class="card-title">📅 D-180: Bloqueio Hoteleiro Preventivo</div>
      <p style="font-size: 8.5pt;">Contato com as diretorias comerciais do Grand Hyatt, Hilton, Bourbon e Holiday Inn para travar bloqueios de 100 a 300 quartos com tarifa corporativa de baixa temporada (saving de ~22.5%).</p>
    </div>
    <div class="card">
      <div class="card-title">🤝 D-150: Abordagem de Compras Indiretas</div>
      <p style="font-size: 8.5pt;">Apresentação do dossiê de viabilidade com 3 cenários orçamentários diretamente ao Head de Procurement e Comitê Médico, antes da abertura formal de concorrência.</p>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ================= SEÇÃO 4: REDE DE FORNECEDORES & MOBILIDADE ================= -->
  <h2 class="section-title">4. Rede Homologada de Fornecedores & Logística de Mobilidade</h2>

  <p>A inteligência da operação reside na parceria estratégica com os fornecedores mais consolidados de São Paulo, garantindo capacidade operacional real, SLAs rigorosos e conformidade fiscal.</p>

  <h3 class="subsection-title">1. Cooper Chame Táxi São Paulo (Mobilidade Corporativa) &middot; TAX-003</h3>
  <p><strong>Histórico & Estrutura:</strong> Fundada em 1988, conta com base ativa direta de <strong>125 veículos sedans/utilitários</strong> monitorados 24h por GPS/GPRS. Possui convênio federado de despacho com cooperativas parceiras (Use Táxi, Coopertax e Rádio Táxi SP), ampliando a capacidade de pico para <strong>mais de 800 veículos</strong>.</p>
  <div class="highlight-box no-break">
    <strong>Diferenciais Competitivos Chame Táxi:</strong>
    <ul style="margin: 5px 0 0 0; padding-left: 15px; font-size: 8.5pt;">
      <li><strong>Faixas e Corredores de Ônibus de SP:</strong> Trânsito livre exclusivo, reduzindo o tempo de deslocamento em até 40% em horários de pico.</li>
      <li><strong>Portal Corporativo 100% Online:</strong> Eliminação de reembolsos manuais, rateio por centro de custo e faturamento quinzenal com NF única.</li>
      <li><strong>Repasse Homologado:</strong> 8.5% sobre o faturamento total das contas intermediadas.</li>
    </ul>
  </div>

  <h3 class="subsection-title">2. Copastur Viagens e Turismo (TMC Corporativa & MICE) &middot; TMC-002</h3>
  <p><strong>Histórico & Estrutura:</strong> Fundada em 1972 (54 anos de liderança de mercado), uma das maiores TMCs do Brasil. Credenciamento IATA Global, acordos BSP consolidados com todas as companhias aéreas e plataforma OBT integrada com SAP Concur, ArgoIT e Reserve. Divisão especializada em bloqueios de assentos para congressos médicos e plantão de crise 24/7. Repasse de <strong>45% dos transaction fees</strong> para a rede da Gisele.</p>

  <h3 class="subsection-title">3. Matriz de Posicionamento & Bolsões Estratégicos nos 4 Polos de SP</h3>
  <table class="data-table no-break">
    <thead>
      <tr>
        <th>Polo / Pavilhão</th>
        <th>Hotéis de Raio Próximo (< 6 km)</th>
        <th>Bolsão Estratégico Chame Táxi</th>
        <th>SLA Chegada</th>
        <th>Corredor Expresso Liberado</th>
      </tr>
    </thead>
    <tbody>
      ${logistica.map(p => `
        <tr>
          <td><strong>${p.nome}</strong></td>
          <td>${p.hoteisProximos.map(h => `${h.nome} (${h.distanciaKm}km)`).join('<br>')}</td>
          <td><strong>${p.bolsoesTaxiEstrategicos[0]?.nomeBolsao}</strong><br><span style="font-size: 7.5pt; color: #64748b;">${p.bolsoesTaxiEstrategicos[0]?.capacidadeEstocagem}</span></td>
          <td><strong>${p.bolsoesTaxiEstrategicos[0]?.tempoMedioRespostaMin} min</strong></td>
          <td>${p.corredoresExpressosAutorizados[0]}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ================= SEÇÃO 5: CPQ, PROPOSTAS & CRM ================= -->
  <h2 class="section-title">5. Motor de CPQ (Configure, Price, Quote) & Pipeline Comercial (CRM)</h2>

  <p>Para cada evento identificado, o motor de CPQ gera instantaneamente 3 cenários orçamentários balanceados, calculando o investimento total do cliente corporativo e a margem de comissionamento da Gisele.</p>

  <h3 class="subsection-title">Estrutura dos 3 Pacotes CPQ</h3>
  <div class="grid-2 no-break">
    <div class="card">
      <div class="card-title">🥉 Standard Corporativo (Foco Custo-Benefício)</div>
      <p style="font-size: 8.5pt;">Hotelaria 3 estrelas funcional (Ibis / Plaza Sul) + Shuttles circulares de van em horários fixos. Ideal para delegações técnicas, equipes operacionais e montadores de stands.</p>
    </div>
    <div class="card" style="border: 2px solid #0f172a;">
      <div class="card-title">⭐ Executivo Premium (Recomendado)</div>
      <p style="font-size: 8.5pt;">Hotelaria 4 estrelas superior (Bourbon Ibirapuera / Transamerica Berrini / Holiday Inn) + Shuttles contínuos com Wi-Fi + Vouchers corporativos Chame Táxi. Ideal para executivos e congressistas.</p>
    </div>
  </div>

  <div class="card no-break" style="margin-top: 10px;">
    <div class="card-title">👑 Full Experience VIP (C-Level & Médicos Especialistas)</div>
    <p style="font-size: 8.5pt;">Hotelaria 5 estrelas luxo (Grand Hyatt / Hilton / Sheraton WTC / Renaissance) + Traslados privativos dedicados com motorista bilíngue + Emissão aérea flexível Copastur + Jantares executivos privativos no Fogo de Chão.</p>
  </div>

  <h3 class="subsection-title">Visão Consolidada do Pipeline Comercial (CRM Kanban)</h3>
  <div class="cover-kpis no-break">
    <div class="cover-kpi-card">
      <div class="cover-kpi-val">R$ ${(crm.totalVolumeGeral / 1000000).toFixed(2)}M</div>
      <div class="cover-kpi-lbl">Volume Geral Mapeado</div>
    </div>
    <div class="cover-kpi-card">
      <div class="cover-kpi-val">R$ ${(crm.totalReceitaPrevista / 1000).toFixed(0)}k</div>
      <div class="cover-kpi-lbl">Receita Prevista Gisele</div>
    </div>
    <div class="cover-kpi-card">
      <div class="cover-kpi-val">R$ ${(crm.pipelinePonderado / 1000).toFixed(0)}k</div>
      <div class="cover-kpi-lbl">Pipeline Ponderado</div>
    </div>
    <div class="cover-kpi-card">
      <div class="cover-kpi-val">${crm.totalDeals} Negócios</div>
      <div class="cover-kpi-lbl">Oportunidades em Funil</div>
    </div>
  </div>

  <div style="margin-top: 40px; border-top: 2px solid #0f172a; padding-top: 15px; font-size: 8.5pt; color: #64748b; text-align: center;">
    <strong>MICE Demand Intelligence Platform</strong> &middot; Desenvolvido para Gestão de Demanda Corporativa & Orquestração de Viagens em São Paulo.<br>
    Documento confidencial gerado pelo sistema integrado.
  </div>

</body>
</html>`;
}

module.exports = {
  gerarDossieGeralHTML
};

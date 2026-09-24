// ================================================================
// MICE Demand Intelligence & Orquestração Corporativa SP
// Frontend Application Logic
// ================================================================

// Estado global da aplicação
let pipelineState = [];
let eventosFiltradosState = [];
let eventoAtivoIndex = 0;
let eventoSelecionadoDossie = null;
let participantesSimuladosDossie = 100;
let viewAtual = 'radar';
let dealsState = null;
let fornecedoresState = [];
let fornecedoresFiltradosState = [];
let fornecedorSelecionadoDossie = null;
let heatmapState = null;

// Estado da Inteligência Preditiva & Logística
let preditivoState = null;
let preditivosFiltradosState = [];
let anoPreditivoSelecionado = 2027;
let eventoPreditivoSelecionado = null;
let logisticaPolosState = [];
let segmentoPillAtivo = 'todos';

// Estado da Sidebar Retrátil
let sidebarExpandidaState = true;
let sidebarMobileAbertaState = false;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  if (window.innerWidth < 768) {
    fecharSidebarMobile();
  }

  try {
    await carregarPipeline();
  } catch (e) {
    console.error('Erro em pipeline:', e);
  }

  try {
    await carregarDealsCRM();
  } catch (e) {
    console.error('Erro em deals:', e);
  }

  try {
    await carregarListaFornecedores();
  } catch (e) {
    console.error('Erro em fornecedores:', e);
  }

  try {
    await carregarMapaCalor();
  } catch (e) {
    console.error('Erro em heatmap:', e);
  }

  try {
    await carregarPreditivo(anoPreditivoSelecionado);
  } catch (e) {
    console.error('Erro em preditivo:', e);
  }

  try {
    await carregarLogisticaMobilidade();
  } catch (e) {
    console.error('Erro em logistica:', e);
  }

  lucide.createIcons();

  // Listener para atalho universal Ctrl + K / Cmd + K e Escape
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      abrirSpotlightSearch();
    }
    if (e.key === 'Escape') {
      fecharSpotlightSearch();
    }
  });
});

// Controle de Expansão / Recolhimento da Sidebar
function toggleSidebar() {
  sidebarExpandidaState = !sidebarExpandidaState;
  const sidebar = document.getElementById('main-sidebar');
  const header = document.getElementById('main-header');
  const wrapper = document.getElementById('main-wrapper');
  const textElements = document.querySelectorAll('.sidebar-text');
  const iconToggle = document.getElementById('icon-sidebar-toggle');

  if (sidebarExpandidaState) {
    sidebar.classList.remove('sidebar-collapsed');
    sidebar.classList.add('sidebar-expanded');
    if (header) { header.classList.remove('content-collapsed'); header.classList.add('content-expanded'); }
    if (wrapper) { wrapper.classList.remove('content-collapsed'); wrapper.classList.add('content-expanded'); }
    textElements.forEach(el => el.classList.remove('hidden'));
    if (iconToggle) iconToggle.setAttribute('data-lucide', 'panel-left-close');
  } else {
    sidebar.classList.remove('sidebar-expanded');
    sidebar.classList.add('sidebar-collapsed');
    if (header) { header.classList.remove('content-expanded'); header.classList.add('content-collapsed'); }
    if (wrapper) { wrapper.classList.remove('content-expanded'); wrapper.classList.add('content-collapsed'); }
    textElements.forEach(el => el.classList.add('hidden'));
    if (iconToggle) iconToggle.setAttribute('data-lucide', 'panel-left');
  }

  lucide.createIcons();
}

function toggleSidebarMobile() {
  sidebarMobileAbertaState = !sidebarMobileAbertaState;
  const sidebar = document.getElementById('main-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (sidebarMobileAbertaState) {
    sidebar.classList.remove('sidebar-collapsed');
    sidebar.classList.add('sidebar-expanded');
    backdrop.classList.remove('hidden');
  } else {
    sidebar.classList.remove('sidebar-expanded');
    sidebar.classList.add('sidebar-collapsed');
    backdrop.classList.add('hidden');
  }
}

function fecharSidebarMobile() {
  sidebarMobileAbertaState = false;
  const sidebar = document.getElementById('main-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  sidebar.classList.remove('sidebar-expanded');
  sidebar.classList.add('sidebar-collapsed');
  backdrop.classList.add('hidden');
}

// Navegação entre Views / Abas
function navegarParaView(view) {
  viewAtual = view;

  // Fechar sidebar mobile se aberta
  if (window.innerWidth < 768) {
    fecharSidebarMobile();
  }

  const todasViews = ['radar', 'detalhe-evento', 'heatmap', 'crm', 'preditivo', 'agents', 'fornecedores', 'detalhe-fornecedor', 'scraper', 'cadastrar-evento', 'busca-rapida'];

  todasViews.forEach(v => {
    const viewDiv = document.getElementById(`view-${v}`);
    if (viewDiv) {
      if (v === view) {
        viewDiv.classList.remove('hidden');
      } else {
        viewDiv.classList.add('hidden');
      }
    }
  });

  // Floating dock visibility
  const floatingDock = document.getElementById('floating-action-dock');
  if (floatingDock) {
    if (view === 'detalhe-evento') {
      floatingDock.classList.remove('hidden');
    } else {
      floatingDock.classList.add('hidden');
    }
  }

  // Atualizar título da topbar
  const titulos = {
    'radar': 'Radar de Oportunidades MICE SP',
    'detalhe-evento': 'Dossiê 360° & Propostas Parametrizadas',
    'heatmap': 'Mapa de Calor de Demanda SP',
    'crm': 'Pipeline Comercial CRM',
    'preditivo': 'Inteligência Preditiva & Recorrência SP',
    'agents': '🤖 Squad de Agentes de IA Autônomos MICE SP',
    'fornecedores': 'Rede de Fornecedores Homologados',
    'detalhe-fornecedor': 'Ficha Técnica do Parceiro Homologado',
    'scraper': 'Scanner MICE & Oportunidades em Staging',
    'cadastrar-evento': 'Cadastrar Novo Evento & Simulador CPQ 360°',
    'busca-rapida': 'Central de Busca Global & Inteligência MICE'
  };

  const topbarTitulo = document.getElementById('topbar-titulo-pagina');
  if (topbarTitulo && titulos[view]) {
    topbarTitulo.innerText = titulos[view];
  }

  // Atualizar itens de navegação na sidebar
  ['radar', 'heatmap', 'crm', 'preditivo', 'agents', 'fornecedores', 'scraper', 'cadastrar-evento', 'busca-rapida'].forEach(v => {
    const navBtn = document.getElementById(`nav-${v}`);
    if (navBtn) {
      const isAtivo = (v === view) || 
                      (v === 'radar' && view === 'detalhe-evento') || 
                      (v === 'fornecedores' && view === 'detalhe-fornecedor');
      if (isAtivo) {
        navBtn.className = 'w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl sidebar-item-active transition text-xs font-bold';
      } else {
        navBtn.className = 'w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl sidebar-item-inactive transition text-xs font-semibold';
      }
    }
  });

  if (view === 'heatmap') carregarMapaCalor();
  if (view === 'crm') carregarDealsCRM();
  if (view === 'preditivo') carregarPreditivo(anoPreditivoSelecionado);
  if (view === 'agents') carregarSquadAgentes();
  if (view === 'fornecedores') {
    carregarListaFornecedores();
    carregarLogisticaMobilidade();
  }
  if (view === 'scraper') {
    carregarDadosScraper();
  }
  if (view === 'cadastrar-evento') {
    iniciarPaginaCadastrarEvento();
  }
  if (view === 'busca-rapida') {
    iniciarPaginaBuscaGlobal();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  lucide.createIcons();
}

// ----------------------------------------------------------------
// 1. MÓDULO RADAR: TABELA COMPACTA COM FILTROS & BUSCA
// ----------------------------------------------------------------

async function carregarPipeline() {
  try {
    const res = await fetch('/api/pipeline');
    const data = await res.json();
    pipelineState = data.pipeline;
    eventosFiltradosState = [...pipelineState];
    atualizarKPIs();
    renderizarTabelaEventosCompacta();
  } catch (err) {
    console.error('Erro ao carregar pipeline:', err);
  }
}

function atualizarKPIs() {
  const totalEventos = pipelineState.length;
  let totalPublico = 0;
  let totalRoomNights = 0;

  pipelineState.forEach(item => {
    totalPublico += item.evento.publicoTotal || 0;
    const dem = item.evento.demandaEstimada || {};
    totalRoomNights += dem.room_nights_estimados || Math.round((item.evento.publicoTotal * 0.5) * item.evento.diasDuracao);
  });

  document.getElementById('kpi-total-eventos').innerText = totalEventos;
  document.getElementById('kpi-publico-total').innerText = totalPublico.toLocaleString('pt-BR');
  document.getElementById('kpi-room-nights').innerText = totalRoomNights.toLocaleString('pt-BR');
}

function aplicarFiltrosEventos() {
  const termoBusca = (document.getElementById('filtro-busca')?.value || '').toLowerCase().trim();
  const governancaFiltro = document.getElementById('filtro-governanca')?.value || 'todos';
  const categoriaFiltro = document.getElementById('filtro-categoria-frente')?.value || 'todos';
  const poloFiltro = document.getElementById('filtro-polo')?.value || 'todos';
  const janelaFiltro = document.getElementById('filtro-janela-critica')?.value || 'todos';

  eventosFiltradosState = pipelineState.filter(item => {
    const nome = (item.evento.nome || '').toLowerCase();
    const segmento = (item.evento.segmento || '').toLowerCase();
    const categoria = (item.evento.category || '').toLowerCase();
    const organizador = (item.evento.empresaOrganizadora || '').toLowerCase();
    const cidade = (item.evento.cidade || '').toLowerCase();
    const local = (item.evento.local || '').toLowerCase();
    const status = item.evento.statusGovernanca || 'CONFIRMADO';

    const matchBusca = !termoBusca || nome.includes(termoBusca) || segmento.includes(termoBusca) || organizador.includes(termoBusca) || cidade.includes(termoBusca);
    const matchGovernanca = governancaFiltro === 'todos' || status === governancaFiltro;

    let matchCategoria = true;
    if (categoriaFiltro !== 'todos') {
      if (categoriaFiltro === 'AGRONEGOCIO') matchCategoria = categoria.includes('agro') || segmento.includes('agro') || segmento.includes('agrícola') || segmento.includes('pecuária') || segmento.includes('bioenergia');
      if (categoriaFiltro === 'SAUDE') matchCategoria = categoria.includes('saude') || segmento.includes('saúde') || segmento.includes('médic') || segmento.includes('hospital') || segmento.includes('odonto') || segmento.includes('cardio');
      if (categoriaFiltro === 'ARENAS') matchCategoria = categoria.includes('arena') || segmento.includes('show') || segmento.includes('música') || segmento.includes('festival') || segmento.includes('fórmula') || segmento.includes('rodeio');
      if (categoriaFiltro === 'VAREJO_TECH') matchCategoria = categoria.includes('varejo') || categoria.includes('tecno') || segmento.includes('varejo') || segmento.includes('finan') || segmento.includes('banc') || segmento.includes('tech') || segmento.includes('supermercado');
      if (categoriaFiltro === 'RESORTS') matchCategoria = categoria.includes('convencoes') || segmento.includes('convenç') || segmento.includes('resort') || segmento.includes('kick-off') || local.includes('resort') || local.includes('royal');
    }

    const matchPolo = poloFiltro === 'todos' || item.evento.local === poloFiltro;

    let matchJanela = true;
    const dias = item.evento.diasAntecedencia !== undefined ? item.evento.diasAntecedencia : 120;
    if (janelaFiltro === 'D90') matchJanela = dias <= 90;
    if (janelaFiltro === 'D120') matchJanela = dias <= 120;
    if (janelaFiltro === 'D180') matchJanela = dias <= 180;

    let matchSegmentoPill = true;
    if (segmentoPillAtivo === 'shows') {
      matchSegmentoPill = segmento.includes('show') || segmento.includes('música') || segmento.includes('festival') || segmento.includes('arena') || segmento.includes('estádio') || nome.includes('show') || nome.includes('lollapalooza') || nome.includes('allianz') || nome.includes('morumbi') || nome.includes('barretos') || nome.includes('joão rock');
    } else if (segmentoPillAtivo === 'agro') {
      matchSegmentoPill = segmento.includes('agro') || segmento.includes('agrícola') || segmento.includes('pecuária') || segmento.includes('grãos') || segmento.includes('sucroalcooleiro') || segmento.includes('horticultura');
    } else if (segmentoPillAtivo === 'saude') {
      matchSegmentoPill = segmento.includes('saúde') || segmento.includes('médic') || segmento.includes('hospital') || segmento.includes('farma') || segmento.includes('cardio') || segmento.includes('ortopedia');
    } else if (segmentoPillAtivo === 'tech') {
      matchSegmentoPill = segmento.includes('tech') || segmento.includes('tecnologia') || segmento.includes('finanças') || segmento.includes('software') || segmento.includes('banc') || segmento.includes('inovação');
    } else if (segmentoPillAtivo === 'logistica') {
      matchSegmentoPill = segmento.includes('logística') || segmento.includes('porto') || segmento.includes('transporte') || segmento.includes('comex') || segmento.includes('indústria');
    } else if (segmentoPillAtivo === 'varejo') {
      matchSegmentoPill = segmento.includes('varejo') || segmento.includes('supermercado') || segmento.includes('aliment') || segmento.includes('franquia') || segmento.includes('consumo') || segmento.includes('beleza') || segmento.includes('moda');
    }

    return matchBusca && matchGovernanca && matchCategoria && matchPolo && matchJanela && matchSegmentoPill;
  });

  renderizarTabelaEventosCompacta();
}

function filtrarPorSegmentoPill(segmento) {
  segmentoPillAtivo = segmento;
  
  const pills = ['todos', 'shows', 'agro', 'saude', 'tech', 'logistica', 'varejo'];
  pills.forEach(p => {
    const btn = document.getElementById(`pill-seg-${p}`);
    if (btn) {
      if (p === segmento) {
        btn.className = 'pill-seg px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-xs transition';
      } else {
        btn.className = 'pill-seg px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-800 hover:text-white border border-slate-800 transition';
      }
    }
  });

  aplicarFiltrosEventos();
}

// ================================================================
// PÁGINA DEDICADA: CADASTRAR EVENTO & SIMULADOR CPQ 360°
// ================================================================

function iniciarPaginaCadastrarEvento() {
  atualizarSimuladorLive();
}

function atualizarSimuladorLive() {
  const publico = parseInt(document.getElementById('page-sim-publico')?.value) || 2500;
  const pctFora = parseInt(document.getElementById('page-sim-pct-fora')?.value) || 60;
  const duracao = parseInt(document.getElementById('page-sim-duracao')?.value) || 3;
  const padraoHotel = document.getElementById('page-sim-padrao-hotel')?.value || 'executivo_4estrelas';

  const delegacao = Math.round(publico * (pctFora / 100));
  const roomNights = Math.round(delegacao * duracao);
  const vans = Math.max(2, Math.ceil(delegacao / 120));
  const onibus = Math.max(1, Math.ceil(delegacao / 400));

  // Multiplicador de diária pelo padrão hoteleiro
  let multHotel = 1.0;
  if (padraoHotel === 'luxo_5estrelas') multHotel = 1.55;
  if (padraoHotel === 'economico_3estrelas') multHotel = 0.65;

  const precoEcon = Math.round(1150 * (duracao / 3) * multHotel);
  const precoExec = Math.round(1890 * (duracao / 3) * multHotel);
  const precoPrem = Math.round(2950 * (duracao / 3) * multHotel);

  const elRoomnights = document.getElementById('live-kpi-roomnights');
  const elDelegacao = document.getElementById('live-kpi-delegacao');
  const elFrota = document.getElementById('live-kpi-frota');
  const elSaving = document.getElementById('live-kpi-saving');
  const elCpqEcon = document.getElementById('live-cpq-economico');
  const elCpqExec = document.getElementById('live-cpq-executivo');
  const elCpqPrem = document.getElementById('live-cpq-premium');

  if (elRoomnights) elRoomnights.innerText = roomNights.toLocaleString('pt-BR');
  if (elDelegacao) elDelegacao.innerText = `${delegacao.toLocaleString('pt-BR')} pax`;
  if (elFrota) elFrota.innerText = `${vans} Vans + ${onibus} Ônibus`;
  if (elSaving) elSaving.innerText = `24.5% (D-180)`;
  if (elCpqEcon) elCpqEcon.innerText = `R$ ${precoEcon.toLocaleString('pt-BR')} / pax`;
  if (elCpqExec) elCpqExec.innerText = `R$ ${precoExec.toLocaleString('pt-BR')} / pax`;
  if (elCpqPrem) elCpqPrem.innerText = `R$ ${precoPrem.toLocaleString('pt-BR')} / pax`;
}

function resetarFormularioCadastro() {
  const form = document.getElementById('form-pagina-cadastrar-evento');
  if (form) form.reset();
  atualizarSimuladorLive();
}

async function submeterPaginaNovoEvento(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-cadastrar-submeter');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Processando Ingestão MICE...</span>`;
    lucide.createIcons();
  }

  const nome = document.getElementById('page-sim-nome').value.trim();
  const organizador = document.getElementById('page-sim-organizador').value.trim() || 'Organização Corporativa';
  const segmento = document.getElementById('page-sim-segmento').value;
  const local = document.getElementById('page-sim-local').value;
  const cidade = document.getElementById('page-sim-cidade').value.trim() || 'São Paulo';
  const publico = parseInt(document.getElementById('page-sim-publico').value) || 2500;
  const pctFora = parseInt(document.getElementById('page-sim-pct-fora').value) || 60;
  const duracao = parseInt(document.getElementById('page-sim-duracao').value) || 3;
  const dataInicio = document.getElementById('page-sim-data').value || '2026-09-15';

  const novoId = `EVT-2026-${String(pipelineState.length + 1).padStart(3, '0')}`;
  const roomNights = Math.round(publico * (pctFora / 100) * duracao);

  const novoItem = {
    evento: {
      id: novoId,
      nome,
      segmento,
      empresaOrganizadora: organizador,
      cidade,
      local,
      dataInicio,
      diasDuracao: duracao,
      publicoTotal: publico,
      percentualForaRegiao: pctFora,
      demandaEstimada: {
        room_nights_estimados: roomNights,
        participantes_hospedagem: Math.round(publico * (pctFora / 100))
      }
    },
    scoreOportunidade: {
      scoreTotal: 92,
      tier: 'TIER 1 (Alta Atratividade)',
      prioridadeAcao: 'IMEDIATA (D-180)'
    }
  };

  // Adiciona ao topo do pipeline
  pipelineState.unshift(novoItem);
  eventosFiltradosState = [...pipelineState];
  atualizarKPIs();
  renderizarTabelaEventosCompacta();

  // Feedback e redirecionamento direto para o Dossiê 360° do evento
  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-300"></i><span>Evento Inserido com Sucesso!</span>`;
      lucide.createIcons();
    }
    abrirDetalheEvento(novoId);
  }, 600);
}

// ================================================================
// PÁGINA DEDICADA: CENTRAL DE BUSCA GLOBAL (UNIVERSAL SEARCH)
// ================================================================

let categoriaBuscaPaginaAtiva = 'todos';

function abrirSpotlightSearch() {
  navegarParaView('busca-rapida');
}

function fecharSpotlightSearch() {
  // Mantido para compatibilidade se invocado
}

function iniciarPaginaBuscaGlobal() {
  const input = document.getElementById('input-busca-global-pagina');
  if (input) {
    input.focus();
    executarBuscaGlobalPagina(input.value);
  } else {
    executarBuscaGlobalPagina('');
  }
}

function filtrarCategoriaBuscaPagina(cat) {
  categoriaBuscaPaginaAtiva = cat;
  ['todos', 'eventos', 'shows', 'hoteis', 'taxis', 'agro'].forEach(c => {
    const chip = document.getElementById(`chip-busca-${c}`);
    if (chip) {
      if (c === cat) {
        chip.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white transition flex-shrink-0';
      } else {
        chip.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#080c14] hover:bg-slate-800 hover:text-white border border-slate-700 transition flex-shrink-0';
      }
    }
  });

  const query = document.getElementById('input-busca-global-pagina')?.value || '';
  executarBuscaGlobalPagina(query);
}

function limparBuscaGlobalPagina() {
  const input = document.getElementById('input-busca-global-pagina');
  if (input) {
    input.value = '';
    input.focus();
  }
  document.getElementById('btn-limpar-busca-global')?.classList.add('hidden');
  executarBuscaGlobalPagina('');
}

function executarBuscaGlobalPagina(query) {
  const container = document.getElementById('grid-resultados-busca-global');
  const contador = document.getElementById('contador-resultados-busca-global');
  const btnLimpar = document.getElementById('btn-limpar-busca-global');
  if (!container) return;

  const q = (query || '').toLowerCase().trim();
  if (btnLimpar) {
    if (q) btnLimpar.classList.remove('hidden');
    else btnLimpar.classList.add('hidden');
  }

  const todosEventos = pipelineState || [];
  const todosFornecedores = fornecedoresState || [];

  // Filtragem de Eventos
  let eventosFiltrados = todosEventos.filter(item => {
    const nome = (item.evento.nome || '').toLowerCase();
    const seg = (item.evento.segmento || '').toLowerCase();
    const loc = (item.evento.local || '').toLowerCase();
    const cid = (item.evento.cidade || '').toLowerCase();
    const org = (item.evento.empresaOrganizadora || '').toLowerCase();

    const matchTexto = !q || nome.includes(q) || seg.includes(q) || loc.includes(q) || cid.includes(q) || org.includes(q);
    if (!matchTexto) return false;

    if (categoriaBuscaPaginaAtiva === 'hoteis' || categoriaBuscaPaginaAtiva === 'taxis') return false;
    if (categoriaBuscaPaginaAtiva === 'shows') {
      return seg.includes('show') || seg.includes('música') || seg.includes('festival') || seg.includes('arena') || nome.includes('lollapalooza') || nome.includes('allianz') || nome.includes('morumbi') || nome.includes('barretos');
    }
    if (categoriaBuscaPaginaAtiva === 'agro') {
      return seg.includes('agro') || seg.includes('pecuária') || seg.includes('agrícola') || cid.includes('ribeirão') || cid.includes('barretos') || cid.includes('campinas');
    }
    if (categoriaBuscaPaginaAtiva === 'eventos') {
      return !seg.includes('show');
    }
    return true;
  });

  // Filtragem de Fornecedores
  let fornecedoresFiltrados = todosFornecedores.filter(f => {
    const nome = (f.nome || '').toLowerCase();
    const tipo = (f.tipo || '').toLowerCase();
    const bairro = (f.bairro || '').toLowerCase();
    const servicos = (f.servicos || []).join(' ').toLowerCase();

    const matchTexto = !q || nome.includes(q) || tipo.includes(q) || bairro.includes(q) || servicos.includes(q);
    if (!matchTexto) return false;

    if (categoriaBuscaPaginaAtiva === 'eventos' || categoriaBuscaPaginaAtiva === 'shows' || categoriaBuscaPaginaAtiva === 'agro') return false;
    if (categoriaBuscaPaginaAtiva === 'hoteis') return tipo === 'hotel';
    if (categoriaBuscaPaginaAtiva === 'taxis') return tipo === 'taxi' || tipo === 'fretamento';
    return true;
  });

  const totalGeral = eventosFiltrados.length + fornecedoresFiltrados.length;
  if (contador) {
    contador.innerHTML = `Exibindo <strong class="text-white">${totalGeral}</strong> resultado(s) encontrado(s)${q ? ` para "<strong>${query}</strong>"` : ''}`;
  }

  if (totalGeral === 0) {
    container.innerHTML = `
      <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-[#0f172a] border border-slate-800 rounded-2xl p-10 text-center space-y-3">
        <i data-lucide="search-x" class="w-10 h-10 text-slate-500 mx-auto"></i>
        <h4 class="text-sm font-bold text-white">Nenhum resultado encontrado</h4>
        <p class="text-xs text-slate-400">Tente buscar por termos mais amplos, nomes de cidades (Campinas, Ribeirão Preto, Santos) ou segmentos de mercado.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let html = '';

  // Renderizar Cards de Eventos
  eventosFiltrados.forEach(item => {
    const isShow = (item.evento.segmento || '').toLowerCase().includes('show') || (item.evento.nome || '').toLowerCase().includes('lollapalooza') || (item.evento.nome || '').toLowerCase().includes('allianz') || (item.evento.nome || '').toLowerCase().includes('barretos');
    const isAgro = (item.evento.segmento || '').toLowerCase().includes('agro') || (item.evento.cidade || '').toLowerCase().includes('ribeirão');

    html += `
      <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-sm hover:border-indigo-500/80 transition flex flex-col justify-between space-y-3 group">
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
              isShow ? 'bg-purple-950 text-purple-300 border border-purple-800' : 
              isAgro ? 'bg-amber-950 text-amber-300 border border-amber-800' : 
              'bg-indigo-950 text-indigo-300 border border-indigo-800'
            }">
              ${isShow ? '🎸 SHOW / ARENA' : isAgro ? '🌾 AGRO / INTERIOR' : '🏢 FEIRA / CONGRESSO'}
            </span>
            <span class="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Score ${item.scoreOportunidade.scoreTotal}/100
            </span>
          </div>

          <h4 class="font-bold text-sm text-white group-hover:text-indigo-300 transition leading-snug line-clamp-2">
            ${item.evento.nome}
          </h4>

          <div class="space-y-1 text-xs text-slate-400">
            <div class="flex items-center space-x-1.5 truncate">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-indigo-400 flex-shrink-0"></i>
              <span class="truncate">${item.evento.local || 'São Paulo'} &middot; <strong class="text-slate-300">${item.evento.cidade || 'SP'}</strong></span>
            </div>
            <div class="flex items-center space-x-1.5">
              <i data-lucide="users" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"></i>
              <span>${item.evento.publicoTotal ? item.evento.publicoTotal.toLocaleString('pt-BR') : '25.000'} pax &middot; <span class="text-indigo-300 font-semibold">${item.evento.demandaEstimada?.room_nights_estimados ? item.evento.demandaEstimada.room_nights_estimados.toLocaleString('pt-BR') : '8.500'} room nights</span></span>
            </div>
            <div class="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400 flex-shrink-0"></i>
              <span>Início: ${item.evento.dataInicio || '2026-10-01'} (${item.evento.diasDuracao || 3} dias)</span>
            </div>
          </div>
        </div>

        <div class="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button onclick="abrirModalDebriefingHistorico('${item.evento.id}')" class="px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-[11px] font-semibold transition inline-flex items-center space-x-1">
            <i data-lucide="history" class="w-3.5 h-3.5 text-indigo-400"></i>
            <span>Debriefing</span>
          </button>
          <button onclick="abrirDetalheEvento('${item.evento.id}')" class="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition shadow-xs inline-flex items-center space-x-1 ml-auto">
            <span>Abrir Dossiê 360°</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  });

  // Renderizar Cards de Fornecedores Homologados
  fornecedoresFiltrados.forEach(f => {
    const isHotel = f.tipo === 'hotel';
    const isTaxi = f.tipo === 'taxi';

    html += `
      <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/80 transition flex flex-col justify-between space-y-3 group">
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
              isHotel ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 
              isTaxi ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 
              'bg-amber-950 text-amber-300 border border-amber-800'
            }">
              ${isHotel ? '🏨 HOTEL HOMOLOGADO' : isTaxi ? '🚕 COOPERATIVA DE TÁXI' : '🚐 FRETAMENTO EXECUTIVO'}
            </span>
            <span class="text-[10px] font-mono text-emerald-400 font-bold">
              ${f.statusContrato || 'HOMOLOGADO'}
            </span>
          </div>

          <h4 class="font-bold text-sm text-white group-hover:text-emerald-300 transition leading-snug">
            ${f.nome}
          </h4>

          <div class="space-y-1 text-xs text-slate-400">
            <div class="flex items-center space-x-1.5 truncate">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"></i>
              <span>${f.bairro || 'São Paulo'} &middot; <strong class="text-slate-300">SP</strong></span>
            </div>
            <div class="flex items-center space-x-1.5">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-indigo-400 flex-shrink-0"></i>
              <span>${isHotel ? `Capacidade: ${f.capacidadeQuartos || 150} quartos` : `Frota: ${f.frotaDisponivel || 80} veículos (Faixa Ônibus)`}</span>
            </div>
            <div class="text-[11px] text-slate-400 line-clamp-1">
              Contato: ${f.contatoComercial?.nome || 'Central Corporativa'} &middot; ${f.contatoComercial?.email || 'mice@hotel.com.br'}
            </div>
          </div>
        </div>

        <div class="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button onclick="abrirDetalheFornecedor('${f.id}')" class="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-bold transition flex items-center justify-center space-x-1">
            <i data-lucide="file-badge" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span>Ver Ficha Técnica & Slates Homologados</span>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  lucide.createIcons();
}

function selecionarItemSpotlight(eventoId) {
  abrirDetalheEvento(eventoId);
}

function selecionarFornecedorSpotlight(fornecedorId) {
  abrirDetalheFornecedor(fornecedorId);
}

function renderizarTabelaEventosCompacta() {
  const corpo = document.getElementById('tabela-eventos-compacta-corpo');
  if (!corpo) return;
  corpo.innerHTML = '';

  const polosNomes = {
    'sp_expo': 'São Paulo Expo',
    'transamerica_expo': 'Transamerica Expo',
    'anhembi': 'Distrito Anhembi',
    'frei_caneca': 'Frei Caneca',
    'wds_wtc': 'WTC Berrini',
    'allianz_parque': 'Allianz Parque & Espaço Unimed',
    'interlagos_arena': 'Autódromo Interlagos (Shows)',
    'morumbi_estadio': 'Estádio do MorumBIS',
    'barretos_parque_peao': 'Parque do Peão de Barretos',
    'ibirapuera_arenas': 'Parque Ibirapuera (C6 Fest)',
    'ribeirao_preto': 'Polo Ribeirão Preto (Agrishow / João Rock)',
    'campinas_resorts': 'Polo Campinas (Jaguariúna / Americana)',
    'sao_jose_rio_preto_aracatuba': 'Polo Noroeste Paulista',
    'piracicaba_agtech': 'Polo Piracicaba & Paranapanema',
    'santos_litoral': 'Polo Baixada Santista',
    'campos_jordao': 'Polo Campos do Jordão'
  };

  eventosFiltradosState.forEach(item => {
    const row = document.createElement('tr');
    const seg = (item.evento.segmento || '').toLowerCase();
    const nome = (item.evento.nome || '').toLowerCase();
    
    let ribbonClass = 'ribbon-tech';
    let badgeClass = 'badge-tech';
    let iconCat = '🏢';

    if (seg.includes('show') || seg.includes('música') || seg.includes('festival') || nome.includes('lollapalooza') || nome.includes('allianz') || nome.includes('morumbi') || nome.includes('barretos') || nome.includes('joão rock')) {
      ribbonClass = 'ribbon-shows';
      badgeClass = 'badge-shows';
      iconCat = '🎸';
    } else if (seg.includes('agro') || seg.includes('agrícola') || seg.includes('pecuária') || seg.includes('grãos') || seg.includes('sucro')) {
      ribbonClass = 'ribbon-agro';
      badgeClass = 'badge-agro';
      iconCat = '🚜';
    } else if (seg.includes('saúde') || seg.includes('médic') || seg.includes('hospital') || seg.includes('farma')) {
      ribbonClass = 'ribbon-saude';
      badgeClass = 'badge-saude';
      iconCat = '💊';
    } else if (seg.includes('logística') || seg.includes('porto') || seg.includes('transporte') || seg.includes('comex')) {
      ribbonClass = 'ribbon-logistica';
      badgeClass = 'badge-logistica';
      iconCat = '⚓';
    } else if (seg.includes('varejo') || seg.includes('supermercado') || seg.includes('aliment') || seg.includes('consumo')) {
      ribbonClass = 'ribbon-varejo';
      badgeClass = 'badge-varejo';
      iconCat = '🛍️';
    }

    row.className = `hover:bg-slate-800/70 cursor-pointer transition ${ribbonClass} group`;
    row.onclick = () => abrirDetalheEvento(item.evento.id);

    const isTier1 = item.scoreOportunidade.scoreTotal >= 90;
    const tierBadge = isTier1
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">★ ${item.scoreOportunidade.scoreTotal}</span>`
      : `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">${item.scoreOportunidade.scoreTotal}</span>`;

    const localStr = polosNomes[item.evento.local] || item.evento.local;
    const roomNightsEst = Math.round((item.evento.publicoTotal * 0.55) * item.evento.diasDuracao);

    const statusGov = item.evento.statusGovernanca || 'CONFIRMADO';
    const statusBadge = statusGov === 'CONFIRMADO' 
      ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Confirmado</span>`
      : statusGov === 'PROVAVEL'
      ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Provável</span>`
      : `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/25"><span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>Em Triagem</span>`;

    const diasAnt = item.evento.diasAntecedencia !== undefined ? item.evento.diasAntecedencia : 120;
    const janelaBadge = diasAnt <= 90 
      ? `<span class="text-[9.5px] font-mono font-bold text-rose-300 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30">🚨 D-90</span>`
      : diasAnt <= 120 
      ? `<span class="text-[9.5px] font-mono font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">⚡ D-120</span>`
      : `<span class="text-[9.5px] font-mono font-bold text-indigo-300 bg-indigo-500/15 px-1.5 py-0.5 rounded border border-indigo-500/30">📅 D-180</span>`;

    row.className = `hover:bg-slate-800/50 cursor-pointer transition ${ribbonClass} group border-b border-slate-800/80`;
    row.innerHTML = `
      <td class="px-3.5 py-3 whitespace-nowrap">
        <div class="flex flex-col space-y-1">
          ${tierBadge}
          ${statusBadge}
        </div>
      </td>
      <td class="px-3.5 py-3 max-w-[300px]">
        <div class="flex items-center space-x-2.5 min-w-0">
          <span class="text-base flex-shrink-0">${iconCat}</span>
          <div class="min-w-0 flex-1">
            <div class="font-bold text-[13px] text-white group-hover:text-indigo-400 transition leading-snug truncate" title="${item.evento.nome}">${item.evento.nome}</div>
            <div class="text-[11.5px] text-slate-400 font-medium truncate flex items-center space-x-1.5 mt-0.5" title="${item.evento.empresaOrganizadora || ''}">
              <span class="truncate">${item.evento.empresaOrganizadora || 'Comitê Organizador'}</span>
              <button onclick="event.stopPropagation(); abrirModalEvidencias('${item.evento.id}')" title="Ver Fontes & Evidências Auditadas" class="text-emerald-400 hover:text-emerald-300 inline-flex items-center flex-shrink-0">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      </td>
      <td class="px-3.5 py-3 max-w-[180px]">
        <div class="text-xs font-semibold text-slate-200 truncate" title="${localStr}">${localStr}</div>
        <div class="text-[10.5px] text-slate-400 truncate">${item.evento.cidade || 'São Paulo'}</div>
      </td>
      <td class="px-3.5 py-3 whitespace-nowrap font-mono text-xs text-slate-300">
        <div class="flex items-center space-x-1.5">
          <span class="font-bold text-white">${item.evento.diasDuracao} dias</span>
          ${janelaBadge}
        </div>
        <div class="text-[10.5px] text-slate-400 mt-0.5 font-mono">${item.evento.dataInicio || '2026'}</div>
      </td>
      <td class="px-3.5 py-3 text-right whitespace-nowrap font-mono font-bold text-xs text-white">
        ${(item.evento.publicoTotal || 0).toLocaleString('pt-BR')}
        <span class="text-[10px] text-slate-400 font-sans font-normal ml-0.5">pax</span>
      </td>
      <td class="px-3.5 py-3 text-right whitespace-nowrap font-mono font-bold text-xs text-indigo-300">
        ${roomNightsEst.toLocaleString('pt-BR')}
        <span class="text-[10px] text-indigo-400/80 font-sans font-normal ml-0.5">qts</span>
      </td>
      <td class="px-3.5 py-3 whitespace-nowrap">
        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${badgeClass}">${item.evento.segmento}</span>
      </td>
      <td class="px-3.5 py-3 text-right whitespace-nowrap">
        <div class="flex items-center justify-end space-x-1.5">
          <button onclick="event.stopPropagation(); abrirModalEvidencias('${item.evento.id}')" title="Ver Fontes Oficiais & Evidências" class="p-1.5 rounded-lg bg-[#080c14] hover:bg-emerald-950/60 text-emerald-400 border border-slate-700 hover:border-emerald-700 transition">
            <i data-lucide="file-search" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="event.stopPropagation(); abrirDetalheEvento('${item.evento.id}')" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition inline-flex items-center space-x-1 shadow-xs">
            <span>Dossiê &rarr;</span>
          </button>
        </div>
      </td>
    `;

    corpo.appendChild(row);
  });

  const rodape = document.getElementById('tabela-eventos-rodape');
  if (rodape) {
    rodape.innerHTML = `
      <span>Exibindo <strong>${eventosFiltradosState.length}</strong> de <strong>${pipelineState.length}</strong> eventos cadastrados em São Paulo</span>
      <span>Clique em qualquer evento para abrir o dossiê completo e propostas</span>
    `;
  }

  lucide.createIcons();
}

// ----------------------------------------------------------------
// MODAL DE EVIDÊNCIAS & FONTES OFICIAIS AUDITADAS
// ----------------------------------------------------------------

function abrirModalEvidencias(eventoId) {
  const item = pipelineState.find(p => p.evento.id === eventoId || p.evento.canonicalId === eventoId);
  if (!item) return;

  const modal = document.getElementById('modal-evidencias-fontes');
  const titulo = document.getElementById('evidencia-titulo-evento');
  const subtitulo = document.getElementById('evidencia-subtitulo-evento');
  const container = document.getElementById('conteudo-evidencias-fontes');

  if (titulo) titulo.innerText = item.evento.nome;
  if (subtitulo) subtitulo.innerText = `Status: ${item.evento.statusGovernanca || 'CONFIRMADO'} | Confiança: ${item.evento.confidenceLevel || 'ALTA'} | Lead Time: D-${item.evento.diasAntecedencia || 120} dias`;

  const sources = item.evento.sources || [];
  const logistics = item.evento.logistics || {};

  let htmlSources = '';
  if (sources.length === 0) {
    htmlSources = `
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-400">
        <p class="text-xs">Registro inserido via esteira institucional com base em edições anteriores homologadas.</p>
      </div>
    `;
  } else {
    htmlSources = sources.map(s => `
      <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5 hover:border-slate-700 transition">
        <div class="flex items-center justify-between">
          <span class="font-bold text-emerald-300 text-xs flex items-center space-x-1.5">
            <i data-lucide="link" class="w-3.5 h-3.5"></i>
            <span>${s.name}</span>
          </span>
          <span class="text-[10px] text-slate-400 font-mono">Consulta: ${s.retrievedAt || '2026-08'}</span>
        </div>
        <p class="text-slate-300 text-[11px] italic bg-slate-950/60 p-2 rounded border border-slate-800/80">"${s.quote || 'Informação verificada no calendário oficial.'}"</p>
        <div class="pt-1 flex items-center justify-between text-[10px]">
          <a href="${s.url}" target="_blank" class="text-cyan-400 hover:underline flex items-center space-x-1 truncate max-w-[80%]">
            <span>${s.url}</span>
            <i data-lucide="external-link" class="w-3 h-3 flex-shrink-0"></i>
          </a>
          <span class="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">${s.type || 'FONTE_OFICIAL'}</span>
        </div>
      </div>
    `).join('');
  }

  const mobilityInfo = logistics.mobilityProviders?.map(m => m.name).join(', ') || 'Cooperativas credenciadas de táxi (trânsito livre em faixa de ônibus)';

  container.innerHTML = `
    <!-- Card de Governança -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#080c14] border border-slate-800 text-[11px]">
      <div>
        <span class="text-slate-400 uppercase text-[9px] font-bold block">Status de Governança</span>
        <span class="font-black text-emerald-400">${item.evento.statusGovernanca || 'CONFIRMADO'}</span>
      </div>
      <div>
        <span class="text-slate-400 uppercase text-[9px] font-bold block">Pressão Hoteleira</span>
        <span class="font-bold text-amber-300">${logistics.hotelPressure || 'ALTA'} (Raio ${logistics.hotelRadiusKm || 15} km)</span>
      </div>
      <div>
        <span class="text-slate-400 uppercase text-[9px] font-bold block">Nível de Confiança</span>
        <span class="font-bold text-indigo-300">🛡️ ${item.evento.confidenceLevel || 'ALTA'} (Auditado)</span>
      </div>
    </div>

    <!-- Fontes e Citações Auditadas -->
    <div class="space-y-2">
      <div class="font-bold text-slate-300 text-xs flex items-center space-x-1.5">
        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
        <span>Fontes Primárias & Evidências Vinculadas</span>
      </div>
      <div class="space-y-2">${htmlSources}</div>
    </div>

    <!-- Mobilidade & Logística Homologada -->
    <div class="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-3 text-[11px] space-y-1">
      <div class="font-bold text-indigo-300 flex items-center space-x-1.5">
        <i data-lucide="car" class="w-3.5 h-3.5 text-indigo-400"></i>
        <span>Mobilidade Homologada no Polo:</span>
      </div>
      <p class="text-slate-300">${mobilityInfo}</p>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  lucide.createIcons();
}

function fecharModalEvidencias() {
  const modal = document.getElementById('modal-evidencias-fontes');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ----------------------------------------------------------------
// 2. MÓDULO PÁGINA PRÓPRIA DO EVENTO
// ----------------------------------------------------------------

function abrirDetalheEvento(eventoId) {
  const item = pipelineState.find(p => p.evento.id === eventoId);
  if (!item) return;

  eventoSelecionadoDossie = item;
  eventoAtivoIndex = pipelineState.findIndex(p => p.evento.id === eventoId);

  renderizarDossieCompleto();
  navegarParaView('detalhe-evento');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarParaListaRadar() {
  navegarParaView('radar');
}

function renderizarDossieCompleto() {
  if (!eventoSelecionadoDossie) return;
  const item = eventoSelecionadoDossie;

  const polosNomesCompletos = {
    'sp_expo': 'São Paulo Expo (Rodovia dos Imigrantes, km 1,5 &middot; Zona Sul / Capital)',
    'transamerica_expo': 'Transamerica Expo Center (Av. Dr. Mário Vilas Boas Rodrigues &middot; Santo Amaro / Capital)',
    'anhembi': 'Distrito Anhembi (Av. Olavo Fontoura, 1209 &middot; Santana / Capital)',
    'frei_caneca': 'Centro de Convenções Frei Caneca (Rua Frei Caneca, 569 &middot; Consolação / Capital)',
    'wds_wtc': 'WTC Events Center (Av. das Nações Unidas, 12551 &middot; Brooklin / Berrini)',
    'allianz_parque': 'Allianz Parque & Espaço Unimed (Av. Francisco Matarazzo, 1705 &middot; Barra Funda / Capital)',
    'interlagos_arena': 'Autódromo de Interlagos (Av. Senador Teotônio Vilela, 261 &middot; Interlagos / Capital)',
    'morumbi_estadio': 'Estádio do MorumBIS (Praça Roberto Gomes Pedrosa, 1 &middot; Morumbi / Capital)',
    'barretos_parque_peao': 'Parque do Peão de Barretos (Rodovia Brigadeiro Faria Lima, km 428 &middot; Barretos)',
    'ibirapuera_arenas': 'Parque Ibirapuera & Auditório (Av. Pedro Álvares Cabral &middot; Ibirapuera / Capital)',
    'ribeirao_preto': 'Polo Ribeirão Preto & Sertãozinho (Parque Agrishow / Centro Taiwan &middot; Interior Agro)',
    'campinas_resorts': 'Polo Campinas & Circuito dos Resorts (Royal Palm Hall / Red Park &middot; Interior)',
    'sao_jose_rio_preto_aracatuba': 'Polo Noroeste Paulista (Recinto Alberto Bertelli Lucato &middot; Pecuária)',
    'piracicaba_agtech': 'Polo Piracicaba & Paranapanema (AgTech Garage ESALQ / EMAPA Avaré &middot; Interior)',
    'santos_litoral': 'Polo Baixada Santista (Blue Med Convention Center &middot; Litoral Portuário)',
    'campos_jordao': 'Polo Serra da Mantiqueira (Campos do Jordão Convention Center &middot; Serra)'
  };

  const cabecalho = document.getElementById('dossie-cabecalho-evento');
  const isTier1 = item.scoreOportunidade.scoreTotal >= 90;
  const isShow = (item.evento.segmento || '').toLowerCase().includes('show') || (item.evento.nome || '').toLowerCase().includes('lollapalooza') || (item.evento.nome || '').toLowerCase().includes('allianz') || (item.evento.nome || '').toLowerCase().includes('morumbi');

  cabecalho.innerHTML = `
    <div class="card-dark-luxury p-5 text-white space-y-4 relative overflow-hidden">
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
        <div class="space-y-2 min-w-0 flex-1">
          <div class="flex items-center space-x-2 flex-wrap gap-y-1">
            <span class="px-2.5 py-0.5 rounded-md text-xs font-extrabold tracking-wide bg-slate-900 text-amber-400 border border-slate-700 shadow-2xs">
              ★ Score ${item.scoreOportunidade.scoreTotal}/100 [${item.scoreOportunidade.tier}]
            </span>
            <span class="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-700">${item.evento.id}</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              ${isShow ? '🎸' : '🏢'} ${item.evento.segmento}
            </span>
          </div>

          <h2 class="text-xl sm:text-2xl font-black text-white leading-snug break-words">${item.evento.nome}</h2>

          <p class="text-xs text-slate-300 flex items-center space-x-1.5 font-medium break-words">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400 flex-shrink-0"></i>
            <span>${polosNomesCompletos[item.evento.local] || item.evento.local}</span>
          </p>
        </div>

        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs text-left md:text-right space-y-0.5 flex-shrink-0 self-start">
          <div class="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Período Operacional</div>
          <div class="text-sm sm:text-base font-black text-white font-mono">${item.evento.diasDuracao} dias de operação</div>
          <div class="text-[11px] text-slate-300 font-medium">Janela ideal: <strong>${item.evento.diasAntecedencia || 60} dias antes</strong></div>
        </div>
      </div>

      <div class="bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl text-xs text-slate-200 flex items-start space-x-2">
        <i data-lucide="sparkles" class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5"></i>
        <div class="break-words"><strong>Diretriz Estratégica:</strong> ${item.scoreOportunidade.acao.replace('🏆', '').replace('🥈', '').replace('🥉', '').replace('📡', '')}</div>
      </div>
    </div>
  `;

  const decisoresDiv = document.getElementById('dossie-decisores-evento');
  const decisores = item.evento.decisores || [];
  decisoresDiv.innerHTML = `
    <div class="flex items-center justify-between border-b border-slate-800/60 pb-3">
      <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5 truncate">
        <i data-lucide="users" class="w-4 h-4 text-slate-300 flex-shrink-0"></i>
        <span class="truncate">Decisores & Personas Mapeadas</span>
      </h3>
      <span class="text-xs text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded-md border border-slate-800 flex-shrink-0">${decisores.length} contatos</span>
    </div>
    <div class="space-y-2">
      ${decisores.length ? decisores.map(d => `
        <div class="bg-[#080c14]/80 p-3 rounded-xl border border-slate-800 space-y-0.5 text-xs hover:border-slate-300 transition min-w-0">
          <div class="font-bold text-white flex items-center justify-between gap-2">
            <span class="truncate">${d.nome}</span>
            <span class="text-[10px] text-slate-500 font-bold uppercase flex-shrink-0">LinkedIn</span>
          </div>
          <div class="text-[11px] text-slate-400 font-medium truncate">${d.cargo}</div>
          ${d.email ? `<div class="text-[11px] text-slate-300 font-mono font-semibold pt-0.5 flex items-center space-x-1 truncate"><i data-lucide="mail" class="w-3 h-3 flex-shrink-0 text-slate-400"></i><span class="truncate">${d.email}</span></div>` : ''}
        </div>
      `).join('') : '<div class="text-xs text-slate-500 p-3 bg-[#080c14] rounded-xl">Mapeamento em processo de enriquecimento.</div>'}
    </div>
  `;

  const volumetriaDiv = document.getElementById('dossie-volumetria-evento');
  const hospedesEst = Math.round(item.evento.publicoTotal * 0.55);
  const roomNightsEst = hospedesEst * item.evento.diasDuracao;
  const transfersEst = Math.round(hospedesEst * 0.75);
  const aereosEst = Math.round(hospedesEst * 0.65);

  // Estimativas de Saving e ESG
  const hotelRef = item.rankingFornecedores.hoteis[0];
  const diariaBalcao = hotelRef.diariaNegociada * 1.25;
  const savingTotalEst = (diariaBalcao - hotelRef.diariaNegociada) * roomNightsEst;
  const co2EvitadoEst = +(hospedesEst * item.evento.diasDuracao * 35 * 0.11 / 1000).toFixed(1);

  volumetriaDiv.innerHTML = `
    <div class="flex items-center justify-between border-b border-slate-800/60 pb-3">
      <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5 truncate">
        <i data-lucide="bar-chart-3" class="w-4 h-4 text-slate-300 flex-shrink-0"></i>
        <span class="truncate">Dimensionamento MICE & Impacto</span>
      </h3>
      <span class="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">🌿 ESG Classe A</span>
    </div>
    <div class="grid grid-cols-2 gap-2.5 text-xs">
      <div class="bg-[#080c14] p-2.5 rounded-xl border border-slate-800 min-w-0">
        <span class="text-[10px] text-slate-500 block uppercase font-bold tracking-wider truncate">Público Total</span>
        <span class="font-extrabold text-white text-sm sm:text-base font-mono truncate block">${item.evento.publicoTotal.toLocaleString('pt-BR')} <span class="text-xs text-slate-400 font-normal">pax</span></span>
      </div>
      <div class="bg-[#080c14] p-2.5 rounded-xl border border-slate-800 min-w-0">
        <span class="text-[10px] text-slate-500 block uppercase font-bold tracking-wider truncate">Room Nights</span>
        <span class="font-extrabold text-white text-sm sm:text-base font-mono truncate block">${roomNightsEst.toLocaleString('pt-BR')} <span class="text-xs text-slate-400 font-normal">qts</span></span>
      </div>
      <div class="bg-[#080c14] p-2.5 rounded-xl border border-slate-800 min-w-0">
        <span class="text-[10px] text-slate-500 block uppercase font-bold tracking-wider truncate">Saving MICE</span>
        <span class="font-extrabold text-emerald-700 text-sm sm:text-base font-mono truncate block">R$ ${savingTotalEst.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
      </div>
      <div class="bg-[#080c14] p-2.5 rounded-xl border border-slate-800 min-w-0">
        <span class="text-[10px] text-slate-500 block uppercase font-bold tracking-wider truncate">CO₂ Poupado</span>
        <span class="font-extrabold text-white text-sm sm:text-base font-mono truncate block">${co2EvitadoEst} <span class="text-xs text-slate-400 font-normal">ton</span></span>
      </div>
    </div>
  `;

  const fornCards = document.getElementById('dossie-fornecedores-top-cards');
  fornCards.innerHTML = '';

  const topHotel = item.rankingFornecedores.hoteis[0];
  const topVan = item.rankingFornecedores.vans[0];
  const topTaxi = item.rankingFornecedores.taxis[0];
  const topTMC = item.rankingFornecedores.tmc[0];

  const cardsList = [
    { titulo: '🏨 Hotelaria', nome: topHotel.nome, fit: topHotel.fitScore, desc: topHotel.justificativa },
    { titulo: '🚐 Vans & Shuttles', nome: topVan.nome, fit: topVan.fitScore, desc: topVan.justificativa },
    { titulo: '🚕 Táxis Homologados', nome: topTaxi.nome, fit: topTaxi.fitScore, desc: topTaxi.justificativa },
    { titulo: '✈️ Emissão Aérea (TMC)', nome: topTMC.nome, fit: topTMC.fitScore, desc: topTMC.justificativa }
  ];

  cardsList.forEach(c => {
    const card = document.createElement('div');
    card.className = 'bg-[#0f172a] border border-slate-800/80 rounded-xl p-3 space-y-1.5 shadow-2xs hover:shadow-sm transition min-w-0';
    card.innerHTML = `
      <div class="flex items-center justify-between gap-1">
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">${c.titulo}</span>
        <span class="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md border border-indigo-200 flex-shrink-0">Fit ${c.fit}%</span>
      </div>
      <h4 class="font-extrabold text-xs text-white truncate" title="${c.nome}">${c.nome}</h4>
      <p class="text-[11px] text-slate-400 leading-snug line-clamp-2">${c.desc}</p>
    `;
    fornCards.appendChild(card);
  });

  renderizarPacotesCPQDossie();
  renderizarCicloOperacional360();
  lucide.createIcons();
}

function definirParticipantesDossie(val) {
  participantesSimuladosDossie = parseInt(val);
  const inputElem = document.getElementById('input-participantes-dossie');
  if (inputElem) inputElem.value = participantesSimuladosDossie;
  
  // Atualizar estilo visual dos botões de preset
  const presetContainer = document.getElementById('botoes-presets-delegacao');
  if (presetContainer) {
    const btns = presetContainer.querySelectorAll('button');
    btns.forEach(b => {
      if (b.innerText.includes(String(val))) {
        b.className = 'px-2 py-1 rounded text-[11px] font-bold text-indigo-700 bg-white shadow-2xs border border-indigo-200';
      } else {
        b.className = 'px-2 py-1 rounded text-[11px] font-semibold text-slate-300 hover:bg-white hover:shadow-2xs transition';
      }
    });
  }

  renderizarPacotesCPQDossie();
  renderizarCicloOperacional360();
}

function atualizarSliderParticipantesDossie(val) {
  participantesSimuladosDossie = Math.max(10, parseInt(val) || 100);
  const inputElem = document.getElementById('input-participantes-dossie');
  if (inputElem) inputElem.value = participantesSimuladosDossie;
  
  renderizarPacotesCPQDossie();
  renderizarCicloOperacional360();
}

function renderizarPacotesCPQDossie() {
  if (!eventoSelecionadoDossie) return;
  const container = document.getElementById('dossie-pacotes-cpq-cards');
  if (!container) return;
  container.innerHTML = '';

  const pacotes = eventoSelecionadoDossie.pacotesRecomendados;
  const multiplicador = participantesSimuladosDossie / 100;

  pacotes.forEach(p => {
    const valorCliente = p.valorEstimado * multiplicador;
    const receitaNossa = p.receitaEstimadaNossa * multiplicador;

    const card = document.createElement('div');
    const isRecomendado = p.recomendado;

    card.className = `p-4 rounded-xl border flex flex-col justify-between space-y-3.5 ${
      isRecomendado 
        ? 'bg-[#080c14]/80 border-slate-800 shadow-sm ring-1 ring-slate-800' 
        : 'bg-[#0f172a] border-slate-800'
    }`;

    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            isRecomendado ? 'bg-slate-900 text-white' : 'bg-slate-800 text-slate-400'
          }">
            ${p.categoria} ${isRecomendado ? '· Recomendado' : ''}
          </span>
        </div>
        <h4 class="font-bold text-sm text-white">${p.nome.replace('⭐', '')}</h4>
        <p class="text-xs text-slate-500 leading-snug">${p.destaque}</p>
      </div>

      <div class="space-y-1.5 py-2.5 border-y border-slate-800/60 text-xs text-slate-300">
        <div><span class="text-slate-500 font-medium">Hospedagem:</span> ${p.composicao.hotel}</div>
        <div><span class="text-slate-500 font-medium">Logística:</span> ${p.composicao.mobilidade}</div>
        ${p.composicao.gastronomia ? `<div><span class="text-slate-500 font-medium">Gastronomia:</span> ${p.composicao.gastronomia}</div>` : ''}
      </div>

      <div class="space-y-2.5">
        <div class="bg-slate-800/90 p-2.5 rounded-lg border border-slate-800 space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-slate-500 font-medium">Investimento Total:</span>
            <span class="font-bold text-white">R$ ${valorCliente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span class="text-slate-400 font-medium">Comissão da Agência:</span>
            <span class="font-bold text-emerald-800">R$ ${receitaNossa.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <button onclick="abrirPropostaExecutivaNovaAba()" class="w-full py-2 rounded-lg ${
          isRecomendado ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-white hover:bg-[#080c14] text-slate-300 border border-slate-300'
        } text-xs font-semibold transition shadow-2xs">
          Gerar Proposta em PDF (${participantesSimuladosDossie} pax)
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

let modoAlocacaoManualAtivo = false;
let customOverridesDossie = {
  hoteis: {},
  taxis: {},
  veiculos: {},
  aereo: {},
  gastronomia: {}
};
let planoOrquestracaoAtual = null;

function toggleModoAlocacaoManual(ativar) {
  modoAlocacaoManualAtivo = (ativar !== undefined) ? ativar : !modoAlocacaoManualAtivo;
  renderizarCicloOperacional360();
}

function restaurarSugestaoIA() {
  customOverridesDossie = {
    hoteis: {},
    taxis: {},
    veiculos: {},
    aereo: {},
    gastronomia: {}
  };
  modoAlocacaoManualAtivo = false;
  renderizarCicloOperacional360();
}

function distribuirIgualmenteHoteis() {
  if (!planoOrquestracaoAtual) return;
  const lista = planoOrquestracaoAtual.orquestracaoHospedagem.todosHoteisDisponiveis || planoOrquestracaoAtual.orquestracaoHospedagem.gradeHoteis;
  const pax = participantesSimuladosDossie;
  const qtdHoteis = Math.min(lista.length, Math.ceil(pax / 100));
  if (qtdHoteis === 0) return;

  const quartosPorHotel = Math.floor(pax / qtdHoteis);
  let resto = pax % qtdHoteis;

  customOverridesDossie.hoteis = {};
  lista.forEach((h, idx) => {
    if (idx < qtdHoteis) {
      const q = quartosPorHotel + (resto > 0 ? 1 : 0);
      customOverridesDossie.hoteis[h.hotelId] = q;
      if (resto > 0) resto--;
    } else {
      customOverridesDossie.hoteis[h.hotelId] = 0;
    }
  });

  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

function alterarQuartosHotel(hotelId, delta) {
  if (!planoOrquestracaoAtual) return;
  const lista = planoOrquestracaoAtual.orquestracaoHospedagem.todosHoteisDisponiveis || planoOrquestracaoAtual.orquestracaoHospedagem.gradeHoteis;
  const hotel = lista.find(h => h.hotelId === hotelId);
  const atual = (customOverridesDossie.hoteis && customOverridesDossie.hoteis[hotelId] !== undefined)
    ? customOverridesDossie.hoteis[hotelId]
    : (hotel ? hotel.quartosAlocados : 0);

  const novoValor = Math.max(0, Math.min(hotel ? hotel.capacidadeTotalHotel : 1000, atual + delta));
  if (!customOverridesDossie.hoteis) customOverridesDossie.hoteis = {};
  customOverridesDossie.hoteis[hotelId] = novoValor;
  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

function definirQuartosHotel(hotelId, valor) {
  const v = Math.max(0, parseInt(valor) || 0);
  if (!customOverridesDossie.hoteis) customOverridesDossie.hoteis = {};
  customOverridesDossie.hoteis[hotelId] = v;
  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

function toggleHotelAtivo(hotelId, ativo) {
  if (!planoOrquestracaoAtual) return;
  const lista = planoOrquestracaoAtual.orquestracaoHospedagem.todosHoteisDisponiveis || planoOrquestracaoAtual.orquestracaoHospedagem.gradeHoteis;
  const hotel = lista.find(h => h.hotelId === hotelId);
  if (!customOverridesDossie.hoteis) customOverridesDossie.hoteis = {};

  if (ativo) {
    customOverridesDossie.hoteis[hotelId] = hotel ? Math.min(150, hotel.maxRoomBlock) : 100;
  } else {
    customOverridesDossie.hoteis[hotelId] = 0;
  }
  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

function alterarTaxisCooperativa(coopId, delta) {
  if (!planoOrquestracaoAtual) return;
  const lista = planoOrquestracaoAtual.orquestracaoTaxis.todasCooperativasDisponiveis || planoOrquestracaoAtual.orquestracaoTaxis.gradeCooperativas;
  const coop = lista.find(c => c.cooperativaId === coopId);
  const atual = (customOverridesDossie.taxis && customOverridesDossie.taxis[coopId] !== undefined)
    ? customOverridesDossie.taxis[coopId]
    : (coop ? coop.veiculosMobilizados : 0);

  const novoValor = Math.max(0, atual + delta);
  if (!customOverridesDossie.taxis) customOverridesDossie.taxis = {};
  customOverridesDossie.taxis[coopId] = novoValor;
  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

function definirTaxisCooperativa(coopId, valor) {
  const v = Math.max(0, parseInt(valor) || 0);
  if (!customOverridesDossie.taxis) customOverridesDossie.taxis = {};
  customOverridesDossie.taxis[coopId] = v;
  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

function dividirTaxisIgualmente() {
  if (!planoOrquestracaoAtual) return;
  const coops = planoOrquestracaoAtual.orquestracaoTaxis.todasCooperativasDisponiveis || planoOrquestracaoAtual.orquestracaoTaxis.gradeCooperativas;
  if (!coops.length) return;
  const totalTaxis = planoOrquestracaoAtual.orquestracaoTaxis.taxisSimultaneosPico || Math.ceil(participantesSimuladosDossie / 4);
  const porCoop = Math.floor(totalTaxis / coops.length);

  customOverridesDossie.taxis = {};
  coops.forEach(c => {
    customOverridesDossie.taxis[c.cooperativaId] = porCoop;
  });
  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

function alterarVeiculosShuttle(tipo, delta) {
  if (!customOverridesDossie.veiculos) customOverridesDossie.veiculos = {};
  const shut = planoOrquestracaoAtual ? planoOrquestracaoAtual.orquestracaoShuttles.veiculosAlocados : { onibusExecutivos46Lugares: 14, vansExecutivas15Lugares: 27 };
  const atual = (customOverridesDossie.veiculos[tipo] !== undefined && customOverridesDossie.veiculos[tipo] !== null)
    ? customOverridesDossie.veiculos[tipo]
    : (tipo === 'onibus' ? shut.onibusExecutivos46Lugares : shut.vansExecutivas15Lugares);

  customOverridesDossie.veiculos[tipo] = Math.max(0, atual + delta);
  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

function alterarPassagensAereas(delta) {
  if (!customOverridesDossie.aereo) customOverridesDossie.aereo = {};
  const atual = (customOverridesDossie.aereo.passagens !== undefined && customOverridesDossie.aereo.passagens !== null)
    ? customOverridesDossie.aereo.passagens
    : Math.round(participantesSimuladosDossie * 0.80);

  customOverridesDossie.aereo.passagens = Math.max(0, atual + delta);
  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

function alterarJantaresGastronomia(delta) {
  if (!customOverridesDossie.gastronomia) customOverridesDossie.gastronomia = {};
  const atual = (customOverridesDossie.gastronomia.jantares !== undefined && customOverridesDossie.gastronomia.jantares !== null)
    ? customOverridesDossie.gastronomia.jantares
    : (planoOrquestracaoAtual ? planoOrquestracaoAtual.orquestracaoGastronomia.totalJantaresPlanejados : 2);

  customOverridesDossie.gastronomia.jantares = Math.max(0, atual + delta);
  modoAlocacaoManualAtivo = true;
  renderizarCicloOperacional360();
}

async function renderizarCicloOperacional360() {
  if (!eventoSelecionadoDossie) return;
  const container = document.getElementById('dossie-ciclo-operacional-container');
  if (!container) return;

  const item = eventoSelecionadoDossie;
  const pax = participantesSimuladosDossie;
  const dias = item.evento.diasDuracao || 3;

  container.innerHTML = `
    <div class="flex items-center justify-center p-8 space-x-2 text-slate-500 text-xs font-medium">
      <div class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <span>Orquestrando capacidade hoteleira, cooperativas de táxi e malha de fretamento para ${pax} pessoas...</span>
    </div>
  `;

  try {
    const res = await fetch('/api/orchestrator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: item.evento.id,
        pax,
        dias,
        overrides: modoAlocacaoManualAtivo ? customOverridesDossie : null
      })
    });
    const plano = await res.json();
    planoOrquestracaoAtual = plano;

    const hosp = plano.orquestracaoHospedagem;
    const tax = plano.orquestracaoTaxis;
    const shut = plano.orquestracaoShuttles;
    const aer = plano.hubLogistico;
    const gast = plano.orquestracaoGastronomia;
    const fin = plano.consolidadoFinanceiro;

    // Status da Alocação de Quartos
    const diffQuartos = hosp.totalQuartosAlocados - pax;
    let badgeQuartosHtml = '';
    if (diffQuartos === 0) {
      badgeQuartosHtml = `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <i data-lucide="check-circle-2" class="w-3 h-3 mr-1 inline text-emerald-700"></i> 100% Coberto (${hosp.totalQuartosAlocados}/${pax} quartos)
      </span>`;
    } else if (diffQuartos < 0) {
      badgeQuartosHtml = `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <i data-lucide="alert-triangle" class="w-3 h-3 mr-1 inline text-amber-700"></i> Faltam ${Math.abs(diffQuartos)} quartos (${hosp.totalQuartosAlocados}/${pax} alocados)
      </span>`;
    } else {
      badgeQuartosHtml = `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
        <i data-lucide="info" class="w-3 h-3 mr-1 inline text-blue-700"></i> +${diffQuartos} quartos excedentes (${hosp.totalQuartosAlocados}/${pax})
      </span>`;
    }

    const listaHoteis = hosp.todosHoteisDisponiveis || hosp.gradeHoteis;
    const listaCooperativas = tax.todasCooperativasDisponiveis || tax.gradeCooperativas;

    container.innerHTML = `
      <!-- CABEÇALHO DO ESTÚDIO DE ALOCAÇÃO -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Estúdio de Alocação MICE SP
            </span>
            <span class="text-xs text-slate-500">&middot; ${plano.evento.regiao}</span>
          </div>
          <h3 class="text-sm font-bold text-white mt-1 flex items-center space-x-1.5">
            <i data-lucide="sliders-horizontal" class="w-4 h-4 text-indigo-600"></i>
            <span>Orquestração & Alocação Personalizada &middot; ${pax.toLocaleString('pt-BR')} Pessoas</span>
          </h3>
        </div>

        <!-- CONTROLES DE MODO (IA vs MANUAL) E AÇÕES -->
        <div class="flex flex-wrap items-center gap-2">
          ${badgeQuartosHtml}
          
          <div class="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-800 text-xs font-semibold">
            <button onclick="toggleModoAlocacaoManual(false)" class="px-2.5 py-1 rounded-md transition ${!modoAlocacaoManualAtivo ? 'bg-white shadow-2xs text-white font-bold' : 'text-slate-400 hover:text-white'}">
              🤖 Auto IA
            </button>
            <button onclick="toggleModoAlocacaoManual(true)" class="px-2.5 py-1 rounded-md transition ${modoAlocacaoManualAtivo ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'text-slate-400 hover:text-white'}">
              ✏️ Ajuste Manual
            </button>
          </div>

          ${modoAlocacaoManualAtivo ? `
            <button onclick="distribuirIgualmenteHoteis()" title="Divide a meta igualmente entre os hotéis homologados mais próximos" class="px-2.5 py-1 bg-white hover:bg-[#080c14] border border-slate-300 text-slate-300 rounded-lg text-xs font-semibold transition flex items-center space-x-1 shadow-2xs">
              <i data-lucide="scale" class="w-3.5 h-3.5 text-indigo-600"></i>
              <span>Dividir Igualmente</span>
            </button>
            <button onclick="restaurarSugestaoIA()" title="Restaura a recomendação otimizada da IA" class="px-2.5 py-1 bg-white hover:bg-[#080c14] border border-slate-300 text-slate-300 rounded-lg text-xs font-semibold transition flex items-center space-x-1 shadow-2xs">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-slate-500"></i>
              <span>Restaurar IA</span>
            </button>
          ` : ''}

          <button onclick="abrirPropostaExecutivaNovaAba()" class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition shadow-2xs flex items-center space-x-1">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span>Exportar Proposta PDF</span>
          </button>
        </div>
      </div>

      <!-- 1. TABELA INTERATIVA DE ALOCAÇÃO MULTIHOTEL -->
      <div class="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-2xs space-y-0">
        <div class="p-3 bg-[#080c14] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-indigo-100 text-indigo-700"><i data-lucide="hotel" class="w-3.5 h-3.5"></i></span>
            <div>
              <h4 class="text-xs font-bold text-white uppercase tracking-wide">1. Alocação Hoteleira Multihotel &middot; Capacidade & Divisão de Quartos</h4>
              <p class="text-[11px] text-slate-500">Ajuste os quartos em cada hotel conforme a preferência da delegação. A IA recalcula savings e comissões instantaneamente.</p>
            </div>
          </div>
          <div class="text-right flex items-center space-x-2">
            <span class="text-xs font-bold text-slate-200 bg-white px-2 py-0.5 rounded border border-slate-800">
              ${hosp.totalQuartosAlocados} / ${pax} Quartos
            </span>
            <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Saving: R$ ${hosp.savingTotalHospedagem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#080c14]/80 text-slate-500 uppercase font-medium border-b border-slate-800 text-[10px] tracking-wider">
              <tr>
                <th class="px-3.5 py-2 w-8 text-center">Ativar</th>
                <th class="px-3.5 py-2">Hotel Homologado & Localização</th>
                <th class="px-3.5 py-2 text-center">Distância</th>
                <th class="px-3.5 py-2 text-center">Capacidade & Bloco</th>
                <th class="px-3.5 py-2 text-center">Quartos Alocados (Ajuste)</th>
                <th class="px-3.5 py-2 text-center">Ocupação</th>
                <th class="px-3.5 py-2 text-right">Diária MICE</th>
                <th class="px-3.5 py-2 text-right">Investimento</th>
                <th class="px-3.5 py-2 text-right">Saving</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-300">
              ${listaHoteis.map(h => {
                const ativo = h.quartosAlocados > 0;
                return `
                  <tr class="hover:bg-[#080c14]/60 transition ${ativo ? 'bg-indigo-50/15' : 'opacity-60 bg-[#080c14]/40'}">
                    <td class="px-3.5 py-2.5 text-center">
                      <input type="checkbox" ${ativo ? 'checked' : ''} onchange="toggleHotelAtivo('${h.hotelId}', this.checked)" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer">
                    </td>
                    <td class="px-3.5 py-2.5 font-semibold text-white">
                      <div class="flex items-center space-x-1.5">
                        <span class="${ativo ? 'text-white font-bold' : 'text-slate-400'}">${h.nome}</span>
                        ${h.cafeIncluso ? '<span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-normal">Café Inc.</span>' : ''}
                      </div>
                      <div class="text-[10px] text-slate-500 font-normal">${h.bairro} &middot; ${h.bolsaoTaxi}</div>
                    </td>
                    <td class="px-3.5 py-2.5 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">${h.distanciaKm} km</td>
                    <td class="px-3.5 py-2.5 text-center text-slate-400 whitespace-nowrap">
                      <span class="font-bold text-slate-200">${h.maxRoomBlock}</span> / ${h.capacidadeTotalHotel} qts
                    </td>
                    <td class="px-3.5 py-2.5 text-center whitespace-nowrap">
                      <div class="inline-flex items-center space-x-1 bg-[#0f172a] border border-slate-300 rounded-lg p-0.5 shadow-2xs">
                        <button onclick="alterarQuartosHotel('${h.hotelId}', -10)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-200 text-slate-300 font-bold text-xs flex items-center justify-center transition">-</button>
                        <input type="number" min="0" max="${h.capacidadeTotalHotel}" step="5" value="${h.quartosAlocados}" onchange="definirQuartosHotel('${h.hotelId}', this.value)" class="w-14 text-center font-bold text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 py-0.5">
                        <button onclick="alterarQuartosHotel('${h.hotelId}', 10)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-200 text-slate-300 font-bold text-xs flex items-center justify-center transition">+</button>
                        <button onclick="definirQuartosHotel('${h.hotelId}', ${h.maxRoomBlock})" title="Preencher com o Room Block Máximo deste Hotel" class="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold border border-indigo-200 transition">Max</button>
                        <button onclick="definirQuartosHotel('${h.hotelId}', 0)" title="Zerar quartos deste hotel" class="px-1.5 py-0.5 rounded text-[10px] bg-[#080c14] text-slate-500 hover:bg-slate-800 font-semibold transition">0</button>
                      </div>
                    </td>
                    <td class="px-3.5 py-2.5 text-center whitespace-nowrap">
                      <div class="flex items-center justify-center space-x-1">
                        <span class="text-[11px] font-semibold text-slate-300">${h.percentualOcupacaoDoHotel}%</span>
                        <div class="w-10 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div class="${h.percentualOcupacaoDoHotel > 85 ? 'bg-amber-500' : 'bg-indigo-600'} h-full rounded-full" style="width: ${Math.min(100, h.percentualOcupacaoDoHotel)}%"></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-3.5 py-2.5 text-right font-mono text-slate-200 whitespace-nowrap">R$ ${h.diariaNegociadaMICE.toFixed(2)}</td>
                    <td class="px-3.5 py-2.5 text-right font-bold text-white whitespace-nowrap">R$ ${h.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td class="px-3.5 py-2.5 text-right font-bold text-emerald-700 whitespace-nowrap">R$ ${h.savingGeradoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                `;
              }).join('')}
              <tr class="bg-slate-800/90 font-bold border-t border-slate-300 text-white">
                <td class="px-3.5 py-2.5 text-center">&mdash;</td>
                <td class="px-3.5 py-2.5">TOTAL ALOCADO (${hosp.hoteisUtilizadosQtd} HOTÉIS ATIVOS)</td>
                <td class="px-3.5 py-2.5 text-center font-mono text-[11px]">&mdash;</td>
                <td class="px-3.5 py-2.5 text-center text-slate-400">&mdash;</td>
                <td class="px-3.5 py-2.5 text-center text-indigo-800 bg-indigo-100/60 font-bold">${hosp.totalQuartosAlocados} Quartos</td>
                <td class="px-3.5 py-2.5 text-center font-mono text-[11px]">${hosp.totalRoomNights.toLocaleString('pt-BR')} Room Nights</td>
                <td class="px-3.5 py-2.5 text-right">&mdash;</td>
                <td class="px-3.5 py-2.5 text-right text-white">R$ ${hosp.custoTotalHospedagem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td class="px-3.5 py-2.5 text-right text-emerald-800">R$ ${hosp.savingTotalHospedagem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2. TABELA INTERATIVA DE COOPERATIVAS DE TÁXI -->
      <div class="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-2xs space-y-0">
        <div class="p-3 bg-[#080c14] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-amber-100 text-amber-700"><i data-lucide="car" class="w-3.5 h-3.5"></i></span>
            <div>
              <h4 class="text-xs font-bold text-white uppercase tracking-wide">2. Cooperativas de Táxi Homologadas &middot; Divisão de Frota Dedicada</h4>
              <p class="text-[11px] text-slate-500">Escolha quais cooperativas atenderão o evento e ajuste a quantidade de táxis simultâneos em cada uma.</p>
            </div>
          </div>
          <div class="text-right flex items-center space-x-2">
            ${listaCooperativas.length > 1 ? `
              <button onclick="dividirTaxisIgualmente()" class="px-2 py-0.5 bg-white hover:bg-[#080c14] border border-slate-300 text-slate-300 rounded text-xs font-semibold transition">
                ⚖️ Dividir 50/50
              </button>
            ` : ''}
            <span class="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Frota Mobilizada: ${tax.taxisSimultaneosPico} Táxis
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#080c14]/80 text-slate-500 uppercase font-medium border-b border-slate-800 text-[10px] tracking-wider">
              <tr>
                <th class="px-3.5 py-2">Cooperativa de Táxi Homologada</th>
                <th class="px-3.5 py-2 text-center">Frota Total</th>
                <th class="px-3.5 py-2 text-center">Táxis Mobilizados (Ajuste)</th>
                <th class="px-3.5 py-2 text-center">Corridas Previstas</th>
                <th class="px-3.5 py-2 text-center">SLA Chegada</th>
                <th class="px-3.5 py-2">Corredores de Ônibus</th>
                <th class="px-3.5 py-2 text-right">Investimento</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-300">
              ${listaCooperativas.map(c => `
                <tr class="hover:bg-[#080c14]/60 transition ${c.veiculosMobilizados > 0 ? 'bg-amber-50/15' : 'opacity-60'}">
                  <td class="px-3.5 py-2.5 font-semibold text-white">
                    <div>${c.nome}</div>
                    <div class="text-[10px] text-slate-500 font-normal">${c.modalidadeVoucher}</div>
                  </td>
                  <td class="px-3.5 py-2.5 text-center text-slate-400">${c.frotaTotalDisponivel} carros</td>
                  <td class="px-3.5 py-2.5 text-center whitespace-nowrap">
                    <div class="inline-flex items-center space-x-1 bg-[#0f172a] border border-slate-300 rounded-lg p-0.5 shadow-2xs">
                      <button onclick="alterarTaxisCooperativa('${c.cooperativaId}', -10)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-200 text-slate-300 font-bold text-xs flex items-center justify-center transition">-</button>
                      <input type="number" min="0" max="${c.frotaTotalDisponivel}" step="5" value="${c.veiculosMobilizados}" onchange="definirTaxisCooperativa('${c.cooperativaId}', this.value)" class="w-14 text-center font-bold text-xs text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500 py-0.5">
                      <button onclick="alterarTaxisCooperativa('${c.cooperativaId}', 10)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-200 text-slate-300 font-bold text-xs flex items-center justify-center transition">+</button>
                      <button onclick="definirTaxisCooperativa('${c.cooperativaId}', 0)" class="px-1.5 py-0.5 rounded text-[10px] bg-[#080c14] text-slate-500 hover:bg-slate-800 font-semibold transition">0</button>
                    </div>
                  </td>
                  <td class="px-3.5 py-2.5 text-center font-semibold text-slate-200">${c.corridasAlocadas.toLocaleString('pt-BR')} corridas</td>
                  <td class="px-3.5 py-2.5 text-center font-mono text-[11px] text-emerald-700 font-bold">${c.slaMedioMinutos} min</td>
                  <td class="px-3.5 py-2.5">
                    <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ 100% Faixa Exclusiva
                    </span>
                  </td>
                  <td class="px-3.5 py-2.5 text-right font-bold text-white whitespace-nowrap">R$ ${c.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. GRADE COMPLEMENTAR INTERATIVA: SHUTTLES, AÉREO E GASTRONOMIA -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        
        <!-- Fretamento & Shuttles -->
        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-2 shadow-2xs">
          <div class="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <i data-lucide="bus" class="w-3.5 h-3.5 text-purple-600"></i>
              <span>3. Shuttles & Fretamento</span>
            </span>
            <span class="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[10px]">${shut.veiculosAlocados.totalVeiculos} Veículos</span>
          </div>
          <div class="font-bold text-white">${shut.empresaResponsavel}</div>
          
          <!-- Steppers de Ônibus e Vans -->
          <div class="space-y-2 pt-1">
            <div class="flex items-center justify-between bg-[#080c14] p-1.5 rounded border border-slate-800">
              <span class="text-[11px] font-medium text-slate-300">Ônibus (46p):</span>
              <div class="flex items-center space-x-1">
                <button onclick="alterarVeiculosShuttle('onibus', -1)" class="w-5 h-5 rounded bg-[#0f172a] border border-slate-300 font-bold text-slate-300 hover:bg-slate-800">-</button>
                <span class="w-8 text-center font-bold text-white font-mono">${shut.veiculosAlocados.onibusExecutivos46Lugares}</span>
                <button onclick="alterarVeiculosShuttle('onibus', 1)" class="w-5 h-5 rounded bg-[#0f172a] border border-slate-300 font-bold text-slate-300 hover:bg-slate-800">+</button>
              </div>
            </div>

            <div class="flex items-center justify-between bg-[#080c14] p-1.5 rounded border border-slate-800">
              <span class="text-[11px] font-medium text-slate-300">Vans Executivas (15p):</span>
              <div class="flex items-center space-x-1">
                <button onclick="alterarVeiculosShuttle('vans', -1)" class="w-5 h-5 rounded bg-[#0f172a] border border-slate-300 font-bold text-slate-300 hover:bg-slate-800">-</button>
                <span class="w-8 text-center font-bold text-white font-mono">${shut.veiculosAlocados.vansExecutivas15Lugares}</span>
                <button onclick="alterarVeiculosShuttle('vans', 1)" class="w-5 h-5 rounded bg-[#0f172a] border border-slate-300 font-bold text-slate-300 hover:bg-slate-800">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Aéreo Copastur -->
        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-2 shadow-2xs">
          <div class="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <i data-lucide="plane" class="w-3.5 h-3.5 text-blue-600"></i>
              <span>4. Logística Aérea (Copastur)</span>
            </span>
            <span class="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">${aer.gestaoAerea.passagensEstimadas} Bilhetes</span>
          </div>
          <div class="font-bold text-white">${aer.aeroportoPrincipal}</div>
          
          <div class="flex items-center justify-between bg-[#080c14] p-1.5 rounded border border-slate-800 pt-1">
            <span class="text-[11px] font-medium text-slate-300">Passagens a Emitir:</span>
            <div class="flex items-center space-x-1">
              <button onclick="alterarPassagensAereas(-50)" class="px-1.5 py-0.5 rounded bg-[#0f172a] border border-slate-300 font-bold text-slate-300 hover:bg-slate-800">-50</button>
              <span class="w-12 text-center font-bold text-white font-mono">${aer.gestaoAerea.passagensEstimadas}</span>
              <button onclick="alterarPassagensAereas(50)" class="px-1.5 py-0.5 rounded bg-[#0f172a] border border-slate-300 font-bold text-slate-300 hover:bg-slate-800">+50</button>
            </div>
          </div>
          <div class="text-[10px] text-slate-500 bg-white p-1 rounded border border-slate-800">
            Fee Unitário: <strong>R$ ${aer.gestaoAerea.feeUnitario.toFixed(2)}</strong> &middot; Franquia 23kg inclusa
          </div>
        </div>

        <!-- Gastronomia MICE -->
        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-2 shadow-2xs">
          <div class="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <i data-lucide="utensils" class="w-3.5 h-3.5 text-rose-600"></i>
              <span>5. Gastronomia MICE</span>
            </span>
            <span class="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">${gast.totalJantaresPlanejados} Jantares</span>
          </div>
          <div class="font-bold text-white">${gast.restaurantePrincipal}</div>
          
          <div class="flex items-center justify-between bg-[#080c14] p-1.5 rounded border border-slate-800 pt-1">
            <span class="text-[11px] font-medium text-slate-300">Jantares Corporativos:</span>
            <div class="flex items-center space-x-1">
              <button onclick="alterarJantaresGastronomia(-1)" class="w-5 h-5 rounded bg-[#0f172a] border border-slate-300 font-bold text-slate-300 hover:bg-slate-800">-</button>
              <span class="w-8 text-center font-bold text-white font-mono">${gast.totalJantaresPlanejados}</span>
              <button onclick="alterarJantaresGastronomia(1)" class="w-5 h-5 rounded bg-[#0f172a] border border-slate-300 font-bold text-slate-300 hover:bg-slate-800">+</button>
            </div>
          </div>
          <div class="text-[10px] text-slate-500 bg-white p-1 rounded border border-slate-800">
            Capacidade: <strong>${gast.capacidadeSalas} pax</strong> &middot; Menu fechado com salas VIP
          </div>
        </div>

      </div>

      <!-- 4. CONSOLIDAÇÃO FINANCEIRA & MARGEM DA AGÊNCIA -->
      <div class="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div class="space-y-1">
          <div class="text-[11px] text-slate-400 uppercase font-semibold flex items-center space-x-1.5">
            <span>Resumo Consolidado da Alocação (${pax} Participantes)</span>
            ${modoAlocacaoManualAtivo ? '<span class="bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 text-[9px] px-1.5 py-0.2 rounded font-bold">Personalizado</span>' : ''}
          </div>
          <div class="text-lg font-bold text-white">
            Investimento Total: R$ ${fin.investimentoTotalCliente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div class="text-xs text-slate-300">
            (R$ ${fin.investimentoPorParticipante.toLocaleString('pt-BR')}/participante com tudo incluso &middot; ${fin.faturamentoModalidade})
          </div>
        </div>

        <div class="flex items-center space-x-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
          <div>
            <div class="text-[10px] text-emerald-400 uppercase font-semibold">Saving Auditável</div>
            <div class="text-base font-bold text-emerald-400">R$ ${fin.savingTotalAuditavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="text-[10px] text-slate-400">${fin.savingPercentual}% de economia vs. balcão</div>
          </div>
          <div>
            <div class="text-[10px] text-amber-400 uppercase font-semibold">Comissão da Agência</div>
            <div class="text-base font-bold text-amber-400">R$ ${fin.receitaComissaoAgenciaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="text-[10px] text-slate-400">Repasses consolidados da rede</div>
          </div>
        </div>
      </div>
    `;

    // Atualizar Floating Action Dock
    const floatingDock = document.getElementById('floating-action-dock');
    if (floatingDock) {
      floatingDock.classList.remove('hidden');
      const dInv = document.getElementById('dock-investimento');
      const dSav = document.getElementById('dock-saving');
      const dCom = document.getElementById('dock-comissao');
      if (dInv) dInv.innerText = `R$ ${fin.investimentoTotalCliente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      if (dSav) dSav.innerText = `R$ ${fin.savingTotalAuditavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${fin.savingPercentual}%)`;
      if (dCom) dCom.innerText = `R$ ${fin.receitaComissaoAgenciaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    lucide.createIcons();
  } catch (err) {
    console.error('Erro na orquestração 360:', err);
    container.innerHTML = `<div class="p-4 bg-rose-50 text-rose-800 rounded-lg text-xs">Erro ao calcular orquestração da jornada: ${err.message}</div>`;
  }
}

function abrirPropostaExecutivaNovaAba() {
  const item = eventoSelecionadoDossie || pipelineState[eventoAtivoIndex];
  if (!item) return;
  window.open(`/proposta/${item.evento.id}?p=${participantesSimuladosDossie}`, '_blank');
}

// ----------------------------------------------------------------
// 3. MÓDULO INTELIGÊNCIA PREDITIVA (RECORRÊNCIA ANUAL)
// ----------------------------------------------------------------

async function carregarPreditivo(ano = 2027) {
  try {
    const res = await fetch(`/api/predictive?ano=${ano}`);
    preditivoState = await res.json();
    preditivosFiltradosState = [...preditivoState.eventos];

    document.getElementById('kpi-pred-taxa').innerText = `${preditivoState.taxaMediaRecorrenciaPct}%`;
    document.getElementById('kpi-pred-room-nights').innerText = preditivoState.totalRoomNightsProjetados.toLocaleString('pt-BR');
    document.getElementById('kpi-pred-saving').innerText = `${preditivoState.savingMedioAntecipacaoPct}%`;

    renderizarTabelaPreditiva();
  } catch (err) {
    console.error('Erro ao carregar inteligência preditiva:', err);
  }
}

function alterarAnoPreditivo(ano) {
  anoPreditivoSelecionado = parseInt(ano);
  carregarPreditivo(anoPreditivoSelecionado);
}

function aplicarFiltrosPreditivos() {
  const termoBusca = (document.getElementById('filtro-busca-pred').value || '').toLowerCase().trim();
  const poloFiltro = (document.getElementById('filtro-polo-pred') ? document.getElementById('filtro-polo-pred').value : 'todos');
  const certezaFiltro = document.getElementById('filtro-certeza-pred').value;
  const janelaFiltro = document.getElementById('filtro-janela-pred').value;

  preditivosFiltradosState = preditivoState.eventos.filter(evt => {
    const nome = (evt.nomeEdicaoProjetada || '').toLowerCase();
    const segmento = (evt.segmento || '').toLowerCase();
    const matchBusca = !termoBusca || nome.includes(termoBusca) || segmento.includes(termoBusca);

    const matchPolo = poloFiltro === 'todos' || evt.localProvavel === poloFiltro;

    let matchCerteza = true;
    if (certezaFiltro === 'tier1') matchCerteza = evt.probabilidadeRecorrencia >= 98;
    if (certezaFiltro === 'tier2') matchCerteza = evt.probabilidadeRecorrencia >= 95;

    let matchJanela = true;
    if (janelaFiltro !== 'todos') matchJanela = evt.statusJanelaAbordagem === janelaFiltro;

    return matchBusca && matchPolo && matchCerteza && matchJanela;
  });

  renderizarTabelaPreditiva();
}

function renderizarTabelaPreditiva() {
  const corpo = document.getElementById('tabela-preditiva-corpo');
  if (!corpo || !preditivoState) return;
  corpo.innerHTML = '';

  const polosNomes = {
    'sp_expo': 'São Paulo Expo (Capital)',
    'transamerica_expo': 'Transamerica Expo (Capital)',
    'anhembi': 'Distrito Anhembi (Capital)',
    'frei_caneca': 'Frei Caneca (Capital)',
    'wds_wtc': 'WTC Berrini (Capital)',
    'allianz_parque': 'Allianz Parque & Espaço Unimed',
    'interlagos_arena': 'Autódromo Interlagos (Lolla / The Town)',
    'morumbi_estadio': 'Estádio do MorumBIS (Shows)',
    'barretos_parque_peao': 'Parque do Peão de Barretos',
    'ibirapuera_arenas': 'Parque Ibirapuera (C6 Fest / Turá)',
    'ribeirao_preto': 'Polo Ribeirão Preto (João Rock)',
    'campinas_resorts': 'Polo Campinas (Jaguariúna / Americana)',
    'sao_jose_rio_preto_aracatuba': 'Polo Noroeste Paulista',
    'piracicaba_agtech': 'Polo Piracicaba & Paranapanema',
    'santos_litoral': 'Polo Baixada Santista',
    'campos_jordao': 'Polo Campos do Jordão (Fest. Inverno)'
  };

  preditivosFiltradosState.forEach(evt => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-slate-800/50 cursor-pointer transition text-xs border-b border-slate-800/80';
    row.onclick = () => abrirModalPreditivoDetalhe(evt.idProjetado);

    const probBarWidth = evt.probabilidadeRecorrencia;
    const localStr = polosNomes[evt.localProvavel] || evt.localProvavel;

    const decisoresPreview = (evt.personasDecisorasMapeadas || []).slice(0, 2).map(p => `
      <span class="inline-block bg-[#080c14] text-slate-300 px-2 py-0.5 rounded text-[10.5px] border border-slate-800 truncate max-w-[180px]">${p.cargo}</span>
    `).join(' ');

    const isJanelaAberta = (evt.statusJanelaAbordagem || '').includes('JANELA_ABERTA');
    const badgeStatus = isJanelaAberta
      ? `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Janela Aberta</span>`
      : `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Pré-Aquecimento</span>`;

    row.innerHTML = `
      <td class="px-3.5 py-3 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <span class="font-bold font-mono text-sm text-white">${evt.probabilidadeRecorrencia}%</span>
          <div class="w-14 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" style="width: ${probBarWidth}%"></div>
          </div>
        </div>
      </td>
      <td class="px-3.5 py-3 max-w-[280px]">
        <div class="font-bold text-[13px] text-white hover:text-indigo-300 transition truncate">${evt.nomeEdicaoProjetada}</div>
        <div class="text-[11px] text-slate-400 truncate mt-0.5">${evt.segmento}</div>
      </td>
      <td class="px-3.5 py-3 whitespace-nowrap text-slate-400">
        <div class="font-mono text-xs text-white font-semibold">${evt.dataInicioEstimada} (${evt.diasDuracao}d)</div>
        <div class="text-[10.5px] text-slate-400 mt-0.5">${localStr}</div>
      </td>
      <td class="px-3.5 py-3 text-right whitespace-nowrap font-mono">
        <div class="font-bold text-xs text-white">${evt.demandaProjetada.publicoTotal.toLocaleString('pt-BR')} pax</div>
        <div class="text-[10.5px] text-indigo-300 font-semibold">${(evt.demandaProjetada.roomNightsEstimadas || Math.round(evt.demandaProjetada.publicoTotal * 0.55 * evt.diasDuracao)).toLocaleString('pt-BR')} qts</div>
      </td>
      <td class="px-3.5 py-3 whitespace-nowrap">
        ${badgeStatus}
      </td>
      <td class="px-3.5 py-3 max-w-xs space-y-1">
        ${decisoresPreview}
      </td>
      <td class="px-3.5 py-3 text-right whitespace-nowrap">
        <div class="flex items-center justify-end space-x-1.5">
          <button onclick="event.stopPropagation(); abrirModalDebriefingHistorico('${evt.eventoBaseId}')" class="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 font-semibold text-xs border border-indigo-800/80 transition inline-flex items-center space-x-1" title="Ver telemetria real de hotéis, táxis vs apps da edição anterior">
            <i data-lucide="history" class="w-3.5 h-3.5 text-indigo-400"></i>
            <span>Dossiê Histórico</span>
          </button>
          <button onclick="event.stopPropagation(); abrirModalPreditivoDetalhe('${evt.idProjetado}')" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition inline-flex items-center space-x-1 shadow-xs">
            <span>Tese &rarr;</span>
          </button>
        </div>
      </td>
    `;

    corpo.appendChild(row);
  });
  lucide.createIcons();

  const rodape = document.getElementById('tabela-preditiva-rodape');
  if (rodape) {
    rodape.innerHTML = `
      <span>Exibindo <strong>${preditivosFiltradosState.length}</strong> de <strong>${preditivoState.eventos.length}</strong> eventos de alta previsibilidade para o Ciclo ${anoPreditivoSelecionado}</span>
      <span>Clique em <strong>Dossiê Pós-Evento</strong> para auditar onde se hospedaram e como se moveram nas edições anteriores</span>
    `;
  }

  lucide.createIcons();
}

function abrirModalPreditivoDetalhe(idProjetado) {
  const evt = preditivoState.eventos.find(e => e.idProjetado === idProjetado);
  if (!evt) return;

  eventoPreditivoSelecionado = evt;
  const container = document.getElementById('conteudo-preditivo-detalhe');

  // Buscar dados de logística do polo
  const poloLogistica = logisticaPolosState.find(p => p.id === evt.localProvavel) || {};

  container.innerHTML = `
    <!-- Header do Evento Preditivo -->
    <div class="bg-[#080c14] p-4 rounded-xl border border-slate-800 space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
          Probabilidade Matemática: ${evt.probabilidadeRecorrencia}% [${evt.certezaClassificacao}]
        </span>
        <span class="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-800">${evt.idProjetado}</span>
      </div>
      <h3 class="text-base font-bold text-white">${evt.nomeEdicaoProjetada}</h3>
      <p class="text-xs text-slate-400">${evt.alertaJanela}</p>
      <div class="pt-1">
        <button onclick="abrirModalDebriefingHistorico('${evt.eventoBaseId}')" class="px-3 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-xs transition">
          <i data-lucide="history" class="w-3.5 h-3.5 text-indigo-300"></i>
          <span>📊 Ver Resultados Finais & Onde se Hospedaram na Edição Anterior</span>
        </button>
      </div>
    </div>

    <!-- Grade: Métricas Preditivas -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <div class="bg-white p-2.5 rounded-lg border border-slate-800">
        <span class="text-[10px] text-slate-500 block uppercase font-medium">Público Projetado</span>
        <span class="text-sm font-bold text-white">${evt.demandaProjetada.publicoTotal.toLocaleString('pt-BR')} pax</span>
        <span class="text-[10px] text-slate-500 block">+${evt.demandaProjetada.crescimentoEstimadoPct}% CAGR anual</span>
      </div>
      <div class="bg-white p-2.5 rounded-lg border border-slate-800">
        <span class="text-[10px] text-slate-500 block uppercase font-medium">Room Nights Mapeadas</span>
        <span class="text-sm font-bold text-indigo-600">${evt.demandaProjetada.roomNights.toLocaleString('pt-BR')}</span>
        <span class="text-[10px] text-slate-500 block">${evt.diasDuracao} dias de ocupação</span>
      </div>
      <div class="bg-white p-2.5 rounded-lg border border-slate-800">
        <span class="text-[10px] text-slate-500 block uppercase font-medium">Transfers & Táxis Estimados</span>
        <span class="text-sm font-bold text-white">${evt.demandaProjetada.transfersAeroporto.toLocaleString('pt-BR')}</span>
        <span class="text-[10px] text-slate-500 block">CGH / GRU / RAO / VCP</span>
      </div>
      <div class="bg-white p-2.5 rounded-lg border border-slate-800">
        <span class="text-[10px] text-slate-500 block uppercase font-medium">Comissão Estimada (11%)</span>
        <span class="text-sm font-bold text-emerald-800">R$ ${evt.comissaoEstimadaGisele.toLocaleString('pt-BR')}</span>
        <span class="text-[10px] text-slate-500 block">Sobre R$ ${(evt.demandaProjetada.budgetEstimadoMICE/1000000).toFixed(1)}M MICE</span>
      </div>
    </div>

    <!-- Posicionamento Estratégico de Táxis & Hotéis de Raio Próximo -->
    ${poloLogistica.nome ? `
      <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-2">
        <span class="font-bold text-white text-xs block uppercase">📍 Hub Operacional: ${poloLogistica.nome}</span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div class="bg-white p-2 rounded-lg border border-slate-800 space-y-1">
            <span class="font-bold text-slate-200 text-[11px] block">🏨 Hotel de Menor Raio Homologado:</span>
            <div class="font-semibold text-white">${poloLogistica.hoteisRaioCurto[0]?.nome || 'Hotel Parceiro'}</div>
            <div class="text-[10px] text-slate-500">${poloLogistica.hoteisRaioCurto[0]?.distanciaKm || 2.0} km de distância &middot; ~${poloLogistica.hoteisRaioCurto[0]?.tempoMin || 5} min</div>
          </div>
          <div class="bg-white p-2 rounded-lg border border-slate-800 space-y-1">
            <span class="font-bold text-slate-200 text-[11px] block">🚕 Bolsão de Despacho Chame Táxi:</span>
            <p class="text-[11px] text-slate-400 leading-snug">
              ${poloLogistica.bolsoesTaxiEstrategicos[0]?.nomeBolsao || 'Bolsão de embarque rápido com voucher digital.'}
            </p>
            <div class="text-[10px] text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-200 mt-1">
              <strong>SLA:</strong> ${poloLogistica.bolsoesTaxiEstrategicos[0]?.tempoMedioRespostaMin || 4} min &middot; ${poloLogistica.bolsoesTaxiEstrategicos[0]?.capacidadeEstocagem || 'Fila contínua'}
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Cronograma Reverso de Abordagem Pré-RFP -->
    <div class="bg-white p-4 rounded-xl border border-slate-800 space-y-3">
      <h4 class="font-bold text-xs text-white uppercase tracking-wider">Cronograma Reverso de Abordagem Antecipada (Geração de Saving)</h4>
      
      <div class="space-y-2 text-xs">
        <div class="flex items-start space-x-2.5 p-2 rounded-lg bg-[#0f172a] border border-slate-800">
          <span class="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">D-180</span>
          <div>
            <div class="font-semibold text-white">Bloqueio Prévio de Tarifário MICE na Rede Hoteleira</div>
            <div class="text-[11px] text-slate-400">Travar room block de 100 a 300 quartos com tarifa corporativa de baixa temporada (saving de ~22.5%).</div>
          </div>
        </div>

        <div class="flex items-start space-x-2.5 p-2 rounded-lg bg-[#0f172a] border border-slate-800">
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono text-[10px] font-bold">D-150</span>
          <div>
            <div class="font-semibold text-white">Contato Consultivo com Compras Indiretas / MICE</div>
            <div class="text-[11px] text-slate-400">Apresentação dos cenários orçamentários prontos antes da abertura formal de concorrência ou RFP.</div>
          </div>
        </div>

        <div class="flex items-start space-x-2.5 p-2 rounded-lg bg-[#0f172a] border border-slate-800">
          <span class="px-1.5 py-0.5 rounded bg-slate-700 text-white font-mono text-[10px] font-bold">D-120</span>
          <div>
            <div class="font-semibold text-white">Assinatura de Acordo de Intermediação & Emissão de Vouchers</div>
            <div class="text-[11px] text-slate-400">Formalização de faturamento direto com Chame Táxi, Copastur e hotelaria credenciada.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Personas Decisoras Mapeadas -->
    <div class="bg-white p-4 rounded-xl border border-slate-800 space-y-2.5">
      <h4 class="font-bold text-xs text-white uppercase tracking-wider">Decisores-Alvo Mapeados para este Evento</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        ${(evt.personasDecisorasMapeadas || []).map(p => `
          <div class="p-2.5 rounded-lg bg-[#0f172a] border border-slate-800 space-y-0.5">
            <div class="font-bold text-white text-xs">${p.cargo}</div>
            <div class="text-[11px] text-slate-500">${p.departamento}</div>
            <div class="text-[10px] text-slate-400 font-medium">Janela ideal de contato: D-${p.janelaAntecedenciaDias}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('modal-preditivo-detalhe').classList.remove('hidden');
  document.getElementById('modal-preditivo-detalhe').classList.add('flex');
  lucide.createIcons();
}

function fecharModalPreditivoDetalhe() {
  document.getElementById('modal-preditivo-detalhe').classList.add('hidden');
  document.getElementById('modal-preditivo-detalhe').classList.remove('flex');
}

function copiarMinutaAbordagemAntecipada() {
  if (!eventoPreditivoSelecionado) return;
  const evt = eventoPreditivoSelecionado;
  const decisorCargo = evt.personasDecisorasMapeadas[0]?.cargo || 'Diretoria de Compras e MICE';

  const texto = `À Atenção de: ${decisorCargo}
Ref.: Planejamento Antecipado de Hospedagem e Mobilidade Corporativa — ${evt.nomeEdicaoProjetada}

Prezados,

Com base na inteligência preditiva de demanda do nosso ecossistema MICE em São Paulo, já mapeamos a realização do ${evt.nomeEdicaoProjetada} para ${evt.dataInicioEstimada}.

Para evitar a inflação tarifária típica dos períodos que antecedem a abertura de RFPs, estruturamos antecipadamente o contingenciamento de:
1. Bloqueio prévio de apartamentos na rede hoteleira parceira com até 22,5% de economia sobre a tarifa balcão.
2. Faturamento direto e vouchers corporativos com a Cooper Chame Táxi (com trânsito liberado nos corredores de ônibus de SP).
3. Emissão aérea IATA e logística de grupos corporativos através da Copastur.

Gostaríamos de apresentar a matriz de viabilidade operacional antes do fechamento de calendários do setor.

Atenciosamente,
Gestão de Inteligência Preditiva & Operações MICE (Gisele)`;

  navigator.clipboard.writeText(texto);
  alert('Minuta de abordagem antecipada copiada para a área de transferência!');
}

// ----------------------------------------------------------------
// 3.1 MÓDULO DEBRIEFING HISTÓRICO & PÓS-EVENTO (RESULTADOS FINAIS)
// ----------------------------------------------------------------

let dadosDebriefingAtivo = null;
let abaDebriefingAtiva = 'hotelaria';

async function abrirModalDebriefingHistorico(eventoBaseId) {
  try {
    const res = await fetch(`/api/preditivo/debriefing?eventoId=${eventoBaseId}`);
    dadosDebriefingAtivo = await res.json();

    document.getElementById('debriefing-titulo-evento').innerText = `${dadosDebriefingAtivo.nomeEvento} · Resultados Auditados`;
    document.getElementById('debriefing-subtitulo-evento').innerText = `${dadosDebriefingAtivo.edicaoReferencia} · Polo: ${dadosDebriefingAtivo.pavilhao} · ${dadosDebriefingAtivo.publicoTotalRegistrado.toLocaleString('pt-BR')} Participantes Registrados`;

    alternarAbaDebriefing('hotelaria');

    document.getElementById('modal-debriefing-historico').classList.remove('hidden');
    document.getElementById('modal-debriefing-historico').classList.add('flex');
    lucide.createIcons();
  } catch (err) {
    console.error('Erro ao carregar debriefing histórico:', err);
    alert('Erro ao carregar dados do debriefing pós-evento: ' + err.message);
  }
}

function fecharModalDebriefingHistorico() {
  document.getElementById('modal-debriefing-historico').classList.add('hidden');
  document.getElementById('modal-debriefing-historico').classList.remove('flex');
}

function alternarAbaDebriefing(aba) {
  abaDebriefingAtiva = aba;

  ['hotelaria', 'mobilidade', 'gargalos', 'preparacao'].forEach(a => {
    const btn = document.getElementById(`tab-debriefing-${a}`);
    if (btn) {
      if (a === aba) {
        btn.className = 'px-4 py-2 border-b-2 border-indigo-600 text-indigo-900 font-bold whitespace-nowrap';
      } else {
        btn.className = 'px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-white whitespace-nowrap';
      }
    }
  });

  renderizarConteudoDebriefing();
}

function renderizarConteudoDebriefing() {
  const container = document.getElementById('conteudo-debriefing-historico');
  if (!container || !dadosDebriefingAtivo) return;

  const d = dadosDebriefingAtivo;
  const h = d.hotelariaRealizada;
  const m = d.mobilidadeRealizada;

  if (abaDebriefingAtiva === 'hotelaria') {
    container.innerHTML = `
      <!-- Strip de KPIs Hoteleiros Realizados -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-3 shadow-2xs">
          <div class="text-[10px] text-indigo-700 uppercase font-bold">Room Nights Consumidas</div>
          <div class="text-lg font-bold text-indigo-950 mt-0.5">${h.totalRoomNightsConsumidas.toLocaleString('pt-BR')} Noites</div>
          <div class="text-[10px] text-indigo-600">${d.publicoDelegaçãoForaPraca.toLocaleString('pt-BR')} hóspedes de fora de SP</div>
        </div>

        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3 shadow-2xs">
          <div class="text-[10px] text-slate-500 uppercase font-bold">Ocupação da Rede Local</div>
          <div class="text-lg font-bold text-white mt-0.5">${d.taxaOcupacaoRedeHoteleira}% Lotação</div>
          <div class="text-[10px] text-rose-600 font-bold">Saturação crítica a D-75</div>
        </div>

        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3 shadow-2xs">
          <div class="text-[10px] text-slate-500 uppercase font-bold">Diária Balcão Pico vs MICE</div>
          <div class="text-lg font-bold text-white mt-0.5">R$ ${h.diariaBalcaoMediaPico.toFixed(0)} <span class="text-xs font-normal text-slate-500">vs</span> <span class="text-emerald-700 font-bold">R$ ${h.diariaMICEMedia.toFixed(0)}</span></div>
          <div class="text-[10px] text-emerald-700 font-semibold">Economia média de R$ ${(h.diariaBalcaoMediaPico - h.diariaMICEMedia).toFixed(0)}/noite</div>
        </div>

        <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 shadow-2xs">
          <div class="text-[10px] text-emerald-800 uppercase font-bold">Saving Histórico Gerado</div>
          <div class="text-lg font-bold text-emerald-900 mt-0.5">R$ ${(h.savingTotalHistoricoReais/1000000).toFixed(1)}M Total</div>
          <div class="text-[10px] text-emerald-800 font-semibold">Auditoria vs Compras Balcão</div>
        </div>
      </div>

      <!-- Tabela Detalhada dos Hotéis Mais Demandados -->
      <div class="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div class="p-3 bg-[#080c14] border-b border-slate-800 flex items-center justify-between">
          <h4 class="font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
            <i data-lucide="building" class="w-4 h-4 text-indigo-600"></i>
            <span>Mapeamento de Ocupação & Quartos Alocados por Hotel na Edição Anterior</span>
          </h4>
          <span class="text-[10px] bg-slate-200 text-slate-300 px-2 py-0.5 rounded font-bold">${h.hoteisUtilizados.length} Hotéis Homologados</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#080c14] text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th class="px-3 py-2">Hotel Homologado</th>
                <th class="px-3 py-2 text-center">Distância</th>
                <th class="px-3 py-2 text-center">Quartos & Noites</th>
                <th class="px-3 py-2">Perfil do Público Hospedado</th>
                <th class="px-3 py-2 text-right">Tarifa Balcão vs MICE</th>
                <th class="px-3 py-2 text-right">Status Esgotamento</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-300">
              ${h.hoteisUtilizados.map(ht => `
                <tr class="hover:bg-[#080c14] transition">
                  <td class="px-3 py-2.5">
                    <div class="font-bold text-white">${ht.hotelNome}</div>
                    <div class="text-[10px] text-slate-500 font-mono">Taxa Ocupação: ${ht.taxaOcupacao}%</div>
                  </td>
                  <td class="px-3 py-2.5 text-center font-mono font-bold text-slate-200 whitespace-nowrap">${ht.distanciaKm} km</td>
                  <td class="px-3 py-2.5 text-center whitespace-nowrap">
                    <span class="bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded font-bold">${ht.quartosOcupados} quartos</span>
                    <div class="text-[10px] text-slate-500 mt-0.5">${ht.roomNightsTotal} room nights</div>
                  </td>
                  <td class="px-3 py-2.5 text-[11px] text-slate-400 max-w-xs leading-snug">
                    ${ht.perfilPublico}
                  </td>
                  <td class="px-3 py-2.5 text-right whitespace-nowrap font-mono text-[11px]">
                    <span class="line-through text-slate-400">R$ ${ht.diariaBalcaoPico.toFixed(0)}</span>
                    <span class="font-bold text-emerald-800 ml-1">R$ ${ht.diariaMICE.toFixed(0)}</span>
                  </td>
                  <td class="px-3 py-2.5 text-right whitespace-nowrap">
                    <span class="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      ${ht.statusEsgotamento}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (abaDebriefingAtiva === 'mobilidade') {
    const t = m.taxisCooperativa;
    const a = m.carrosAplicativoUber99;
    const s = m.fretamentoShuttles;

    container.innerHTML = `
      <!-- Banner de Duelo com Barras Visuais -->
      <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-rose-950 text-white rounded-2xl p-4 border border-slate-700/60 shadow-lg space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <i data-lucide="swords" class="w-4 h-4 text-amber-400"></i>
            <span>Duelo Operacional: Bolsão Credenciado vs Aplicativos Avulsos</span>
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Diferencial Auditado MICE</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <!-- Métrica 1: Tempo de Espera -->
          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-400">Tempo de Espera:</span>
              <span class="text-emerald-400 font-bold font-mono">6 min vs 52 min</span>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div class="bg-emerald-500 h-full rounded-full" style="width: 12%"></div>
              <div class="bg-rose-500 h-full rounded-full" style="width: 88%"></div>
            </div>
            <div class="text-[10px] text-emerald-300 font-semibold text-right">⚡ -88% de fila na saída</div>
          </div>

          <!-- Métrica 2: Multiplicador de Tarifa -->
          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-400">Tarifa Dinâmica:</span>
              <span class="text-emerald-400 font-bold font-mono">1.0x vs 3.8x</span>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div class="bg-emerald-500 h-full rounded-full" style="width: 25%"></div>
              <div class="bg-rose-500 h-full rounded-full" style="width: 75%"></div>
            </div>
            <div class="text-[10px] text-emerald-300 font-semibold text-right">💰 Zero surpresa tarifária</div>
          </div>

          <!-- Métrica 3: Cancelamento -->
          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-400">Cancelamento:</span>
              <span class="text-emerald-400 font-bold font-mono">&lt;1% vs 34%</span>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div class="bg-emerald-500 h-full rounded-full" style="width: 3%"></div>
              <div class="bg-rose-500 h-full rounded-full" style="width: 97%"></div>
            </div>
            <div class="text-[10px] text-emerald-300 font-semibold text-right">🚫 Zero passageiros ilhados</div>
          </div>
        </div>
      </div>

      <!-- Comparativo Visual Direto: Táxi Homologado vs Aplicativos Uber/99 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Card 1: Cooperativa Homologada de Táxi -->
        <div class="bg-[#0f172a] border-2 border-emerald-500/40 rounded-xl p-4 space-y-3 shadow-xs">
          <div class="flex items-center justify-between border-b border-emerald-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="font-bold text-xs text-white uppercase tracking-wider">🚕 Táxis Credenciados & Cooperativa</span>
            </div>
            <span class="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold">Altíssima Eficiência</span>
          </div>

          <div class="font-bold text-white text-sm">${t.nomeCooperativa}</div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-[#080c14] p-2 rounded-lg border border-slate-800">
              <span class="text-[10px] text-slate-500 block uppercase">Tempo Médio de Espera</span>
              <span class="text-base font-bold text-emerald-700">${t.slaTempoEsperaMinutos} Minutos</span>
              <span class="text-[10px] text-slate-500 block">Bolsão prioritário na porta</span>
            </div>
            <div class="bg-[#080c14] p-2 rounded-lg border border-slate-800">
              <span class="text-[10px] text-slate-500 block uppercase">Tarifa Cobrada</span>
              <span class="text-base font-bold text-white">R$ ${t.tarifaMediaCobrada.toFixed(0)} Fixo</span>
              <span class="text-[10px] text-emerald-700 font-bold">Zero Tarifa Dinâmica</span>
            </div>
          </div>

          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between items-center bg-[#080c14] p-1.5 rounded border border-slate-800 text-[11px]">
              <span class="text-slate-400">Corridas Realizadas:</span>
              <span class="font-bold text-white">${t.totalCorridasRealizadas.toLocaleString('pt-BR')} corridas</span>
            </div>
            <div class="flex justify-between items-center bg-[#080c14] p-1.5 rounded border border-slate-800 text-[11px]">
              <span class="text-slate-400">Acesso a Corredores Expressos:</span>
              <span class="font-bold text-emerald-800">✅ 100% Liberado nas Faixas de Ônibus</span>
            </div>
            <div class="flex justify-between items-center bg-[#080c14] p-1.5 rounded border border-slate-800 text-[11px]">
              <span class="text-slate-400">Faturamento & Controle:</span>
              <span class="font-bold text-white">Voucher Digital QR Code Pós-Pago</span>
            </div>
            <div class="flex justify-between items-center bg-[#080c14] p-1.5 rounded border border-slate-800 text-[11px]">
              <span class="text-slate-400">Aprovação / Satisfação:</span>
              <span class="font-bold text-emerald-800">${t.avaliacaoSatisfacaoPct}% Nota 10</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed">
            <strong>Diferencial Operacional:</strong> ${t.beneficioChave}
          </div>
        </div>

        <!-- Card 2: Aplicativos Avulsos (Uber / 99) - O Caos Registrado -->
        <div class="bg-[#0f172a] border-2 border-rose-300 rounded-xl p-4 space-y-3 shadow-xs">
          <div class="flex items-center justify-between border-b border-rose-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span class="font-bold text-xs text-white uppercase tracking-wider">🚗 Carros de Aplicativo (Uber/99 Avulso)</span>
            </div>
            <span class="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] px-2 py-0.5 rounded font-bold">Gargalo Crítico</span>
          </div>

          <div class="font-bold text-white text-sm">Deslocamento Desordenado por App</div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-rose-50/60 p-2 rounded-lg border border-rose-200">
              <span class="text-[10px] text-rose-800 block uppercase font-bold">Tempo Médio de Espera</span>
              <span class="text-base font-bold text-rose-700">${a.tempoMedioEsperaPicoMinutos} Minutos</span>
              <span class="text-[10px] text-rose-800 block font-medium">Filas de mais de 1h na saída</span>
            </div>
            <div class="bg-rose-50/60 p-2 rounded-lg border border-rose-200">
              <span class="text-[10px] text-rose-800 block uppercase font-bold">Tarifa Dinâmica de Pico</span>
              <span class="text-base font-bold text-rose-700">${a.tarifaDinamicaPicoMultiplicador}x de Dinâmico</span>
              <span class="text-[10px] text-rose-800 block font-medium">R$ ${a.tarifaMediaPicoPaga.toFixed(0)} por corrida curta</span>
            </div>
          </div>

          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between items-center bg-[#080c14] p-1.5 rounded border border-slate-800 text-[11px]">
              <span class="text-slate-400">Chamadas Tentadas:</span>
              <span class="font-bold text-white">${a.totalChamadasRealizadas.toLocaleString('pt-BR')} chamadas</span>
            </div>
            <div class="flex justify-between items-center bg-[#080c14] p-1.5 rounded border border-slate-800 text-[11px]">
              <span class="text-slate-400">Taxa de Cancelamento por Motoristas:</span>
              <span class="font-bold text-rose-700">${a.taxaCancelamentoMotoristasPct}% Canceladas</span>
            </div>
            <div class="flex justify-between items-center bg-[#080c14] p-1.5 rounded border border-slate-800 text-[11px]">
              <span class="text-slate-400">Acesso a Corredores de Ônibus:</span>
              <span class="font-bold text-rose-700">❌ Proibido (Retido no congestionamento)</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-950 space-y-1">
            <strong>Reclamações Crônicas Registradas:</strong>
            <ul class="list-disc list-inside space-y-0.5 text-rose-900">
              ${a.principaisReclamacoes.slice(0, 3).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>

      </div>

      <!-- Fretamento de Shuttles Realizado -->
      <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
            <i data-lucide="bus" class="w-4 h-4 text-purple-600"></i>
            <span>Operação de Shuttles Circulares (Hotel ↔ Pavilhão)</span>
          </h4>
          <span class="bg-purple-100 text-purple-900 border border-purple-200 text-[10px] px-2 py-0.5 rounded font-bold">${s.pontualidadeRegistradaPct}% Pontualidade</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div class="bg-white p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block">Frota Operada</span>
            <span class="font-bold text-white text-sm">${s.totalOnibusOperados} Ônibus (46p) + ${s.totalVansOperadas} Vans (15p)</span>
          </div>
          <div class="bg-white p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block">Giros Circulares</span>
            <span class="font-bold text-white text-sm">${s.totalGirosRealizados} Viagens Realizadas</span>
          </div>
          <div class="bg-white p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block">Empresa Homologada</span>
            <span class="font-bold text-white text-sm">${s.empresaOperadora}</span>
          </div>
        </div>
      </div>
    `;
  } else if (abaDebriefingAtiva === 'gargalos') {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start space-x-2">
          <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-700 shrink-0 mt-0.5"></i>
          <div>
            <strong>Auditoria Post-Mortem Operacional:</strong> Os 3 maiores gargalos enfrentados por empresas que não anteciparam suas contratações com a central MICE na edição anterior.
          </div>
        </div>

        <div class="space-y-3">
          ${d.gargalosELicoesAprendidas.map((g, idx) => `
            <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2 shadow-2xs">
              <div class="flex items-center space-x-2">
                <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">${idx + 1}</span>
                <h4 class="font-bold text-xs text-white">${g.titulo}</h4>
              </div>
              <p class="text-xs text-slate-400 pl-7 leading-relaxed">${g.descricao}</p>
              <div class="ml-7 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                <strong class="text-emerald-900">🛡️ Lição & Solução Aplicada:</strong> ${g.licao}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (abaDebriefingAtiva === 'preparacao') {
    const p = d.planoPreparacaoProximaEdicao;

    container.innerHTML = `
      <div class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-4 space-y-3 shadow-md">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/40 text-indigo-200 border border-indigo-400/30 uppercase">Playbook de Antecipação MICE</span>
          <span class="text-xs font-mono text-emerald-400 font-bold">${p.savingEstimadoProximaEdicaoPct}% Saving Projetado</span>
        </div>
        <h3 class="text-base font-bold text-white">Estratégia de Captura & Blindagem de Inventário para o Próximo Ciclo</h3>
        <p class="text-xs text-slate-300 leading-snug">
          Janela de Ouro de Abordagem: <strong class="text-white">${p.janelaIdealAbordagem}</strong>. Ao travar as reservas antes da publicação das RFPs, a agência garante as menores tarifas e frota dedicada.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
          <div class="flex items-center space-x-1.5 text-indigo-900 font-bold">
            <i data-lucide="hotel" class="w-4 h-4 text-indigo-600"></i>
            <span>1. Hotelaria & Room Block Shield</span>
          </div>
          <p class="text-slate-400 text-[11px] leading-relaxed">${p.acao1_Hotelaria}</p>
        </div>

        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
          <div class="flex items-center space-x-1.5 text-emerald-900 font-bold">
            <i data-lucide="car" class="w-4 h-4 text-emerald-600"></i>
            <span>2. Mobilidade & Cooperativa de Táxi</span>
          </div>
          <p class="text-slate-400 text-[11px] leading-relaxed">${p.acao2_Mobilidade}</p>
        </div>

        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
          <div class="flex items-center space-x-1.5 text-purple-900 font-bold">
            <i data-lucide="bus" class="w-4 h-4 text-purple-600"></i>
            <span>3. Shuttles & Telemetria GPS</span>
          </div>
          <p class="text-slate-400 text-[11px] leading-relaxed">${p.acao3_Shuttles}</p>
        </div>

        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
          <div class="flex items-center space-x-1.5 text-rose-900 font-bold">
            <i data-lucide="utensils" class="w-4 h-4 text-rose-600"></i>
            <span>4. Gastronomia Corporativa</span>
          </div>
          <p class="text-slate-400 text-[11px] leading-relaxed">${p.acao4_Gastronomia}</p>
        </div>
      </div>
    `;
  }

  lucide.createIcons();
}

function aplicarDebriefingAoOrquestrador() {
  if (!dadosDebriefingAtivo) return;
  const evtId = dadosDebriefingAtivo.eventoBaseId;
  fecharModalDebriefingHistorico();
  fecharModalPreditivoDetalhe();
  abrirDetalheEvento(evtId);
}

// ----------------------------------------------------------------
// 4. MÓDULO LOGÍSTICA DE MOBILIDADE & POSICIONAMENTO
// ----------------------------------------------------------------

async function carregarLogisticaMobilidade() {
  try {
    const res = await fetch('/api/logistica-mobilidade');
    logisticaPolosState = await res.json();
    renderizarCardsLogisticaPolos();
  } catch (err) {
    console.error('Erro ao carregar logística de mobilidade:', err);
  }
}

function renderizarCardsLogisticaPolos() {
  const container = document.getElementById('container-polos-logistica');
  if (!container || !logisticaPolosState.length) return;
  container.innerHTML = '';

  logisticaPolosState.forEach(polo => {
    const card = document.createElement('div');
    card.className = 'bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-3.5';

    card.innerHTML = `
      <div class="flex items-start justify-between border-b border-slate-800 pb-2.5">
        <div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Centro de Convenções</span>
          <h4 class="font-bold text-sm text-white leading-snug">${polo.nome}</h4>
          <p class="text-[11px] text-slate-500 mt-0.5">${polo.endereco}</p>
        </div>
      </div>

      <!-- Hotéis de Raio Próximo -->
      <div class="space-y-1.5">
        <span class="text-[11px] font-bold text-slate-200 block uppercase">🏨 Hotéis Estratégicos de Raio Curto (< 5 km / 5-8 km):</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          ${polo.hoteisProximos.map(h => `
            <div class="bg-white p-2 rounded-md border border-slate-800 text-[11px]">
              <div class="font-semibold text-white">${h.nome}</div>
              <div class="text-slate-500">${h.perfil}</div>
              <div class="text-slate-200 font-mono font-medium mt-0.5">${h.distanciaKm} km &middot; ~${h.tempoMin} min</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Bolsões de Táxi -->
      <div class="space-y-1.5">
        <span class="text-[11px] font-bold text-slate-200 block uppercase">🚕 Bolsões Estratégicos de Despacho (Chame Táxi):</span>
        <div class="space-y-1.5">
          ${polo.bolsoesTaxiEstrategicos.map(b => `
            <div class="bg-white p-2.5 rounded-md border border-slate-800 space-y-1 text-xs">
              <div class="font-bold text-white text-[11px]">${b.nomeBolsao}</div>
              <div class="text-[11px] text-slate-400 leading-snug">${b.diferencialOperacional}</div>
              <div class="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                <span><strong>Horário de Pico:</strong> ${b.janelaCriticaHorario}</span>
                <span>&middot;</span>
                <span class="text-emerald-800 font-medium"><strong>SLA:</strong> ${b.tempoMedioRespostaMin} min</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Corredores Expressos -->
      <div class="bg-white p-2.5 rounded-md border border-slate-800 text-[11px] text-slate-300 space-y-1">
        <span class="font-semibold text-white block">🛣️ Rotas Expressas em Faixas Exclusivas de SP:</span>
        <ul class="list-disc list-inside space-y-0.5 text-slate-400">
          ${polo.corredoresExpressosAutorizados.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <!-- Dica Tática -->
      <div class="bg-slate-800 p-2.5 rounded-md border border-slate-800 text-[11px] text-slate-200">
        <span class="font-bold block text-white mb-0.5">💡 Estratégia de Operação MICE (Gisele):</span>
        ${polo.dicaTaticaGisele}
      </div>
    `;

    container.appendChild(card);
  });

  lucide.createIcons();
}

// ----------------------------------------------------------------
// 5. MÓDULO MAPA DE CALOR
// ----------------------------------------------------------------

async function carregarMapaCalor() {
  try {
    const res = await fetch('/api/heatmap');
    heatmapState = await res.json();
    renderizarPolosGeograficos();
    renderizarTimelineSazonalidade();
    lucide.createIcons();
  } catch (err) {
    console.error('Erro ao carregar mapa de calor:', err);
  }
}

function renderizarPolosGeograficos() {
  const container = document.getElementById('container-polos-geograficos');
  if (!container || !heatmapState) return;
  container.innerHTML = '';

  heatmapState.geografico.forEach(polo => {
    const isCritico = polo.nivelSaturacao.includes('ALTA') || polo.nivelSaturacao.includes('CRÍTICO');
    const isModerado = polo.nivelSaturacao.includes('MÉDIA') || polo.nivelSaturacao.includes('MODERAD');
    
    const badgeColor = isCritico 
      ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
      : isModerado
      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

    const dotColor = isCritico ? 'bg-rose-400' : isModerado ? 'bg-amber-400' : 'bg-emerald-400';
    const card = document.createElement('div');
    card.className = 'card-base p-4 space-y-3 flex flex-col justify-between hover:border-slate-700 transition';

    const gapEstimado = Math.max(0, polo.totalRoomNights - (polo.capacidadeRoomBlockRede * 3));

    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${polo.regiao}</span>
            <h4 class="font-bold text-[13px] text-white leading-tight mt-0.5">${polo.nome}</h4>
          </div>
          <span class="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}">
            <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span>
            ${polo.nivelSaturacao}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-[#090e1a] p-2.5 rounded-lg border border-slate-800/80">
            <span class="text-[10px] text-slate-400 font-medium block">Público Total</span>
            <span class="font-bold font-mono text-sm text-white">${polo.totalParticipantes.toLocaleString('pt-BR')} pax</span>
          </div>
          <div class="bg-[#090e1a] p-2.5 rounded-lg border border-slate-800/80">
            <span class="text-[10px] text-slate-400 font-medium block">Room Nights Demandadas</span>
            <span class="font-bold font-mono text-sm text-indigo-300">${polo.totalRoomNights.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div class="space-y-1.5 text-xs bg-[#090e1a] p-2.5 rounded-lg border border-slate-800/80">
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-slate-400">Cobertura da Rede Homologada:</span>
            <span class="font-mono font-bold text-white">${polo.capacidadeRoomBlockRede} quartos (${polo.taxaCoberturaRedePct}%)</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style="width: ${Math.min(100, Math.max(5, polo.taxaCoberturaRedePct))}%"></div>
          </div>
          <div class="flex justify-between items-center text-[10.5px] pt-1 text-slate-400">
            <span>Gap de Acomodação:</span>
            <span class="font-mono font-bold text-amber-300">~${gapEstimado.toLocaleString('pt-BR')} quartos</span>
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-slate-800/80 flex justify-between items-center">
        <span class="text-[10.5px] text-slate-500 font-mono">100% Estado de SP</span>
        <button onclick="abrirRelatorioHotel('${polo.id}')" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center space-x-1 transition">
          <i data-lucide="file-bar-chart" class="w-3.5 h-3.5"></i>
          <span>Relatório de Demanda &rarr;</span>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
  lucide.createIcons();
}

function renderizarTimelineSazonalidade() {
  const container = document.getElementById('container-timeline-sazonalidade');
  if (!container || !heatmapState) return;
  container.innerHTML = '';

  heatmapState.temporal.forEach(mes => {
    const isPico = mes.status.includes('EXTREMO') || mes.status.includes('ALTA');
    const card = document.createElement('div');
    card.className = `p-3 rounded-lg border ${isPico ? 'bg-[#0e1625] border-amber-500/30' : 'bg-[#0e1625] border-slate-800'} space-y-2 text-xs hover:border-slate-700 transition`;

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-xs text-white">${mes.mesNome}</h4>
        <span class="text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
          isPico ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
        }">
          ${mes.status}
        </span>
      </div>

      <div class="space-y-0.5 text-[11px] text-slate-400">
        <div class="flex justify-between font-mono"><span>Eventos:</span><span class="font-bold text-white">${mes.totalEventos}</span></div>
        <div class="flex justify-between font-mono"><span>Room Nights:</span><span class="font-bold text-indigo-300">${mes.roomNights.toLocaleString('pt-BR')}</span></div>
      </div>

      <p class="text-[10.5px] text-slate-300 bg-[#080c14] p-2 rounded-md border border-slate-800 leading-snug">
        ${mes.alerta}
      </p>
    `;

    container.appendChild(card);
  });
  lucide.createIcons();
}

// ----------------------------------------------------------------
// 6. MÓDULO CRM & PIPELINE
// ----------------------------------------------------------------

async function carregarDealsCRM() {
  try {
    const res = await fetch('/api/deals');
    dealsState = await res.json();

    document.getElementById('crm-volume-total').innerText = `R$ ${dealsState.totalVolumeGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('crm-receita-prevista').innerText = `R$ ${dealsState.totalReceitaPrevista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('crm-pipeline-ponderado').innerText = `R$ ${dealsState.pipelinePonderado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('crm-total-deals-badge').innerText = `${dealsState.totalDeals} oportunidades ativas`;

    renderizarKanbanCRM();
  } catch (err) {
    console.error('Erro ao carregar deals do CRM:', err);
  }
}

function renderizarKanbanCRM() {
  const container = document.getElementById('container-kanban-fases');
  if (!container || !dealsState) return;
  container.innerHTML = '';

  const phaseColors = {
    'RADAR': { border: 'border-indigo-500/30', badge: 'bg-indigo-500/10 text-indigo-300' },
    'QUALIFICADO': { border: 'border-cyan-500/30', badge: 'bg-cyan-500/10 text-cyan-300' },
    'PROPOSTA_ENVIADA': { border: 'border-amber-500/30', badge: 'bg-amber-500/10 text-amber-300' },
    'NEGOCIACAO': { border: 'border-purple-500/30', badge: 'bg-purple-500/10 text-purple-300' },
    'CONTRATO_FECHADO': { border: 'border-emerald-500/30', badge: 'bg-emerald-500/10 text-emerald-300' },
    'LIQUIDADO': { border: 'border-slate-500/30', badge: 'bg-slate-500/10 text-slate-300' }
  };

  dealsState.fases.forEach(fase => {
    const dealsNaFase = dealsState.porFase[fase.id] || [];
    const color = phaseColors[fase.id] || { border: 'border-slate-800', badge: 'bg-slate-800 text-slate-300' };
    const col = document.createElement('div');
    col.className = 'min-w-[270px] max-w-[310px] flex-shrink-0 bg-[#0c1220] border border-slate-800 rounded-xl p-3 space-y-2.5 flex flex-col justify-between';

    col.innerHTML = `
      <div class="space-y-2.5">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <div class="flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full ${color.badge.split(' ')[1].replace('text-', 'bg-')}"></span>
            <span class="text-xs font-bold text-slate-200 uppercase tracking-wider">${fase.nome}</span>
          </div>
          <span class="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full ${color.badge} border ${color.border}">
            ${dealsNaFase.length}
          </span>
        </div>

        <div class="space-y-2">
          ${dealsNaFase.length === 0 ? `
            <div class="p-4 text-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-[11px]">
              Nenhuma oportunidade nesta fase
            </div>
          ` : dealsNaFase.map(d => `
            <div class="bg-[#111a2e] border border-slate-800/90 hover:border-slate-700 rounded-lg p-3 shadow-2xs space-y-2 text-xs group transition">
              <div>
                <div class="font-bold text-[12.5px] text-white group-hover:text-indigo-300 transition line-clamp-1 leading-snug" title="${d.eventoNome}">
                  ${d.eventoNome}
                </div>
                <div class="text-[11px] text-slate-400 truncate mt-0.5 flex items-center space-x-1" title="${d.cliente}">
                  <span>${d.cliente}</span>
                </div>
              </div>

              <div class="bg-[#080c14] p-2 rounded-md border border-slate-800/80 grid grid-cols-2 gap-1 text-[11px]">
                <div>
                  <span class="text-[10px] text-slate-500 uppercase block">Volume</span>
                  <span class="font-mono font-bold text-slate-200">R$ ${d.valorEstimado.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-slate-500 uppercase block">Comissão</span>
                  <span class="font-mono font-bold text-emerald-400">R$ ${d.receitaPrevista.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div class="pt-1 border-t border-slate-800/60 flex justify-between items-center text-[11px]">
                <span class="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  ${d.probabilidade || 50}% prob.
                </span>
                <button onclick="avancarFaseDeal('${d.id}', '${fase.id}')" class="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center space-x-0.5 transition">
                  <span>Avançar</span>
                  <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.appendChild(col);
  });
  lucide.createIcons();
}

async function avancarFaseDeal(dealId, faseAtual) {
  const ordemFases = ['RADAR', 'QUALIFICADO', 'PROPOSTA_ENVIADA', 'NEGOCIACAO', 'CONTRATO_FECHADO', 'LIQUIDADO'];
  const idx = ordemFases.indexOf(faseAtual);
  if (idx < ordemFases.length - 1) {
    const proximaFase = ordemFases[idx + 1];
    await fetch(`/api/deals/${dealId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ novaFase: proximaFase })
    });
    carregarDealsCRM();
  }
}

// ----------------------------------------------------------------
// 7. MÓDULO REDE DE FORNECEDORES (TABELA COMPACTA & PÁGINA PRÓPRIA)
// ----------------------------------------------------------------

async function carregarListaFornecedores() {
  try {
    const res = await fetch('/api/fornecedores');
    const data = await res.json();
    fornecedoresState = data.fornecedores;
    fornecedoresFiltradosState = [...fornecedoresState];

    document.getElementById('kpi-fornecedores').innerText = `${fornecedoresState.length} Parceiros`;
    renderizarTabelaFornecedoresCompacta();
  } catch (err) {
    console.error('Erro ao carregar lista de fornecedores:', err);
  }
}

function aplicarFiltrosFornecedores() {
  const termoBusca = (document.getElementById('filtro-busca-forn').value || '').toLowerCase().trim();
  const tipoFiltro = document.getElementById('filtro-tipo-forn').value;
  const qualFiltro = document.getElementById('filtro-qualidade-forn').value;

  fornecedoresFiltradosState = fornecedoresState.filter(f => {
    const nome = (f.nome || '').toLowerCase();
    const bairro = (f.bairro || '').toLowerCase();
    const tipo = (f.tipo || '').toLowerCase();
    const matchBusca = !termoBusca || nome.includes(termoBusca) || bairro.includes(termoBusca) || tipo.includes(termoBusca);

    const matchTipo = tipoFiltro === 'todos' || f.tipo === tipoFiltro;

    let matchQual = true;
    if (qualFiltro === 'alta') matchQual = (f.avaliacao_qualidade || 9.0) >= 9.2;
    if (qualFiltro === 'padrao') matchQual = (f.avaliacao_qualidade || 9.0) < 9.2;

    return matchBusca && matchTipo && matchQual;
  });

  renderizarTabelaFornecedoresCompacta();
}

function renderizarTabelaFornecedoresCompacta() {
  const corpo = document.getElementById('tabela-fornecedores-corpo');
  if (!corpo) return;
  corpo.innerHTML = '';

  const tiposLabel = {
    hotel: 'Hotelaria',
    taxi: 'Cooperativa Táxi',
    transfer_van: 'Vans / Fretamento',
    tmc_parceira: 'TMC Emissão Aérea',
    restaurante_espaco: 'Espaços & Gastronomia'
  };

  fornecedoresFiltradosState.forEach(f => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-slate-800/50 cursor-pointer transition text-xs border-b border-slate-800/80';
    row.onclick = () => abrirDetalheFornecedor(f.id);

    const capacidadeStr = f.tipo === 'hotel' 
      ? `${f.capacidade_quartos || f.max_room_block} quartos (${f.max_room_block} block)`
      : f.tipo === 'taxi' 
        ? `${f.frota_disponivel} veículos` 
        : f.tipo === 'transfer_van' 
          ? `${(f.frota_vans_15lugares || 0) + (f.frota_microonibus_28lugares || 0) + (f.frota_onibus_46lugares || 0)} unidades`
          : f.tipo === 'tmc_parceira'
            ? 'Emissão Global IATA'
            : `${f.capacidade_max_pessoas || 200} pessoas`;

    const tarifaStr = f.diaria_negociada_mice 
      ? `R$ ${f.diaria_negociada_mice.toFixed(2)}/diária` 
      : f.diaria_van_10h 
        ? `R$ ${f.diaria_van_10h.toFixed(2)} (10h)`
        : f.tarifa_media_gru_hotel 
          ? `R$ ${f.tarifa_media_gru_hotel.toFixed(2)} (GRU)` 
          : f.fee_emissao_aereo_nac
            ? `Fee R$ ${f.fee_emissao_aereo_nac.toFixed(2)}`
            : `R$ ${(f.valor_por_pessoa_fechado || 200).toFixed(2)}/pax`;

    const nota = f.avaliacao_qualidade ? f.avaliacao_qualidade : 9.0;

    row.innerHTML = `
      <td class="px-3.5 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">${f.id}</td>
      <td class="px-3.5 py-3 font-bold text-[13px] text-white">
        <span class="hover:text-indigo-300 transition">${f.nome}</span>
      </td>
      <td class="px-3.5 py-3 whitespace-nowrap">
        <span class="px-2 py-0.5 rounded-md bg-[#080c14] border border-slate-800 text-slate-300 text-[10.5px] font-semibold">${tiposLabel[f.tipo] || f.tipo}</span>
      </td>
      <td class="px-3.5 py-3 text-slate-300 font-medium whitespace-nowrap">${capacidadeStr}</td>
      <td class="px-3.5 py-3 font-mono font-semibold text-slate-200 whitespace-nowrap">${tarifaStr}</td>
      <td class="px-3.5 py-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">${f.comissao_percentual || f.comissao_repasse_parceria || 10}%</td>
      <td class="px-3.5 py-3 text-right whitespace-nowrap">
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          ★ ${nota}
        </span>
      </td>
      <td class="px-3.5 py-3 text-right whitespace-nowrap">
        <button onclick="event.stopPropagation(); abrirDetalheFornecedor('${f.id}')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white font-bold text-xs transition inline-flex items-center space-x-1 border border-slate-700 shadow-2xs">
          <span>Ver Ficha &rarr;</span>
        </button>
      </td>
    `;

    corpo.appendChild(row);
  });

  const rodape = document.getElementById('tabela-fornecedores-rodape');
  if (rodape) {
    rodape.innerHTML = `
      <span>Exibindo <strong>${fornecedoresFiltradosState.length}</strong> de <strong>${fornecedoresState.length}</strong> parceiros homologados</span>
      <span>Clique em qualquer fornecedor para ver a ficha técnica completa e matriz de distâncias</span>
    `;
  }

  lucide.createIcons();
}

function abrirDetalheFornecedor(fornecedorId) {
  const fornecedor = fornecedoresState.find(f => f.id === fornecedorId);
  if (!fornecedor) return;

  fornecedorSelecionadoDossie = fornecedor;
  renderizarDossieFornecedor();
  navegarParaView('detalhe-fornecedor');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarParaListaFornecedores() {
  navegarParaView('fornecedores');
}

function renderizarDossieFornecedor() {
  if (!fornecedorSelecionadoDossie) return;
  const f = fornecedorSelecionadoDossie;

  const tiposLabel = {
    hotel: 'Hotelaria Corporativa',
    taxi: 'Cooperativa de Táxi Homologada',
    transfer_van: 'Fretamento de Vans & Ônibus',
    tmc_parceira: 'TMC de Emissão Aérea (IATA)',
    restaurante_espaco: 'Espaço Gastronômico & Jantares'
  };

  // 1. Cabeçalho
  const cabecalho = document.getElementById('fornecedor-cabecalho');
  cabecalho.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-slate-800/60 pb-4">
      <div>
        <div class="flex items-center space-x-2 mb-1.5">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
            Nota de Qualidade: ${f.avaliacao_qualidade || 9.0}/10
          </span>
          <span class="text-xs font-mono text-slate-500 bg-[#080c14] px-2 py-0.5 rounded border border-slate-800">${f.id}</span>
          <span class="text-xs text-slate-500">&middot; Modalidade: <strong class="text-slate-200">${tiposLabel[f.tipo] || f.tipo}</strong></span>
        </div>
        <h2 class="text-lg font-bold text-white leading-snug">${f.nome}</h2>
        <p class="text-xs text-slate-500 mt-1">${f.bairro ? `Localização: ${f.bairro} &middot; São Paulo - SP` : 'Cobertura Operacional na Região Metropolitana de São Paulo e Aeroportos'}</p>
      </div>

      <div class="bg-[#080c14] p-3 rounded-lg border border-slate-800 text-xs text-right space-y-0.5">
        <div class="text-slate-500 text-[10px] uppercase font-medium">Repasse Comercial Homologado</div>
        <div class="text-lg font-bold text-white">${f.comissao_percentual || f.comissao_repasse_parceria || 10}% de Margem / Fee</div>
        <div class="text-[11px] text-slate-400">Parceria ativa com a rede da Gisele</div>
      </div>
    </div>

    ${f.detalhes_operacionais ? `
      <div class="bg-slate-800/70 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <strong class="text-white block mb-1">Perfil & Inteligência Operacional B2B:</strong>
        ${f.detalhes_operacionais}
      </div>
    ` : ''}

    ${f.posicionamento_taxi_recomendado ? `
      <div class="bg-[#080c14] p-3 rounded-lg border border-slate-800 text-xs text-slate-200">
        <strong class="text-white block mb-0.5">🚕 Estratégia de Posicionamento & Embarque:</strong>
        ${f.posicionamento_taxi_recomendado}
      </div>
    ` : ''}
  `;

  // 2. Card Capacidade & Estrutura
  const capCard = document.getElementById('fornecedor-capacidade-card');
  let capHtml = '';
  if (f.tipo === 'hotel') {
    capHtml = `
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
          <span class="text-[10px] text-slate-500 block uppercase">Capacidade Total</span>
          <span class="font-bold text-white">${f.capacidade_quartos} quartos</span>
        </div>
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
          <span class="text-[10px] text-slate-500 block uppercase">Bloqueio Máximo (Room Block)</span>
          <span class="font-bold text-white">${f.max_room_block} apartamentos</span>
        </div>
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
          <span class="text-[10px] text-slate-500 block uppercase">Café da Manhã</span>
          <span class="font-bold text-white">${f.cafe_incluso ? 'Incluso na Diária' : 'Cobrado à parte'}</span>
        </div>
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
          <span class="text-[10px] text-slate-500 block uppercase">Salas de Reunião / Apoio</span>
          <span class="font-bold text-white">${f.possui_salas_apoio ? 'Disponível no Hotel' : 'Não possui'}</span>
        </div>
      </div>
    `;
  } else if (f.tipo === 'taxi') {
    capHtml = `
      <div class="space-y-2 text-xs">
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block uppercase">Frota Própria Ativa</span>
            <span class="font-bold text-white">${f.frota_disponivel} veículos sedans/utilitários</span>
          </div>
          <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block uppercase">Veículos Categoria Executiva</span>
            <span class="font-bold text-white">${f.veiculos_executivos || 45} sedans médios/grandes</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block uppercase">Cobertura Aeroportuária</span>
            <span class="font-bold text-white">${f.cobertura_cgh ? 'Congonhas (CGH)' : ''} ${f.cobertura_gru ? 'e Guarulhos (GRU)' : ''}</span>
          </div>
          <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block uppercase">SLA Médio de Chegada</span>
            <span class="font-bold text-white">${f.sla_tempo_chegada_min} minutos (GPS 24h)</span>
          </div>
        </div>
        ${f.rede_federada_parceiras ? `
          <div class="bg-slate-800 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
            <span class="font-semibold text-white">Capacidade de Pico / Intercâmbio:</span> ${f.rede_federada_parceiras}
          </div>
        ` : ''}
      </div>
    `;
  } else if (f.tipo === 'transfer_van') {
    capHtml = `
      <div class="grid grid-cols-3 gap-2 text-xs">
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
          <span class="text-[10px] text-slate-500 block uppercase">Vans (15 lug.)</span>
          <span class="font-bold text-white">${f.frota_vans_15lugares || 0} unidades</span>
        </div>
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
          <span class="text-[10px] text-slate-500 block uppercase">Micro-ônibus (28 lug.)</span>
          <span class="font-bold text-white">${f.frota_microonibus_28lugares || 0} unidades</span>
        </div>
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
          <span class="text-[10px] text-slate-500 block uppercase">Ônibus (46 lug.)</span>
          <span class="font-bold text-white">${f.frota_onibus_46lugares || 0} unidades</span>
        </div>
      </div>
    `;
  } else if (f.tipo === 'tmc_parceira') {
    capHtml = `
      <div class="space-y-2 text-xs">
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block uppercase">Credenciamento & Homologação</span>
            <span class="font-bold text-white">${f.codigo_iata_ativo ? 'Código IATA Ativo Global' : 'Não'}</span>
          </div>
          <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block uppercase">Conexões GDS & Emissão</span>
            <span class="font-bold text-white">${(f.acordo_bsp_consolidadoras || []).join(', ')}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block uppercase">Plataforma Self-Booking</span>
            <span class="font-bold text-white">${f.sistema_obt_integrado ? 'OBT Integrado (Concur/Argo/Reserve)' : 'Manual'}</span>
          </div>
          <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 block uppercase">Gestão de Emergências</span>
            <span class="font-bold text-white">Plantão 24/7 com equipe dedicada</span>
          </div>
        </div>
      </div>
    `;
  }

  capCard.innerHTML = `
    <div class="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
      <h3 class="text-xs font-semibold text-white uppercase tracking-wider">Capacidade & Estrutura Operacional</h3>
      <span class="text-xs text-slate-500">Recursos Mapeados</span>
    </div>
    ${capHtml}
  `;

  // 3. Card Condições Comerciais
  const comCard = document.getElementById('fornecedor-comercial-card');
  let tarifaDisplay = '';
  if (f.tipo === 'hotel') {
    const savingPct = (((f.diaria_media_padrao - f.diaria_negociada_mice) / f.diaria_media_padrao) * 100).toFixed(0);
    tarifaDisplay = `
      <div class="space-y-1.5 text-xs">
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Tarifa Balcão Pública:</span>
          <span class="text-slate-400 line-through">R$ ${f.diaria_media_padrao.toFixed(2)}/diária</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500 font-semibold">Tarifa Acordada MICE:</span>
          <span class="font-bold text-white text-sm">R$ ${f.diaria_negociada_mice.toFixed(2)}/diária (${savingPct}% saving)</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Política de Cancelamento:</span>
          <span class="font-medium text-slate-200">Sem ônus até D-${f.politica_cancelamento_dias || 14}</span>
        </div>
        <div class="flex justify-between py-1">
          <span class="text-slate-500">Comissão para a Gisele:</span>
          <span class="font-bold text-white">${f.comissao_percentual}% sobre o faturamento</span>
        </div>
      </div>
    `;
  } else if (f.tipo === 'taxi') {
    tarifaDisplay = `
      <div class="space-y-1.5 text-xs">
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Tarifa Aeroporto CGH &middot; Hotel:</span>
          <span class="font-bold text-white">R$ ${f.tarifa_media_cgh_hotel.toFixed(2)}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Tarifa Aeroporto GRU &middot; Hotel:</span>
          <span class="font-bold text-white">R$ ${f.tarifa_media_gru_hotel.toFixed(2)}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Faturamento Corporativo:</span>
          <span class="font-medium text-slate-200">Voucher digital pós-pago quinzenal</span>
        </div>
        <div class="flex justify-between py-1">
          <span class="text-slate-500">Repasse de Parceria:</span>
          <span class="font-bold text-white">${f.comissao_percentual}%</span>
        </div>
      </div>
    `;
  } else if (f.tipo === 'transfer_van') {
    tarifaDisplay = `
      <div class="space-y-1.5 text-xs">
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Diária de Van 10h com Motorista:</span>
          <span class="font-bold text-white">R$ ${f.diaria_van_10h.toFixed(2)}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Diária de Ônibus 10h:</span>
          <span class="font-bold text-white">R$ ${f.diaria_onibus_10h.toFixed(2)}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Transfer In/Out Aeroporto:</span>
          <span class="font-bold text-white">R$ ${f.transfer_in_out_aeroporto_van.toFixed(2)}</span>
        </div>
        <div class="flex justify-between py-1">
          <span class="text-slate-500">Repasse / Margem:</span>
          <span class="font-bold text-white">${f.comissao_percentual}%</span>
        </div>
      </div>
    `;
  } else if (f.tipo === 'tmc_parceira') {
    tarifaDisplay = `
      <div class="space-y-1.5 text-xs">
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Transaction Fee Nacional:</span>
          <span class="font-bold text-white">R$ ${f.fee_emissao_aereo_nac.toFixed(2)} / bilhete</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Transaction Fee Internacional:</span>
          <span class="font-bold text-white">R$ ${f.fee_emissao_aereo_inter.toFixed(2)} / bilhete</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800/60">
          <span class="text-slate-500">Faturamento Corporativo:</span>
          <span class="font-medium text-slate-200">${f.politica_faturamento_dias} dias direto no cliente</span>
        </div>
        <div class="flex justify-between py-1">
          <span class="text-slate-500">Repasse de Parceria (Gisele):</span>
          <span class="font-bold text-white">${f.comissao_repasse_parceria}% dos fees</span>
        </div>
      </div>
    `;
  }

  comCard.innerHTML = `
    <div class="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
      <h3 class="text-xs font-semibold text-white uppercase tracking-wider">Tarifário Negociado & Condições Comerciais</h3>
      <span class="text-xs text-slate-500">Tabela Acordada</span>
    </div>
    ${tarifaDisplay}
  `;

  // 4. Distâncias aos Polos de SP
  const distGrid = document.getElementById('fornecedor-distancias-grid');
  distGrid.innerHTML = '';

  const dists = f.distancias_km || { transamerica_expo: 5.0, sp_expo: 8.0, anhembi: 12.0, frei_caneca: 6.0, wds_wtc: 4.0 };
  const polosMeta = [
    { key: 'transamerica_expo', nome: 'Transamerica Expo' },
    { key: 'sp_expo', nome: 'São Paulo Expo' },
    { key: 'anhembi', nome: 'Distrito Anhembi' },
    { key: 'frei_caneca', nome: 'Frei Caneca' },
    { key: 'wds_wtc', nome: 'WTC Berrini' }
  ];

  polosMeta.forEach(p => {
    const km = dists[p.key] !== undefined ? dists[p.key] : 8.5;
    const itemBox = document.createElement('div');
    itemBox.className = 'bg-[#080c14] p-2.5 rounded-lg border border-slate-800 text-center space-y-0.5';
    itemBox.innerHTML = `
      <div class="text-[10px] text-slate-500 font-medium">${p.nome}</div>
      <div class="font-bold text-white text-xs">${km} km</div>
      <div class="text-[9px] text-slate-400">~${Math.round(km * 2.5)} min de van</div>
    `;
    distGrid.appendChild(itemBox);
  });

  lucide.createIcons();
}

function copiarMinutaFornecedor() {
  if (!fornecedorSelecionadoDossie) return;
  const f = fornecedorSelecionadoDossie;

  const texto = `TERMO DE HOMOLOGAÇÃO DE PARCERIA & TARIFÁRIO MICE
Fornecedor: ${f.nome} (Código: ${f.id})
Comissão / Repasse Acordado: ${f.comissao_percentual || f.comissao_repasse_parceria || 10}%

Especificações Homologadas:
- Capacidade/Estrutura: Validada
- Política de Faturamento Direto e Cancelamento acordada
- Canal de atendimento prioritário para eventos corporativos em São Paulo

Gestão de Parcerias & Operações MICE (Gisele)`;

  navigator.clipboard.writeText(texto);
  alert('Minuta de homologação copiada para a área de transferência!');
}

async function removerFornecedor(id) {
  if (confirm(`Confirma a remoção do parceiro ${id}?`)) {
    await fetch(`/api/fornecedores/${id}`, { method: 'DELETE' });
    await carregarPipeline();
    await carregarListaFornecedores();
  }
}

function abrirModalNovoFornecedor() {
  document.getElementById('modal-novo-fornecedor').classList.remove('hidden');
  document.getElementById('modal-novo-fornecedor').classList.add('flex');
}

function fecharModalNovoFornecedor() {
  document.getElementById('modal-novo-fornecedor').classList.add('hidden');
  document.getElementById('modal-novo-fornecedor').classList.remove('flex');
}

async function submeterNovoFornecedor(e) {
  e.preventDefault();
  const nome = document.getElementById('forn-nome').value;
  const tipo = document.getElementById('forn-tipo').value;
  const comissao = parseFloat(document.getElementById('forn-comissao').value);
  const tarifa = parseFloat(document.getElementById('forn-tarifa').value);
  const capacidade = parseInt(document.getElementById('forn-capacidade').value);

  const novoForn = {
    tipo,
    nome,
    comissao_percentual: comissao,
    avaliacao_qualidade: 9.2,
    distancias_km: { transamerica_expo: 5.0, sp_expo: 6.0, anhembi: 8.0, frei_caneca: 4.0, wds_wtc: 5.0 }
  };

  if (tipo === 'hotel') {
    novoForn.categoria = '4_estrelas';
    novoForn.diaria_media_padrao = tarifa * 1.18;
    novoForn.diaria_negociada_mice = tarifa;
    novoForn.capacidade_quartos = capacidade;
    novoForn.max_room_block = Math.round(capacidade * 0.5);
    novoForn.cafe_incluso = true;
    novoForn.possui_salas_apoio = true;
    novoForn.sla_resposta_horas = 3;
  } else if (tipo === 'taxi') {
    novoForn.frota_disponivel = capacidade;
    novoForn.faturamento_pos_pago_voucher = true;
    novoForn.cobertura_cgh = true;
    novoForn.cobertura_gru = true;
    novoForn.tarifa_media_cgh_hotel = 60.0;
    novoForn.tarifa_media_gru_hotel = tarifa;
    novoForn.sla_tempo_chegada_min = 8;
    novoForn.capacidade_pico_simultanea = 150;
  } else if (tipo === 'transfer_van') {
    novoForn.frota_vans_15lugares = Math.round(capacidade * 0.6);
    novoForn.frota_microonibus_28lugares = Math.round(capacidade * 0.3);
    novoForn.frota_onibus_46lugares = Math.round(capacidade * 0.1);
    novoForn.diaria_van_10h = tarifa;
    novoForn.diaria_onibus_10h = tarifa * 2.2;
    novoForn.rastreamento_gps_tempo_real = true;
    novoForn.motoristas_bilingues = true;
    novoForn.atendimento_24h = true;
  }

  await fetch('/api/fornecedores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoForn)
  });

  fecharModalNovoFornecedor();
  await carregarPipeline();
  await carregarListaFornecedores();
}

// ----------------------------------------------------------------
// 8. MODAIS DE SIMULAÇÃO E PROPOSTA
// ----------------------------------------------------------------

function abrirModalSimulador() {
  document.getElementById('modal-simulador').classList.remove('hidden');
  document.getElementById('modal-simulador').classList.add('flex');
}

function fecharModalSimulador() {
  document.getElementById('modal-simulador').classList.add('hidden');
  document.getElementById('modal-simulador').classList.remove('flex');
}

async function submeterNovoEvento(e) {
  e.preventDefault();
  const nome = document.getElementById('sim-nome').value;
  const local = document.getElementById('sim-local').value;
  const segmento = document.getElementById('sim-segmento').value;
  const publico = parseInt(document.getElementById('sim-publico').value);
  const pctFora = parseInt(document.getElementById('sim-pct-fora').value) / 100;
  const duracao = parseInt(document.getElementById('sim-duracao').value);

  const novoEvento = {
    id: `SIM-${Date.now().toString().slice(-4)}`,
    nome,
    segmento,
    local_evento: local,
    cidade: 'São Paulo',
    data_inicio: '2026-11-20',
    data_fim: '2026-11-23',
    dias_duracao: duracao,
    dias_antecedencia: 90,
    publico_total_estimado: publico,
    percentual_fora_da_cidade: pctFora,
    empresa_organizadora: 'Instituição Organizadora Simulada',
    cnpj_organizador: '00.000.000/0001-00',
    decisores_identificados: [
      { nome: 'Gerência de Compras e MICE', cargo: 'Comitê Organizador', email: 'eventos@organizacao.com.br' }
    ],
    poder_economico_segmento: segmento.includes('Saúde') || segmento.includes('Finanças') ? 'ALTO' : 'MEDIO'
  };

  try {
    const res = await fetch('/api/simular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento: novoEvento, participantes: 100 })
    });
    const data = await res.json();
    pipelineState.unshift(data);
    eventosFiltradosState.unshift(data);
    fecharModalSimulador();
    atualizarKPIs();
    renderizarTabelaEventosCompacta();
    carregarDealsCRM();
    abrirDetalheEvento(data.evento.id);
  } catch (err) {
    alert('Erro ao processar simulação: ' + err.message);
  }
}

function copiarPropostaAtual() {
  const item = eventoSelecionadoDossie || pipelineState[eventoAtivoIndex];
  if (!item) return;

  const decisor = (item.evento.decisores && item.evento.decisores[0]) ? item.evento.decisores[0].nome : 'Prezados Senhores';
  const hotelTop = item.rankingFornecedores.hoteis[0];
  const vanTop = item.rankingFornecedores.vans[0];
  const taxiTop = item.rankingFornecedores.taxis[0];

  const texto = `À atenção de: ${decisor}
Ref.: Estruturação de Hospedagem e Mobilidade Corporativa — ${item.evento.nome}

Prezados,

Identificamos a realização do ${item.evento.nome} em São Paulo e estruturamos previamente os cenários de viabilidade operacional para atendimento aos participantes e palestrantes da organização:

1. HOSPEDAGEM CREDENCIADA:
• Hotel Selecionado: ${hotelTop.nome} (distância de ${hotelTop.distanciaKm} km do centro de convenções).
• Tarifa Corporativa Pré-Negociada: R$ ${hotelTop.diariaNegociada.toFixed(2)}/diária (saving médio de 15% sobre a tarifa balcão).
• Bloqueio prévio de apartamentos com café da manhã e infraestrutura para apoio operacional.

2. MOBILIDADE E TRASLADOS:
• Operação de Shuttle contínuo (Hotel ↔ Centro de Convenções) via ${vanTop.nome}.
• Sistema de Voucher Corporativo com ${taxiTop.nome} para atendimento nas chegadas em Congonhas (CGH) e Guarulhos (GRU), com faturamento consolidado.

3. GOVERNANÇA E CONTROLE:
• Faturamento direto nos fornecedores homologados.
• Relatórios consolidados de despesas e conciliação financeira.
• Central de atendimento e suporte 24/7.

Acesse a proposta executiva detalhada com os três cenários orçamentários:
http://localhost:3000/proposta/${item.evento.id}?p=${participantesSimuladosDossie}

Atenciosamente,
Coordenação de Inteligência & Operações MICE`;

  document.getElementById('texto-proposta-gerada').value = texto;
  document.getElementById('modal-proposta').classList.remove('hidden');
  document.getElementById('modal-proposta').classList.add('flex');
}

function fecharModalProposta() {
  document.getElementById('modal-proposta').classList.add('hidden');
  document.getElementById('modal-proposta').classList.remove('flex');
  document.getElementById('label-copiado').style.display = 'none';
}

function copiarTextoAreaProposta() {
  const textarea = document.getElementById('texto-proposta-gerada');
  textarea.select();
  document.execCommand('copy');
  document.getElementById('label-copiado').style.display = 'inline-flex';
  setTimeout(() => {
    document.getElementById('label-copiado').style.display = 'none';
  }, 3000);
}

async function abrirRelatorioHotel(poloId) {
  try {
    const res = await fetch(`/api/heatmap/relatorio-hotel/${poloId}`);
    const data = await res.json();
    if (data.error) return alert(data.error);

    const texto = `À Atenção da Diretoria Comercial & Vendas Hoteleiras
Ref.: Mapeamento de Oportunidades & Demanda Corporativa — ${data.poloNome}

Prezados Senhores,

Através da nossa plataforma de Inteligência de Demanda Corporativa (MICE), monitoramos a realização de ${data.totalEventosMapeados} grandes eventos confirmados no ${data.poloNome} nos próximos meses:

• Demanda Estimada no Polo: ${data.demandaRoomNightsPotencial.toLocaleString('pt-BR')} room nights
• Público Total Projetado: ${data.volumeParticipantesTotal.toLocaleString('pt-BR')} participantes
• Volume Financeiro Estimado: R$ ${data.budgetCorporativoMapeado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Eventos Mapeados:
${data.eventos.map(e => ` - ${e.nome} (${e.publico.toLocaleString('pt-BR')} pax | ${e.duracao} dias)`).join('\n')}

Gostaríamos de formalizar o acordo de tarifário corporativo MICE e garantir o bloqueio prévio de contingente de apartamentos (room blocks) para direcionamento dos nossos clientes corporativos.

Atenciosamente,
Gestão de Inteligência & Parcerias Hoteleiras MICE`;

    document.getElementById('texto-relatorio-hotel').value = texto;
    document.getElementById('modal-relatorio-hotel').classList.remove('hidden');
    document.getElementById('modal-relatorio-hotel').classList.add('flex');
    lucide.createIcons();
  } catch (err) {
    console.error('Erro ao abrir relatório de hotel:', err);
  }
}

function fecharModalRelatorioHotel() {
  document.getElementById('modal-relatorio-hotel').classList.add('hidden');
  document.getElementById('modal-relatorio-hotel').classList.remove('flex');
  document.getElementById('label-copiado-hotel').style.display = 'none';
}

function copiarTextoAreaHotel() {
  const textarea = document.getElementById('texto-relatorio-hotel');
  textarea.select();
  document.execCommand('copy');
  document.getElementById('label-copiado-hotel').style.display = 'inline-flex';
  setTimeout(() => {
    document.getElementById('label-copiado-hotel').style.display = 'none';
  }, 3000);
}

// ----------------------------------------------------------------
// 9. MICE OUTREACH COPILOT & ESG & ROOM BLOCK SHIELD
// ----------------------------------------------------------------

let copilotState = null;
let abaCopilotAtiva = 'email';
let esgStateModal = null;
let shieldStateModal = null;

async function abrirModalOutreachCopilot() {
  const item = eventoSelecionadoDossie || pipelineState[eventoAtivoIndex];
  if (!item) return;

  try {
    const res = await fetch(`/api/outreach-copilot/${item.evento.id}?p=${participantesSimuladosDossie}`);
    copilotState = await res.json();

    document.getElementById('copilot-email-assunto').value = copilotState.email.assunto;
    document.getElementById('copilot-email-corpo').value = copilotState.email.corpo;
    document.getElementById('copilot-whatsapp-corpo').value = copilotState.whatsapp.texto;

    const listaArgs = document.getElementById('copilot-argumentos-lista');
    listaArgs.innerHTML = copilotState.argumentosChave.map(arg => `
      <div class="bg-[#0f172a] border border-slate-800 rounded-lg p-2.5 flex items-start space-x-2 text-xs">
        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"></i>
        <span class="text-slate-200 font-medium">${arg}</span>
      </div>
    `).join('');

    alternarAbaCopilot('email');
    document.getElementById('modal-outreach-copilot').classList.remove('hidden');
    document.getElementById('modal-outreach-copilot').classList.add('flex');
    lucide.createIcons();
  } catch (err) {
    alert('Erro ao carregar Outreach Copilot: ' + err.message);
  }
}

function fecharModalOutreachCopilot() {
  document.getElementById('modal-outreach-copilot').classList.add('hidden');
  document.getElementById('modal-outreach-copilot').classList.remove('flex');
  document.getElementById('label-copiado-copilot').style.display = 'none';
}

function alternarAbaCopilot(aba) {
  abaCopilotAtiva = aba;

  ['email', 'whatsapp', 'argumentos'].forEach(a => {
    const tabBtn = document.getElementById(`tab-copilot-${a}`);
    const tabConteudo = document.getElementById(`conteudo-copilot-${a}`);
    if (tabBtn && tabConteudo) {
      if (a === aba) {
        tabBtn.className = 'px-4 py-2 border-b-2 border-slate-900 text-white font-bold';
        tabConteudo.classList.remove('hidden');
      } else {
        tabBtn.className = 'px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-200';
        tabConteudo.classList.add('hidden');
      }
    }
  });
  lucide.createIcons();
}

function copiarConteudoCopilotAtivo() {
  let texto = '';
  if (abaCopilotAtiva === 'email') {
    texto = `Assunto: ${document.getElementById('copilot-email-assunto').value}\n\n${document.getElementById('copilot-email-corpo').value}`;
  } else if (abaCopilotAtiva === 'whatsapp') {
    texto = document.getElementById('copilot-whatsapp-corpo').value;
  } else {
    texto = copilotState ? copilotState.argumentosChave.join('\n• ') : '';
  }

  navigator.clipboard.writeText(texto);
  const lbl = document.getElementById('label-copiado-copilot');
  lbl.style.display = 'inline-flex';
  setTimeout(() => { lbl.style.display = 'none'; }, 3000);
}

// ESG Dossiê Modal
async function abrirModalESGDossie() {
  const item = eventoSelecionadoDossie || pipelineState[eventoAtivoIndex];
  if (!item) return;

  try {
    const res = await fetch(`/api/esg-metrics/${item.evento.id}?p=${participantesSimuladosDossie}`);
    esgStateModal = await res.json();

    const container = document.getElementById('conteudo-esg-dossie');
    const m = esgStateModal.metricasCarbono;
    const s = esgStateModal.seloSustentabilidade;

    container.innerHTML = `
      <div class="bg-emerald-50/70 border border-emerald-300 rounded-xl p-4 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-800 text-white uppercase">${s.nivel}</span>
          <span class="text-[10px] text-emerald-800 font-mono">${s.conformidadeGHG}</span>
        </div>
        <h4 class="text-sm font-bold text-emerald-950">Desempenho Ambiental Projetado &middot; ${esgStateModal.eventoNome}</h4>
        <p class="text-[11px] text-emerald-900 leading-snug">
          Ao substituir o transporte individual desordenado por shuttles circulares e táxis em corredores exclusivos, a delegação atinge <strong>${m.reducaoPercentualEmissoes}% de redução de emissões</strong>.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800 text-center">
          <span class="text-[10px] text-slate-500 block uppercase">CO₂ Evitado</span>
          <span class="text-sm font-bold text-emerald-800">${m.co2EvitadoTonCO2} ton CO₂</span>
        </div>
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800 text-center">
          <span class="text-[10px] text-slate-500 block uppercase">Árvores Salvas</span>
          <span class="text-sm font-bold text-white">${m.arvoresSalvasEquivalente} árvores/ano</span>
        </div>
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800 text-center">
          <span class="text-[10px] text-slate-500 block uppercase">Combustível Poupado</span>
          <span class="text-sm font-bold text-white">${m.litrosCombustivelPoupados.toLocaleString('pt-BR')} L</span>
        </div>
        <div class="bg-[#080c14] p-2.5 rounded-lg border border-slate-800 text-center">
          <span class="text-[10px] text-slate-500 block uppercase">Eficiência</span>
          <span class="text-sm font-bold text-emerald-800">-${m.reducaoPercentualEmissoes}% Carbono</span>
        </div>
      </div>

      <div class="bg-white p-3 rounded-lg border border-slate-800 space-y-1.5">
        <span class="font-bold text-white text-xs block uppercase">Diretrizes de Governança ESG Aplicadas:</span>
        <ul class="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
          ${s.pontosDestaque.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    `;

    document.getElementById('modal-esg-dossie').classList.remove('hidden');
    document.getElementById('modal-esg-dossie').classList.add('flex');
    lucide.createIcons();
  } catch (err) {
    alert('Erro ao carregar dossiê ESG: ' + err.message);
  }
}

function fecharModalESGDossie() {
  document.getElementById('modal-esg-dossie').classList.add('hidden');
  document.getElementById('modal-esg-dossie').classList.remove('flex');
}

function copiarResumoESG() {
  if (!esgStateModal) return;
  const m = esgStateModal.metricasCarbono;
  const texto = `RELATÓRIO ESG & PEGADA DE CARBONO — ${esgStateModal.eventoNome}
Metodologia: GHG Protocol Corporate Standard
Participantes: ${esgStateModal.participantes} pax

Métricas Alcançadas:
• Redução de Emissões: ${m.reducaoPercentualEmissoes}%
• Carbono Evitado: ${m.co2EvitadoTonCO2} toneladas de CO2 (${m.co2EvitadoKg.toLocaleString('pt-BR')} kg)
• Equivalência Ambiental: ${m.arvoresSalvasEquivalente} árvores preservadas/ano
• Combustível Poupado: ${m.litrosCombustivelPoupados.toLocaleString('pt-BR')} litros

Coordenação de Sustentabilidade & MICE Intelligence SP`;

  navigator.clipboard.writeText(texto);
  alert('Resumo ESG copiado para a área de transferência!');
}

// Room Block Shield Modal
async function abrirModalRoomBlockShield() {
  const item = eventoSelecionadoDossie || pipelineState[eventoAtivoIndex];
  if (!item) return;

  try {
    const quartos = Math.round(participantesSimuladosDossie * 0.8);
    const topHotel = item.rankingFornecedores.hoteis[0];
    const diaria = topHotel.diariaNegociada || 440;

    const res = await fetch(`/api/room-block-shield/${item.evento.id}?quartos=${quartos}&diaria=${diaria}`);
    shieldStateModal = await res.json();

    const container = document.getElementById('conteudo-room-block-shield');
    const b = shieldStateModal.blindagemContratual;
    const p = shieldStateModal.parametrosBloqueio;

    container.innerHTML = `
      <div class="bg-slate-900 text-white p-4 rounded-xl space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase">Proteção Ativa</span>
          <span class="text-[11px] font-mono text-slate-300">Room Block: ${p.quartosBloqueados} quartos</span>
        </div>
        <h4 class="text-sm font-bold">${b.titulo}</h4>
        <p class="text-[11px] text-slate-300 leading-snug">
          Eliminação de multas de attrition (no-show e devolução de quartos) através de réguas escalonadas e redistribuição automatizada na rede MICE.
        </p>
      </div>

      <div class="space-y-2">
        <span class="font-bold text-white text-xs block uppercase">Cronograma de Liberação Sem Multa (Réguas de Corte):</span>
        <div class="space-y-1.5">
          ${b.marcosCorte.map(m => `
            <div class="p-2.5 rounded-lg border bg-[#080c14] border-slate-800 text-xs space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white">${m.marco}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded ${m.corBadge}">${m.percentualLiberacaoSemMulta}% Sem Ônus</span>
              </div>
              <p class="text-[11px] text-slate-400 leading-snug">${m.diretriz}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="bg-[#080c14] p-3 rounded-lg border border-slate-800 space-y-1 text-xs">
        <span class="font-bold text-white block">🔄 Rede Ativa de Redistribuição de Excedentes:</span>
        <p class="text-[11px] text-slate-400 leading-snug">
          ${shieldStateModal.redeRedistribuicaoAtiva.descricao}
        </p>
      </div>
    `;

    document.getElementById('modal-room-block-shield').classList.remove('hidden');
    document.getElementById('modal-room-block-shield').classList.add('flex');
    lucide.createIcons();
  } catch (err) {
    alert('Erro ao carregar Room Block Shield: ' + err.message);
  }
}

function fecharModalRoomBlockShield() {
  document.getElementById('modal-room-block-shield').classList.add('hidden');
  document.getElementById('modal-room-block-shield').classList.remove('flex');
}

function copiarClausulaShield() {
  if (!shieldStateModal) return;
  const texto = `CLÁUSULA CONTRATUAL — ROOM BLOCK SHIELD (SEM MULTA DE ATTRITION)
Evento: ${shieldStateModal.eventoNome}
Contingenciamento Homologado: ${shieldStateModal.parametrosBloqueio.quartosBloqueados} apartamentos

Condições de Devolução Escalonada:
1. Até D-60: Liberação de 100% dos quartos sem qualquer incidência de multa ou penalidade.
2. Até D-45: Ajuste de até 80% do contingente inicial sem ônus financeiro.
3. Até D-30: Ajuste de até 50% dos quartos e acionamento da rede de redistribuição da central MICE.
4. Até D-15: Fixação da Rooming List definitiva.

Gestão de Riscos & Governança Hoteleira MICE SP`;

  navigator.clipboard.writeText(texto);
  alert('Cláusula Room Block Shield copiada!');
}

// ----------------------------------------------------------------
// 10. MÓDULO RADAR AUTÔNOMO DE VARREDURA & WEB SCRAPER
// ----------------------------------------------------------------

let scraperState = {
  status: 'OPERACIONAL',
  fontesDetalhes: [],
  descobertas: [],
  totalDescobertasPendentes: 0,
  totalEventosNoPipeline: 0
};

async function carregarDadosScraper() {
  try {
    const res = await fetch('/api/scraper/status');
    const data = await res.json();
    scraperState = data;
    renderizarViewScraper(data);
    atualizarBadgeScraper(data.totalDescobertasPendentes);
  } catch (err) {
    console.error('Erro ao carregar dados do Scraper:', err);
  }
}

function atualizarBadgeScraper(pendentes) {
  const badge = document.getElementById('badge-nav-scraper');
  if (badge) {
    badge.innerText = pendentes || '0';
    badge.className = pendentes > 0 
      ? 'px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold'
      : 'px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-400 text-[9px] font-bold';
  }
}

function renderizarViewScraper(data) {
  // 1. Atualizar KPIs
  const kpiFontes = document.getElementById('scraper-kpi-fontes');
  const kpiStaging = document.getElementById('scraper-kpi-staging');
  const kpiPipeline = document.getElementById('scraper-kpi-pipeline');
  const kpiData = document.getElementById('scraper-kpi-ultima-data');
  const contadorPendentes = document.getElementById('scraper-contador-pendentes');

  if (kpiFontes) kpiFontes.innerText = `${data.fontesAtivas || 9} Portais`;
  if (kpiStaging) kpiStaging.innerText = `${data.totalDescobertasPendentes || 0} Eventos`;
  if (kpiPipeline) kpiPipeline.innerText = `${data.totalEventosNoPipeline || 57} Eventos`;
  if (contadorPendentes) contadorPendentes.innerText = `${data.totalDescobertasPendentes || 0}`;

  if (kpiData) {
    if (data.ultimaExecucao) {
      const dt = new Date(data.ultimaExecucao);
      kpiData.innerText = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' &middot; ' + dt.toLocaleDateString('pt-BR');
    } else {
      kpiData.innerText = 'Recente';
    }
  }

  // 2. Renderizar Cards de Staging (Eventos Descobertos)
  const containerStaging = document.getElementById('container-descobertas-staging');
  if (containerStaging) {
    containerStaging.innerHTML = '';

    if (!data.descobertas || data.descobertas.length === 0) {
      containerStaging.innerHTML = `
        <div class="col-span-1 md:col-span-2 bg-[#0f172a] border border-slate-800 rounded-xl p-8 text-center space-y-2">
          <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600"></i>
          </div>
          <h4 class="text-sm font-bold text-slate-200">Nenhum evento pendente no momento</h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto">Todos os eventos captados foram aprovados ou o robô aguarda o próximo ciclo de varredura. Clique em <strong>"Executar Varredura Agora"</strong> para forçar nova checagem.</p>
        </div>
      `;
    } else {
      data.descobertas.forEach(evt => {
        const eos = evt.scoreOportunidade || { scoreTotal: 85, tier: 'PRATA 🥈' };
        const isTier1 = eos.scoreTotal >= 90;

        const card = document.createElement('div');
        card.className = 'card-base p-4 space-y-3.5 hover:border-indigo-500/50 transition';
        card.innerHTML = `
          <div class="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isTier1 ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}">
                  EOS: ${eos.scoreTotal}/100 [${eos.tier}]
                </span>
                <span class="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded font-semibold border border-indigo-500/25">
                  ${evt.segmento}
                </span>
              </div>
              <h4 class="text-[13px] font-bold text-white leading-snug">${evt.nome}</h4>
            </div>
            <span class="text-[10px] text-slate-400 font-mono whitespace-nowrap bg-[#080c14] px-2 py-0.5 rounded border border-slate-800">
              ${evt.id}
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div class="bg-[#090e1a] p-2 rounded-lg border border-slate-800/80">
              <span class="text-[10px] text-slate-400 block font-medium">Local / Cidade</span>
              <span class="font-bold text-slate-200 text-xs">${evt.cidade} (${evt.local_evento})</span>
            </div>
            <div class="bg-[#090e1a] p-2 rounded-lg border border-slate-800/80">
              <span class="text-[10px] text-slate-400 block font-medium">Data Início</span>
              <span class="font-bold font-mono text-slate-200 text-xs">${evt.data_inicio}</span>
            </div>
            <div class="bg-[#090e1a] p-2 rounded-lg border border-slate-800/80">
              <span class="text-[10px] text-slate-400 block font-medium">Público Estimado</span>
              <span class="font-bold font-mono text-slate-200 text-xs">${evt.publico_total_estimado.toLocaleString('pt-BR')} pax</span>
            </div>
            <div class="bg-[#090e1a] p-2 rounded-lg border border-slate-800/80">
              <span class="text-[10px] text-slate-400 block font-medium">Room Nights Previstas</span>
              <span class="font-bold font-mono text-indigo-300 text-xs">${(evt.demanda_estimada ? evt.demanda_estimada.room_nights_estimados : 1000).toLocaleString('pt-BR')} diárias</span>
            </div>
          </div>

          <div class="bg-[#090e1a] p-3 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-[11.5px] font-bold text-slate-200">🏢 Organizador: ${evt.empresa_organizadora}</span>
              <span class="text-[10px] text-slate-500 font-mono">CNPJ: ${evt.cnpj_organizador || 'Mapeado'}</span>
            </div>
            ${evt.decisores_identificados && evt.decisores_identificados.length > 0 ? `
              <div class="text-[11px] text-slate-300 flex items-center space-x-1.5 pt-0.5">
                <i data-lucide="user-check" class="w-3.5 h-3.5 text-emerald-400 inline flex-shrink-0"></i>
                <span><strong>Decisor:</strong> ${evt.decisores_identificados[0].nome} (${evt.decisores_identificados[0].cargo})</span>
              </div>
            ` : ''}
            <div class="text-[10px] text-slate-400 pt-1">
              <span>Captado via: <em>${evt.fonteCaptada || 'Crawler Automático'}</em></span>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-2 pt-1">
            <button onclick="descartarDescobertaScraper('${evt.id}')" class="px-3 py-1.5 rounded-md border border-slate-800 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-400 text-xs font-medium transition">
              Descartar
            </button>
            <button onclick="aprovarDescobertaScraper('${evt.id}')" class="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>Aprovar & Ingerir no Radar</span>
            </button>
          </div>
        `;
        containerStaging.appendChild(card);
      });
    }
  }

  // 3. Renderizar Tabela de Fontes Monitoradas
  const tabelaFontesCorpo = document.getElementById('tabela-fontes-scraper-corpo');
  if (tabelaFontesCorpo && data.fontesDetalhes) {
    tabelaFontesCorpo.innerHTML = '';
    data.fontesDetalhes.forEach(f => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-[#080c14]';
      row.innerHTML = `
        <td class="px-3.5 py-2.5 font-bold text-white">${f.nome}</td>
        <td class="px-3.5 py-2.5 text-slate-400">${f.regiao}</td>
        <td class="px-3.5 py-2.5 text-indigo-600 font-mono text-[11px] truncate max-w-xs">
          <a href="${f.url}" target="_blank" class="hover:underline flex items-center space-x-1">
            <span>${f.url}</span>
            <i data-lucide="external-link" class="w-3 h-3 text-slate-400 inline"></i>
          </a>
        </td>
        <td class="px-3.5 py-2.5 text-center text-slate-400">${f.frequencia}</td>
        <td class="px-3.5 py-2.5 text-center">
          <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">${f.confiabilidade}%</span>
        </td>
        <td class="px-3.5 py-2.5 text-right">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            ${f.status}
          </span>
        </td>
      `;
      tabelaFontesCorpo.appendChild(row);
    });
  }

  lucide.createIcons();
}

async function executarVarreduraManual() {
  const btn = document.getElementById('btn-executar-varredura');
  const spinner = document.getElementById('icone-spinner-varredura');
  const terminal = document.getElementById('scraper-terminal-logs');

  if (spinner) spinner.classList.add('animate-spin');
  if (btn) btn.disabled = true;

  adicionarLogTerminal('INFO', 'Iniciando varredura automatizada nos 9 centros oficiais de SP...');

  try {
    const res = await fetch('/api/scraper/run', { method: 'POST' });
    const result = await res.json();

    adicionarLogTerminal('SUCCESS', `Varredura concluída! ${result.novosEventosDetectados} novos eventos identificados.`);
    adicionarLogTerminal('INFO', `Fontes auditadas com sucesso: São Paulo Expo, Anhembi, Transamerica, WTC, Frei Caneca, Royal Palm Hall, Agrishow.`);

    await carregarDadosScraper();
    await carregarPipeline(); // Atualiza radar principal
  } catch (err) {
    adicionarLogTerminal('ERROR', `Falha ao executar varredura: ${err.message}`);
  } finally {
    if (spinner) spinner.classList.remove('animate-spin');
    if (btn) btn.disabled = false;
  }
}

function adicionarLogTerminal(tipo, msg) {
  const terminal = document.getElementById('scraper-terminal-logs');
  if (!terminal) return;

  const hora = new Date().toLocaleTimeString('pt-BR');
  const el = document.createElement('div');

  let corBadge = 'text-blue-400';
  if (tipo === 'SUCCESS') corBadge = 'text-emerald-400';
  if (tipo === 'ERROR') corBadge = 'text-rose-400';
  if (tipo === 'WARNING') corBadge = 'text-yellow-400';

  el.innerHTML = `<span class="text-slate-500 font-mono">[${hora}]</span> <span class="${corBadge}">[${tipo}]</span> ${msg}`;
  terminal.appendChild(el);
  terminal.scrollTop = terminal.scrollHeight;
}

async function aprovarDescobertaScraper(eventoId) {
  try {
    const res = await fetch(`/api/scraper/approve/${eventoId}`, { method: 'POST' });
    const data = await res.json();
    if (data.sucesso) {
      adicionarLogTerminal('SUCCESS', `Evento ${eventoId} aprovado e ingerido no Pipeline com sucesso!`);
      await carregarDadosScraper();
      await carregarPipeline();
    } else {
      alert(data.error || 'Erro ao aprovar evento');
    }
  } catch (err) {
    alert('Erro ao aprovar evento: ' + err.message);
  }
}

async function aprovarTodosScraper(scoreMinimo = 70) {
  if (!confirm(`Deseja aprovar e ingerir todos os eventos descobertos com EOS >= ${scoreMinimo}?`)) return;
  try {
    const res = await fetch(`/api/scraper/approve-all?score=${scoreMinimo}`, { method: 'POST' });
    const data = await res.json();
    if (data.sucesso) {
      adicionarLogTerminal('SUCCESS', `${data.totalAprovados} eventos foram aprovados e adicionados ao radar!`);
      await carregarDadosScraper();
      await carregarPipeline();
    }
  } catch (err) {
    alert('Erro ao aprovar todos os eventos: ' + err.message);
  }
}

async function descartarDescobertaScraper(eventoId) {
  try {
    const res = await fetch(`/api/scraper/discard/${eventoId}`, { method: 'POST' });
    const data = await res.json();
    if (data.sucesso) {
      adicionarLogTerminal('WARNING', `Evento ${eventoId} descartado do staging.`);
      await carregarDadosScraper();
    }
  } catch (err) {
    alert('Erro ao descartar evento: ' + err.message);
  }
}

// Chamar badge scraper no carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/scraper/status')
    .then(r => r.json())
    .then(d => atualizarBadgeScraper(d.totalDescobertasPendentes))
    .catch(() => {});
});

// ================================================================
// 7. MÓDULO SQUAD DE AGENTES DE IA AUTÔNOMOS (MAS)
// ================================================================

let squadAgentesState = null;
let ultimoOutputAgenteTexto = '';

async function carregarSquadAgentes() {
  try {
    const res = await fetch('/api/agents/status');
    const data = await res.json();
    squadAgentesState = data;

    const statAcoes = document.getElementById('stat-agent-acoes');
    const statSavings = document.getElementById('stat-agent-savings');
    const statCo2 = document.getElementById('stat-agent-co2');

    if (statAcoes) statAcoes.innerText = `${data.acoesExecutadasHoje} tarefas`;
    if (statSavings) statSavings.innerText = `R$ ${data.savingsAcumuladosReais.toLocaleString('pt-BR')}`;
    if (statCo2) statCo2.innerText = `48.2 toneladas`;

    renderizarCardsAgentes(data.agentes);
  } catch (err) {
    console.error('Erro ao carregar squad de agentes:', err);
  }
}

function renderizarCardsAgentes(agentes) {
  const container = document.getElementById('grid-cards-7-agentes');
  if (!container) return;
  container.innerHTML = '';

  const icones = {
    'radar': 'radar',
    'trending-up': 'trending-up',
    'target': 'target',
    'sliders': 'sliders',
    'shield-check': 'shield-check',
    'car': 'car',
    'leaf': 'leaf'
  };

  const agentCategory = {
    'agente-radar': 'MICE DISCOVERY',
    'agente-yield': 'YIELD INTELLIGENCE',
    'agente-prospector': 'B2B OUTREACH',
    'agente-combinatorial': 'CPQ ORCHESTRATION',
    'agente-roomblock': 'SHIELD GOVERNANCE',
    'agente-mobilidade': 'MOBILITY ROUTING',
    'agente-esg': 'ESG & CARBON AUDIT'
  };

  agentes.forEach(ag => {
    const iconeNome = icones[ag.icone] || 'bot';
    const tagCat = agentCategory[ag.id] || 'AUTONOMOUS AGENT';

    const card = document.createElement('div');
    card.className = 'card-base p-4 flex flex-col justify-between space-y-3.5 hover:border-indigo-500/50 transition min-w-0 group';
    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[9.5px] font-mono font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25">
            ${tagCat}
          </span>
          <span class="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            ${ag.status}
          </span>
        </div>

        <div class="flex items-start space-x-3">
          <div class="w-9 h-9 rounded-lg bg-[#090e1a] text-indigo-400 flex items-center justify-center flex-shrink-0 border border-slate-800 shadow-2xs group-hover:border-indigo-500/40 group-hover:text-indigo-300 transition">
            <i data-lucide="${iconeNome}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="font-bold text-[13px] text-white group-hover:text-indigo-300 transition truncate">${ag.nome}</h4>
            <p class="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mt-0.5">${ag.descricao}</p>
          </div>
        </div>
      </div>

      <div class="space-y-2.5 pt-2.5 border-t border-slate-800/80 text-xs">
        <div class="bg-[#090e1a] p-2 rounded-lg border border-slate-800/80 text-[10.5px] text-slate-400 space-y-0.5">
          <span class="font-bold text-slate-500 block uppercase tracking-wider text-[9.5px]">Última Ação:</span>
          <div class="truncate text-slate-200 font-medium">${ag.ultimaAcao}</div>
        </div>

        <div class="flex items-center space-x-2">
          <button onclick="executarAgenteIndividual('${ag.id}')" class="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs">
            <i data-lucide="play" class="w-3.5 h-3.5 text-indigo-200"></i>
            <span>Executar</span>
          </button>
          <button onclick="abrirModalDetalhesAgente('${ag.id}')" class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition flex items-center justify-center space-x-1" title="Ver Detalhes">
            <i data-lucide="eye" class="w-3.5 h-3.5 text-slate-400"></i>
            <span>Logs</span>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

async function executarAgenteIndividual(agentId) {
  try {
    const res = await fetch(`/api/agents/run/${agentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventoId: eventoSelecionadoDossie ? eventoSelecionadoDossie.evento.id : 'evt-001',
        pax: participantesSimuladosDossie || 250
      })
    });

    const data = await res.json();
    abrirModalAgentDetail(agentId, data);
  } catch (err) {
    alert('Erro ao executar agente: ' + err.message);
  }
}

function abrirModalAgentDetail(agentId, data) {
  const modal = document.getElementById('modal-agent-detail');
  const title = document.getElementById('modal-agent-title');
  const conteudo = document.getElementById('conteudo-agent-detail');

  if (!modal || !conteudo) return;

  title.innerText = data.nome || 'Execução do Agente de IA';
  ultimoOutputAgenteTexto = JSON.stringify(data, null, 2);

  if (agentId === 'sentinela_mercado') {
    conteudo.innerHTML = `
      <div class="bg-indigo-950 text-indigo-100 p-4 rounded-xl space-y-2 font-mono text-xs">
        <div class="text-amber-300 font-bold">📡 Varredura de Mercado MICE SP Concluída:</div>
        <div>• Total de Eventos Rastreados: <strong>${data.totalMonitorado}</strong></div>
        <div>• Status do Motor: <strong>${data.status}</strong></div>
      </div>
      <div class="space-y-2">
        <h4 class="font-bold text-white text-xs uppercase tracking-wider">Oportunidades Críticas Detectadas:</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${data.descobertasCriticas.map(d => `
            <div class="bg-[#080c14] p-2.5 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div class="font-bold text-white truncate">${d.nome}</div>
              <div class="text-[11px] text-slate-500">Polo: <strong>${d.polo}</strong> &middot; Público: <strong>${d.publico.toLocaleString('pt-BR')} pax</strong></div>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">Janela: ${d.janelaIdealMeses} meses antes</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (agentId === 'yield_forecaster') {
    conteudo.innerHTML = `
      <div class="bg-purple-950 text-purple-100 p-4 rounded-xl space-y-2 font-mono text-xs">
        <div class="text-amber-300 font-bold">📈 Projeção Preditiva de Yield & Curva de Saturação:</div>
        <div>• Evento Analisado: <strong>${data.eventoAnalisado.nome}</strong></div>
        <div>• Diretriz: <strong>${data.alertaGeral}</strong></div>
      </div>
      <div class="space-y-2">
        <h4 class="font-bold text-white text-xs uppercase tracking-wider">Simulação Hoteleira de Raio Curto:</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead class="bg-[#080c14] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th class="p-2">Hotel Homologado</th>
                <th class="p-2">Distância</th>
                <th class="p-2">Tarifa MICE</th>
                <th class="p-2">Tarifa Balcão Pico</th>
                <th class="p-2">Saving Estimado</th>
                <th class="p-2">Esgotamento</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${data.analiseHoteis.map(h => `
                <tr>
                  <td class="p-2 font-bold text-white">${h.hotelNome}</td>
                  <td class="p-2 text-slate-400">${h.distanciaKm} km</td>
                  <td class="p-2 text-indigo-700 font-bold">R$ ${h.tarifaMICE}</td>
                  <td class="p-2 text-rose-600 line-through">R$ ${h.tarifaBalcaoPico}</td>
                  <td class="p-2 text-emerald-700 font-bold">R$ ${h.savingEstimadoPorQuarto.toLocaleString('pt-BR')}</td>
                  <td class="p-2"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">${h.janelaCriticaEsgotamento}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (agentId === 'hunter_outreach') {
    ultimoOutputAgenteTexto = data.templatesProntos.emailPitch;
    conteudo.innerHTML = `
      <div class="bg-slate-950 text-slate-100 p-4 rounded-xl space-y-2 font-mono text-xs">
        <div class="text-emerald-400 font-bold">🎯 Abordagens B2B Parametrizadas para o Decisor:</div>
        <div>• Alvo: <strong>${data.decisorSelecionado.nome}</strong> (${data.decisorSelecionado.cargo})</div>
        <div>• Evento: <strong>${data.evento}</strong></div>
      </div>
      <div class="space-y-3">
        <div class="space-y-1">
          <span class="text-xs font-bold text-white uppercase">📧 E-mail Executivo para Compras / Trade:</span>
          <pre class="bg-[#080c14] p-3 rounded-xl border border-slate-800 text-[11px] text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">${data.templatesProntos.emailPitch}</pre>
        </div>
        <div class="space-y-1">
          <span class="text-xs font-bold text-white uppercase">💬 Mensagem de LinkedIn (InMail):</span>
          <pre class="bg-[#080c14] p-3 rounded-xl border border-slate-800 text-[11px] text-slate-200 whitespace-pre-wrap font-sans">${data.templatesProntos.linkedinDM}</pre>
        </div>
      </div>
    `;
  } else if (agentId === 'cpq_orchestrator') {
    conteudo.innerHTML = `
      <div class="bg-cyan-950 text-cyan-100 p-4 rounded-xl space-y-2 font-mono text-xs">
        <div class="text-amber-300 font-bold">⚖️ Otimização Combinatorial CPQ 360° Concluída:</div>
        <div>• Delegação Simulada: <strong>${data.parametros.pax} participantes</strong> (${data.parametros.dias} dias)</div>
        <div>• Investimento Total Cliente: <strong>R$ ${data.financeiro.investimentoTotalCliente.toLocaleString('pt-BR')}</strong></div>
        <div>• Saving Auditado: <strong>R$ ${data.financeiro.savingTotalAuditado.toLocaleString('pt-BR')} (${data.financeiro.savingPercentual}%)</strong></div>
        <div>• Comissão Estimada da Agência: <strong>R$ ${data.financeiro.comissaoEstimadaAgencia.toLocaleString('pt-BR')}</strong></div>
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="bg-[#080c14] p-3 rounded-xl border border-slate-800 space-y-1">
          <span class="text-[10px] text-slate-500 uppercase font-bold">Distribuição Multihotel</span>
          ${data.alocacaoRecomendada.hoteisRecomendados.map(h => `
            <div class="flex justify-between"><span>${h.nome}:</span> <strong>${h.quartos} quartos</strong></div>
          `).join('')}
        </div>
        <div class="bg-[#080c14] p-3 rounded-xl border border-slate-800 space-y-1">
          <span class="text-[10px] text-slate-500 uppercase font-bold">Dimensionamento de Frota</span>
          <div class="flex justify-between"><span>Vans Executivas (15p):</span> <strong>${data.alocacaoRecomendada.mobilidade.vansExecutivas15p} vans</strong></div>
          <div class="flex justify-between"><span>Táxis em Bolsão de Pico:</span> <strong>${data.alocacaoRecomendada.mobilidade.taxisSimultaneosPico} veículos</strong></div>
          <div class="text-emerald-700 font-bold pt-1">✅ Faixas de Ônibus 100% Liberadas</div>
        </div>
      </div>
    `;
  } else if (agentId === 'room_block_shield') {
    conteudo.innerHTML = `
      <div class="bg-amber-950 text-amber-100 p-4 rounded-xl space-y-2 font-mono text-xs">
        <div class="text-amber-300 font-bold">🛡️ Auditoria do Guardião Room Block Shield:</div>
        <div>• Evento: <strong>${data.evento}</strong> (Janela D-${data.diasParaEvento})</div>
        <div>• Quartos Bloqueados: <strong>${data.quartosBloqueados}</strong> &middot; Confirmados: <strong>${data.quartosConfirmados}</strong></div>
        <div>• Multas de Attrition Evitadas: <strong>R$ ${data.multasEvitadasReais.toLocaleString('pt-BR')}</strong></div>
      </div>
      <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1 leading-relaxed">
        <strong>Diretriz Jurídica & Operacional:</strong>
        <p>${data.diretrizJuridica}</p>
      </div>
    `;
  } else if (agentId === 'live_dispatcher') {
    conteudo.innerHTML = `
      <div class="bg-rose-950 text-rose-100 p-4 rounded-xl space-y-2 font-mono text-xs">
        <div class="text-amber-300 font-bold">🚕 Torre de Mobilidade em Tempo Real:</div>
        <div>• Passageiros Presentes: <strong>${data.paxSimulados} pax</strong></div>
        <div>• SLA Médio Bolsão Credenciado: <strong>${data.tempoEstimadoChegadaMin} minutos</strong> (vs 52 min apps)</div>
        <div>• Tempo Total Economizado: <strong>${data.dimensionamentoAoVivo.tempoEconomizadoPorPassageiroMin} min por passageiro</strong></div>
      </div>
      <div class="bg-[#080c14] p-4 rounded-xl border border-slate-800 text-xs text-slate-200 space-y-2">
        <div class="font-bold text-white uppercase">Status do Despacho:</div>
        <div>• Táxis Estocados no Portão: <strong>${data.dimensionamentoAoVivo.taxisEstocadosPortaoPrincipal} veículos</strong></div>
        <div>• Vans Circulares em Operação: <strong>${data.dimensionamentoAoVivo.vansCircularesAtivas} vans</strong></div>
        <div>• Vouchers Digitais QR Code: <strong>${data.dimensionamentoAoVivo.vouchersDigitaisEmitidos} emitidos</strong></div>
      </div>
    `;
  } else if (agentId === 'esg_finance_auditor') {
    conteudo.innerHTML = `
      <div class="bg-teal-950 text-teal-100 p-4 rounded-xl space-y-2 font-mono text-xs">
        <div class="text-amber-300 font-bold">🌿 Auditoria Contábil & Dossiê ESG:</div>
        <div>• Faturas Homologadas: <strong>${data.faturasConciliadas} fornecedores</strong></div>
        <div>• Fatura Única Centralizada: <strong>R$ ${data.valorTotalConciliadoReais.toLocaleString('pt-BR')}</strong></div>
        <div>• Emissões de CO₂ Poupadas: <strong>${data.metricasESG.co2EvitadoToneladas} toneladas</strong></div>
        <div>• Classificação ESG: <strong>${data.metricasESG.classificacaoSustentabilidade}</strong></div>
      </div>
      <div class="bg-[#080c14] p-4 rounded-xl border border-slate-800 text-xs text-slate-200 space-y-1">
        <strong>Certificação:</strong>
        <p>${data.metricasESG.certificacao}</p>
      </div>
    `;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  lucide.createIcons();
}

function fecharModalAgentDetail() {
  const modal = document.getElementById('modal-agent-detail');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function copiarOutputAgente() {
  if (!ultimoOutputAgenteTexto) return;
  navigator.clipboard.writeText(ultimoOutputAgenteTexto).then(() => {
    const btn = document.getElementById('btn-copiar-output-agente');
    if (btn) {
      btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>Copiado!</span>';
      lucide.createIcons();
      setTimeout(() => {
        btn.innerHTML = '<i data-lucide="copy" class="w-4 h-4"></i><span>Copiar Resultado</span>';
        lucide.createIcons();
      }, 2000);
    }
  });
}

async function executarTodosOsAgentes() {
  const btn = event.target.closest('button');
  const textoOriginal = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Executando Squad...</span>';
  lucide.createIcons();

  try {
    const agentes = ['sentinela_mercado', 'yield_forecaster', 'hunter_outreach', 'cpq_orchestrator', 'room_block_shield', 'live_dispatcher', 'esg_finance_auditor'];
    for (const ag of agentes) {
      await fetch(`/api/agents/run/${ag}`, { method: 'POST' });
    }
    await carregarSquadAgentes();
    alert('✅ Squad de Agentes de IA executou todas as tarefas com sucesso!');
  } catch (err) {
    alert('Erro ao executar squad: ' + err.message);
  } finally {
    btn.innerHTML = textoOriginal;
    lucide.createIcons();
  }
}

function preencherPromptCopilot(texto) {
  const input = document.getElementById('input-chat-copilot-agentes');
  if (input) {
    input.value = texto;
    enviarComandoCopilotAgentes();
  }
}

async function enviarComandoCopilotAgentes() {
  const input = document.getElementById('input-chat-copilot-agentes');
  const output = document.getElementById('output-copilot-multiagente');
  if (!input || !input.value.trim()) return;

  const msg = input.value.trim();
  output.classList.remove('hidden');
  output.innerHTML = `
    <div class="text-indigo-400 font-bold flex items-center space-x-2">
      <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
      <span>Squad de IA processando sua solicitação...</span>
    </div>
  `;
  lucide.createIcons();

  try {
    const res = await fetch('/api/agents/copilot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: msg })
    });

    const data = await res.json();
    output.innerHTML = `
      <div class="text-slate-400 text-[10px] pb-1 border-b border-slate-800 flex justify-between">
        <span>Prompt: "${data.mensagemUsuario}"</span>
        <span>Agentes: ${data.agentesEnvolvidos.join(' &middot; ')}</span>
      </div>
      <div class="text-slate-100 text-xs whitespace-pre-wrap leading-relaxed pt-1">${data.resposta}</div>
    `;
    input.value = '';
    lucide.createIcons();
  } catch (err) {
    output.innerHTML = `<div class="text-rose-400">Erro ao processar: ${err.message}</div>`;
  }
}



const fs = require('fs');
const path = require('path');

const ARQ_EVENTOS = path.join(__dirname, '../src/data/eventos_radar.json');
const ARQ_FORNECEDORES = path.join(__dirname, '../src/data/fornecedores_sp.json');

// --- 1. SHOWS E FESTIVAIS (MEGA E MÉDIOS) ---
const NOVOS_SHOWS_E_FESTIVAIS = [
  // === MEGA SHOWS & MEGA FESTIVAIS ===
  {
    id: "EVT-2026-061",
    nome: "Lollapalooza Brasil 2026 (13ª Edição & Camarotes Corporativos)",
    segmento: "Shows / Mega Festivais / Música Internacional",
    local_evento: "interlagos_arena",
    cidade: "São Paulo",
    data_inicio: "2026-03-27",
    data_fim: "2026-03-29",
    dias_duracao: 3,
    dias_antecedencia: 21,
    publico_total_estimado: 240000,
    percentual_fora_da_cidade: 0.65,
    empresa_organizadora: "Live Nation Brasil & Rock World",
    cnpj_organizador: "10.456.789/0001-12",
    decisores_identificados: [
      { nome: "Marcelo Beraldo", cargo: "Diretor de Operações de Festivais & Parcerias", email: "mberaldo@livenation.com.br" },
      { nome: "Camila Guimarães", cargo: "Head de Hospitalidade VIP & Camarotes Corporativos", email: "camila.vip@lollapaloozabr.com" },
      { nome: "Gustavo Paiva", cargo: "Gerente de Trade Marketing e Patrocínios (Heineken/Itaú)", email: "patrocinios@heineken.com.br" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 156000,
      room_nights_estimados: 468000,
      transfers_aeroporto_necessarios: 95000,
      deslocamentos_hotel_evento_dia: 156000,
      aereos_estimados: 85000,
      jantares_executivos_grupos: 45
    },
    budget_alvo_estimado: 12500000
  },
  {
    id: "EVT-2026-062",
    nome: "Temporada de Shows Internacionais de Estádio (Allianz Parque 2026)",
    segmento: "Shows / Estádios & Arenas / Turnês Mundiais",
    local_evento: "allianz_parque",
    cidade: "São Paulo",
    data_inicio: "2026-10-15",
    data_fim: "2026-10-18",
    dias_duracao: 4,
    dias_antecedencia: 60,
    publico_total_estimado: 190000,
    percentual_fora_da_cidade: 0.55,
    empresa_organizadora: "WTorre Entretenimento & Live Nation",
    cnpj_organizador: "18.333.444/0001-99",
    decisores_identificados: [
      { nome: "Cláudio Macedo", cargo: "CEO da WTorre Entretenimento & Allianz Parque", email: "cmacedo@allianzparque.com.br" },
      { nome: "Juliana Medeiros", cargo: "Diretora de Camarotes Corporativos & Hospitality", email: "camarotes@allianzparque.com.br" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 104500,
      room_nights_estimados: 209000,
      transfers_aeroporto_necessarios: 62000,
      deslocamentos_hotel_evento_dia: 104500,
      aereos_estimados: 55000,
      jantares_executivos_grupos: 35
    },
    budget_alvo_estimado: 8900000
  },
  {
    id: "EVT-2026-063",
    nome: "Mega Shows Estádio do MorumBIS 2026 (Grandes Bandas & Camarotes VIP)",
    segmento: "Shows / Estádios / Turnês Globais",
    local_evento: "morumbi_estadio",
    cidade: "São Paulo",
    data_inicio: "2026-11-06",
    data_fim: "2026-11-08",
    dias_duracao: 3,
    dias_antecedencia: 85,
    publico_total_estimado: 195000,
    percentual_fora_da_cidade: 0.58,
    empresa_organizadora: "MorumBIS Entretenimento & 30e",
    cnpj_organizador: "31.222.111/0001-88",
    decisores_identificados: [
      { nome: "Pepeu Correa", cargo: "CEO da 30e Entretenimento", email: "pepeu@30e.com.br" },
      { nome: "Mariana Faria", cargo: "Gerente Geral de Hospitalidade & Receptivo MorumBIS", email: "hospitality@morumbis.com.br" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 113100,
      room_nights_estimados: 339300,
      transfers_aeroporto_necessarios: 68000,
      deslocamentos_hotel_evento_dia: 113100,
      aereos_estimados: 60000,
      jantares_executivos_grupos: 30
    },
    budget_alvo_estimado: 9800000
  },
  {
    id: "EVT-2026-064",
    nome: "71ª Festa do Peão de Boiadeiro de Barretos 2026 (Maior Circuito de Shows Sertanejos)",
    segmento: "Shows / Festivais Sertanejos / Entretenimento Agro",
    local_evento: "barretos_parque_peao",
    cidade: "Barretos",
    data_inicio: "2026-08-20",
    data_fim: "2026-08-30",
    dias_duracao: 10,
    dias_antecedencia: 180,
    publico_total_estimado: 900000,
    percentual_fora_da_cidade: 0.82,
    empresa_organizadora: "Associação Os Independentes de Barretos",
    cnpj_organizador: "44.876.543/0001-21",
    decisores_identificados: [
      { nome: "Hussein Gemha Júnior", cargo: "Presidente de Os Independentes & Parque do Peão", email: "presidencia@osindependentes.com.br" },
      { nome: "Jerônimo Muzetti", cargo: "Diretor Financeiro e Relações Corporativas", email: "patrocinios@osindependentes.com.br" },
      { nome: "Fernando Moni", cargo: "Coordenador de Camarotes Corporativos (Brahma / Super Bull)", email: "camarotes@barretos.com.br" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 738000,
      room_nights_estimados: 2214000,
      transfers_aeroporto_necessarios: 180000,
      deslocamentos_hotel_evento_dia: 738000,
      aereos_estimados: 120000,
      jantares_executivos_grupos: 85
    },
    budget_alvo_estimado: 18500000
  },
  {
    id: "EVT-2026-065",
    nome: "Festival João Rock Ribeirão Preto 2026 (Maior Festival de Rock Nacional do Brasil)",
    segmento: "Shows / Festivais de Rock / Música Brasileira",
    local_evento: "ribeirao_preto",
    cidade: "Ribeirão Preto",
    data_inicio: "2026-06-13",
    data_fim: "2026-06-14",
    dias_duracao: 2,
    dias_antecedencia: 50,
    publico_total_estimado: 75000,
    percentual_fora_da_cidade: 0.68,
    empresa_organizadora: "João Rock Produções & EPTV",
    cnpj_organizador: "05.432.198/0001-77",
    decisores_identificados: [
      { nome: "Luit Marques", cargo: "Sócio-Diretor e Organizador Geral", email: "luit@joaorock.com.br" },
      { nome: "Marcelo Rocci", cargo: "Diretor Comercial & Camarote Colorado", email: "comercial@joaorock.com.br" }
    ],
    poder_economico_segmento: "MEDIO_ALTO",
    demanda_estimada: {
      hospedes_estimados: 51000,
      room_nights_estimados: 102000,
      transfers_aeroporto_necessarios: 28000,
      deslocamentos_hotel_evento_dia: 51000,
      aereos_estimados: 22000,
      jantares_executivos_grupos: 20
    },
    budget_alvo_estimado: 3800000
  },
  {
    id: "EVT-2026-066",
    nome: "37ª Festa do Peão de Americana 2026 (Circuito de Shows e Camarotes Corporativos)",
    segmento: "Shows / Festivais Sertanejos / Rodeio",
    local_evento: "campinas_resorts",
    cidade: "Americana",
    data_inicio: "2026-06-10",
    data_fim: "2026-06-21",
    dias_duracao: 6,
    dias_antecedencia: 70,
    publico_total_estimado: 400000,
    percentual_fora_da_cidade: 0.60,
    empresa_organizadora: "Clube dos Cavaleiros de Americana (CCA)",
    cnpj_organizador: "51.345.678/0001-43",
    decisores_identificados: [
      { nome: "Beto Lahr", cargo: "Presidente do Clube dos Cavaleiros de Americana", email: "beto@festadopeaodeamericana.com.br" },
      { nome: "Rodrigo Françoso", cargo: "Diretor de Marketing & Camarotes Empresariais", email: "comercial@cca.com.br" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 240000,
      room_nights_estimados: 480000,
      transfers_aeroporto_necessarios: 60000,
      deslocamentos_hotel_evento_dia: 240000,
      aereos_estimados: 45000,
      jantares_executivos_grupos: 40
    },
    budget_alvo_estimado: 6800000
  },
  {
    id: "EVT-2026-067",
    nome: "Jaguariúna Rodeo Festival & Shows 2026 (Red Park / Circuito Brahma)",
    segmento: "Shows / Festivais / Entretenimento",
    local_evento: "campinas_resorts",
    cidade: "Jaguariúna",
    data_inicio: "2026-09-18",
    data_fim: "2026-09-27",
    dias_duracao: 4,
    dias_antecedencia: 45,
    publico_total_estimado: 120000,
    percentual_fora_da_cidade: 0.70,
    empresa_organizadora: "Diverti & Circuito Sertanejo",
    cnpj_organizador: "14.234.567/0001-89",
    decisores_identificados: [
      { nome: "Gui Marconi", cargo: "CEO da Diverti & Organizador JRF", email: "gui@diverti.com.br" },
      { nome: "Fabiana Pires", cargo: "Gerente de Hospitality & Patrocinadores", email: "patrocinio@jaguariunarodeo.com.br" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 84000,
      room_nights_estimados: 168000,
      transfers_aeroporto_necessarios: 35000,
      deslocamentos_hotel_evento_dia: 84000,
      aereos_estimados: 30000,
      jantares_executivos_grupos: 25
    },
    budget_alvo_estimado: 4900000
  },
  {
    id: "EVT-2026-068",
    nome: "Só Track Boa Festival SP 2026 (Maior Festival de Música Eletrônica Nacional)",
    segmento: "Shows / Festivais / Música Eletrônica",
    local_evento: "interlagos_arena",
    cidade: "São Paulo",
    data_inicio: "2026-05-22",
    data_fim: "2026-05-23",
    dias_duracao: 2,
    dias_antecedencia: 30,
    publico_total_estimado: 45000,
    percentual_fora_da_cidade: 0.55,
    empresa_organizadora: "Entourage Conteúdo Artístico & Vintage Culture",
    cnpj_organizador: "22.333.444/0001-55",
    decisores_identificados: [
      { nome: "Guga Trevisani", cargo: "Diretor Executivo da Entourage & STB", email: "guga@entourage.com.br" },
      { nome: "Carolina Rossi", cargo: "Head de Camarotes & Backstage VIP", email: "vip@sotrackboa.com" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 24750,
      room_nights_estimados: 49500,
      transfers_aeroporto_necessarios: 15000,
      deslocamentos_hotel_evento_dia: 24750,
      aereos_estimados: 14000,
      jantares_executivos_grupos: 15
    },
    budget_alvo_estimado: 2900000
  },

  // === SHOWS MÉDIOS, ARENAS & FESTIVAIS BOUTIQUE / EXECUTIVOS ===
  {
    id: "EVT-2026-069",
    nome: "C6 Fest 2026 (Jazz, MPB & Pop Internacional no Parque Ibirapuera)",
    segmento: "Shows / Festivais Boutique / Jazz & MPB",
    local_evento: "ibirapuera_arenas",
    cidade: "São Paulo",
    data_inicio: "2026-05-21",
    data_fim: "2026-05-24",
    dias_duracao: 4,
    dias_antecedencia: 25,
    publico_total_estimado: 28000,
    percentual_fora_da_cidade: 0.50,
    empresa_organizadora: "Dueto Produções & C6 Bank",
    cnpj_organizador: "02.876.543/0001-19",
    decisores_identificados: [
      { nome: "Monique Gardenberg", cargo: "Diretora Geral Dueto Produções", email: "monique@duetoproducoes.com.br" },
      { nome: "Alexandra Pain", cargo: "Head de Marketing & Eventos do C6 Bank", email: "alexandra.pain@c6bank.com" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 14000,
      room_nights_estimados: 42000,
      transfers_aeroporto_necessarios: 9000,
      deslocamentos_hotel_evento_dia: 14000,
      aereos_estimados: 8500,
      jantares_executivos_grupos: 25
    },
    budget_alvo_estimado: 2600000
  },
  {
    id: "EVT-2026-070",
    nome: "Temporada de Shows Corporativos no Espaço Unimed 2026 (Grandes Turnês)",
    segmento: "Shows / Casas de Show / Corporativo & Entretenimento",
    local_evento: "allianz_parque",
    cidade: "São Paulo",
    data_inicio: "2026-07-10",
    data_fim: "2026-07-12",
    dias_duracao: 3,
    dias_antecedencia: 40,
    publico_total_estimado: 25000,
    percentual_fora_da_cidade: 0.45,
    empresa_organizadora: "Grupo São Paulo Eventos & Espaço Unimed",
    cnpj_organizador: "09.876.543/0001-99",
    decisores_identificados: [
      { nome: "Marco Antônio Tobias", cargo: "Diretor Comercial do Espaço Unimed & Audio", email: "marco@espacounimed.com.br" },
      { nome: "Renata Abreu", cargo: "Gerente de Camarotes e Eventos Corporativos", email: "camarotes@espacounimed.com.br" }
    ],
    poder_economico_segmento: "MEDIO_ALTO",
    demanda_estimada: {
      hospedes_estimados: 11250,
      room_nights_estimados: 22500,
      transfers_aeroporto_necessarios: 7500,
      deslocamentos_hotel_evento_dia: 11250,
      aereos_estimados: 6500,
      jantares_executivos_grupos: 18
    },
    budget_alvo_estimado: 1950000
  },
  {
    id: "EVT-2026-071",
    nome: "Shows & Eventos no Vibra São Paulo 2026 (Ex-Credicard Hall)",
    segmento: "Shows / Casas de Show / Executivo",
    local_evento: "transamerica_expo",
    cidade: "São Paulo",
    data_inicio: "2026-08-14",
    data_fim: "2026-08-16",
    dias_duracao: 3,
    dias_antecedencia: 35,
    publico_total_estimado: 21000,
    percentual_fora_da_cidade: 0.45,
    empresa_organizadora: "Opus Entretenimento & Vibra Energia",
    cnpj_organizador: "13.456.789/0001-33",
    decisores_identificados: [
      { nome: "Carlos Konrath", cargo: "Presidente da Opus Entretenimento", email: "ckonrath@opusentretenimento.com" },
      { nome: "Patrícia Lima", cargo: "Gerente de Eventos & Hospitalidade Vibra SP", email: "corporativo@vibrasaopaulo.com" }
    ],
    poder_economico_segmento: "MEDIO_ALTO",
    demanda_estimada: {
      hospedes_estimados: 9450,
      room_nights_estimados: 18900,
      transfers_aeroporto_necessarios: 6000,
      deslocamentos_hotel_evento_dia: 9450,
      aereos_estimados: 5500,
      jantares_executivos_grupos: 14
    },
    budget_alvo_estimado: 1650000
  },
  {
    id: "EVT-2026-072",
    nome: "56º Festival Internacional de Inverno de Campos do Jordão 2026 (Música Clássica & Jazz)",
    segmento: "Shows / Festivais / Música Erudita & Jazz",
    local_evento: "campos_jordao",
    cidade: "Campos do Jordão",
    data_inicio: "2026-07-03",
    data_fim: "2026-07-26",
    dias_duracao: 24,
    dias_antecedencia: 90,
    publico_total_estimado: 65000,
    percentual_fora_da_cidade: 0.85,
    empresa_organizadora: "Fundação OSESP & Secretaria da Cultura de SP",
    cnpj_organizador: "50.123.456/0001-90",
    decisores_identificados: [
      { nome: "Marcelo Lopes", cargo: "Diretor Executivo da Fundação OSESP", email: "mlopes@osesp.art.br" },
      { nome: "Cláudia Assumpção", cargo: "Coordenadora de Viagens e Hospitalidade de Solistas Internacionais", email: "viagens@osesp.art.br" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 55250,
      room_nights_estimados: 165750,
      transfers_aeroporto_necessarios: 25000,
      deslocamentos_hotel_evento_dia: 55250,
      aereos_estimados: 20000,
      jantares_executivos_grupos: 30
    },
    budget_alvo_estimado: 4200000
  },
  {
    id: "EVT-2026-073",
    nome: "Festival Turá SP 2026 (Música Brasileira, Gastronomia & Cultura no Ibirapuera)",
    segmento: "Shows / Festivais / Cultura & MPB",
    local_evento: "ibirapuera_arenas",
    cidade: "São Paulo",
    data_inicio: "2026-06-27",
    data_fim: "2026-06-28",
    dias_duracao: 2,
    dias_antecedencia: 28,
    publico_total_estimado: 35000,
    percentual_fora_da_cidade: 0.50,
    empresa_organizadora: "T4F Entretenimento (Time For Fun)",
    cnpj_organizador: "03.888.999/0001-44",
    decisores_identificados: [
      { nome: "Fernando Alterio", cargo: "Presidente do Conselho T4F", email: "alterio@t4f.com.br" },
      { nome: "Francesca Alterio", cargo: "Diretora de Festivais T4F (Turá / Grls)", email: "francesca@t4f.com.br" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 17500,
      room_nights_estimados: 35000,
      transfers_aeroporto_necessarios: 11000,
      deslocamentos_hotel_evento_dia: 17500,
      aereos_estimados: 9500,
      jantares_executivos_grupos: 15
    },
    budget_alvo_estimado: 2750000
  },
  {
    id: "EVT-2026-074",
    nome: "Time Warp Brasil 2026 (Festival Internacional de Techno & Experiência Audiovisual)",
    segmento: "Shows / Festivais / Música Eletrônica & Tech",
    local_evento: "anhembi",
    cidade: "São Paulo",
    data_inicio: "2026-05-01",
    data_fim: "2026-05-02",
    dias_duracao: 2,
    dias_antecedencia: 20,
    publico_total_estimado: 38000,
    percentual_fora_da_cidade: 0.60,
    empresa_organizadora: "Entourage & Time Warp Global (Cosmopop)",
    cnpj_organizador: "22.333.444/0001-55",
    decisores_identificados: [
      { nome: "Marcio Ribeiro", cargo: "Head de Produção Internacional Time Warp", email: "marcio@entourage.com.br" },
      { nome: "Carla Silveira", cargo: "Gerente de Hospitalidade para DJs e Comitivas Internacionais", email: "hospitality@timewarpbrasil.com" }
    ],
    poder_economico_segmento: "ALTO",
    demanda_estimada: {
      hospedes_estimados: 22800,
      room_nights_estimados: 45600,
      transfers_aeroporto_necessarios: 14000,
      deslocamentos_hotel_evento_dia: 22800,
      aereos_estimados: 13000,
      jantares_executivos_grupos: 12
    },
    budget_alvo_estimado: 2850000
  },
  {
    id: "EVT-2026-075",
    nome: "34º Festival Forró da Lua Cheia 2026 (Altinópolis / Ribeirão Preto)",
    segmento: "Shows / Festivais / Música Brasileira & Multicultural",
    local_evento: "ribeirao_preto",
    cidade: "Altinópolis",
    data_inicio: "2026-05-28",
    data_fim: "2026-05-31",
    dias_duracao: 4,
    dias_antecedencia: 35,
    publico_total_estimado: 14000,
    percentual_fora_da_cidade: 0.80,
    empresa_organizadora: "Produções Lua Cheia & Hotel Fazenda Vale das Grutas",
    cnpj_organizador: "07.654.321/0001-11",
    decisores_identificados: [
      { nome: "Leonardo Moretti", cargo: "Diretor Geral do Festival Lua Cheia", email: "contato@festivalforrodaluacheia.com.br" }
    ],
    poder_economico_segmento: "MEDIO",
    demanda_estimada: {
      hospedes_estimados: 11200,
      room_nights_estimados: 44800,
      transfers_aeroporto_necessarios: 6000,
      deslocamentos_hotel_evento_dia: 11200,
      aereos_estimados: 5000,
      jantares_executivos_grupos: 8
    },
    budget_alvo_estimado: 1450000
  },
  {
    id: "EVT-2026-076",
    nome: "Shows de Temporada no Tokio Marine Hall 2026 (Ex-Tom Brasil)",
    segmento: "Shows / Casas de Show / MPB & Pop",
    local_evento: "transamerica_expo",
    cidade: "São Paulo",
    data_inicio: "2026-09-04",
    data_fim: "2026-09-06",
    dias_duracao: 3,
    dias_antecedencia: 30,
    publico_total_estimado: 12000,
    percentual_fora_da_cidade: 0.40,
    empresa_organizadora: "Grupo Tom Brasil & Tokio Marine Seguradora",
    cnpj_organizador: "62.345.678/0001-54",
    decisores_identificados: [
      { nome: "Gladstone Lobato", cargo: "Diretor de Eventos Corporativos Tokio Marine Hall", email: "corporativo@tokiomarinehall.com.br" }
    ],
    poder_economico_segmento: "MEDIO_ALTO",
    demanda_estimada: {
      hospedes_estimados: 4800,
      room_nights_estimados: 9600,
      transfers_aeroporto_necessarios: 3200,
      deslocamentos_hotel_evento_dia: 4800,
      aereos_estimados: 2800,
      jantares_executivos_grupos: 10
    },
    budget_alvo_estimado: 1100000
  }
];

// --- 2. NOVOS FORNECEDORES DE PROXIMIDADE PARA ESTÁDIOS & SHOWS ---
const NOVOS_FORNECEDORES_SHOWS = [
  // Hotéis Allianz Parque / Barra Funda
  {
    id: "HOT-023",
    tipo: "hotel",
    nome: "B&B Hotel São Paulo Barra Funda",
    categoria: "3_estrelas",
    bairro: "Barra Funda (Allianz Parque / Espaço Unimed)",
    coordenadas: { lat: -23.526, lon: -46.668 },
    diaria_media_padrao: 380,
    diaria_negociada_mice: 310,
    capacidade_quartos: 210,
    max_room_block: 110,
    comissao_percentual: 10,
    politica_cancelamento_dias: 14,
    sla_resposta_horas: 3,
    cafe_incluso: true,
    possui_salas_apoio: true,
    distancias_km: {
      allianz_parque: 1.2,
      espaco_unimed: 0.8,
      anhembi: 4.5,
      sp_expo: 16.0,
      transamerica_expo: 14.5
    },
    avaliacao_qualidade: 8.8,
    historico_atendimentos: 55,
    detalhes_operacionais: "Hotel estratégico a 1,2 km do Allianz Parque e 800m do Espaço Unimed. Ideal para equipes de produção, comitivas de camarotes e patrocinadores de shows.",
    posicionamento_taxi_recomendado: "Bolsão Chame Táxi no Terminal Barra Funda / Av. Francisco Matarazzo."
  },
  {
    id: "HOT-024",
    tipo: "hotel",
    nome: "Transamerica Classic Victoria Perdizes",
    categoria: "4_estrelas",
    bairro: "Perdizes (Próximo ao Allianz Parque)",
    coordenadas: { lat: -23.538, lon: -46.673 },
    diaria_media_padrao: 620,
    diaria_negociada_mice: 490,
    capacidade_quartos: 140,
    max_room_block: 70,
    comissao_percentual: 10,
    politica_cancelamento_dias: 14,
    sla_resposta_horas: 2,
    cafe_incluso: true,
    possui_salas_apoio: true,
    distancias_km: {
      allianz_parque: 1.5,
      espaco_unimed: 2.1,
      anhembi: 5.2,
      sp_expo: 15.0,
      transamerica_expo: 13.0
    },
    avaliacao_qualidade: 9.3,
    historico_atendimentos: 42,
    detalhes_operacionais: "Flat executivo de alto padrão no coração de Perdizes. Muito procurado por executivos de marcas patrocinadoras e artistas em turnê.",
    posicionamento_taxi_recomendado: "Ponto exclusivo na Rua Monte Alegre com Av. Sumaré."
  },

  // Hotéis MorumBIS / Palácio Tangará
  {
    id: "HOT-025",
    tipo: "hotel",
    nome: "Palácio Tangará (Oetker Collection - Ultra Luxo)",
    categoria: "5_estrelas_luxo",
    bairro: "Panamby / Morumbi",
    coordenadas: { lat: -23.638, lon: -46.726 },
    diaria_media_padrao: 2600,
    diaria_negociada_mice: 1850,
    capacidade_quartos: 141,
    max_room_block: 50,
    comissao_percentual: 12,
    politica_cancelamento_dias: 30,
    sla_resposta_horas: 1,
    cafe_incluso: true,
    possui_salas_apoio: true,
    distancias_km: {
      morumbi_estadio: 3.5,
      allianz_parque: 14.5,
      interlagos_arena: 9.8,
      transamerica_expo: 5.2
    },
    avaliacao_qualidade: 9.9,
    historico_atendimentos: 60,
    detalhes_operacionais: "Hotel 6 estrelas de ultra-luxo dentro do Parque Burle Marx. Escolha número 1 de astros internacionais da música (Coldplay, Bruno Mars, U2) e comitivas de alta diretoria global de patrocinadores.",
    posicionamento_taxi_recomendado: "Heliponto ativo e frota de sedans executivos blindados Chame Táxi."
  },
  {
    id: "HOT-026",
    tipo: "hotel",
    nome: "Hilton São Paulo Morumbi",
    categoria: "5_estrelas_luxo",
    bairro: "Brooklin / Marginal Pinheiros (Frente Morumbi)",
    coordenadas: { lat: -23.611, lon: -46.699 },
    diaria_media_padrao: 1100,
    diaria_negociada_mice: 850,
    capacidade_quartos: 503,
    max_room_block: 180,
    comissao_percentual: 10,
    politica_cancelamento_dias: 21,
    sla_resposta_horas: 2,
    cafe_incluso: true,
    possui_salas_apoio: true,
    distancias_km: {
      morumbi_estadio: 4.2,
      allianz_parque: 12.8,
      interlagos_arena: 11.5,
      transamerica_expo: 4.5
    },
    avaliacao_qualidade: 9.6,
    historico_atendimentos: 88,
    detalhes_operacionais: "Integrado ao Centro Empresarial Nações Unidas (CENU). Grande infraestrutura para grupos corporativos de mega shows no MorumBIS.",
    posicionamento_taxi_recomendado: "Porte-cochère no CENU com acesso rápido pela Ponte Estaiada."
  },

  // Hotéis Barretos (Festa do Peão)
  {
    id: "HOT-027",
    tipo: "hotel",
    nome: "Barretos Park Hotel (Dentro do Parque do Peão)",
    categoria: "4_estrelas",
    bairro: "Parque do Peão (Barretos)",
    coordenadas: { lat: -20.528, lon: -48.552 },
    diaria_media_padrao: 1800,
    diaria_negociada_mice: 1150,
    capacidade_quartos: 251,
    max_room_block: 120,
    comissao_percentual: 10,
    politica_cancelamento_dias: 45,
    sla_resposta_horas: 4,
    cafe_incluso: true,
    possui_salas_apoio: true,
    distancias_km: {
      barretos_parque_peao: 0.1,
      ribeirao_preto: 120.0
    },
    avaliacao_qualidade: 9.4,
    historico_atendimentos: 38,
    detalhes_operacionais: "Único hotel temático construído dentro do complexo do Parque do Peão de Barretos. Quartos esgotados com até 1 ano de antecedência. Acesso VIP aos camarotes a pé.",
    posicionamento_taxi_recomendado: "Ponto privativo no portão do Estádio de Rodeios."
  },
  {
    id: "HOT-028",
    tipo: "hotel",
    nome: "Dan Inn Barretos Hotel",
    categoria: "3_estrelas",
    bairro: "Centro (Barretos)",
    coordenadas: { lat: -20.556, lon: -48.568 },
    diaria_media_padrao: 850,
    diaria_negociada_mice: 520,
    capacidade_quartos: 130,
    max_room_block: 60,
    comissao_percentual: 8,
    politica_cancelamento_dias: 30,
    sla_resposta_horas: 4,
    cafe_incluso: true,
    possui_salas_apoio: true,
    distancias_km: {
      barretos_parque_peao: 6.5,
      ribeirao_preto: 118.0
    },
    avaliacao_qualidade: 8.5,
    historico_atendimentos: 25,
    detalhes_operacionais: "Hotel tradicional no centro de Barretos com piscina e salas de eventos. Conectado ao Parque do Peão por transfers contínuos.",
    posicionamento_taxi_recomendado: "Praça central de Barretos com a Cooperativa de Rádio Táxi local."
  },

  // Cooperativas e Fretamento para Shows
  {
    id: "TAXI-007",
    tipo: "taxi",
    nome: "Cooperativa de Rádio Táxi Barretos & Circuito Sertanejo",
    frota_disponivel: 180,
    faturamento_pos_pago_voucher: true,
    cobertura_cgh: false,
    cobertura_gru: false,
    tarifa_media_cgh_hotel: 0,
    tarifa_media_gru_hotel: 0,
    sla_tempo_chegada_min: 7,
    capacidade_pico_simultanea: 120,
    avaliacao_qualidade: 9.3,
    comissao_repasse_parceria: 10,
    bairro: "Barretos & Aeroporto Chafei Amsei",
    detalhes_operacionais: "Cooperativa homologada com ponto exclusivo no portão principal do Parque do Peão de Barretos e no Aeroporto de Barretos (SBBT).",
    posicionamento_taxi_recomendado: "Pista expressa de desembarque do Parque do Peão sem bloqueio no trânsito."
  }
];

// --- EXECUÇÃO DA ATUALIZAÇÃO ---
console.log('🔄 Atualizando banco de dados com Shows e Festivais...');

// 1. Inserir Eventos
const eventosAtuais = JSON.parse(fs.readFileSync(ARQ_EVENTOS, 'utf8'));
const idsAtuais = new Set(eventosAtuais.map(e => e.id));
let eventosAdicionados = 0;

NOVOS_SHOWS_E_FESTIVAIS.forEach(show => {
  if (!idsAtuais.has(show.id)) {
    eventosAtuais.push(show);
    eventosAdicionados++;
  }
});

fs.writeFileSync(ARQ_EVENTOS, JSON.stringify(eventosAtuais, null, 2), 'utf8');
console.log(`✅ ${eventosAdicionados} Shows e Festivais (Mega e Médios) adicionados a eventos_radar.json!`);

// 2. Inserir Fornecedores
const fornecedoresAtuais = JSON.parse(fs.readFileSync(ARQ_FORNECEDORES, 'utf8'));
const fIdsAtuais = new Set(fornecedoresAtuais.map(f => f.id));
let fornecedoresAdicionados = 0;

NOVOS_FORNECEDORES_SHOWS.forEach(forn => {
  if (!fIdsAtuais.has(forn.id)) {
    fornecedoresAtuais.push(forn);
    fornecedoresAdicionados++;
  }
});

fs.writeFileSync(ARQ_FORNECEDORES, JSON.stringify(fornecedoresAtuais, null, 2), 'utf8');
console.log(`✅ ${fornecedoresAdicionados} Fornecedores de Proximidade (Allianz, Morumbi, Barretos) adicionados a fornecedores_sp.json!`);

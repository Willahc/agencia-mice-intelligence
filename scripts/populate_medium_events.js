const fs = require('fs');
const path = require('path');

const eventosPath = path.join(__dirname, '..', 'src', 'data', 'eventos_radar.json');
const fornecedoresPath = path.join(__dirname, '..', 'src', 'data', 'fornecedores_sp.json');

const eventosAtuais = JSON.parse(fs.readFileSync(eventosPath, 'utf8'));
const fornecedoresAtuais = JSON.parse(fs.readFileSync(fornecedoresPath, 'utf8'));

const eventosMedios = [
  // --- CONVENÇÕES DE VENDAS & CORPORATIVOS (100 a 800 PAX) ---
  {
    "id": "EVT-2026-033",
    "nome": "Convenção Nacional de Vendas Ambev 2026 (Trade & Liderança)",
    "segmento": "Varejo / Alimentos",
    "local_evento": "wds_wtc",
    "cidade": "São Paulo",
    "data_inicio": "2026-02-23",
    "data_fim": "2026-02-25",
    "dias_duracao": 3,
    "dias_antecedencia": 10,
    "publico_total_estimado": 450,
    "percentual_fora_da_cidade": 0.85,
    "empresa_organizadora": "Ambev S.A. (Diretoria de Vendas & Gente e Gestão)",
    "cnpj_organizador": "07.526.557/0001-00",
    "decisores_identificados": [
      {
        "nome": "Rodrigo Figueiredo",
        "cargo": "Vice-Presidente de Vendas e Trade Marketing",
        "email": "rodrigo.figueiredo@ambev.com.br"
      },
      {
        "nome": "Juliana Rossi",
        "cargo": "Gerente de Eventos Corporativos & Compras Indiretas",
        "email": "juliana.rossi@ambev.com.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 380,
      "room_nights_estimados": 1140,
      "transfers_aeroporto_necessarios": 380,
      "deslocamentos_hotel_evento_dia": 380,
      "aereos_estimados": 350,
      "jantares_executivos_grupos": 4
    },
    "budget_alvo_estimado": 650000.00
  },
  {
    "id": "EVT-2026-034",
    "nome": "Convenção Anual Nestlé Health Science 2026 (Medical Nutrition)",
    "segmento": "Farmacêutico / Saúde",
    "local_evento": "transamerica_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-03-24",
    "data_fim": "2026-03-26",
    "dias_duracao": 3,
    "dias_antecedencia": 20,
    "publico_total_estimado": 280,
    "percentual_fora_da_cidade": 0.90,
    "empresa_organizadora": "Nestlé Brasil Ltda (Divisão Health Science)",
    "cnpj_organizador": "60.409.075/0001-52",
    "decisores_identificados": [
      {
        "nome": "Monique Meirelles",
        "cargo": "Head de Marketing Médico & Eventos Científicos",
        "email": "monique.meirelles@br.nestle.com"
      },
      {
        "nome": "Eduardo Castilho",
        "cargo": "Coordenador de Compras e Viagens Corporativas",
        "email": "eduardo.castilho@br.nestle.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 250,
      "room_nights_estimados": 750,
      "transfers_aeroporto_necessarios": 250,
      "deslocamentos_hotel_evento_dia": 250,
      "aereos_estimados": 240,
      "jantares_executivos_grupos": 3
    },
    "budget_alvo_estimado": 480000.00
  },
  {
    "id": "EVT-2026-035",
    "nome": "Convenção Nacional de Franqueados Cacau Show 2026",
    "segmento": "Varejo / Alimentos",
    "local_evento": "frei_caneca",
    "cidade": "São Paulo",
    "data_inicio": "2026-05-18",
    "data_fim": "2026-05-20",
    "dias_duracao": 3,
    "dias_antecedencia": 40,
    "publico_total_estimado": 650,
    "percentual_fora_da_cidade": 0.75,
    "empresa_organizadora": "Cacau Show (Cacau Franchising Ltda)",
    "cnpj_organizador": "04.770.828/0001-20",
    "decisores_identificados": [
      {
        "nome": "Alexandre Tadeu da Costa",
        "cargo": "CEO & Fundador",
        "email": "presidencia@cacaushow.com.br"
      },
      {
        "nome": "Carla Nogueira",
        "cargo": "Gerente de Expansão e Eventos de Franquia",
        "email": "carla.nogueira@cacaushow.com.br"
      }
    ],
    "poder_economico_segmento": "ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 490,
      "room_nights_estimados": 1470,
      "transfers_aeroporto_necessarios": 450,
      "deslocamentos_hotel_evento_dia": 490,
      "aereos_estimados": 420,
      "jantares_executivos_grupos": 6
    },
    "budget_alvo_estimado": 790000.00
  },
  {
    "id": "EVT-2026-036",
    "nome": "Encontro de Liderança Santander & Empresas Parceiras 2026",
    "segmento": "Financeiro / Fintech",
    "local_evento": "wds_wtc",
    "cidade": "São Paulo",
    "data_inicio": "2026-04-14",
    "data_fim": "2026-04-15",
    "dias_duracao": 2,
    "dias_antecedencia": 30,
    "publico_total_estimado": 350,
    "percentual_fora_da_cidade": 0.65,
    "empresa_organizadora": "Banco Santander (Brasil) S.A.",
    "cnpj_organizador": "90.400.888/0001-42",
    "decisores_identificados": [
      {
        "nome": "Marcelo Labuto",
        "cargo": "Diretor Executivo de Rede & Parcerias",
        "email": "marcelo.labuto@santander.com.br"
      },
      {
        "nome": "Beatriz Vilela",
        "cargo": "Head de Compras MICE & Hospitality",
        "email": "beatriz.vilela@santander.com.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 230,
      "room_nights_estimados": 460,
      "transfers_aeroporto_necessarios": 230,
      "deslocamentos_hotel_evento_dia": 230,
      "aereos_estimados": 210,
      "jantares_executivos_grupos": 4
    },
    "budget_alvo_estimado": 520000.00
  },

  // --- SIMPÓSIOS MÉDICOS, ADVISORY BOARDS & CONGRESSOS BOUTIQUE (100 a 900 PAX) ---
  {
    "id": "EVT-2026-037",
    "nome": "Advisory Board Internacional de Imunooncologia AstraZeneca 2026",
    "segmento": "Farmacêutico / Saúde",
    "local_evento": "frei_caneca",
    "cidade": "São Paulo",
    "data_inicio": "2026-05-08",
    "data_fim": "2026-05-10",
    "dias_duracao": 3,
    "dias_antecedencia": 45,
    "publico_total_estimado": 120,
    "percentual_fora_da_cidade": 0.95,
    "empresa_organizadora": "AstraZeneca do Brasil Ltda",
    "cnpj_organizador": "60.315.777/0001-59",
    "decisores_identificados": [
      {
        "nome": "Dr. Fernando Moura",
        "cargo": "Diretor Médico de Oncologia",
        "email": "fernando.moura@astrazeneca.com"
      },
      {
        "nome": "Lucia Guimarães",
        "cargo": "Compliance & Medical Travel Specialist",
        "email": "lucia.guimaraes@astrazeneca.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 115,
      "room_nights_estimados": 345,
      "transfers_aeroporto_necessarios": 115,
      "deslocamentos_hotel_evento_dia": 115,
      "aereos_estimados": 110,
      "jantares_executivos_grupos": 3
    },
    "budget_alvo_estimado": 420000.00
  },
  {
    "id": "EVT-2026-038",
    "nome": "Simpósio Internacional de Cirurgia Robótica & Urologia Einstein 2026",
    "segmento": "Farmacêutico / Saúde",
    "local_evento": "wds_wtc",
    "cidade": "São Paulo",
    "data_inicio": "2026-06-25",
    "data_fim": "2026-06-27",
    "dias_duracao": 3,
    "dias_antecedencia": 60,
    "publico_total_estimado": 400,
    "percentual_fora_da_cidade": 0.70,
    "empresa_organizadora": "Sociedade Beneficente Israelita Brasileira Albert Einstein",
    "cnpj_organizador": "60.765.823/0001-30",
    "decisores_identificados": [
      {
        "nome": "Dr. Namir Cavalli",
        "cargo": "Coordenador de Ensino e Eventos Cirúrgicos",
        "email": "namir.cavalli@einstein.br"
      },
      {
        "nome": "Paula Vasconcellos",
        "cargo": "Supervisora de Hospitalidade e Viagens Acadêmicas",
        "email": "paula.vasconcellos@einstein.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 280,
      "room_nights_estimados": 840,
      "transfers_aeroporto_necessarios": 260,
      "deslocamentos_hotel_evento_dia": 280,
      "aereos_estimados": 240,
      "jantares_executivos_grupos": 4
    },
    "budget_alvo_estimado": 580000.00
  },
  {
    "id": "EVT-2026-039",
    "nome": "Jornada Paulista de Dermatologia & Cosmiatria Avançada 2026",
    "segmento": "Farmacêutico / Saúde",
    "local_evento": "frei_caneca",
    "cidade": "São Paulo",
    "data_inicio": "2026-08-14",
    "data_fim": "2026-08-16",
    "dias_duracao": 3,
    "dias_antecedencia": 70,
    "publico_total_estimado": 850,
    "percentual_fora_da_cidade": 0.55,
    "empresa_organizadora": "Sociedade Brasileira de Dermatologia - Resp. São Paulo (SBD-RESP)",
    "cnpj_organizador": "56.987.123/0001-99",
    "decisores_identificados": [
      {
        "nome": "Dra. Christine Prado",
        "cargo": "Presidente da Comissão Organizadora",
        "email": "eventos@sbd-resp.org.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 465,
      "room_nights_estimados": 1395,
      "transfers_aeroporto_necessarios": 380,
      "deslocamentos_hotel_evento_dia": 465,
      "aereos_estimados": 350,
      "jantares_executivos_grupos": 5
    },
    "budget_alvo_estimado": 690000.00
  },

  // --- SUMMITS DE TI, SAAS, IA & FINTECH (200 a 1.500 PAX) ---
  {
    "id": "EVT-2026-040",
    "nome": "SAP NOW Executive Summit Brasil 2026 (C-Level & Partners)",
    "segmento": "Tecnologia / Telecom / IA",
    "local_evento": "transamerica_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-09-02",
    "data_fim": "2026-09-03",
    "dias_duracao": 2,
    "dias_antecedencia": 80,
    "publico_total_estimado": 1800,
    "percentual_fora_da_cidade": 0.52,
    "empresa_organizadora": "SAP Brasil Ltda",
    "cnpj_organizador": "00.778.675/0001-09",
    "decisores_identificados": [
      {
        "nome": "Adriana Aroulho",
        "cargo": "Presidente SAP Brasil",
        "email": "adriana.aroulho@sap.com"
      },
      {
        "nome": "Gustavo Faria",
        "cargo": "Head de Marketing de Campo & Eventos Executivos",
        "email": "gustavo.faria@sap.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 935,
      "room_nights_estimados": 1870,
      "transfers_aeroporto_necessarios": 750,
      "deslocamentos_hotel_evento_dia": 935,
      "aereos_estimados": 680,
      "jantares_executivos_grupos": 8
    },
    "budget_alvo_estimado": 1250000.00
  },
  {
    "id": "EVT-2026-041",
    "nome": "AWS Community Day & Cloud Leaders São Paulo 2026",
    "segmento": "Tecnologia / Telecom / IA",
    "local_evento": "wds_wtc",
    "cidade": "São Paulo",
    "data_inicio": "2026-08-05",
    "data_fim": "2026-08-06",
    "dias_duracao": 2,
    "dias_antecedencia": 65,
    "publico_total_estimado": 750,
    "percentual_fora_da_cidade": 0.45,
    "empresa_organizadora": "Amazon AWS Brasil & Comunidade Cloud SP",
    "cnpj_organizador": "15.419.640/0001-88",
    "decisores_identificados": [
      {
        "nome": "Cleber Morais",
        "cargo": "Diretor Geral AWS Brasil",
        "email": "cleber.morais@amazon.com"
      },
      {
        "nome": "Fernanda Queiroz",
        "cargo": "Senior Developer Marketing & Event Coordinator",
        "email": "fqueiroz@amazon.com"
      }
    ],
    "poder_economico_segmento": "ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 340,
      "room_nights_estimados": 680,
      "transfers_aeroporto_necessarios": 280,
      "deslocamentos_hotel_evento_dia": 340,
      "aereos_estimados": 260,
      "jantares_executivos_grupos": 4
    },
    "budget_alvo_estimado": 490000.00
  },
  {
    "id": "EVT-2026-042",
    "nome": "Fintech Revolution Summit São Paulo 2026 (Banking & Open Finance)",
    "segmento": "Financeiro / Fintech",
    "local_evento": "frei_caneca",
    "cidade": "São Paulo",
    "data_inicio": "2026-07-08",
    "data_fim": "2026-07-09",
    "dias_duracao": 2,
    "dias_antecedencia": 50,
    "publico_total_estimado": 900,
    "percentual_fora_da_cidade": 0.50,
    "empresa_organizadora": "StartSe University & FinTech Club",
    "cnpj_organizador": "23.456.789/0001-01",
    "decisores_identificados": [
      {
        "nome": "Junior Borneli",
        "cargo": "Co-Fundador & CEO StartSe",
        "email": "junior@startse.com"
      },
      {
        "nome": "Jessica Fontes",
        "cargo": "Head de Parcerias e Operações de Eventos",
        "email": "jessica.fontes@startse.com"
      }
    ],
    "poder_economico_segmento": "ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 450,
      "room_nights_estimados": 900,
      "transfers_aeroporto_necessarios": 360,
      "deslocamentos_hotel_evento_dia": 450,
      "aereos_estimados": 320,
      "jantares_executivos_grupos": 5
    },
    "budget_alvo_estimado": 620000.00
  },

  // --- FÓRUNS DE LIDERANÇA, GOVERNANÇA & AGRO (150 a 600 PAX) ---
  {
    "id": "EVT-2026-043",
    "nome": "Fórum de Líderes Empresariais & CEOs LIDE 2026",
    "segmento": "Governança / Liderança C-Level",
    "local_evento": "wds_wtc",
    "cidade": "São Paulo",
    "data_inicio": "2026-08-25",
    "data_fim": "2026-08-26",
    "dias_duracao": 2,
    "dias_antecedencia": 75,
    "publico_total_estimado": 180,
    "percentual_fora_da_cidade": 0.70,
    "empresa_organizadora": "Grupo Doria / LIDE (Grupo de Líderes Empresariais)",
    "cnpj_organizador": "05.111.222/0001-33",
    "decisores_identificados": [
      {
        "nome": "João Doria Neto",
        "cargo": "Diretor Executivo LIDE",
        "email": "diretoria@lide.com.br"
      },
      {
        "nome": "Silvia Andrade",
        "cargo": "Head de Cerimonial e Hospitalidade C-Level",
        "email": "silvia.andrade@lide.com.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 126,
      "room_nights_estimados": 252,
      "transfers_aeroporto_necessarios": 126,
      "deslocamentos_hotel_evento_dia": 126,
      "aereos_estimados": 115,
      "jantares_executivos_grupos": 3
    },
    "budget_alvo_estimado": 450000.00
  },
  {
    "id": "EVT-2026-044",
    "nome": "AgroFinance & Barter Summit São Paulo 2026 (Crédito & CPRs)",
    "segmento": "Agronegócio / Financeiro",
    "local_evento": "wds_wtc",
    "cidade": "São Paulo",
    "data_inicio": "2026-09-15",
    "data_fim": "2026-09-16",
    "dias_duracao": 2,
    "dias_antecedencia": 90,
    "publico_total_estimado": 520,
    "percentual_fora_da_cidade": 0.78,
    "empresa_organizadora": "Agrotools & Datagro Publicações",
    "cnpj_organizador": "08.987.654/0001-21",
    "decisores_identificados": [
      {
        "nome": "Plinio Nastari",
        "cargo": "Presidente Datagro",
        "email": "nastari@datagro.com"
      },
      {
        "nome": "Marcio Albuquerque",
        "cargo": "Coordenador de Viagens & Produtores VIP",
        "email": "marcio.albuquerque@datagro.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 405,
      "room_nights_estimados": 810,
      "transfers_aeroporto_necessarios": 360,
      "deslocamentos_hotel_evento_dia": 405,
      "aereos_estimados": 350,
      "jantares_executivos_grupos": 4
    },
    "budget_alvo_estimado": 610000.00
  },
  {
    "id": "EVT-2026-045",
    "nome": "Congresso Brasileiro de Direito Tributário & M&A 2026",
    "segmento": "Jurídico / Compliance",
    "local_evento": "frei_caneca",
    "cidade": "São Paulo",
    "data_inicio": "2026-11-18",
    "data_fim": "2026-11-20",
    "dias_duracao": 3,
    "dias_antecedencia": 115,
    "publico_total_estimado": 380,
    "percentual_fora_da_cidade": 0.60,
    "empresa_organizadora": "Instituto Brasileiro de Estudos Tributários (IBET)",
    "cnpj_organizador": "50.123.456/0001-90",
    "decisores_identificados": [
      {
        "nome": "Paulo de Barros Carvalho",
        "cargo": "Presidente Emérito IBET",
        "email": "presidencia@ibet.com.br"
      },
      {
        "nome": "Heloisa Moretto",
        "cargo": "Coordenadora Executiva de Eventos Jurídicos",
        "email": "heloisa.moretto@ibet.com.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 228,
      "room_nights_estimados": 684,
      "transfers_aeroporto_necessarios": 200,
      "deslocamentos_hotel_evento_dia": 228,
      "aereos_estimados": 190,
      "jantares_executivos_grupos": 3
    },
    "budget_alvo_estimado": 470000.00
  }
];

const novosFornecedoresBoutique = [
  {
    "id": "HOT-013",
    "tipo": "hotel",
    "nome": "Blue Tree Towers Faria Lima",
    "categoria": "4_estrelas",
    "bairro": "Itaim Bibi / Faria Lima",
    "coordenadas": { "lat": -23.5850, "lon": -46.6810 },
    "diaria_media_padrao": 580.00,
    "diaria_negociada_mice": 460.00,
    "capacidade_quartos": 180,
    "max_room_block": 90,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 10,
    "sla_resposta_horas": 3,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "transamerica_expo": 7.5,
      "sp_expo": 9.8,
      "anhembi": 12.0,
      "frei_caneca": 6.5,
      "wds_wtc": 4.1
    },
    "avaliacao_qualidade": 9.3,
    "historico_atendimentos": 42,
    "detalhes_operacionais": "Localização no coração da Faria Lima / Itaim Bibi. Perfeito para eventos corporativos executivos, convenções financeiras e consultorias.",
    "posicionamento_taxi_recomendado": "Bolsão Chame Táxi Av. Brigadeiro Faria Lima com Rua Jesuíno Arruda."
  },
  {
    "id": "HOT-014",
    "tipo": "hotel",
    "nome": "Bourbon São Paulo Ibirapuera Conventions",
    "categoria": "4_estrelas",
    "bairro": "Moema / Ibirapuera",
    "coordenadas": { "lat": -23.6020, "lon": -46.6640 },
    "diaria_media_padrao": 510.00,
    "diaria_negociada_mice": 415.00,
    "capacidade_quartos": 650,
    "max_room_block": 300,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 14,
    "sla_resposta_horas": 4,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "transamerica_expo": 8.5,
      "sp_expo": 7.2,
      "anhembi": 13.5,
      "frei_caneca": 7.0,
      "wds_wtc": 4.8
    },
    "avaliacao_qualidade": 9.4,
    "historico_atendimentos": 75,
    "detalhes_operacionais": "Maior complexo hoteleiro de Moema, integrado ao Shopping Ibirapuera e com centro de convenções próprio para até 1.200 pessoas.",
    "posicionamento_taxi_recomendado": "Bolsão Chame Táxi Av. Ibirapuera / Al. dos Maracatins."
  }
];

// Mesclar sem duplicar IDs
const mapEventos = new Map();
eventosAtuais.forEach(e => mapEventos.set(e.id, e));
eventosMedios.forEach(e => mapEventos.set(e.id, e));
const eventosFinais = Array.from(mapEventos.values());

const mapFornecedores = new Map();
fornecedoresAtuais.forEach(f => mapFornecedores.set(f.id, f));
novosFornecedoresBoutique.forEach(f => mapFornecedores.set(f.id, f));
const fornecedoresFinais = Array.from(mapFornecedores.values());

fs.writeFileSync(eventosPath, JSON.stringify(eventosFinais, null, 2), 'utf8');
fs.writeFileSync(fornecedoresPath, JSON.stringify(fornecedoresFinais, null, 2), 'utf8');

console.log(`✅ Base Total Atualizada: ${eventosFinais.length} Eventos (Mega + Médios de 100+ pax)`);
console.log(`✅ Base Total de Fornecedores: ${fornecedoresFinais.length} Parceiros`);

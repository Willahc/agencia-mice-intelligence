const fs = require('fs');
const path = require('path');

const eventosPath = path.join(__dirname, '..', 'src', 'data', 'eventos_radar.json');
const fornecedoresPath = path.join(__dirname, '..', 'src', 'data', 'fornecedores_sp.json');

const eventosAtuais = JSON.parse(fs.readFileSync(eventosPath, 'utf8'));
const fornecedoresAtuais = JSON.parse(fs.readFileSync(fornecedoresPath, 'utf8'));

const eventosAgroEstadoSP = [
  // --- POLO RIBEIRÃO PRETO & SERTÃOZINHO (AGRO, CANA & PECUÁRIA) ---
  {
    "id": "EVT-2026-046",
    "nome": "Agrishow 2026 (30ª Feira Internacional de Tecnologia Agrícola em Ação)",
    "segmento": "Agronegócio / Máquinas Agrícolas",
    "local_evento": "ribeirao_preto",
    "cidade": "Ribeirão Preto",
    "data_inicio": "2026-04-27",
    "data_fim": "2026-05-01",
    "dias_duracao": 5,
    "dias_antecedencia": 150,
    "publico_total_estimado": 195000,
    "percentual_fora_da_cidade": 0.85,
    "empresa_organizadora": "Informa Markets Brasil & ABIMAQ / ABAG / ANDA / SRB",
    "cnpj_organizador": "01.440.048/0001-14",
    "decisores_identificados": [
      {
        "nome": "João Carlos Marchesan",
        "cargo": "Presidente do Conselho de Administração da ABIMAQ",
        "email": "presidencia@abimaq.org.br"
      },
      {
        "nome": "Liliane Bortoluci",
        "cargo": "Diretora do Portfólio Agrishow Informa Markets",
        "email": "liliane.bortoluci@informa.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 165750,
      "room_nights_estimados": 828750,
      "transfers_aeroporto_necessarios": 45000,
      "deslocamentos_hotel_evento_dia": 165750,
      "aereos_estimados": 38000,
      "jantares_executivos_grupos": 85
    },
    "budget_alvo_estimado": 12000000.00
  },
  {
    "id": "EVT-2026-047",
    "nome": "Fenasucro & Agrocana 2026 (32ª Feira Internacional de Bioenergia & Tecnologia Canavieira)",
    "segmento": "Agronegócio / Bioenergia & Sucroalcooleiro",
    "local_evento": "ribeirao_preto",
    "cidade": "Sertãozinho / Ribeirão Preto",
    "data_inicio": "2026-08-11",
    "data_fim": "2026-08-14",
    "dias_duracao": 4,
    "dias_antecedencia": 120,
    "publico_total_estimado": 45000,
    "percentual_fora_da_cidade": 0.70,
    "empresa_organizadora": "RX Brasil (Reed Exhibitions) & CEISE Br",
    "cnpj_organizador": "55.888.777/0001-33",
    "decisores_identificados": [
      {
        "nome": "Paulo Montabone",
        "cargo": "Diretor da Fenasucro & Agrocana",
        "email": "paulo.montabone@rxglobal.com"
      },
      {
        "nome": "Mariana Diniz",
        "cargo": "Coordenadora de Hospitalidade & Viagens de Usinas",
        "email": "mariana.diniz@rxglobal.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 31500,
      "room_nights_estimados": 126000,
      "transfers_aeroporto_necessarios": 18000,
      "deslocamentos_hotel_evento_dia": 31500,
      "aereos_estimados": 14000,
      "jantares_executivos_grupos": 35
    },
    "budget_alvo_estimado": 4500000.00
  },
  {
    "id": "EVT-2026-048",
    "nome": "Encontro Nacional de Confinamento e Pecuária de Corte 2026 (Enconpec)",
    "segmento": "Pecuária / Corte & Confinamento",
    "local_evento": "ribeirao_preto",
    "cidade": "Ribeirão Preto",
    "data_inicio": "2026-03-10",
    "data_fim": "2026-03-12",
    "dias_duracao": 3,
    "dias_antecedencia": 80,
    "publico_total_estimado": 2200,
    "percentual_fora_da_cidade": 0.85,
    "empresa_organizadora": "Associação Nacional dos Confinadores (Assocon)",
    "cnpj_organizador": "09.432.123/0001-45",
    "decisores_identificados": [
      {
        "nome": "Thiago Pereira",
        "cargo": "Diretor Executivo Assocon",
        "email": "diretoria@assocon.com.br"
      },
      {
        "nome": "Carla Zanetti",
        "cargo": "Head de Eventos & Relações com Frigoríficos",
        "email": "carla.zanetti@assocon.com.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 1870,
      "room_nights_estimados": 5610,
      "transfers_aeroporto_necessarios": 1600,
      "deslocamentos_hotel_evento_dia": 1870,
      "aereos_estimados": 1400,
      "jantares_executivos_grupos": 8
    },
    "budget_alvo_estimado": 1100000.00
  },

  // --- POLO CAMPINAS, ATIBAIA & CIRCUITO DOS RESORTS (CONVENÇÕES AGRO & HORTICULTURA) ---
  {
    "id": "EVT-2026-049",
    "nome": "Convenção Nacional de Revendedores e Concessionárias John Deere 2026",
    "segmento": "Agronegócio / Máquinas & Tecnologia",
    "local_evento": "campinas_resorts",
    "cidade": "Campinas",
    "data_inicio": "2026-05-12",
    "data_fim": "2026-05-15",
    "dias_duracao": 4,
    "dias_antecedencia": 90,
    "publico_total_estimado": 850,
    "percentual_fora_da_cidade": 0.90,
    "empresa_organizadora": "John Deere Brasil Ltda",
    "cnpj_organizador": "89.851.354/0001-20",
    "decisores_identificados": [
      {
        "nome": "Alfredo Miguel Neto",
        "cargo": "Diretor de Assuntos Corporativos América Latina",
        "email": "miguelnetoalfredo@johndeere.com"
      },
      {
        "nome": "Thais Beltrame",
        "cargo": "Global Travel & Meeting Services Lead",
        "email": "beltramethais@johndeere.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 765,
      "room_nights_estimados": 3060,
      "transfers_aeroporto_necessarios": 750,
      "deslocamentos_hotel_evento_dia": 765,
      "aereos_estimados": 700,
      "jantares_executivos_grupos": 5
    },
    "budget_alvo_estimado": 1650000.00
  },
  {
    "id": "EVT-2026-050",
    "nome": "Convenção Nacional de Vendas Syngenta & Campo Forte 2026",
    "segmento": "Agronegócio / Defensivos & Sementes",
    "local_evento": "campinas_resorts",
    "cidade": "Atibaia",
    "data_inicio": "2026-06-08",
    "data_fim": "2026-06-11",
    "dias_duracao": 4,
    "dias_antecedencia": 100,
    "publico_total_estimado": 600,
    "percentual_fora_da_cidade": 0.92,
    "empresa_organizadora": "Syngenta Proteção de Cultivos Ltda",
    "cnpj_organizador": "60.744.463/0001-90",
    "decisores_identificados": [
      {
        "nome": "André Savino",
        "cargo": "Diretor Geral de Negócios Brasil",
        "email": "andre.savino@syngenta.com"
      },
      {
        "nome": "Larissa Silveira",
        "cargo": "Head de Compras MICE & Viagens Estratégicas",
        "email": "larissa.silveira@syngenta.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 550,
      "room_nights_estimados": 2200,
      "transfers_aeroporto_necessarios": 550,
      "deslocamentos_hotel_evento_dia": 550,
      "aereos_estimados": 520,
      "jantares_executivos_grupos": 4
    },
    "budget_alvo_estimado": 1400000.00
  },
  {
    "id": "EVT-2026-051",
    "nome": "Hortitec 2026 (30ª Exposição Técnica de Horticultura, Cultivo Protegido e Flores)",
    "segmento": "Agronegócio / Hortifruticultura",
    "local_evento": "campinas_resorts",
    "cidade": "Holambra / Campinas",
    "data_inicio": "2026-06-24",
    "data_fim": "2026-06-26",
    "dias_duracao": 3,
    "dias_antecedencia": 70,
    "publico_total_estimado": 32000,
    "percentual_fora_da_cidade": 0.75,
    "empresa_organizadora": "RBB Eventos & Hortitec Feiras",
    "cnpj_organizador": "02.890.123/0001-88",
    "decisores_identificados": [
      {
        "nome": "Renato Rusche",
        "cargo": "Diretor Geral Hortitec",
        "email": "hortitec@hortitec.com.br"
      }
    ],
    "poder_economico_segmento": "ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 24000,
      "room_nights_estimados": 72000,
      "transfers_aeroporto_necessarios": 15000,
      "deslocamentos_hotel_evento_dia": 24000,
      "aereos_estimados": 12000,
      "jantares_executivos_grupos": 18
    },
    "budget_alvo_estimado": 2800000.00
  },

  // --- POLO NOROESTE PAULISTA (PECUÁRIA DE CORTE, LEITE & GENÉTICA) ---
  {
    "id": "EVT-2026-052",
    "nome": "Expo Rio Preto 2026 (62ª Exposição Agropecuária de São José do Rio Preto)",
    "segmento": "Pecuária / Leilões & Genética Nelore",
    "local_evento": "sao_jose_rio_preto_aracatuba",
    "cidade": "São José do Rio Preto",
    "data_inicio": "2026-09-16",
    "data_fim": "2026-09-21",
    "dias_duracao": 6,
    "dias_antecedencia": 110,
    "publico_total_estimado": 55000,
    "percentual_fora_da_cidade": 0.60,
    "empresa_organizadora": "Secretaria de Agricultura de SJRP & Associação de Criadores",
    "cnpj_organizador": "46.588.970/0001-30",
    "decisores_identificados": [
      {
        "nome": "Pedro Roberto Gomes",
        "cargo": "Coordenador Geral da Expo Rio Preto",
        "email": "exporiopreto@riopreto.sp.gov.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 33000,
      "room_nights_estimados": 198000,
      "transfers_aeroporto_necessarios": 18000,
      "deslocamentos_hotel_evento_dia": 33000,
      "aereos_estimados": 14000,
      "jantares_executivos_grupos": 25
    },
    "budget_alvo_estimado": 4200000.00
  },
  {
    "id": "EVT-2026-053",
    "nome": "Expô Araçatuba Agro 2026 (Feira Agropecuária do Noroeste Paulista)",
    "segmento": "Pecuária / Corte & Genética",
    "local_evento": "sao_jose_rio_preto_aracatuba",
    "cidade": "Araçatuba",
    "data_inicio": "2026-09-04",
    "data_fim": "2026-09-09",
    "dias_duracao": 6,
    "dias_antecedencia": 105,
    "publico_total_estimado": 65000,
    "percentual_fora_da_cidade": 0.55,
    "empresa_organizadora": "Rural Eventos & Sindicato Rural de Araçatuba",
    "cnpj_organizador": "44.123.456/0001-77",
    "decisores_identificados": [
      {
        "nome": "Guilherme Rangel",
        "cargo": "Diretor de Eventos Agropecuários",
        "email": "contato@expoaracatuba.com.br"
      }
    ],
    "poder_economico_segmento": "ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 35750,
      "room_nights_estimados": 214500,
      "transfers_aeroporto_necessarios": 19000,
      "deslocamentos_hotel_evento_dia": 35750,
      "aereos_estimados": 15000,
      "jantares_executivos_grupos": 22
    },
    "budget_alvo_estimado": 3800000.00
  },

  // --- POLO PIRACICABA & VALE DO PARANAPANEMA (AGTECH & EQUINOCULTURA) ---
  {
    "id": "EVT-2026-054",
    "nome": "AgTech Summit Piracicaba 2026 (Inovação & Startups do Agro - ESALQ USP)",
    "segmento": "Agronegócio / AgTech & Bioinsumos",
    "local_evento": "piracicaba_agtech",
    "cidade": "Piracicaba",
    "data_inicio": "2026-07-22",
    "data_fim": "2026-07-24",
    "dias_duracao": 3,
    "dias_antecedencia": 85,
    "publico_total_estimado": 3500,
    "percentual_fora_da_cidade": 0.70,
    "empresa_organizadora": "AgTech Garage (PwC Brasil) & ESALQ USP",
    "cnpj_organizador": "32.123.789/0001-09",
    "decisores_identificados": [
      {
        "nome": "José Augusto Tomé",
        "cargo": "CEO AgTech Garage & Sócio PwC",
        "email": "tome@agtechgarage.com"
      },
      {
        "nome": "Fabiana Rossi",
        "cargo": "Head de Eventos & Venture Agro",
        "email": "fabiana.rossi@agtechgarage.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 2450,
      "room_nights_estimados": 7350,
      "transfers_aeroporto_necessarios": 2100,
      "deslocamentos_hotel_evento_dia": 2450,
      "aereos_estimados": 1900,
      "jantares_executivos_grupos": 8
    },
    "budget_alvo_estimado": 1350000.00
  },
  {
    "id": "EVT-2026-055",
    "nome": "EMAPA 2026 (54ª Exposição Municipal Agropecuária e Equinocultura de Avaré)",
    "segmento": "Pecuária / Equinocultura & Quarto de Milha",
    "local_evento": "piracicaba_agtech",
    "cidade": "Avaré",
    "data_inicio": "2026-12-02",
    "data_fim": "2026-12-08",
    "dias_duracao": 7,
    "dias_antecedencia": 140,
    "publico_total_estimado": 80000,
    "percentual_fora_da_cidade": 0.65,
    "empresa_organizadora": "Prefeitura da Estância Turística de Avaré & ABQM",
    "cnpj_organizador": "46.634.168/0001-50",
    "decisores_identificados": [
      {
        "nome": "Antonio Carlos Ribeiro",
        "cargo": "Coordenador Geral EMAPA",
        "email": "emapa@avare.sp.gov.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 52000,
      "room_nights_estimados": 364000,
      "transfers_aeroporto_necessarios": 28000,
      "deslocamentos_hotel_evento_dia": 52000,
      "aereos_estimados": 22000,
      "jantares_executivos_grupos": 30
    },
    "budget_alvo_estimado": 5200000.00
  },

  // --- POLO SERRA & LITORAL (FÓRUNS DE LIDERANÇA & AGRO EXPORT) ---
  {
    "id": "EVT-2026-056",
    "nome": "Fórum de Inverno do Agronegócio e Liderança 2026 (AgroLeaders)",
    "segmento": "Agronegócio / Liderança & Macroeconomia",
    "local_evento": "campos_jordao",
    "cidade": "Campos do Jordão",
    "data_inicio": "2026-07-16",
    "data_fim": "2026-07-18",
    "dias_duracao": 3,
    "dias_antecedencia": 75,
    "publico_total_estimado": 450,
    "percentual_fora_da_cidade": 0.85,
    "empresa_organizadora": "Sociedade Rural Brasileira (SRB) & LIDE Agro",
    "cnpj_organizador": "60.555.444/0001-11",
    "decisores_identificados": [
      {
        "nome": "Sérgio Bortolozzo",
        "cargo": "Presidente SRB",
        "email": "presidencia@srb.org.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 380,
      "room_nights_estimados": 1140,
      "transfers_aeroporto_necessarios": 380,
      "deslocamentos_hotel_evento_dia": 380,
      "aereos_estimados": 340,
      "jantares_executivos_grupos": 4
    },
    "budget_alvo_estimado": 880000.00
  },
  {
    "id": "EVT-2026-057",
    "nome": "Fórum Agro Export & Logística de Grãos 2026 (Santos Export)",
    "segmento": "Agronegócio / Comércio Exterior & Logística Portuária",
    "local_evento": "santos_litoral",
    "cidade": "Santos",
    "data_inicio": "2026-08-19",
    "data_fim": "2026-08-20",
    "dias_duracao": 2,
    "dias_antecedencia": 80,
    "publico_total_estimado": 1500,
    "percentual_fora_da_cidade": 0.65,
    "empresa_organizadora": "Brasil Export & Sistema Santa Cecília",
    "cnpj_organizador": "12.345.678/0001-90",
    "decisores_identificados": [
      {
        "nome": "Fabrizio Pierdomenico",
        "cargo": "Coordenador Geral Santos Export",
        "email": "fabrizio@santosexport.com.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 975,
      "room_nights_estimados": 1950,
      "transfers_aeroporto_necessarios": 750,
      "deslocamentos_hotel_evento_dia": 975,
      "aereos_estimados": 680,
      "jantares_executivos_grupos": 6
    },
    "budget_alvo_estimado": 1200000.00
  }
];

const novosFornecedoresEstadoSP = [
  {
    "id": "HOT-020",
    "tipo": "hotel",
    "nome": "Hotel Mont Blanc Premium Ribeirão Preto",
    "categoria": "5_estrelas",
    "bairro": "Nova Aliança / Av. Maurílio Biagi",
    "cidade": "Ribeirão Preto",
    "diaria_media_padrao": 780.00,
    "diaria_negociada_mice": 520.00,
    "capacidade_quartos": 216,
    "max_room_block": 140,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 21,
    "sla_resposta_horas": 3,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "ribeirao_preto": 6.5,
      "campinas_resorts": 210.0,
      "sp_expo": 315.0,
      "transamerica_expo": 310.0,
      "anhembi": 305.0,
      "frei_caneca": 312.0,
      "wds_wtc": 310.0,
      "sao_jose_rio_preto_aracatuba": 195.0,
      "piracicaba_agtech": 180.0,
      "santos_litoral": 385.0,
      "campos_jordao": 340.0
    },
    "avaliacao_qualidade": 9.6,
    "historico_atendimentos": 65,
    "detalhes_operacionais": "Principal hotel 5 estrelas executivo de Ribeirão Preto. Destino preferencial de multinacionais de máquinas agrícolas (John Deere, Case IH, New Holland) durante a Agrishow.",
    "posicionamento_taxi_recomendado": "Ponto de táxi privativo na Av. Maurílio Biagi com saída expressa para o Anel Viário Sul."
  },
  {
    "id": "HOT-021",
    "tipo": "hotel",
    "nome": "Wyndham Garden Convention Ribeirão Preto",
    "categoria": "4_estrelas",
    "bairro": "Jardim Botânico",
    "cidade": "Ribeirão Preto",
    "diaria_media_padrao": 550.00,
    "diaria_negociada_mice": 420.00,
    "capacidade_quartos": 315,
    "max_room_block": 180,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 14,
    "sla_resposta_horas": 4,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "ribeirao_preto": 4.8,
      "campinas_resorts": 212.0,
      "sp_expo": 318.0,
      "transamerica_expo": 312.0,
      "anhembi": 308.0,
      "frei_caneca": 315.0,
      "wds_wtc": 312.0,
      "sao_jose_rio_preto_aracatuba": 198.0,
      "piracicaba_agtech": 182.0,
      "santos_litoral": 388.0,
      "campos_jordao": 342.0
    },
    "avaliacao_qualidade": 9.3,
    "historico_atendimentos": 58,
    "detalhes_operacionais": "Hotel com maior centro de convenções próprio da região de Ribeirão Preto (capacidade para até 800 pessoas em auditório). Próximo ao Taiwan Centro de Eventos.",
    "posicionamento_taxi_recomendado": "Bolsão Chame Táxi / Táxi Expresso RAO na entrada principal."
  },
  {
    "id": "HOT-022",
    "tipo": "hotel",
    "nome": "Royal Palm Plaza Resort & Royal Palm Hall Campinas",
    "categoria": "5_estrelas",
    "bairro": "Jardim Nova Califórnia",
    "cidade": "Campinas",
    "diaria_media_padrao": 890.00,
    "diaria_negociada_mice": 680.00,
    "capacidade_quartos": 500,
    "max_room_block": 350,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 21,
    "sla_resposta_horas": 3,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "campinas_resorts": 0.1,
      "ribeirao_preto": 210.0,
      "sp_expo": 98.0,
      "transamerica_expo": 95.0,
      "anhembi": 88.0,
      "frei_caneca": 92.0,
      "wds_wtc": 94.0,
      "sao_jose_rio_preto_aracatuba": 330.0,
      "piracicaba_agtech": 65.0,
      "santos_litoral": 165.0,
      "campos_jordao": 185.0
    },
    "avaliacao_qualidade": 9.8,
    "historico_atendimentos": 90,
    "detalhes_operacionais": "O maior complexo MICE da América Latina integrado a resort. O Royal Palm Hall comporta até 9.000 pessoas simultâneas, palco das convenções de vendas nacionais da Bayer, Syngenta e John Deere.",
    "posicionamento_taxi_recomendado": "Receptivo exclusivo de vans e táxis executivos conectado ao Aeroporto de Viracopos (15 min via Rod. Santos Dumont)."
  },
  {
    "id": "HOT-023",
    "tipo": "hotel",
    "nome": "Bourbon Atibaia Resort",
    "categoria": "5_estrelas",
    "bairro": "Rod. Fernão Dias, km 37,5",
    "cidade": "Atibaia",
    "diaria_media_padrao": 1150.00,
    "diaria_negociada_mice": 850.00,
    "capacidade_quartos": 572,
    "max_room_block": 400,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 30,
    "sla_resposta_horas": 3,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "campinas_resorts": 45.0,
      "ribeirao_preto": 260.0,
      "sp_expo": 75.0,
      "transamerica_expo": 78.0,
      "anhembi": 58.0,
      "frei_caneca": 64.0,
      "wds_wtc": 72.0,
      "sao_jose_rio_preto_aracatuba": 380.0,
      "piracicaba_agtech": 115.0,
      "santos_litoral": 135.0,
      "campos_jordao": 130.0
    },
    "avaliacao_qualidade": 9.7,
    "historico_atendimentos": 85,
    "detalhes_operacionais": "Líder absoluto em convenções corporativas de imersão total com pensão completa inclusa. Infraestrutura para plenárias de até 2.000 pessoas.",
    "posicionamento_taxi_recomendado": "Frota dedicada de vans e micro-ônibus fretados para translado SP / GRU / CGH para o resort."
  },
  {
    "id": "HOT-024",
    "tipo": "hotel",
    "nome": "Grande Hotel Campos do Jordão (Hotel-Escola Senac)",
    "categoria": "5_estrelas",
    "bairro": "Capivari",
    "cidade": "Campos do Jordão",
    "diaria_media_padrao": 1350.00,
    "diaria_negociada_mice": 980.00,
    "capacidade_quartos": 95,
    "max_room_block": 60,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 21,
    "sla_resposta_horas": 3,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "campos_jordao": 1.8,
      "sp_expo": 175.0,
      "transamerica_expo": 180.0,
      "anhembi": 165.0,
      "frei_caneca": 170.0,
      "wds_wtc": 178.0,
      "campinas_resorts": 185.0,
      "ribeirao_preto": 340.0,
      "sao_jose_rio_preto_aracatuba": 460.0,
      "piracicaba_agtech": 235.0,
      "santos_litoral": 240.0
    },
    "avaliacao_qualidade": 9.9,
    "historico_atendimentos": 40,
    "detalhes_operacionais": "Hotel de altíssimo luxo na Serra da Mantiqueira, padrão de excelência Senac para fóruns de presidentes de empresas, líderes do agronegócio e ministros.",
    "posicionamento_taxi_recomendado": "Heliponto homologado e serviço de transfer executivo VIP."
  },
  {
    "id": "HOT-025",
    "tipo": "hotel",
    "nome": "Parque Balneário Hotel Santos",
    "categoria": "5_estrelas",
    "bairro": "Gonzaga",
    "cidade": "Santos",
    "diaria_media_padrao": 620.00,
    "diaria_negociada_mice": 490.00,
    "capacidade_quartos": 110,
    "max_room_block": 65,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 14,
    "sla_resposta_horas": 4,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "santos_litoral": 3.2,
      "sp_expo": 62.0,
      "transamerica_expo": 70.0,
      "anhembi": 78.0,
      "frei_caneca": 72.0,
      "wds_wtc": 68.0,
      "campinas_resorts": 165.0,
      "ribeirao_preto": 385.0,
      "sao_jose_rio_preto_aracatuba": 510.0,
      "piracicaba_agtech": 210.0,
      "campos_jordao": 240.0
    },
    "avaliacao_qualidade": 9.4,
    "historico_atendimentos": 48,
    "detalhes_operacionais": "Hotel mais tradicional de Santos, localizado na Av. Ana Costa com a orla. Principal base de hospedagem para eventos no Blue Med Convention Center e Fóruns Santos Export.",
    "posicionamento_taxi_recomendado": "Ponto de táxi permanente no Gonzaga com saída direta para a Av. Presidente Wilson."
  },
  {
    "id": "TAXI-006",
    "tipo": "taxi",
    "nome": "Cooperativa Rádio Táxi Ribeirão Preto (Expresso RAO)",
    "frota_disponivel": 280,
    "sla_medio_minutos": 5,
    "voucher_digital": true,
    "atendimento_24h": true,
    "faturamento_quinzenal": true,
    "comissao_percentual": 8.5,
    "corredor_onibus_autorizado": true,
    "tarifa_media_gru_hotel": 450.00,
    "tarifa_media_cgh_hotel": 450.00,
    "avaliacao_qualidade": 9.4,
    "detalhes_operacionais": "Central oficial de táxi de Ribeirão Preto com frota credenciada para atendimento ao Aeroporto Leite Lopes (RAO) e ao Parque Tecnológico Agrishow."
  },
  {
    "id": "VAN-006",
    "tipo": "transfer_van",
    "nome": "Rápido Campinas & Fretamento Viracopos MICE",
    "frota_vans_15lugares": 30,
    "frota_microonibus_28lugares": 25,
    "frota_onibus_46lugares": 30,
    "motoristas_bilingues": true,
    "rastreamento_gps_tempo_real": true,
    "seguro_passageiro_incluso": true,
    "diaria_van_10h": 720.00,
    "diaria_microonibus_10h": 1200.00,
    "diaria_onibus_10h": 1850.00,
    "comissao_percentual": 11.0,
    "avaliacao_qualidade": 9.6,
    "historico_grandes_eventos": 82,
    "detalhes_operacionais": "Especialista em transporte de comitivas executivas no eixo Campinas-Atibaia-Viracopos e translados rodoviários de delegações saindo de SP Capital para resorts do interior."
  }
];

// Mesclar sem duplicar IDs
const mapEventos = new Map();
eventosAtuais.forEach(e => mapEventos.set(e.id, e));
eventosAgroEstadoSP.forEach(e => mapEventos.set(e.id, e));
const eventosFinais = Array.from(mapEventos.values());

const mapFornecedores = new Map();
fornecedoresAtuais.forEach(f => mapFornecedores.set(f.id, f));
novosFornecedoresEstadoSP.forEach(f => mapFornecedores.set(f.id, f));
const fornecedoresFinais = Array.from(mapFornecedores.values());

fs.writeFileSync(eventosPath, JSON.stringify(eventosFinais, null, 2), 'utf8');
fs.writeFileSync(fornecedoresPath, JSON.stringify(fornecedoresFinais, null, 2), 'utf8');

console.log(`✅ Base Total do Estado de SP Atualizada: ${eventosFinais.length} Eventos (Capital + Interior Agro + Resorts + Litoral)`);
console.log(`✅ Base Total de Fornecedores Homologados: ${fornecedoresFinais.length} Parceiros`);

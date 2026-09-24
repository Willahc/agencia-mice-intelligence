const fs = require('fs');
const path = require('path');

const eventosPath = path.join(__dirname, '..', 'src', 'data', 'eventos_radar.json');
const fornecedoresPath = path.join(__dirname, '..', 'src', 'data', 'fornecedores_sp.json');

const eventosAtuais = JSON.parse(fs.readFileSync(eventosPath, 'utf8'));
const fornecedoresAtuais = JSON.parse(fs.readFileSync(fornecedoresPath, 'utf8'));

const novosEventos = [
  {
    "id": "EVT-2026-018",
    "nome": "Congresso Brasileiro de Cardiologia 2026 (81º CBC / SBC)",
    "segmento": "Farmacêutico / Saúde",
    "local_evento": "transamerica_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-09-24",
    "data_fim": "2026-09-27",
    "dias_duracao": 4,
    "dias_antecedencia": 95,
    "publico_total_estimado": 14000,
    "percentual_fora_da_cidade": 0.75,
    "empresa_organizadora": "Sociedade Brasileira de Cardiologia (SBC)",
    "cnpj_organizador": "33.518.239/0001-90",
    "decisores_identificados": [
      {
        "nome": "Dra. Andrea Rocha",
        "cargo": "Diretora de Eventos & Relações com a Indústria Farmacêutica",
        "email": "eventos@cardiol.br"
      },
      {
        "nome": "Carlos Eduardo Pinto",
        "cargo": "Coordenador de Hospitalidade & Receptivo de Speakers",
        "email": "carlos.pinto@cardiol.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 10500,
      "room_nights_estimados": 42000,
      "transfers_aeroporto_necessarios": 8000,
      "deslocamentos_hotel_evento_dia": 10500,
      "aereos_estimados": 7200,
      "jantares_executivos_grupos": 22
    },
    "budget_alvo_estimado": 3800000.00
  },
  {
    "id": "EVT-2026-019",
    "nome": "Congresso Brasileiro de Ortopedia e Traumatologia 2026 (58º CBOT / SBOT)",
    "segmento": "Farmacêutico / Saúde",
    "local_evento": "sp_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-11-12",
    "data_fim": "2026-11-15",
    "dias_duracao": 4,
    "dias_antecedencia": 110,
    "publico_total_estimado": 12000,
    "percentual_fora_da_cidade": 0.70,
    "empresa_organizadora": "Sociedade Brasileira de Ortopedia e Traumatologia (SBOT)",
    "cnpj_organizador": "62.860.590/0001-08",
    "decisores_identificados": [
      {
        "nome": "Dr. Roberto Alencar",
        "cargo": "Presidente da Comissão de Congressos SBOT",
        "email": "congresso@sbot.org.br"
      },
      {
        "nome": "Patricia Mendes",
        "cargo": "Gerente de Compras e Viagens Médicas",
        "email": "patricia.mendes@sbot.org.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 8400,
      "room_nights_estimados": 33600,
      "transfers_aeroporto_necessarios": 6500,
      "deslocamentos_hotel_evento_dia": 8400,
      "aereos_estimados": 5800,
      "jantares_executivos_grupos": 18
    },
    "budget_alvo_estimado": 3200000.00
  },
  {
    "id": "EVT-2026-020",
    "nome": "VTEX DAY 2026 (Maior Evento de Digital Commerce da América Latina)",
    "segmento": "Tecnologia / Telecom / IA",
    "local_evento": "sp_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-06-03",
    "data_fim": "2026-06-04",
    "dias_duracao": 2,
    "dias_antecedencia": 45,
    "publico_total_estimado": 22000,
    "percentual_fora_da_cidade": 0.50,
    "empresa_organizadora": "VTEX Brasil Tecnologia para Comércio Ltda",
    "cnpj_organizador": "05.314.972/0001-74",
    "decisores_identificados": [
      {
        "nome": "Vanessa Lima",
        "cargo": "Head de Brand Experience & Eventos Globais",
        "email": "vanessa.lima@vtex.com"
      },
      {
        "nome": "Felipe Mansur",
        "cargo": "Global Travel & Facilities Manager",
        "email": "felipe.mansur@vtex.com"
      }
    ],
    "poder_economico_segmento": "ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 11000,
      "room_nights_estimados": 22000,
      "transfers_aeroporto_necessarios": 8500,
      "deslocamentos_hotel_evento_dia": 11000,
      "aereos_estimados": 7500,
      "jantares_executivos_grupos": 24
    },
    "budget_alvo_estimado": 2900000.00
  },
  {
    "id": "EVT-2026-021",
    "nome": "Futurecom 2026 (Transformação Digital, Telecomunicações & Conectividade)",
    "segmento": "Tecnologia / Telecom / IA",
    "local_evento": "sp_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-10-06",
    "data_fim": "2026-10-08",
    "dias_duracao": 3,
    "dias_antecedencia": 80,
    "publico_total_estimado": 32000,
    "percentual_fora_da_cidade": 0.55,
    "empresa_organizadora": "Informa Markets Brasil",
    "cnpj_organizador": "01.440.048/0001-14",
    "decisores_identificados": [
      {
        "nome": "Hermano Pinto",
        "cargo": "Diretor do Portfólio de Tecnologia & Telecom",
        "email": "hermano.pinto@informa.com"
      },
      {
        "nome": "Camila Sampaio",
        "cargo": "Coordenadora de Hospitalidade MICE",
        "email": "camila.sampaio@informa.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 17600,
      "room_nights_estimados": 52800,
      "transfers_aeroporto_necessarios": 12000,
      "deslocamentos_hotel_evento_dia": 17600,
      "aereos_estimados": 11000,
      "jantares_executivos_grupos": 28
    },
    "budget_alvo_estimado": 3600000.00
  },
  {
    "id": "EVT-2026-022",
    "nome": "Fispal Tecnologia & Food Service 2026 (Indústria de Alimentos & Bebidas)",
    "segmento": "Varejo / Alimentos",
    "local_evento": "sp_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-06-16",
    "data_fim": "2026-06-19",
    "dias_duracao": 4,
    "dias_antecedencia": 50,
    "publico_total_estimado": 48000,
    "percentual_fora_da_cidade": 0.48,
    "empresa_organizadora": "Informa Markets Brasil",
    "cnpj_organizador": "01.440.048/0001-14",
    "decisores_identificados": [
      {
        "nome": "Marina Brandão",
        "cargo": "Gerente de Eventos Industriais",
        "email": "marina.brandao@informa.com"
      }
    ],
    "poder_economico_segmento": "ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 23040,
      "room_nights_estimados": 92160,
      "transfers_aeroporto_necessarios": 15000,
      "deslocamentos_hotel_evento_dia": 23040,
      "aereos_estimados": 12500,
      "jantares_executivos_grupos": 19
    },
    "budget_alvo_estimado": 3100000.00
  },
  {
    "id": "EVT-2026-023",
    "nome": "Fenatran 2026 (24º Salão Internacional do Transporte Rodoviário de Cargas)",
    "segmento": "Logística / Frotas",
    "local_evento": "sp_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-11-09",
    "data_fim": "2026-11-13",
    "dias_duracao": 5,
    "dias_antecedencia": 120,
    "publico_total_estimado": 66000,
    "percentual_fora_da_cidade": 0.60,
    "empresa_organizadora": "RX Brasil (Reed Exhibitions) & NTC&Logística",
    "cnpj_organizador": "55.888.777/0001-33",
    "decisores_identificados": [
      {
        "nome": "Thiago da Silva",
        "cargo": "Diretor do Portfólio de Transportes e Frotas",
        "email": "thiago.silva@rxglobal.com"
      },
      {
        "nome": "Bruna Fogaça",
        "cargo": "Supervisora de Operações e Receptivo MICE",
        "email": "bruna.fogaca@rxglobal.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 39600,
      "room_nights_estimados": 198000,
      "transfers_aeroporto_necessarios": 26000,
      "deslocamentos_hotel_evento_dia": 39600,
      "aereos_estimados": 22000,
      "jantares_executivos_grupos": 35
    },
    "budget_alvo_estimado": 5400000.00
  },
  {
    "id": "EVT-2026-024",
    "nome": "Automec 2026 (Feira Internacional de Autopeças, Equipamentos e Serviços)",
    "segmento": "Automotivo / Indústria",
    "local_evento": "sp_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-04-21",
    "data_fim": "2026-04-25",
    "dias_duracao": 5,
    "dias_antecedencia": 30,
    "publico_total_estimado": 75000,
    "percentual_fora_da_cidade": 0.52,
    "empresa_organizadora": "RX Brasil (Reed Exhibitions)",
    "cnpj_organizador": "55.888.777/0001-33",
    "decisores_identificados": [
      {
        "nome": "Eduardo Ferreira",
        "cargo": "Gerente Geral do Setor Automotivo",
        "email": "eduardo.ferreira@rxglobal.com"
      }
    ],
    "poder_economico_segmento": "ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 39000,
      "room_nights_estimados": 195000,
      "transfers_aeroporto_necessarios": 24000,
      "deslocamentos_hotel_evento_dia": 39000,
      "aereos_estimados": 20000,
      "jantares_executivos_grupos": 27
    },
    "budget_alvo_estimado": 4800000.00
  },
  {
    "id": "EVT-2026-025",
    "nome": "Bett Brasil 2026 (Maior Encontro de Educação Básica & EdTech da AL)",
    "segmento": "Educação / Tecnologia",
    "local_evento": "transamerica_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-04-28",
    "data_fim": "2026-05-01",
    "dias_duracao": 4,
    "dias_antecedencia": 35,
    "publico_total_estimado": 35000,
    "percentual_fora_da_cidade": 0.58,
    "empresa_organizadora": "Hyve Group Brasil",
    "cnpj_organizador": "04.567.890/0001-22",
    "decisores_identificados": [
      {
        "nome": "Claudia Valério",
        "cargo": "Diretora de Operações e Conteúdo",
        "email": "claudia.valerio@bettbrasil.com"
      },
      {
        "nome": "Rodrigo Neves",
        "cargo": "Hospitality & Corporate Travel Manager",
        "email": "rodrigo.neves@bettbrasil.com"
      }
    ],
    "poder_economico_segmento": "MEDIO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 20300,
      "room_nights_estimados": 81200,
      "transfers_aeroporto_necessarios": 13000,
      "deslocamentos_hotel_evento_dia": 20300,
      "aereos_estimados": 11500,
      "jantares_executivos_grupos": 15
    },
    "budget_alvo_estimado": 2400000.00
  },
  {
    "id": "EVT-2026-026",
    "nome": "Fenalaw 2026 (Maior Congresso & Exposição Jurídica da América Latina)",
    "segmento": "Jurídico / Compliance",
    "local_evento": "frei_caneca",
    "cidade": "São Paulo",
    "data_inicio": "2026-10-21",
    "data_fim": "2026-10-23",
    "dias_duracao": 3,
    "dias_antecedencia": 85,
    "publico_total_estimado": 10000,
    "percentual_fora_da_cidade": 0.45,
    "empresa_organizadora": "Informa Markets Brasil",
    "cnpj_organizador": "01.440.048/0001-14",
    "decisores_identificados": [
      {
        "nome": "Juliana Manzato",
        "cargo": "Diretora de Marca & Relações Institucionais Fenalaw",
        "email": "juliana.manzato@informa.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 4500,
      "room_nights_estimados": 13500,
      "transfers_aeroporto_necessarios": 3500,
      "deslocamentos_hotel_evento_dia": 4500,
      "aereos_estimados": 3100,
      "jantares_executivos_grupos": 16
    },
    "budget_alvo_estimado": 1800000.00
  },
  {
    "id": "EVT-2026-027",
    "nome": "Congresso Brasileiro de Radiologia 2026 (CBR 26)",
    "segmento": "Farmacêutico / Saúde",
    "local_evento": "frei_caneca",
    "cidade": "São Paulo",
    "data_inicio": "2026-10-15",
    "data_fim": "2026-10-17",
    "dias_duracao": 3,
    "dias_antecedencia": 75,
    "publico_total_estimado": 7500,
    "percentual_fora_da_cidade": 0.72,
    "empresa_organizadora": "Colégio Brasileiro de Radiologia e Diagnóstico por Imagem (CBR)",
    "cnpj_organizador": "43.765.432/0001-19",
    "decisores_identificados": [
      {
        "nome": "Dr. Valdair Muglia",
        "cargo": "Diretor Científico e de Congressos CBR",
        "email": "eventos@cbr.org.br"
      },
      {
        "nome": "Luciana Meirelles",
        "cargo": "Coordenadora de Receptivo de Palestrantes",
        "email": "luciana.meirelles@cbr.org.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 5400,
      "room_nights_estimados": 16200,
      "transfers_aeroporto_necessarios": 4200,
      "deslocamentos_hotel_evento_dia": 5400,
      "aereos_estimados": 3800,
      "jantares_executivos_grupos": 14
    },
    "budget_alvo_estimado": 2200000.00
  },
  {
    "id": "EVT-2026-028",
    "nome": "RD Summit São Paulo 2026 (Marketing, Vendas & Inovação Digital)",
    "segmento": "Tecnologia / Telecom / IA",
    "local_evento": "anhembi",
    "cidade": "São Paulo",
    "data_inicio": "2026-11-04",
    "data_fim": "2026-11-06",
    "dias_duracao": 3,
    "dias_antecedencia": 100,
    "publico_total_estimado": 20000,
    "percentual_fora_da_cidade": 0.60,
    "empresa_organizadora": "RD Station / TOTVS",
    "cnpj_organizador": "13.021.584/0001-86",
    "decisores_identificados": [
      {
        "nome": "Denis Briso",
        "cargo": "Head de Eventos e Experiências de Marca",
        "email": "denis.briso@rdstation.com"
      },
      {
        "nome": "Mariana Lopes",
        "cargo": "Travel & Strategic Procurement Lead",
        "email": "mariana.lopes@rdstation.com"
      }
    ],
    "poder_economico_segmento": "ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 12000,
      "room_nights_estimados": 36000,
      "transfers_aeroporto_necessarios": 9000,
      "deslocamentos_hotel_evento_dia": 12000,
      "aereos_estimados": 8200,
      "jantares_executivos_grupos": 20
    },
    "budget_alvo_estimado": 3000000.00
  },
  {
    "id": "EVT-2026-029",
    "nome": "FCE Pharma & FCE Cosmetique 2026 (Tecnologia para Indústria Farmacêutica)",
    "segmento": "Farmacêutico / Saúde",
    "local_evento": "sp_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-06-02",
    "data_fim": "2026-06-04",
    "dias_duracao": 3,
    "dias_antecedencia": 40,
    "publico_total_estimado": 24000,
    "percentual_fora_da_cidade": 0.54,
    "empresa_organizadora": "NürnbergMesse Brasil",
    "cnpj_organizador": "09.123.456/0001-78",
    "decisores_identificados": [
      {
        "nome": "Nadja Bento",
        "cargo": "Head de Life Sciences & Feiras Farmacêuticas",
        "email": "nadja.bento@nuernbergmesse-brasil.com.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 12960,
      "room_nights_estimados": 38880,
      "transfers_aeroporto_necessarios": 9500,
      "deslocamentos_hotel_evento_dia": 12960,
      "aereos_estimados": 8500,
      "jantares_executivos_grupos": 16
    },
    "budget_alvo_estimado": 2600000.00
  },
  {
    "id": "EVT-2026-030",
    "nome": "Intermodal South America 2026 (Logística Internacional & Comércio Exterior)",
    "segmento": "Logística / Frotas",
    "local_evento": "sp_expo",
    "cidade": "São Paulo",
    "data_inicio": "2026-03-17",
    "data_fim": "2026-03-19",
    "dias_duracao": 3,
    "dias_antecedencia": 15,
    "publico_total_estimado": 42000,
    "percentual_fora_da_cidade": 0.62,
    "empresa_organizadora": "Informa Markets Brasil",
    "cnpj_organizador": "01.440.048/0001-14",
    "decisores_identificados": [
      {
        "nome": "Hermano Pinto Jr.",
        "cargo": "Diretor do Portfólio de Infraestrutura e Logística",
        "email": "hermano.jr@informa.com"
      },
      {
        "nome": "Carina Vilela",
        "cargo": "Gerente de Facilities & Viagens Corporativas",
        "email": "carina.vilela@informa.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 26040,
      "room_nights_estimados": 78120,
      "transfers_aeroporto_necessarios": 18000,
      "deslocamentos_hotel_evento_dia": 26040,
      "aereos_estimados": 16000,
      "jantares_executivos_grupos": 26
    },
    "budget_alvo_estimado": 3900000.00
  },
  {
    "id": "EVT-2026-031",
    "nome": "Congresso Brasileiro de Oncologia Clínica 2026 (XXVII SBOC)",
    "segmento": "Farmacêutico / Saúde",
    "local_evento": "wds_wtc",
    "cidade": "São Paulo",
    "data_inicio": "2026-11-19",
    "data_fim": "2026-11-21",
    "dias_duracao": 3,
    "dias_antecedencia": 125,
    "publico_total_estimado": 6500,
    "percentual_fora_da_cidade": 0.80,
    "empresa_organizadora": "Sociedade Brasileira de Oncologia Clínica (SBOC)",
    "cnpj_organizador": "49.123.789/0001-44",
    "decisores_identificados": [
      {
        "nome": "Dr. Carlos Gil Ferreira",
        "cargo": "Presidente SBOC & Relações Médicas",
        "email": "diretoria@sboc.org.br"
      },
      {
        "nome": "Renata Silveira",
        "cargo": "Head de Hospitalidade & Compliance Interfarma",
        "email": "renata.silveira@sboc.org.br"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 5200,
      "room_nights_estimados": 15600,
      "transfers_aeroporto_necessarios": 4500,
      "deslocamentos_hotel_evento_dia": 5200,
      "aereos_estimados": 4000,
      "jantares_executivos_grupos": 15
    },
    "budget_alvo_estimado": 3100000.00
  },
  {
    "id": "EVT-2026-032",
    "nome": "Salão Internacional do Automóvel de São Paulo 2026 (Edição Retomada)",
    "segmento": "Automotivo / Indústria",
    "local_evento": "anhembi",
    "cidade": "São Paulo",
    "data_inicio": "2026-10-29",
    "data_fim": "2026-11-08",
    "dias_duracao": 11,
    "dias_antecedencia": 90,
    "publico_total_estimado": 450000,
    "percentual_fora_da_cidade": 0.40,
    "empresa_organizadora": "ANFAVEA & RX Brasil",
    "cnpj_organizador": "62.333.444/0001-55",
    "decisores_identificados": [
      {
        "nome": "Márcio de Lima Leite",
        "cargo": "Presidente Executivo ANFAVEA",
        "email": "marcio.leite@anfavea.com.br"
      },
      {
        "nome": "Amanda Lemos",
        "cargo": "Diretora de Logística & Delegações Executivas",
        "email": "amanda.lemos@rxglobal.com"
      }
    ],
    "poder_economico_segmento": "MUITO_ALTO",
    "demanda_estimada": {
      "hospedes_estimados": 180000,
      "room_nights_estimados": 900000,
      "transfers_aeroporto_necessarios": 60000,
      "deslocamentos_hotel_evento_dia": 180000,
      "aereos_estimados": 55000,
      "jantares_executivos_grupos": 60
    },
    "budget_alvo_estimado": 8500000.00
  }
];

const novosFornecedores = [
  {
    "id": "HOT-007",
    "tipo": "hotel",
    "nome": "Meliá Paulista Hotel",
    "categoria": "5_estrelas",
    "bairro": "Cerqueira César / Av. Paulista",
    "coordenadas": { "lat": -23.5580, "lon": -46.6600 },
    "diaria_media_padrao": 680.00,
    "diaria_negociada_mice": 540.00,
    "capacidade_quartos": 396,
    "max_room_block": 200,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 14,
    "sla_resposta_horas": 4,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "transamerica_expo": 12.5,
      "sp_expo": 11.0,
      "anhembi": 7.5,
      "frei_caneca": 1.2,
      "wds_wtc": 8.5
    },
    "avaliacao_qualidade": 9.3,
    "historico_atendimentos": 54,
    "detalhes_operacionais": "Hotel de alto padrão na Av. Paulista, perfeito para delegações no Frei Caneca e WTC. Possui centro de convenções próprio com 10 salas.",
    "posicionamento_taxi_recomendado": "Bolsão Chame Táxi em frente à estação Consolação (SLA: 3 min)."
  },
  {
    "id": "HOT-008",
    "tipo": "hotel",
    "nome": "Pullman São Paulo Vila Olímpia",
    "categoria": "5_estrelas",
    "bairro": "Vila Olímpia / Faria Lima",
    "coordenadas": { "lat": -23.5950, "lon": -46.6850 },
    "diaria_media_padrao": 850.00,
    "diaria_negociada_mice": 680.00,
    "capacidade_quartos": 280,
    "max_room_block": 150,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 14,
    "sla_resposta_horas": 3,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "transamerica_expo": 6.8,
      "sp_expo": 9.2,
      "anhembi": 14.5,
      "frei_caneca": 8.2,
      "wds_wtc": 3.4
    },
    "avaliacao_qualidade": 9.5,
    "historico_atendimentos": 60,
    "detalhes_operacionais": "Bandeira premium da Accor focada no público corporativo C-Level, finanças e tecnologia. Próximo ao WTC e Transamerica.",
    "posicionamento_taxi_recomendado": "Bolsão Chame Táxi na Rua Olimpíadas com Funchal (SLA: 4 min)."
  },
  {
    "id": "HOT-009",
    "tipo": "hotel",
    "nome": "Novotel São Paulo Berrini",
    "categoria": "4_estrelas",
    "bairro": "Brooklin / Berrini",
    "coordenadas": { "lat": -23.6060, "lon": -46.6990 },
    "diaria_media_padrao": 490.00,
    "diaria_negociada_mice": 410.00,
    "capacidade_quartos": 280,
    "max_room_block": 140,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 10,
    "sla_resposta_horas": 4,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "transamerica_expo": 4.5,
      "sp_expo": 11.2,
      "anhembi": 16.5,
      "frei_caneca": 10.5,
      "wds_wtc": 0.9
    },
    "avaliacao_qualidade": 9.2,
    "historico_atendimentos": 48,
    "detalhes_operacionais": "Hotel executivo com arquitetura contemporânea e restaurante próprio. A 900 metros do WTC Events Center.",
    "posicionamento_taxi_recomendado": "Ponto de apoio Berrini / Chucri Zaidan."
  },
  {
    "id": "HOT-010",
    "tipo": "hotel",
    "nome": "Tivoli Mofarrej São Paulo",
    "categoria": "5_estrelas",
    "bairro": "Jardins / Alameda Santos",
    "coordenadas": { "lat": -23.5640, "lon": -46.6540 },
    "diaria_media_padrao": 1150.00,
    "diaria_negociada_mice": 920.00,
    "capacidade_quartos": 218,
    "max_room_block": 100,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 21,
    "sla_resposta_horas": 3,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "transamerica_expo": 13.0,
      "sp_expo": 10.5,
      "anhembi": 7.8,
      "frei_caneca": 1.5,
      "wds_wtc": 8.8
    },
    "avaliacao_qualidade": 9.7,
    "historico_atendimentos": 38,
    "detalhes_operacionais": "Hotel de luxo nos Jardins, destino preferencial de palestrantes internacionais, executivos C-Level e lideranças médicas de congressos.",
    "posicionamento_taxi_recomendado": "Bolsão Chame Táxi Alameda Santos com Ministro Rocha Azevedo."
  },
  {
    "id": "HOT-011",
    "tipo": "hotel",
    "nome": "Radisson Hotel Paulista",
    "categoria": "4_estrelas",
    "bairro": "Paraíso / Paulista",
    "coordenadas": { "lat": -23.5710, "lon": -46.6450 },
    "diaria_media_padrao": 590.00,
    "diaria_negociada_mice": 480.00,
    "capacidade_quartos": 370,
    "max_room_block": 160,
    "comissao_percentual": 10.0,
    "politica_cancelamento_dias": 10,
    "sla_resposta_horas": 4,
    "cafe_incluso": true,
    "possui_salas_apoio": true,
    "distancias_km": {
      "transamerica_expo": 11.5,
      "sp_expo": 8.5,
      "anhembi": 8.2,
      "frei_caneca": 2.8,
      "wds_wtc": 7.5
    },
    "avaliacao_qualidade": 9.2,
    "historico_atendimentos": 44,
    "detalhes_operacionais": "Excelente logística com acesso imediato à Av. 23 de Maio (corredor norte-sul) para deslocamento ágil ao São Paulo Expo e Anhembi.",
    "posicionamento_taxi_recomendado": "Bolsão Chame Táxi Rua da Consolação / Bernardino de Campos."
  },
  {
    "id": "HOT-012",
    "tipo": "hotel",
    "nome": "Ibis Styles São Paulo Anhembi",
    "categoria": "3_estrelas",
    "bairro": "Santana / Zona Norte",
    "coordenadas": { "lat": -23.5090, "lon": -46.6260 },
    "diaria_media_padrao": 330.00,
    "diaria_negociada_mice": 275.00,
    "capacidade_quartos": 187,
    "max_room_block": 110,
    "comissao_percentual": 8.0,
    "politica_cancelamento_dias": 7,
    "sla_resposta_horas": 5,
    "cafe_incluso": true,
    "possui_salas_apoio": false,
    "distancias_km": {
      "transamerica_expo": 22.5,
      "sp_expo": 18.0,
      "anhembi": 1.4,
      "frei_caneca": 6.8,
      "wds_wtc": 19.5
    },
    "avaliacao_qualidade": 8.5,
    "historico_atendimentos": 52,
    "detalhes_operacionais": "Opção econômica e temática muito próxima ao Distrito Anhembi e Expo Center Norte. Ótimo para equipes de montagem e delegações de compras.",
    "posicionamento_taxi_recomendado": "Ponto de táxi integrado ao terminal rodoviário Tietê."
  },
  {
    "id": "TAXI-004",
    "tipo": "taxi",
    "nome": "Cooperativa Rádio Táxi Capital SP",
    "frota_disponivel": 420,
    "sla_medio_minutos": 6,
    "voucher_digital": true,
    "atendimento_24h": true,
    "faturamento_quinzenal": true,
    "comissao_percentual": 8.0,
    "corredor_onibus_autorizado": true,
    "tarifa_media_gru_hotel": 150.00,
    "tarifa_media_cgh_hotel": 55.00,
    "avaliacao_qualidade": 9.2,
    "detalhes_operacionais": "Central de táxi consolidada com forte cobertura na Zona Sul (Berrini, Santo Amaro, Moema e Morumbi)."
  },
  {
    "id": "VAN-004",
    "tipo": "transfer_van",
    "nome": "CSC Transportes & Fretamento Corporativo SP",
    "frota_vans_15lugares": 45,
    "frota_microonibus_28lugares": 35,
    "frota_onibus_46lugares": 40,
    "motoristas_bilingues": true,
    "rastreamento_gps_tempo_real": true,
    "seguro_passageiro_incluso": true,
    "diaria_van_10h": 760.00,
    "diaria_microonibus_10h": 1250.00,
    "diaria_onibus_10h": 1900.00,
    "comissao_percentual": 11.0,
    "avaliacao_qualidade": 9.5,
    "historico_grandes_eventos": 95,
    "detalhes_operacionais": "Empresa de grande porte com capacidade para movimentar até 3.000 passageiros/dia simultaneamente em megafeiras no SP Expo e Anhembi."
  },
  {
    "id": "REST-002",
    "tipo": "restaurante_espaco",
    "nome": "Vento Haragano Churrascaria Executiva",
    "capacidade_max_pessoas": 400,
    "valor_por_pessoa_fechado": 245.00,
    "bebidas_inclusas": true,
    "espaco_privativo_av": true,
    "comissao_percentual": 10.0,
    "distancias_km": {
      "transamerica_expo": 9.5,
      "sp_expo": 10.2,
      "anhembi": 9.0,
      "frei_caneca": 3.8,
      "wds_wtc": 6.5
    },
    "avaliacao_qualidade": 9.5,
    "detalhes_operacionais": "Tradicional churrascaria na Av. Rebouças com salão nobre e 3 salas privativas para jantares de encerramento de estandes e eventos corporativos."
  },
  {
    "id": "REST-003",
    "tipo": "restaurante_espaco",
    "nome": "Terraço Itália Restaurante & Panorama Lounge",
    "capacidade_max_pessoas": 250,
    "valor_por_pessoa_fechado": 320.00,
    "bebidas_inclusas": true,
    "espaco_privativo_av": true,
    "comissao_percentual": 10.0,
    "distancias_km": {
      "transamerica_expo": 15.0,
      "sp_expo": 13.5,
      "anhembi": 4.5,
      "frei_caneca": 2.2,
      "wds_wtc": 12.0
    },
    "avaliacao_qualidade": 9.7,
    "detalhes_operacionais": "Localizado no 41º e 42º andares do Edifício Itália, com vista 360° de SP. Ambiente exclusivo para jantares de alto escalão, embaixadas e celebrações de gala."
  }
];

// Mesclar sem duplicar IDs
const mapEventos = new Map();
eventosAtuais.forEach(e => mapEventos.set(e.id, e));
novosEventos.forEach(e => mapEventos.set(e.id, e));
const eventosFinais = Array.from(mapEventos.values());

const mapFornecedores = new Map();
fornecedoresAtuais.forEach(f => mapFornecedores.set(f.id, f));
novosFornecedores.forEach(f => mapFornecedores.set(f.id, f));
const fornecedoresFinais = Array.from(mapFornecedores.values());

fs.writeFileSync(eventosPath, JSON.stringify(eventosFinais, null, 2), 'utf8');
fs.writeFileSync(fornecedoresPath, JSON.stringify(fornecedoresFinais, null, 2), 'utf8');

console.log(`✅ Base de Eventos expandida para: ${eventosFinais.length} megaeventos`);
console.log(`✅ Base de Fornecedores expandida para: ${fornecedoresFinais.length} parceiros homologados`);

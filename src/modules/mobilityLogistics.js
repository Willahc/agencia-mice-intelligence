/**
 * MÓDULO DE LOGÍSTICA DE MOBILIDADE & POSICIONAMENTO ESTRATÉGICO DE TÁXIS/HOTEIS EM SP
 */

const { listarFornecedores } = require('./supplierManager');

const POLOS_LOGISTICA_SP = [
  {
    id: "sp_expo",
    nome: "São Paulo Expo (Zona Sul / Imigrantes)",
    endereco: "Rodovia dos Imigrantes, km 1,5 - Vila Água Funda, São Paulo - SP",
    eventosPrincipais: ["Hospitalar", "Fenatran", "Futurecom", "Feicon", "Expo Revestir", "CCXP", "Fispal Food"],
    hoteisProximos: [
      { id: "HOT-005", nome: "Plaza Sul Hotel & Flats", distanciaKm: 2.8, tempoMin: 8, perfil: "Econômico Operacional" },
      { id: "HOT-012", nome: "Ibis São Paulo Congonhas", distanciaKm: 5.5, tempoMin: 12, perfil: "Conectado ao Aeroporto CGH" },
      { id: "HOT-010", nome: "Bourbon Ibirapuera Convention", distanciaKm: 6.8, tempoMin: 14, perfil: "Executivo Superior / Grande Volume" },
      { id: "HOT-002", nome: "Ibis Interlagos", distanciaKm: 8.4, tempoMin: 18, perfil: "Econômico Sul" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão 1: Pista Local Rodovia dos Imigrantes (Portão Principal SP Expo)",
        capacidadeEstocagem: "40 a 60 veículos em rotação contínua",
        janelaCriticaHorario: "Manhã: 07h30 às 10h00 (Abertura) & Tarde/Noite: 17h30 às 20h30 (Encerramento)",
        tempoMedioRespostaMin: 3,
        diferencialOperacional: "Acesso imediato à pista marginal da Imigrantes sem retenção nos semáforos da Av. Miguel Stéfano."
      },
      {
        nomeBolsao: "Bolsão 2: Hub Metrô Jabaquara & Av. Armando de Arruda Pereira",
        capacidadeEstocagem: "25 veículos de retaguarda",
        janelaCriticaHorario: "11h30 às 15h30 (Almoço executivo e chegadas fracionadas)",
        tempoMedioRespostaMin: 6,
        diferencialOperacional: "Estocagem rápida para absorção de transbordos de passageiros vindos de Congonhas e Linha 1-Azul."
      }
    ],
    corredoresExpressosAutorizados: [
      "Corredor Av. Washington Luís / Av. dos Bandeirantes (trânsito exclusivo em faixas de ônibus)",
      "Av. Jabaquara / Av. Domingos de Morais (fuga rápida para a região da Paulista / Jardins)"
    ],
    dicaTaticaGisele: "Em dias de Hospitalar e Fenatran, travar a estocagem de 40 táxis Chame Táxi na pista lateral da Imigrantes a partir das 17h00. O tempo de saída de carro comum/app pode chegar a 50 min, enquanto táxi pela faixa sai em 12 min."
  },
  {
    id: "transamerica_expo",
    nome: "Transamerica Expo Center & Complexo Berrini (Santo Amaro / Chácara Santo Antônio)",
    endereco: "Av. Dr. Mário Vilas Boas Rodrigues, 387 - Santo Amaro, São Paulo - SP",
    eventosPrincipais: ["FEBRABAN TECH", "Fenalaw", "SOGESP", "Congresso de Oncologia"],
    hoteisProximos: [
      { id: "HOT-001", nome: "Hotel Transamerica Berrini", distanciaKm: 4.2, tempoMin: 10, perfil: "Executivo Berrini" },
      { id: "HOT-006", nome: "Sheraton São Paulo WTC Hotel", distanciaKm: 4.1, tempoMin: 11, perfil: "5 Estrelas Luxo Integrado WTC" },
      { id: "HOT-009", nome: "Hilton São Paulo Morumbi", distanciaKm: 4.5, tempoMin: 12, perfil: "5 Estrelas Luxo Executivo CENU" },
      { id: "HOT-003", nome: "Grand Hyatt São Paulo", distanciaKm: 4.8, tempoMin: 13, perfil: "Ultra-Luxo C-Level" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão 1: Av. Dr. Mário Vilas Boas Rodrigues (Portão 1 Transamerica Expo)",
        capacidadeEstocagem: "30 a 50 veículos em fila dinâmica",
        janelaCriticaHorario: "08h00 às 10h00 e 17h00 às 19h30",
        tempoMedioRespostaMin: 4,
        diferencialOperacional: "Embarque coberto para delegações bancárias e congressistas com leitor de voucher digital Chame Táxi."
      },
      {
        nomeBolsao: "Bolsão 2: Eixo Ponte Laguna & Rua Verbo Divino (Chácara Santo Antônio)",
        capacidadeEstocagem: "30 veículos de apoio",
        janelaCriticaHorario: "16h30 às 20h00",
        tempoMedioRespostaMin: 5,
        diferencialOperacional: "Acesso expresso à Marginal Pinheiros evitando o nó de trânsito da Ponte Transamérica."
      }
    ],
    corredoresExpressosAutorizados: [
      "Corredor Av. Santo Amaro / Av. São Gabriel (ligação expressa com Itaim Bibi e Jardins)",
      "Av. Dr. Chucri Zaidan e Av. Eng. Luís Carlos Berrini (faixa exclusiva compartilhada)"
    ],
    dicaTaticaGisele: "Para a FEBRABAN TECH, mais de 80% do público corporativo se hospeda no eixo Berrini (Sheraton WTC, Hilton e Grand Hyatt). Shuttles circulares de van a cada 15 min + táxis pré-posicionados na saída garantem SLA de excelência."
  },
  {
    id: "anhembi",
    nome: "Distrito Anhembi & Complexo Expo Center Norte (Zona Norte / Santana)",
    endereco: "Av. Olavo Fontoura, 1209 - Santana, São Paulo - SP",
    eventosPrincipais: ["APAS Show", "Beauty Fair", "Intermodal South America", "HSM+", "Fórum E-Commerce Brasil", "SET Expo"],
    hoteisProximos: [
      { id: "HOT-004", nome: "Holiday Inn Parque Anhembi", distanciaKm: 0.3, tempoMin: 2, perfil: "780 Quartos (Pé no Pavilhão)" },
      { id: "HOT-011", nome: "Novotel Center Norte", distanciaKm: 2.8, tempoMin: 8, perfil: "Executivo / Complexo Center Norte" },
      { id: "HOT-008", nome: "Blue Tree Premium Paulista", distanciaKm: 7.8, tempoMin: 18, perfil: "Eixo Paulista / Jardins" },
      { id: "HOT-007", nome: "Renaissance São Paulo", distanciaKm: 8.0, tempoMin: 20, perfil: "5 Estrelas Luxo Jardins" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão 1: Av. Olavo Fontoura (Portão 1 e Portão 3 Distrito Anhembi)",
        capacidadeEstocagem: "50 a 80 veículos em bolsão permanente",
        janelaCriticaHorario: "11h00 às 14h00 e 18h00 às 21h30 (Feiras noturnas)",
        tempoMedioRespostaMin: 3,
        diferencialOperacional: "Despacho de táxi credenciado com acesso direto à Marginal Tietê (Sentido Castelo Branco e Ayrton Senna/GRU)."
      },
      {
        nomeBolsao: "Bolsão 2: Rua José Bernardo Pinto (Pavilhão Expo Center Norte)",
        capacidadeEstocagem: "35 veículos",
        janelaCriticaHorario: "12h00 às 15h00 e 18h30 às 21h00",
        tempoMedioRespostaMin: 4,
        diferencialOperacional: "Conexão rápida com o Metrô Portuguesa-Tietê e Av. Zaki Narchi."
      }
    ],
    corredoresExpressosAutorizados: [
      "Corredor Norte-Sul / Av. 23 de Maio / Av. Santos Dumont (acesso sem semáforos ao Aeroporto CGH)",
      "Pistas expressas da Marginal Tietê e Rodovia Ayrton Senna (deslocamento para Aeroporto GRU em 28 min)"
    ],
    dicaTaticaGisele: "A APAS Show e a Beauty Fair geram a maior pressão hoteleira de SP (mais de 170.000 room nights cada). O Holiday Inn Anhembi deve ter bloqueio de 300 quartos travado em D-180."
  },
  {
    id: "frei_caneca",
    nome: "Centro de Convenções Frei Caneca & Polo Paulista (Consolação / Jardins)",
    endereco: "Rua Frei Caneca, 569 - Consolação, São Paulo - SP",
    eventosPrincipais: ["Congressos Médicos Especializados", "Simpósios Farmacêuticos", "Fóruns de Gestão"],
    hoteisProximos: [
      { id: "HOT-008", nome: "Blue Tree Premium Paulista", distanciaKm: 0.9, tempoMin: 5, perfil: "Executivo Paulista" },
      { id: "HOT-007", nome: "Renaissance São Paulo Hotel", distanciaKm: 1.2, tempoMin: 6, perfil: "5 Estrelas Luxo Jardins" },
      { id: "HOT-010", nome: "Bourbon Ibirapuera", distanciaKm: 6.5, tempoMin: 16, perfil: "Grande Capacidade Moema" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão 1: Rua Frei Caneca esquina com Rua Augusta",
        capacidadeEstocagem: "15 a 20 veículos em giro rápido",
        janelaCriticaHorario: "08h00 às 09h30 e 17h30 às 19h00",
        tempoMedioRespostaMin: 4,
        diferencialOperacional: "Embarque no Shopping Frei Caneca com acesso às faixas da Rua da Consolação e Av. 9 de Julho."
      }
    ],
    corredoresExpressosAutorizados: [
      "Faixas exclusivas da Av. Paulista e Rua da Consolação",
      "Corredor Av. 9 de Julho / Av. Santo Amaro"
    ],
    dicaTaticaGisele: "Polo com grande concentração de médicos e palestrantes que preferem hotéis de luxo a pé ou em corridas curtas de táxi. Excelente para fechamento de pacotes VIP."
  },
  {
    id: "wds_wtc",
    nome: "WTC Events Center & Complexo Berrini (Brooklin / CENU)",
    endereco: "Av. das Nações Unidas, 12551 - Brooklin Novo, São Paulo - SP",
    eventosPrincipais: ["Fóruns LIDE", "C-Level Summits", "Convenções Bancárias & FinTechs", "AgroFinance"],
    hoteisProximos: [
      { id: "HOT-006", nome: "Sheraton São Paulo WTC Hotel", distanciaKm: 0.1, tempoMin: 2, perfil: "5 Estrelas Integrado ao Centro de Eventos" },
      { id: "HOT-009", nome: "Hilton São Paulo Morumbi", distanciaKm: 0.8, tempoMin: 4, perfil: "5 Estrelas Luxo CENU" },
      { id: "HOT-001", nome: "Hotel Transamerica Berrini", distanciaKm: 1.2, tempoMin: 5, perfil: "Executivo Moderno Berrini" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão WTC: Recepção Principal D&D Shopping / Sheraton",
        capacidadeEstocagem: "30 veículos em prontidão contínua",
        janelaCriticaHorario: "07h30 às 09h30 e 17h30 às 20h00",
        tempoMedioRespostaMin: 3,
        diferencialOperacional: "Conexão subterrânea direta entre o centro de convenções, hotel e praça de alimentação."
      }
    ],
    corredoresExpressosAutorizados: [
      "Faixas exclusivas da Av. Engenheiro Luís Carlos Berrini e Av. Chucri Zaidan",
      "Corredor Marginal Pinheiros sentido Aeroporto de Congonhas (12 min)"
    ],
    dicaTaticaGisele: "O WTC é o centro preferencial para eventos de altíssimo ticket e C-Level. O pacote de táxi executivo pré-faturado tem adesão de mais de 80% dos organizadores."
  },
  {
    id: "ribeirao_preto",
    nome: "Polo Ribeirão Preto & Sertãozinho (Agrishow & Capital do Agronegócio)",
    endereco: "Parque Tecnológico Agrishow (Rod. Pref. Antônio Duarte Nogueira, Km 321) & Centro de Eventos Taiwan",
    eventosPrincipais: ["Agrishow", "Fenasucro & Agrocana", "Enconpec Pecuária", "Congresso do Café"],
    hoteisProximos: [
      { id: "HOT-020", nome: "Hotel Mont Blanc Premium Ribeirão", distanciaKm: 6.5, tempoMin: 12, perfil: "5 Estrelas Executivo Agro" },
      { id: "HOT-021", nome: "Wyndham Garden Convention Ribeirão", distanciaKm: 4.8, tempoMin: 10, perfil: "4 Estrelas Convenções" },
      { id: "HOT-022", nome: "Ibis Ribeirão Preto Shopping", distanciaKm: 7.2, tempoMin: 14, perfil: "Econômico Estratégico" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão 1: Aeroporto Leite Lopes (RAO) & Portão Principal Parque Agrishow",
        capacidadeEstocagem: "80 veículos e vans em escala rotativa",
        janelaCriticaHorario: "07h00 às 10h30 e 16h30 às 20h00",
        tempoMedioRespostaMin: 5,
        diferencialOperacional: "Vouchers corporativos para produtores e comitivas internacionais com rota expressa Anhanguera."
      }
    ],
    corredoresExpressosAutorizados: [
      "Rodovia Anhanguera (SP-330) e Anel Viário Contorno Sul",
      "Rodovia Cândido Portinari (SP-334)"
    ],
    dicaTaticaGisele: "Na semana da Agrishow, Ribeirão Preto e cidades vizinhas (Sertãozinho, Cravinhos, Jaboticabal) atingem 100% de ocupação. Travar bloqueios de 100+ quartos em D-180 gera saving de até 60% sobre a tarifa balcão de pico (que passa de R$ 2.000/noite)."
  },
  {
    id: "campinas_resorts",
    nome: "Polo Campinas, Atibaia & Circuito dos Resorts (Royal Palm Hall & Convenções Fechadas)",
    endereco: "Royal Palm Hall (Av. Monsenhor Luís Fernandes de Abreu, 311 - Campinas) & Bourbon Atibaia Resort",
    eventosPrincipais: ["Convenções de Vendas Multinacionais", "Hortitec Holambra", "Liderança Agro John Deere/Syngenta/Bayer"],
    hoteisProximos: [
      { id: "HOT-023", nome: "Royal Palm Plaza Resort & Hall", distanciaKm: 0.1, tempoMin: 2, perfil: "Complexo Resort & Centro de Convenções (Cap. 9.000 pax)" },
      { id: "HOT-024", nome: "Bourbon Atibaia Resort", distanciaKm: 45.0, tempoMin: 38, perfil: "Resort para Convenções 100% Exclusivas" },
      { id: "HOT-025", nome: "Tauá Resort Atibaia", distanciaKm: 48.0, tempoMin: 40, perfil: "Complexo de Eventos Corporativos" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão 1: Hub Aeroporto Internacional de Viracopos (VCP) & Royal Palm Hall",
        capacidadeEstocagem: "40 vans e 60 táxis executivos",
        janelaCriticaHorario: "Chegadas de voos de todo o Brasil e transfer contínuo para resorts",
        tempoMedioRespostaMin: 6,
        diferencialOperacional: "Receptivo em Viracopos com vans dedicadas para Atibaia, Campinas e Itupeva."
      }
    ],
    corredoresExpressosAutorizados: [
      "Rodovia dos Bandeirantes (SP-348) e Rodovia Anhanguera (SP-330)",
      "Rodovia Dom Pedro I (SP-065)"
    ],
    dicaTaticaGisele: "Polo ideal para convenções de vendas corporativas de 300 a 1.500 pessoas que buscam imersão total da equipe sem dispersão hoteleira."
  },
  {
    id: "sao_jose_rio_preto_aracatuba",
    nome: "Polo Noroeste Paulista (São José do Rio Preto & Araçatuba)",
    endereco: "Recinto Alberto Bertelli Lucato (SJRP) & Recinto Clibas de Almeida Prado (Araçatuba)",
    eventosPrincipais: ["Expo Rio Preto Pecuária", "Expô Araçatuba Agro", "Leilões Nelore & Gir Leiteiro"],
    hoteisProximos: [
      { id: "HOT-026", nome: "Comfort Hotel São José do Rio Preto", distanciaKm: 4.2, tempoMin: 9, perfil: "Executivo Regional" },
      { id: "HOT-027", nome: "Ibis Araçatuba", distanciaKm: 5.5, tempoMin: 11, perfil: "Econômico Funcional" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão 1: Aeroporto Prof. Eribelto Manoel Reino (SJP) & Recinto de Exposições",
        capacidadeEstocagem: "25 veículos",
        janelaCriticaHorario: "14h00 às 22h00 (Leilões e julgamentos de raças)",
        tempoMedioRespostaMin: 5,
        diferencialOperacional: "Atendimento direto a criadores e comitivas de leilões rurais."
      }
    ],
    corredoresExpressosAutorizados: [
      "Rodovia Washington Luís (SP-310)",
      "Rodovia Marechal Rondon (SP-300)"
    ],
    dicaTaticaGisele: "Eventos voltados à pecuária de elite com grande volume de faturamento em leilões. Alta demanda por transporte executivo e jantares privativos para criadores."
  },
  {
    id: "piracicaba_agtech",
    nome: "Polo Piracicaba, Paranapanema & Avaré (AgTech Valley & EMAPA)",
    endereco: "Parque Tecnológico de Piracicaba / ESALQ USP & Parque de Exposições de Avaré",
    eventosPrincipais: ["AgTech Summit Piracicaba", "EMAPA Avaré (Equinocultura)", "FAPI Ourinhos"],
    hoteisProximos: [
      { id: "HOT-028", nome: "Beira Rio Palace Hotel Piracicaba", distanciaKm: 3.5, tempoMin: 8, perfil: "Executivo Central" },
      { id: "HOT-029", nome: "Villa Verde Hotel Avaré", distanciaKm: 2.8, tempoMin: 6, perfil: "Parque Agropecuário" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão AgTech: ESALQ / Parque Tecnológico Piracicaba",
        capacidadeEstocagem: "20 veículos e vans de fretamento",
        janelaCriticaHorario: "08h00 às 18h30",
        tempoMedioRespostaMin: 6,
        diferencialOperacional: "Conexão rápida com o Aeroporto de Viracopos (45 min via Rod. do Açúcar)."
      }
    ],
    corredoresExpressosAutorizados: [
      "Rodovia do Açúcar (SP-075) e Rodovia Luiz de Queiroz (SP-304)",
      "Rodovia Castello Branco (SP-280)"
    ],
    dicaTaticaGisele: "Piracicaba é o Vale do Silício do Agro brasileiro. Empresas de biotecnologia e fundos de venture capital demandam hotelaria boutique e traslados executivos constantes de Viracopos."
  },
  {
    id: "santos_litoral",
    nome: "Polo Baixada Santista & Porto de Santos (Logística Portuária & Agro Export)",
    endereco: "Blue Med Convention Center (Praça Almirante Gago Coutinho, 29 - Ponta da Praia, Santos - SP)",
    eventosPrincipais: ["Santos Export Agro", "Brasil Export", "Conferências de Comércio Exterior"],
    hoteisProximos: [
      { id: "HOT-030", nome: "Parque Balneário Hotel Santos", distanciaKm: 3.2, tempoMin: 8, perfil: "5 Estrelas Tradicional Gonzaga" },
      { id: "HOT-031", nome: "Bourbon Santos Hotel", distanciaKm: 3.5, tempoMin: 9, perfil: "Executivo Gonzaga" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão Ponta da Praia: Blue Med Convention Center Santos",
        capacidadeEstocagem: "25 táxis e vans executivas",
        janelaCriticaHorario: "08h00 às 10h00 e 17h00 às 19h30",
        tempoMedioRespostaMin: 4,
        diferencialOperacional: "Conexão direta com a orla da praia e rota expressa pela Rodovia dos Imigrantes / Anchieta."
      }
    ],
    corredoresExpressosAutorizados: [
      "Sistema Anchieta-Imigrantes (SP-150 / SP-160)",
      "Avenidas da Orla da Praia de Santos e Av. Ana Costa"
    ],
    dicaTaticaGisele: "Eventos focados em exportação de commodities (soja, milho, café, açúcar). Fretamento de vans executivas partindo direto dos aeroportos de SP (GRU/CGH) para Santos."
  },
  {
    id: "campos_jordao",
    nome: "Polo Serra da Mantiqueira (Campos do Jordão Convention Center)",
    endereco: "Av. Macedo Soares, 499 - Capivari, Campos do Jordão - SP",
    eventosPrincipais: ["Fóruns Econômicos de Inverno", "Liderança Empresarial & Agro C-Level", "Congressos Médicos VIP"],
    hoteisProximos: [
      { id: "HOT-032", nome: "Grande Hotel Campos do Jordão Senac", distanciaKm: 1.8, tempoMin: 5, perfil: "5 Estrelas Luxo Hotel-Escola" },
      { id: "HOT-033", nome: "Hotel Vila Inglesa", distanciaKm: 3.2, tempoMin: 8, perfil: "Charme & Alto Padrão" }
    ],
    bolsoesTaxiEstrategicos: [
      {
        nomeBolsao: "Bolsão Capivari: Centro de Convenções Campos do Jordão",
        capacidadeEstocagem: "20 veículos e vans VIP",
        janelaCriticaHorario: "14h00 às 23h00 (Fóruns e jantares de gala)",
        tempoMedioRespostaMin: 5,
        diferencialOperacional: "Atendimento premium com motoristas bilíngues e carros blindados sob demanda."
      }
    ],
    corredoresExpressosAutorizados: [
      "Rodovia Floriano Rodrigues Pinheiro (SP-123)",
      "Rodovia Ayrton Senna / Carvalho Pinto (SP-070)"
    ],
    dicaTaticaGisele: "O polo de maior ticket médio diário do estado para fóruns de liderança executiva e encontros estratégicos no outono/inverno."
  }
];

function obterLogisticaMobilidadePolos() {
  return POLOS_LOGISTICA_SP;
}

function obterLogisticaPoloPorId(poloId) {
  return POLOS_LOGISTICA_SP.find(p => p.id === poloId) || null;
}

module.exports = {
  POLOS_LOGISTICA_SP,
  obterLogisticaMobilidadePolos,
  obterLogisticaPoloPorId
};

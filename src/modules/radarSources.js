/**
 * MÓDULO DE FONTES DE CAPTAÇÃO & INGESTÃO EM MASSA DE SÃO PAULO (Radar Sources)
 * Mapeamento exaustivo dos centros de convenções, hotéis corporativos e plataformas de eventos em SP.
 */

const FONTES_SP = [
  // 1. Grandes Pavilhões e Centros de Convenções Dedicados
  { id: 'sp_expo', nome: 'São Paulo Expo', tipo: 'pavilha_convencoes', regiao: 'Zona Sul / Imigrantes', capacidadeMax: 50000 },
  { id: 'transamerica_expo', nome: 'Transamerica Expo Center', tipo: 'pavilha_convencoes', regiao: 'Zona Sul / Santo Amaro', capacidadeMax: 20000 },
  { id: 'anhembi', nome: 'Distrito Anhembi', tipo: 'pavilha_convencoes', regiao: 'Zona Norte / Santana', capacidadeMax: 60000 },
  { id: 'expo_center_norte', nome: 'Expo Center Norte', tipo: 'pavilha_convencoes', regiao: 'Zona Norte / Vila Guilherme', capacidadeMax: 40000 },
  { id: 'frei_caneca', nome: 'Centro de Convenções Frei Caneca', tipo: 'centro_convencoes', regiao: 'Centro / Consolação', capacidadeMax: 8000 },
  { id: 'reboucas', nome: 'Centro de Convenções Rebouças', tipo: 'centro_convencoes_medico', regiao: 'Pinheiros / Clínicas', capacidadeMax: 5000 },
  { id: 'pro_magno', nome: 'Pro Magno Centro de Eventos', tipo: 'centro_convencoes', regiao: 'Zona Norte / Casa Verde', capacidadeMax: 15000 },
  { id: 'wds_wtc', nome: 'WTC Events Center / Sheraton', tipo: 'hotel_convencoes', regiao: 'Brooklin / Berrini', capacidadeMax: 12000 },

  // 2. Hotéis Corporativos com Centros de Convenções Próprios
  { id: 'grand_hyatt', nome: 'Grand Hyatt São Paulo (Espaço de Convenções)', tipo: 'hotel_convencoes', regiao: 'Berrini / Marginal Pinheiros', capacidadeMax: 3000 },
  { id: 'hilton_morumbi', nome: 'Hilton São Paulo Morumbi', tipo: 'hotel_convencoes', regiao: 'Berrini / CENESP', capacidadeMax: 2000 },
  { id: 'renaissance_sp', nome: 'Renaissance São Paulo Hotel', tipo: 'hotel_convencoes', regiao: 'Jardins / Paulista', capacidadeMax: 1500 },
  { id: 'tivoli_mofarrej', nome: 'Tivoli Mofarrej São Paulo', tipo: 'hotel_convencoes', regiao: 'Jardins / Alameda Santos', capacidadeMax: 1200 },
  { id: 'pullman_vila_olimpia', nome: 'Pullman São Paulo Vila Olímpia', tipo: 'hotel_convencoes', regiao: 'Vila Olímpia', capacidadeMax: 1000 },
  { id: 'blue_tree_faria_lima', nome: 'Blue Tree Premium Faria Lima', tipo: 'hotel_convencoes', regiao: 'Itaim Bibi / Faria Lima', capacidadeMax: 800 },

  // 3. Entidades Médicas & Sociedades Científicas
  { id: 'amb', nome: 'Associação Médica Brasileira (AMB)', tipo: 'sociedade_cientifica', segmento: 'Medicina / Especialidades' },
  { id: 'sbc', nome: 'Sociedade Brasileira de Cardiologia (SBC)', tipo: 'sociedade_cientifica', segmento: 'Cardiologia' },
  { id: 'sbot', nome: 'Sociedade Brasileira de Ortopedia (SBOT)', tipo: 'sociedade_cientifica', segmento: 'Ortopedia' },
  { id: 'sogesp', nome: 'Associação de Obstetrícia e Ginecologia de SP (SOGESP)', tipo: 'sociedade_cientifica', segmento: 'Ginecologia' },
  { id: 'sboc', nome: 'Sociedade Brasileira de Oncologia Clínica (SBOC)', tipo: 'sociedade_cientifica', segmento: 'Oncologia' },
  { id: 'apcd_ciosp', nome: 'Associação Paulista de Cirurgiões-Dentistas (APCD / CIOSP)', tipo: 'sociedade_cientifica', segmento: 'Odontologia' },
  { id: 'spr_jpr', nome: 'Sociedade Paulista de Radiologia (SPR / JPR)', tipo: 'sociedade_cientifica', segmento: 'Radiologia' },

  // 4. Promotoras Globais, Órgãos Oficiais & Bureaus MICE
  { id: 'spcvb_visite_sp', nome: 'São Paulo Convention & Visitors Bureau (Visite São Paulo)', tipo: 'orgao_oficial_mice', regiao: 'Estado de São Paulo' },
  { id: 'ubrafe_oficial', nome: 'UBRAFE - União Brasileira de Feiras e Eventos de Negócios', tipo: 'associacao_feiras', regiao: 'Nacional / SP' },
  { id: 'setur_sp', nome: 'Secretaria de Turismo e Viagens do Estado de São Paulo (SETUR-SP)', tipo: 'orgao_governamental', regiao: 'Estado de São Paulo' },
  { id: 'informa_markets_br', nome: 'Informa Markets Brasil (Agrishow, Hospitalar, Intermodal, Fispal)', tipo: 'promotora_global', regiao: 'SP Capital & Interior' },
  { id: 'rx_global_brasil', nome: 'RX Brasil - Reed Exhibitions (Feicon, Fenasucro, Fenatran)', tipo: 'promotora_global', regiao: 'SP Capital & Interior' },
  { id: 'gl_events_br', nome: 'GL events Brasil (São Paulo Expo, Anhembi, Bienal do Livro)', tipo: 'promotora_global', regiao: 'SP Capital' },
  { id: 'live_nation_br', nome: 'Live Nation Entertainment Brasil & Rock World (The Town, Lollapalooza)', tipo: 'promotora_festivais', regiao: 'SP Capital' },

  // 5. Arenas, Polos do Interior & Complexos de Resorts MICE
  { id: 'interlagos_f1', nome: 'Autódromo de Interlagos (Fórmula 1 & Megafestivais)', tipo: 'arena_megashows', regiao: 'Zona Sul / Interlagos' },
  { id: 'allianz_parque_wtorre', nome: 'Allianz Parque & Espaço Unimed (WTorre Entretenimento)', tipo: 'arena_megashows', regiao: 'Zona Oeste / Barra Funda' },
  { id: 'barretos_independentes', nome: 'Parque do Peão de Barretos (Os Independentes)', tipo: 'arena_rodeio_agro', regiao: 'Norte Paulista' },
  { id: 'royal_palm_mice', nome: 'Royal Palm Hall Complexo MICE (Campinas)', tipo: 'resort_convencoes', regiao: 'RMC Campinas' },
  { id: 'bourbon_atibaia_mice', nome: 'Bourbon Atibaia Resort Convention Center', tipo: 'resort_convencoes', regiao: 'Circuito dos Resorts' },
  { id: 'club_med_paradise_mice', nome: 'Club Med Lake Paradise MICE (Mogi das Cruzes)', tipo: 'resort_convencoes', regiao: 'Alto Tietê' },
  { id: 'bluemed_santos_mice', nome: 'Blue Med Convention Center (Santos Porto & Export)', tipo: 'centro_convencoes', regiao: 'Baixada Santista' },

  // 6. Plataformas de Ticketing & Inscrições B2B
  { id: 'sympla_corp', nome: 'Sympla Corporate & Congressos', tipo: 'plataforma_ticketing' },
  { id: 'eventbrite_b2b', nome: 'Eventbrite Brasil B2B', tipo: 'plataforma_ticketing' },
  { id: 'even3', nome: 'Even3 Congressos Científicos', tipo: 'plataforma_ticketing' },
  { id: 'doity', nome: 'Doity Eventos Acadêmicos & Médicos', tipo: 'plataforma_ticketing' }
];

module.exports = {
  FONTES_SP
};

/**
 * MÓDULO 3: GESTÃO DA REDE DE FORNECEDORES (Supplier Manager)
 * Gerencia o cadastro, tarifas acordadas, comissões e SLAs dos parceiros da Gisele em São Paulo.
 */

const fs = require('fs');
const path = require('path');

const FORNECEDORES_FILE = path.join(__dirname, '../data/fornecedores_sp.json');

/**
 * Lista todos os fornecedores cadastrados
 */
function listarFornecedores(filtroTipo = null) {
  if (!fs.existsSync(FORNECEDORES_FILE)) {
    fs.writeFileSync(FORNECEDORES_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  const lista = JSON.parse(fs.readFileSync(FORNECEDORES_FILE, 'utf-8'));
  if (filtroTipo) {
    return lista.filter(f => f.tipo === filtroTipo);
  }
  return lista;
}

/**
 * Salva ou atualiza um fornecedor na rede
 */
function salvarFornecedor(fornecedorData) {
  const lista = listarFornecedores();
  
  // Gerar ID caso não exista
  if (!fornecedorData.id) {
    const prefixos = {
      hotel: 'HOT',
      taxi: 'TAX',
      transfer_van: 'VAN',
      tmc_parceira: 'TMC',
      restaurante_espaco: 'REST'
    };
    const prefixo = prefixos[fornecedorData.tipo] || 'FORN';
    const count = lista.filter(f => f.tipo === fornecedorData.tipo).length + 1;
    fornecedorData.id = `${prefixo}-${String(count).padStart(3, '0')}`;
  }

  const index = lista.findIndex(f => f.id === fornecedorData.id);
  
  const fornecedorAtualizado = {
    ...fornecedorData,
    atualizado_em: new Date().toISOString()
  };

  if (index >= 0) {
    lista[index] = fornecedorAtualizado;
  } else {
    lista.push(fornecedorAtualizado);
  }

  fs.writeFileSync(FORNECEDORES_FILE, JSON.stringify(lista, null, 2), 'utf-8');
  return fornecedorAtualizado;
}

/**
 * Remove um fornecedor por ID
 */
function removerFornecedor(id) {
  const lista = listarFornecedores();
  const novaLista = lista.filter(f => f.id !== id);
  if (lista.length !== novaLista.length) {
    fs.writeFileSync(FORNECEDORES_FILE, JSON.stringify(novaLista, null, 2), 'utf-8');
    return true;
  }
  return false;
}

/**
 * Obtém estatísticas consolidadas da rede
 */
function obterEstatisticasRede() {
  const lista = listarFornecedores();
  const hoteis = lista.filter(f => f.tipo === 'hotel');
  const taxis = lista.filter(f => f.tipo === 'taxi');
  const vans = lista.filter(f => f.tipo === 'transfer_van');
  const tmcs = lista.filter(f => f.tipo === 'tmc_parceira');

  const totalQuartosMapeados = hoteis.reduce((acc, h) => acc + (h.capacidade_quartos || 0), 0);
  const totalRoomBlockMaximo = hoteis.reduce((acc, h) => acc + (h.max_room_block || 0), 0);
  const mediaComissaoHoteis = hoteis.length ? (hoteis.reduce((acc, h) => acc + (h.comissao_percentual || 0), 0) / hoteis.length).toFixed(1) : 0;
  const totalFrotaVans = vans.reduce((acc, v) => acc + (v.frota_vans_15lugares || 0) + (v.frota_microonibus_28lugares || 0) + (v.frota_onibus_46lugares || 0), 0);

  return {
    totalFornecedores: lista.length,
    hoteis: {
      total: hoteis.length,
      quartosMapeados: totalQuartosMapeados,
      roomBlockDisponivel: totalRoomBlockMaximo,
      mediaComissaoPct: Number(mediaComissaoHoteis)
    },
    taxis: {
      total: taxis.length,
      frotaTotal: taxis.reduce((acc, t) => acc + (t.frota_disponivel || 0), 0)
    },
    vans: {
      total: vans.length,
      veiculosFretamento: totalFrotaVans
    },
    tmcs: {
      total: tmcs.length
    }
  };
}

module.exports = {
  listarFornecedores,
  salvarFornecedor,
  removerFornecedor,
  obterEstatisticasRede
};

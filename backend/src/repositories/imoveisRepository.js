import { pool } from '../config/database.js';

export const imoveisRepository = {
  async obterResumoDashboard() {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE s.codigo = 'DISPONIVEL')::int AS disponiveis,
        COUNT(*) FILTER (WHERE s.codigo = 'VENDIDO')::int AS vendidos,
        COUNT(*) FILTER (WHERE s.codigo = 'ALUGADO')::int AS alugados
      FROM imoveis i
      INNER JOIN situacoes_imovel s ON s.id = i.situacao_id
      WHERE i.deleted_at IS NULL
    `);

    const recentes = await pool.query(`
      SELECT
        i.id, i.codigo_referencia, i.titulo, i.cidade, i.bairro,
        i.preco_venda, i.preco_locacao, i.publicado, i.created_at,
        t.nome AS tipo_nome,
        f.codigo AS finalidade_codigo, f.nome AS finalidade_nome,
        s.codigo AS situacao_codigo, s.nome AS situacao_nome,
        (SELECT url FROM imovel_fotos pf WHERE pf.imovel_id = i.id AND pf.is_principal = TRUE LIMIT 1) AS foto_principal
      FROM imoveis i
      INNER JOIN tipos_imovel t ON t.id = i.tipo_imovel_id
      INNER JOIN finalidades f ON f.id = i.finalidade_id
      INNER JOIN situacoes_imovel s ON s.id = i.situacao_id
      WHERE i.deleted_at IS NULL
      ORDER BY i.created_at DESC
      LIMIT 6
    `);

    return {
      metricas: rows[0],
      recentes: recentes.rows,
    };
  },

  async listarAdmin({ busca, finalidade_id, situacao_id, publicado, page = 1, limit = 12 }) {
    const conditions = ['i.deleted_at IS NULL'];
    const params = [];

    if (busca) {
      params.push(`%${busca}%`);
      conditions.push(`(
        i.titulo ILIKE $${params.length} OR
        i.codigo_referencia ILIKE $${params.length} OR
        i.cidade ILIKE $${params.length} OR
        i.bairro ILIKE $${params.length}
      )`);
    }

    if (finalidade_id) {
      params.push(Number(finalidade_id));
      conditions.push(`i.finalidade_id = $${params.length}`);
    }

    if (situacao_id) {
      params.push(Number(situacao_id));
      conditions.push(`i.situacao_id = $${params.length}`);
    }

    if (publicado === 'true' || publicado === 'false') {
      params.push(publicado === 'true');
      conditions.push(`i.publicado = $${params.length}`);
    }

    const whereClause = conditions.join(' AND ');
    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM imoveis i WHERE ${whereClause}`,
      params
    );

    params.push(Number(limit), offset);
    const dataResult = await pool.query(
      `SELECT
        i.id, i.codigo_referencia, i.titulo, i.cidade, i.bairro,
        i.preco_venda, i.preco_locacao, i.publicado, i.destaque,
        i.quartos, i.banheiros, i.vagas_garagem, i.area_total,
        i.situacao_id, i.finalidade_id, i.tipo_imovel_id, i.updated_at,
        t.nome AS tipo_nome,
        f.codigo AS finalidade_codigo, f.nome AS finalidade_nome,
        s.codigo AS situacao_codigo, s.nome AS situacao_nome,
        (SELECT url FROM imovel_fotos pf WHERE pf.imovel_id = i.id AND pf.is_principal = TRUE LIMIT 1) AS foto_principal
      FROM imoveis i
      INNER JOIN tipos_imovel t ON t.id = i.tipo_imovel_id
      INNER JOIN finalidades f ON f.id = i.finalidade_id
      INNER JOIN situacoes_imovel s ON s.id = i.situacao_id
      WHERE ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return {
      itens: dataResult.rows,
      total: countResult.rows[0].total,
      pagina: Math.max(1, Number(page)),
      totalPaginas: Math.ceil(countResult.rows[0].total / Number(limit)) || 1,
    };
  },

  async findByIdAdmin(id) {
    const { rows } = await pool.query(
      `SELECT
        i.*,
        t.nome AS tipo_nome,
        f.codigo AS finalidade_codigo, f.nome AS finalidade_nome,
        s.codigo AS situacao_codigo, s.nome AS situacao_nome
      FROM imoveis i
      INNER JOIN tipos_imovel t ON t.id = i.tipo_imovel_id
      INNER JOIN finalidades f ON f.id = i.finalidade_id
      INNER JOIN situacoes_imovel s ON s.id = i.situacao_id
      WHERE i.id = $1 AND i.deleted_at IS NULL`,
      [id]
    );
    return rows[0] || null;
  },

  async criar(dados, usuarioId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const tempCodigo = `TMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const { rows } = await client.query(
        `INSERT INTO imoveis (
          codigo_referencia, titulo, descricao, tipo_imovel_id, finalidade_id, situacao_id,
          publicado, destaque, preco_venda, preco_locacao, valor_condominio, valor_iptu,
          cep, estado, cidade, bairro, logradouro, numero, complemento, exibir_endereco_completo,
          area_total, area_construida, quartos, suites, banheiros, vagas_garagem,
          diferenciais, criado_por, atualizado_por
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26,
          $27::jsonb, $28, $28
        ) RETURNING id`,
        [
          tempCodigo,
          dados.titulo,
          dados.descricao,
          dados.tipo_imovel_id,
          dados.finalidade_id,
          dados.situacao_id,
          dados.publicado,
          dados.destaque,
          dados.preco_venda,
          dados.preco_locacao,
          dados.valor_condominio,
          dados.valor_iptu,
          dados.cep || null,
          dados.estado.toUpperCase(),
          dados.cidade,
          dados.bairro,
          dados.logradouro || null,
          dados.numero || null,
          dados.complemento || null,
          dados.exibir_endereco_completo,
          dados.area_total,
          dados.area_construida,
          dados.quartos,
          dados.suites,
          dados.banheiros,
          dados.vagas_garagem,
          JSON.stringify(dados.diferenciais),
          usuarioId,
        ]
      );

      const novoId = rows[0].id;
      const codigoFinal = `VL-${1000 + novoId}`;

      await client.query('UPDATE imoveis SET codigo_referencia = $1 WHERE id = $2', [
        codigoFinal,
        novoId,
      ]);

      await client.query('COMMIT');
      return this.findByIdAdmin(novoId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async atualizar(id, dados, usuarioId) {
    const { rows } = await pool.query(
      `UPDATE imoveis SET
        titulo = $1,
        descricao = $2,
        tipo_imovel_id = $3,
        finalidade_id = $4,
        situacao_id = $5,
        publicado = $6,
        destaque = $7,
        preco_venda = $8,
        preco_locacao = $9,
        valor_condominio = $10,
        valor_iptu = $11,
        cep = $12,
        estado = $13,
        cidade = $14,
        bairro = $15,
        logradouro = $16,
        numero = $17,
        complemento = $18,
        exibir_endereco_completo = $19,
        area_total = $20,
        area_construida = $21,
        quartos = $22,
        suites = $23,
        banheiros = $24,
        vagas_garagem = $25,
        diferenciais = $26::jsonb,
        atualizado_por = $27
      WHERE id = $28 AND deleted_at IS NULL
      RETURNING id`,
      [
        dados.titulo,
        dados.descricao,
        dados.tipo_imovel_id,
        dados.finalidade_id,
        dados.situacao_id,
        dados.publicado,
        dados.destaque,
        dados.preco_venda,
        dados.preco_locacao,
        dados.valor_condominio,
        dados.valor_iptu,
        dados.cep || null,
        dados.estado.toUpperCase(),
        dados.cidade,
        dados.bairro,
        dados.logradouro || null,
        dados.numero || null,
        dados.complemento || null,
        dados.exibir_endereco_completo,
        dados.area_total,
        dados.area_construida,
        dados.quartos,
        dados.suites,
        dados.banheiros,
        dados.vagas_garagem,
        JSON.stringify(dados.diferenciais),
        usuarioId,
        id,
      ]
    );

    if (!rows[0]) return null;
    return this.findByIdAdmin(id);
  },

  async atualizarSituacao(id, situacaoId, usuarioId) {
    const { rows } = await pool.query(
      `UPDATE imoveis
       SET situacao_id = $1, atualizado_por = $2
       WHERE id = $3 AND deleted_at IS NULL
       RETURNING id`,
      [situacaoId, usuarioId, id]
    );
    if (!rows[0]) return null;
    return this.findByIdAdmin(id);
  },

  async arquivar(id, usuarioId) {
    const { rows } = await pool.query(
      `UPDATE imoveis
       SET deleted_at = NOW(), publicado = FALSE, destaque = FALSE, atualizado_por = $1
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING id`,
      [usuarioId, id]
    );
    return rows[0] || null;
  },

  // =========================================================================
  // CONSULTAS RESTRITAS AO SITE PÚBLICO (APENAS PUBLICADOS E DISPONÍVEIS)
  // =========================================================================

  async listarPublico({
    busca,
    cidade,
    bairro,
    tipo_imovel_id,
    finalidade,
    preco_min,
    preco_max,
    destaque,
    ordenar = 'recentes',
    page = 1,
    limit = 9,
  }) {
    const conditions = [
      'i.deleted_at IS NULL',
      'i.publicado = TRUE',
      's.visivel_publico = TRUE',
    ];
    const params = [];

    if (busca) {
      params.push(`%${busca}%`);
      conditions.push(`(
        i.titulo ILIKE $${params.length} OR
        i.descricao ILIKE $${params.length} OR
        i.codigo_referencia ILIKE $${params.length} OR
        i.cidade ILIKE $${params.length} OR
        i.bairro ILIKE $${params.length}
      )`);
    }

    if (cidade) {
      params.push(cidade);
      conditions.push(`LOWER(i.cidade) = LOWER($${params.length})`);
    }

    if (bairro) {
      params.push(bairro);
      conditions.push(`LOWER(i.bairro) = LOWER($${params.length})`);
    }

    if (tipo_imovel_id) {
      params.push(Number(tipo_imovel_id));
      conditions.push(`i.tipo_imovel_id = $${params.length}`);
    }

    if (finalidade) {
      const codigoFinalidade = finalidade.toUpperCase();
      if (codigoFinalidade === 'VENDA') {
        conditions.push(`f.codigo IN ('VENDA', 'AMBAS')`);
      } else if (codigoFinalidade === 'LOCACAO') {
        conditions.push(`f.codigo IN ('LOCACAO', 'AMBAS')`);
      }
    }

    if (preco_min) {
      params.push(Number(preco_min));
      conditions.push(`(
        (i.preco_venda IS NOT NULL AND i.preco_venda >= $${params.length}) OR
        (i.preco_locacao IS NOT NULL AND i.preco_locacao >= $${params.length})
      )`);
    }

    if (preco_max) {
      params.push(Number(preco_max));
      conditions.push(`(
        (i.preco_venda IS NOT NULL AND i.preco_venda <= $${params.length}) OR
        (i.preco_locacao IS NOT NULL AND i.preco_locacao <= $${params.length})
      )`);
    }

    if (destaque === 'true') {
      conditions.push('i.destaque = TRUE');
    }

    const orderMap = {
      recentes: 'i.created_at DESC',
      menor_preco: 'COALESCE(i.preco_venda, i.preco_locacao) ASC',
      maior_preco: 'COALESCE(i.preco_venda, i.preco_locacao) DESC',
    };
    const orderBy = orderMap[ordenar] || orderMap.recentes;

    const whereClause = conditions.join(' AND ');
    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM imoveis i
       INNER JOIN finalidades f ON f.id = i.finalidade_id
       INNER JOIN situacoes_imovel s ON s.id = i.situacao_id
       WHERE ${whereClause}`,
      params
    );

    params.push(Number(limit), offset);
    const dataResult = await pool.query(
      `SELECT
        i.id, i.codigo_referencia, i.titulo, i.cidade, i.bairro, i.estado,
        i.preco_venda, i.preco_locacao, i.destaque,
        i.area_total, i.quartos, i.suites, i.banheiros, i.vagas_garagem,
        t.nome AS tipo_nome,
        f.codigo AS finalidade_codigo, f.nome AS finalidade_nome,
        (SELECT url FROM imovel_fotos pf WHERE pf.imovel_id = i.id AND pf.is_principal = TRUE LIMIT 1) AS foto_principal
      FROM imoveis i
      INNER JOIN tipos_imovel t ON t.id = i.tipo_imovel_id
      INNER JOIN finalidades f ON f.id = i.finalidade_id
      INNER JOIN situacoes_imovel s ON s.id = i.situacao_id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return {
      itens: dataResult.rows,
      total: countResult.rows[0].total,
      pagina: Math.max(1, Number(page)),
      totalPaginas: Math.ceil(countResult.rows[0].total / Number(limit)) || 1,
    };
  },

  async findByCodigoPublico(codigo) {
    const { rows } = await pool.query(
      `SELECT
        i.id, i.codigo_referencia, i.titulo, i.descricao,
        i.preco_venda, i.preco_locacao, i.valor_condominio, i.valor_iptu,
        i.cep, i.estado, i.cidade, i.bairro, i.logradouro, i.numero, i.complemento,
        i.exibir_endereco_completo,
        i.area_total, i.area_construida, i.quartos, i.suites, i.banheiros, i.vagas_garagem,
        i.diferenciais, i.created_at,
        t.nome AS tipo_nome,
        f.codigo AS finalidade_codigo, f.nome AS finalidade_nome,
        s.codigo AS situacao_codigo, s.nome AS situacao_nome
      FROM imoveis i
      INNER JOIN tipos_imovel t ON t.id = i.tipo_imovel_id
      INNER JOIN finalidades f ON f.id = i.finalidade_id
      INNER JOIN situacoes_imovel s ON s.id = i.situacao_id
      WHERE UPPER(i.codigo_referencia) = UPPER($1)
        AND i.deleted_at IS NULL
        AND i.publicado = TRUE
        AND s.visivel_publico = TRUE`,
      [codigo]
    );
    return rows[0] || null;
  },

  async listarOpcoesFiltroPublico() {
    const [locais, tipos, finalidades] = await Promise.all([
      pool.query(`
        SELECT DISTINCT i.cidade, i.bairro
        FROM imoveis i
        INNER JOIN situacoes_imovel s ON s.id = i.situacao_id
        WHERE i.deleted_at IS NULL AND i.publicado = TRUE AND s.visivel_publico = TRUE
        ORDER BY i.cidade ASC, i.bairro ASC
      `),
      pool.query('SELECT id, nome FROM tipos_imovel WHERE ativo = TRUE ORDER BY nome ASC'),
      pool.query('SELECT id, codigo, nome FROM finalidades ORDER BY id ASC'),
    ]);

    return {
      locais: locais.rows,
      tipos_imovel: tipos.rows,
      finalidades: finalidades.rows,
    };
  },
};
-- ============================================================================
-- MIGRATION 001: ESTRUTURA INICIAL DO BANCO DE DADOS - VISTA LIVRE IMÓVEIS
-- ============================================================================

-- Função para atualizar automaticamente a coluna updated_at
CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Usuários / Funcionários autorizados
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL DEFAULT 'CORRETOR'
        CHECK (perfil IN ('ADMIN', 'CORRETOR')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios;
CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

-- 2. Tipos de Imóvel (Domínio)
CREATE TABLE IF NOT EXISTS tipos_imovel (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(60) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Finalidades de Negociação (Domínio)
CREATE TABLE IF NOT EXISTS finalidades (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE
        CHECK (codigo IN ('VENDA', 'LOCACAO', 'AMBAS')),
    nome VARCHAR(50) NOT NULL
);

-- 4. Situações do Imóvel (Domínio: Disponível, Vendido, Alugado)
CREATE TABLE IF NOT EXISTS situacoes_imovel (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE
        CHECK (codigo IN ('DISPONIVEL', 'VENDIDO', 'ALUGADO')),
    nome VARCHAR(50) NOT NULL,
    visivel_publico BOOLEAN NOT NULL DEFAULT FALSE
);

-- 5. Imóveis (Entidade Central)
CREATE TABLE IF NOT EXISTS imoveis (
    id SERIAL PRIMARY KEY,
    codigo_referencia VARCHAR(20) NOT NULL UNIQUE,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT NOT NULL,

    tipo_imovel_id INTEGER NOT NULL REFERENCES tipos_imovel(id) ON DELETE RESTRICT,
    finalidade_id INTEGER NOT NULL REFERENCES finalidades(id) ON DELETE RESTRICT,
    situacao_id INTEGER NOT NULL REFERENCES situacoes_imovel(id) ON DELETE RESTRICT,

    publicado BOOLEAN NOT NULL DEFAULT FALSE,
    destaque BOOLEAN NOT NULL DEFAULT FALSE,

    -- Valores financeiros
    preco_venda NUMERIC(12, 2) NULL CHECK (preco_venda IS NULL OR preco_venda > 0),
    preco_locacao NUMERIC(12, 2) NULL CHECK (preco_locacao IS NULL OR preco_locacao > 0),
    valor_condominio NUMERIC(10, 2) NULL CHECK (valor_condominio IS NULL OR valor_condominio >= 0),
    valor_iptu NUMERIC(10, 2) NULL CHECK (valor_iptu IS NULL OR valor_iptu >= 0),

    -- Localização
    cep VARCHAR(9) NULL,
    estado CHAR(2) NOT NULL DEFAULT 'SP',
    cidade VARCHAR(100) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    logradouro VARCHAR(180) NULL,
    numero VARCHAR(20) NULL,
    complemento VARCHAR(100) NULL,
    exibir_endereco_completo BOOLEAN NOT NULL DEFAULT FALSE,

    -- Características físicas
    area_total NUMERIC(10, 2) NULL CHECK (area_total IS NULL OR area_total > 0),
    area_construida NUMERIC(10, 2) NULL CHECK (area_construida IS NULL OR area_construida > 0),
    quartos SMALLINT NOT NULL DEFAULT 0 CHECK (quartos >= 0),
    suites SMALLINT NOT NULL DEFAULT 0 CHECK (suites >= 0),
    banheiros SMALLINT NOT NULL DEFAULT 0 CHECK (banheiros >= 0),
    vagas_garagem SMALLINT NOT NULL DEFAULT 0 CHECK (vagas_garagem >= 0),
    diferenciais JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Auditoria e arquivamento seguro
    criado_por INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    atualizado_por INTEGER NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,

    -- Garante ao menos um preço cadastrado
    CONSTRAINT chk_imovel_ao_menos_um_preco
        CHECK (preco_venda IS NOT NULL OR preco_locacao IS NOT NULL)
);

DROP TRIGGER IF EXISTS trg_imoveis_updated_at ON imoveis;
CREATE TRIGGER trg_imoveis_updated_at
    BEFORE UPDATE ON imoveis
    FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

-- Índices para acelerar filtros do catálogo público e painel administrativo
CREATE INDEX IF NOT EXISTS idx_imoveis_listagem_publica
    ON imoveis (publicado, situacao_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_imoveis_cidade_bairro
    ON imoveis (cidade, bairro);
CREATE INDEX IF NOT EXISTS idx_imoveis_finalidade_tipo
    ON imoveis (finalidade_id, tipo_imovel_id);

-- 6. Fotografias dos Imóveis (Metadados apontando para o Supabase Storage)
CREATE TABLE IF NOT EXISTS imovel_fotos (
    id SERIAL PRIMARY KEY,
    imovel_id INTEGER NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    storage_key VARCHAR(255) NOT NULL,
    legenda VARCHAR(150) NULL,
    is_principal BOOLEAN NOT NULL DEFAULT FALSE,
    ordem SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_imovel_fotos_imovel_id
    ON imovel_fotos (imovel_id, ordem);

-- Garante que cada imóvel tenha no máximo UMA foto marcada como principal
CREATE UNIQUE INDEX IF NOT EXISTS idx_imovel_foto_principal_unica
    ON imovel_fotos (imovel_id)
    WHERE is_principal = TRUE;
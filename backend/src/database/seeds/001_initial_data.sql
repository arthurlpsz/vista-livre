-- ============================================================================
-- SEED 001: TABELAS DE DOMÍNIO INICIAIS - VISTA LIVRE IMÓVEIS
-- ============================================================================

INSERT INTO tipos_imovel (nome) VALUES
    ('Apartamento'),
    ('Casa'),
    ('Sobrado'),
    ('Cobertura'),
    ('Kitnet / Studio'),
    ('Terreno'),
    ('Sala Comercial'),
    ('Galpão')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO finalidades (codigo, nome) VALUES
    ('VENDA', 'Venda'),
    ('LOCACAO', 'Locação'),
    ('AMBAS', 'Venda e Locação')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO situacoes_imovel (codigo, nome, visivel_publico) VALUES
    ('DISPONIVEL', 'Disponível', TRUE),
    ('VENDIDO', 'Vendido', FALSE),
    ('ALUGADO', 'Alugado', FALSE)
ON CONFLICT (codigo) DO NOTHING;
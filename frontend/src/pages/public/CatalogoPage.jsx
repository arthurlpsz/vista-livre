async function buscarCatalogoComValores(valores, paginaAlvo = 1) {
    setCarregando(true);
    try {
      const { data } = await api.get('/public/imoveis', {
        params: {
          busca: valores.busca || undefined,
          finalidade: valores.finalidade || undefined,
          tipo_imovel_id: valores.tipoImovelId || undefined,
          cidade: valores.cidade || undefined,
          bairro: valores.bairro || undefined,
          preco_min: valores.precoMin || undefined,
          preco_max: valores.precoMax || undefined,
          ordenar: valores.ordenar || 'recentes',
          page: paginaAlvo,
          limit: 9,
        },
      });
      setImoveis(data.itens);
      setPaginacao({ pagina: data.pagina, totalPaginas: data.totalPaginas, total: data.total });
    } catch {
      setImoveis([]);
    } finally {
      setCarregando(false);
    }
  }

  function limparFiltros() {
    const limpo = {
      busca: '',
      finalidade: '',
      tipoImovelId: '',
      cidade: '',
      bairro: '',
      precoMin: '',
      precoMax: '',
      ordenar: 'recentes',
    };
    setBusca('');
    setFinalidade('');
    setTipoImovelId('');
    setCidade('');
    setBairro('');
    setPrecoMin('');
    setPrecoMax('');
    setOrdenar('recentes');
    setSearchParams({});
    buscarCatalogoComValores(limpo, 1);
  }
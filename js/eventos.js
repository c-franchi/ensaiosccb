document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Iniciando Eventos ===');
    
    // Verificar se há dados de login
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    
    if (!ccbEnsaioType || !ccbLocalidade) {
        console.log('Usuário não está logado, redirecionando para login');
        window.location.href = 'login.html';
        return;
    }

    // Atualizar informações da localidade
    const localidadeInfo = document.getElementById('localidade-info');
    if (localidadeInfo) {
        localidadeInfo.textContent = `${ccbEnsaioType === 'regional' ? 'Ensaio Regional' : 'Ensaio Local'} - ${ccbLocalidade}`;
    }

    // Carregar eventos
    carregarEventos();
});

function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarTipoPresenca(tipo) {
    const tipos = {
        'anciao': 'Ancião',
        'cooperador': 'Cooperador',
        'cooperadorJovens': 'Cooperador de Jovens',
        'encarregadoRegional': 'Encarregado Regional',
        'encarregadoLocal': 'Encarregado Local',
        'examinadora': 'Examinadora',
        'irmaos': 'Irmãos',
        'irmas': 'Irmãs'
    };
    return tipos[tipo] || tipo;
}

function exibirDetalhesEnsaio(ensaio) {
    const detalhesContainer = document.getElementById('detalhes-ensaio');
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    
    let presencasHtml = '';
    if (ccbEnsaioType === 'regional') {
        presencasHtml = `
            <div class="accordion" id="presencasAccordion">
                <!-- Presenças de Serviço -->
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#presencasServico">
                            Presenças de Serviço
                        </button>
                    </h2>
                    <div id="presencasServico" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <ul class="list-group">
                                ${Object.entries(ensaio.presencas).map(([tipo, dados]) => {
                                    if (tipo === 'irmaos' || tipo === 'irmas') return '';
                                    if (tipo === 'encarregadoRegional' || tipo === 'encarregadoLocal' || tipo === 'examinadora') return '';
                                    return `
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            ${formatarTipoPresenca(tipo)}
                                            <span class="badge bg-primary rounded-pill">${dados.quantidade}</span>
                                        </li>
                                        ${dados.nomes ? `
                                            <li class="list-group-item">
                                                <small class="text-muted">${dados.nomes}</small>
                                            </li>
                                        ` : ''}
                                    `;
                                }).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Encarregados e Examinadora -->
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#encarregadosExaminadora">
                            Encarregados e Examinadora
                        </button>
                    </h2>
                    <div id="encarregadosExaminadora" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <ul class="list-group">
                                ${Object.entries(ensaio.presencas).map(([tipo, dados]) => {
                                    if (tipo === 'irmaos' || tipo === 'irmas') return '';
                                    if (tipo === 'encarregadoRegional' || tipo === 'encarregadoLocal' || tipo === 'examinadora') {
                                        return `
                                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                                ${formatarTipoPresenca(tipo)}
                                                <span class="badge bg-primary rounded-pill">${dados.quantidade}</span>
                                            </li>
                                            ${dados.nomes ? `
                                                <li class="list-group-item">
                                                    <small class="text-muted">${dados.nomes}</small>
                                                </li>
                                            ` : ''}
                                        `;
                                    }
                                    return '';
                                }).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Irmãos e Irmãs -->
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#irmaosIrmas">
                            Irmãos e Irmãs
                        </button>
                    </h2>
                    <div id="irmaosIrmas" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Irmãos
                                    <span class="badge bg-primary rounded-pill">${ensaio.presencas.irmaos}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Irmãs
                                    <span class="badge bg-primary rounded-pill">${ensaio.presencas.irmas}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        presencasHtml = `
            <div class="accordion" id="presencasAccordion">
                <!-- Presenças de Serviço -->
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#presencasServico">
                            Presenças de Serviço
                        </button>
                    </h2>
                    <div id="presencasServico" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <ul class="list-group">
                                ${Object.entries(ensaio.presencas).map(([tipo, quantidade]) => {
                                    if (tipo === 'irmaos' || tipo === 'irmas') return '';
                                    if (tipo === 'encarregadoRegional' || tipo === 'encarregadoLocal' || tipo === 'examinadora') return '';
                                    return `
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            ${formatarTipoPresenca(tipo)}
                                            <span class="badge bg-primary rounded-pill">${quantidade}</span>
                                        </li>
                                    `;
                                }).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Encarregados e Examinadora -->
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#encarregadosExaminadora">
                            Encarregados e Examinadora
                        </button>
                    </h2>
                    <div id="encarregadosExaminadora" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <ul class="list-group">
                                ${Object.entries(ensaio.presencas).map(([tipo, quantidade]) => {
                                    if (tipo === 'irmaos' || tipo === 'irmas') return '';
                                    if (tipo === 'encarregadoRegional' || tipo === 'encarregadoLocal' || tipo === 'examinadora') {
                                        return `
                                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                                ${formatarTipoPresenca(tipo)}
                                                <span class="badge bg-primary rounded-pill">${quantidade}</span>
                                            </li>
                                        `;
                                    }
                                    return '';
                                }).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Irmãos e Irmãs -->
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#irmaosIrmas">
                            Irmãos e Irmãs
                        </button>
                    </h2>
                    <div id="irmaosIrmas" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Irmãos
                                    <span class="badge bg-primary rounded-pill">${ensaio.presencas.irmaos}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Irmãs
                                    <span class="badge bg-primary rounded-pill">${ensaio.presencas.irmas}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    detalhesContainer.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Detalhes do Ensaio</h5>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Data:</strong> ${formatarData(ensaio.data)}</p>
                        <p><strong>Igreja:</strong> ${ensaio.igreja}</p>
                        <p><strong>Tipo:</strong> ${formatarTipoEnsaio(ensaio.tipo)}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Palavra:</strong> ${ensaio.palavra.livro} ${ensaio.palavra.capitulo}:${ensaio.palavra.versiculo}</p>
                        <p><strong>Observações:</strong> ${ensaio.observacoes || 'Nenhuma'}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        ${presencasHtml}
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Hinos</h6>
                        <ul class="list-group">
                            ${ensaio.hinos.map(hino => `
                                <li class="list-group-item">${hino}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Instrumentos</h6>
                        <ul class="list-group">
                            ${Object.entries(ensaio.instrumentos).map(([instrumento, quantidade]) => `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    ${formatarNomeInstrumento(instrumento)}
                                    <span class="badge bg-primary rounded-pill">${quantidade}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function carregarEventos() {
    console.log("Iniciando carregamento de eventos");
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    const chaveLocalidade = `ensaios_${ccbLocalidade.toLowerCase().replace(/\s+/g, '_')}`;
    
    try {
        // Carregar eventos apenas do localStorage
        let eventos = JSON.parse(localStorage.getItem(chaveLocalidade) || '[]');
        console.log("Eventos do localStorage:", eventos);
        
        // Filtrar apenas eventos ativos ou sem status definido (para compatibilidade)
        eventos = eventos.filter(evento => !evento.status || evento.status === 'ativo');
        console.log("Eventos filtrados:", eventos);
        
        // Ordenar por data (mais recente primeiro)
        eventos.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        // Renderizar eventos
        const eventosContainer = document.getElementById('eventos-container');
        if (!eventosContainer) return;
        
        if (eventos.length === 0) {
            eventosContainer.innerHTML = `
                <div class="alert alert-info">
                    Nenhum ensaio encontrado para esta localidade.
                </div>
            `;
            return;
        }
        
        eventosContainer.innerHTML = eventos.map((evento, index) => {
            // Calcular totais e porcentagens
            const instrumentos = evento.instrumentos || {};
            const totalInstrumentos = Object.values(instrumentos).reduce((a, b) => a + b, 0);
            
            // Calcular porcentagens
            const porcentagens = {
                cordas: (instrumentos.violino || 0) + (instrumentos.viola || 0) + 
                       (instrumentos.violoncelo || 0),
                madeiras: (instrumentos.flauta || 0) + (instrumentos.oboe || 0) + 
                       (instrumentos.oboeAmore || 0) + (instrumentos.corneIngles || 0) + 
                       (instrumentos.clarinete || 0) + (instrumentos.clarineteAlto || 0) + 
                       (instrumentos.clarineteBaixo || 0) + (instrumentos.fagote || 0) +
                       (instrumentos.saxSoprano || 0) + (instrumentos.saxAlto || 0) + 
                       (instrumentos.saxTenor || 0) + (instrumentos.saxBaritono || 0),
                metais: (instrumentos.trompete || 0) + (instrumentos.flugelhorn || 0) + 
                       (instrumentos.trompa || 0) + (instrumentos.trombone || 0) + 
                       (instrumentos.baritono || 0) + (instrumentos.eufonio || 0) + 
                       (instrumentos.tuba || 0),
                outros: (instrumentos.organistas || 0) + (instrumentos.acordeon || 0) + (instrumentos['nao-inclusos'] || 0)
            };
            
            // Calcular porcentagens
            Object.keys(porcentagens).forEach(categoria => {
                porcentagens[categoria + 'Pct'] = totalInstrumentos > 0 
                    ? Math.round((porcentagens[categoria] / totalInstrumentos) * 100) 
                    : 0;
            });
            
            // Preparar dados específicos baseado no tipo de ensaio
            let dadosEspecificos = '';
            if (evento.tipo === 'regional') {
                dadosEspecificos = `
                    <p><strong>Atendimento Ancião:</strong> ${evento.atendimentoAnciao || 'Não informado'}</p>
                    <p><strong>Regência Regional 1:</strong> ${evento.regencia1 || 'Não informado'}</p>
                    <p><strong>Regência Regional 2:</strong> ${evento.regencia2 || 'Não informado'}</p>
                    <p><strong>Examinadora:</strong> ${evento.examinadora || 'Não informado'}</p>
                    <p><strong>Palavra:</strong> ${evento.palavra?.livro || 'Não informado'} ${evento.palavra?.capitulo || ''} ${evento.palavra?.versiculo || ''}</p>
                `;
            } else {
                dadosEspecificos = `
                    <p><strong>Atendimento Ensaio:</strong> ${evento.atendimentoEnsaio || 'Não informado'}</p>
                    <p><strong>Regência Local 1:</strong> ${evento.regenciaLocal1?.nome || 'Não informado'} (${evento.regenciaLocal1?.tipo === 'regional' ? 'Regional' : 'Local'})</p>
                    <p><strong>Regência Local 2:</strong> ${evento.regenciaLocal2?.nome || 'Não informado'} (${evento.regenciaLocal2?.tipo === 'regional' ? 'Regional' : 'Local'})</p>
                `;
            }
            
            // Preparar lista de hinos
            const hinos = evento.hinos || [];
            const hinosList = hinos.map(hino => {
                if (hino.startsWith('Abertura:')) {
                    return `<li class="list-group-item"><strong>Hino de Abertura:</strong> ${hino.replace('Abertura:', '').trim()}</li>`;
                }
                return `<li class="list-group-item">Hino ${hino}</li>`;
            }).join('');
            
            // Preparar presenças
            let presencasHtml = '';
            if (evento.presencas) {
                // Calcular total de presenças
                let totalPresencas = 0;
                Object.entries(evento.presencas).forEach(([tipo, dados]) => {
                    if (typeof dados === 'object') {
                        totalPresencas += dados.quantidade || 0;
                    } else {
                        totalPresencas += dados || 0;
                    }
                });
                
                // Identificadores únicos para este evento
                const presencasId = `presencas-${index}`;
                const presencasServicoId = `presencasServico-${index}`;
                const encarregadosExaminadoraId = `encarregadosExaminadora-${index}`;
                const irmaosIrmasId = `irmaosIrmas-${index}`;
                
                if (evento.tipo === 'regional') {
                    presencasHtml = `
                        <div class="row mt-3">
                            <div class="col-12">
                                <h6>Presenças <span class="badge bg-primary">${totalPresencas} total</span></h6>
                                <div class="accordion" id="${presencasId}">
                                    <!-- Presenças de Serviço -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${presencasServicoId}">
                                                Presenças de Serviço
                                            </button>
                                        </h2>
                                        <div id="${presencasServicoId}" class="accordion-collapse collapse" data-bs-parent="#${presencasId}">
                                            <div class="accordion-body">
                                                <ul class="list-group">
                                                    ${Object.entries(evento.presencas).filter(([tipo]) => 
                                                        !['irmaos', 'irmas', 'encarregadoRegional', 'encarregadoLocal', 'examinadora'].includes(tipo)
                                                    ).map(([tipo, valor]) => `
                                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                                            ${formatarTipoPresenca(tipo)}
                                                            <span class="badge bg-primary rounded-pill">${valor || 0}</span>
                                                        </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Encarregados e Examinadora -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${encarregadosExaminadoraId}">
                                                Encarregados e Examinadora
                                            </button>
                                        </h2>
                                        <div id="${encarregadosExaminadoraId}" class="accordion-collapse collapse" data-bs-parent="#${presencasId}">
                                            <div class="accordion-body">
                                                <ul class="list-group">
                                                    ${Object.entries(evento.presencas).filter(([tipo]) => 
                                                        ['encarregadoRegional', 'encarregadoLocal', 'examinadora'].includes(tipo)
                                                    ).map(([tipo, valor]) => `
                                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                                            ${formatarTipoPresenca(tipo)}
                                                            <span class="badge bg-primary rounded-pill">${valor || 0}</span>
                                                        </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Irmãos e Irmãs -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${irmaosIrmasId}">
                                                Irmãos e Irmãs
                                            </button>
                                        </h2>
                                        <div id="${irmaosIrmasId}" class="accordion-collapse collapse" data-bs-parent="#${presencasId}">
                                            <div class="accordion-body">
                                                <ul class="list-group">
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        Irmãos
                                                        <span class="badge bg-primary rounded-pill">${evento.presencas.irmaos || 0}</span>
                                                    </li>
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        Irmãs
                                                        <span class="badge bg-primary rounded-pill">${evento.presencas.irmas || 0}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    presencasHtml = `
                        <div class="row mt-3">
                            <div class="col-12">
                                <h6>Presenças <span class="badge bg-primary">${totalPresencas} total</span></h6>
                                <div class="accordion" id="${presencasId}">
                                    <!-- Presenças de Serviço -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${presencasServicoId}">
                                                Presenças de Serviço
                                            </button>
                                        </h2>
                                        <div id="${presencasServicoId}" class="accordion-collapse collapse" data-bs-parent="#${presencasId}">
                                            <div class="accordion-body">
                                                <ul class="list-group">
                                                    ${Object.entries(evento.presencas).filter(([tipo]) => 
                                                        !['irmaos', 'irmas', 'encarregadoRegional', 'encarregadoLocal', 'examinadora'].includes(tipo)
                                                    ).map(([tipo, valor]) => `
                                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                                            ${formatarTipoPresenca(tipo)}
                                                            <span class="badge bg-primary rounded-pill">${valor || 0}</span>
                                                        </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Encarregados e Examinadora -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${encarregadosExaminadoraId}">
                                                Encarregados e Examinadora
                                            </button>
                                        </h2>
                                        <div id="${encarregadosExaminadoraId}" class="accordion-collapse collapse" data-bs-parent="#${presencasId}">
                                            <div class="accordion-body">
                                                <ul class="list-group">
                                                    ${Object.entries(evento.presencas).filter(([tipo]) => 
                                                        ['encarregadoRegional', 'encarregadoLocal', 'examinadora'].includes(tipo)
                                                    ).map(([tipo, valor]) => `
                                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                                            ${formatarTipoPresenca(tipo)}
                                                            <span class="badge bg-primary rounded-pill">${valor || 0}</span>
                                                        </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Irmãos e Irmãs -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${irmaosIrmasId}">
                                                Irmãos e Irmãs
                                            </button>
                                        </h2>
                                        <div id="${irmaosIrmasId}" class="accordion-collapse collapse" data-bs-parent="#${presencasId}">
                                            <div class="accordion-body">
                                                <ul class="list-group">
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        Irmãos
                                                        <span class="badge bg-primary rounded-pill">${evento.presencas.irmaos || 0}</span>
                                                    </li>
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        Irmãs
                                                        <span class="badge bg-primary rounded-pill">${evento.presencas.irmas || 0}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
            
            return `
                <div class="card mb-3">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            ${formatarData(evento.data)}
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12 col-md-6">
                                <h6>Informações Gerais</h6>
                                <div class="accordion" id="accordion-info-${evento.id}">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-info-${evento.id}">
                                                Detalhes do Ensaio
                                            </button>
                                        </h2>
                                        <div id="collapse-info-${evento.id}" class="accordion-collapse collapse show" data-bs-parent="#accordion-info-${evento.id}">
                                            <div class="accordion-body p-2">
                                                <p class="mb-2"><strong>Igreja:</strong> ${evento.igreja || evento.localidade}</p>
                                                ${dadosEspecificos}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <h6>Contagem de Instrumentos</h6>
                                <div class="accordion" id="accordion-${evento.id}">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${evento.id}">
                                                Detalhes da Contagem
                                            </button>
                                        </h2>
                                        <div id="collapse-${evento.id}" class="accordion-collapse collapse" data-bs-parent="#accordion-${evento.id}">
                                            <div class="accordion-body p-2">
                                                <div class="row g-2">
                                                    <div class="col-12 col-sm-6">
                                                        <p class="mb-1"><strong>Cordas:</strong> ${porcentagens.cordas} (${porcentagens.cordasPct}%)</p>
                                                        <div class="d-flex flex-wrap">
                                                            <span class="badge bg-secondary me-1 mb-1">Violino: ${instrumentos.violino || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Viola: ${instrumentos.viola || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Violoncelo: ${instrumentos.violoncelo || 0}</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 col-sm-6">
                                                        <p class="mb-1"><strong>Madeiras:</strong> ${porcentagens.madeiras} (${porcentagens.madeirasPct}%)</p>
                                                        <div class="d-flex flex-wrap">
                                                            <span class="badge bg-secondary me-1 mb-1">Flauta: ${instrumentos.flauta || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Oboé: ${instrumentos.oboe || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Oboé D'Amore: ${instrumentos.oboeAmore || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Corne Inglês: ${instrumentos.corneIngles || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Clarinete: ${instrumentos.clarinete || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Clarinete Alto: ${instrumentos.clarineteAlto || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Clarinete Baixo: ${instrumentos.clarineteBaixo || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Fagote: ${instrumentos.fagote || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Sax Soprano: ${instrumentos.saxSoprano || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Sax Alto: ${instrumentos.saxAlto || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Sax Tenor: ${instrumentos.saxTenor || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Sax Barítono: ${instrumentos.saxBaritono || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row g-2 mt-2">
                                                    <div class="col-12 col-sm-6">
                                                        <p class="mb-1"><strong>Metais:</strong> ${porcentagens.metais} (${porcentagens.metaisPct}%)</p>
                                                        <div class="d-flex flex-wrap">
                                                            <span class="badge bg-secondary me-1 mb-1">Trompete/Cornet: ${instrumentos.trompete || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Flugelhorn: ${instrumentos.flugelhorn || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Trompa: ${instrumentos.trompa || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Trombone/Trombonito: ${instrumentos.trombone || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Barítono: ${instrumentos.baritono || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Eufônio: ${instrumentos.eufonio || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Tuba: ${instrumentos.tuba || 0}</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 col-sm-6">
                                                        <p class="mb-1"><strong>Outros:</strong> ${porcentagens.outros} (${porcentagens.outrosPct}%)</p>
                                                        <div class="d-flex flex-wrap">
                                                            <span class="badge bg-secondary me-1 mb-1">Organistas: ${instrumentos.organistas || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Acordeon: ${instrumentos.acordeon || 0}</span>
                                                            <span class="badge bg-secondary me-1 mb-1">Não inclusos no MOO: ${instrumentos['nao-inclusos'] || 0}</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 col-sm-6">
                                                        <p class="mb-1"><strong>Total de Instrumentos:</strong> ${totalInstrumentos}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row g-3 mt-2">
                            <div class="col-12">
                                <h6>Hinos</h6>
                                <div class="accordion" id="accordion-hinos-${evento.id}">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-hinos-${evento.id}">
                                                Lista de Hinos
                                            </button>
                                        </h2>
                                        <div id="collapse-hinos-${evento.id}" class="accordion-collapse collapse" data-bs-parent="#accordion-hinos-${evento.id}">
                                            <div class="accordion-body p-2">
                                                <ul class="list-group">
                                                    ${hinosList}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        ${presencasHtml}
                        
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="d-flex flex-wrap gap-2">
                                    <button class="btn btn-primary" onclick="editarEnsaio('${evento.id}')">Editar</button>
                                    <button class="btn btn-danger" onclick="excluirEnsaio('${evento.id}')">Excluir</button>
                                    <button class="btn btn-success" onclick="gerarPDF(${JSON.stringify(evento).replace(/"/g, '&quot;')})">Gerar PDF</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        const eventosContainer = document.getElementById('eventos-container');
        if (eventosContainer) {
            eventosContainer.innerHTML = `
                <div class="alert alert-danger">
                    Erro ao carregar os eventos. Por favor, tente novamente.
                </div>
            `;
        }
    }
}

function editarEnsaio(ensaioId) {
    window.location.href = `dadosensaio.html?id=${ensaioId}`;
}

function excluirEnsaio(id) {
    // Usar SweetAlert2 para confirmar a exclusão
    Swal.fire({
        title: 'Confirmar exclusão',
        text: 'Tem certeza que deseja excluir este ensaio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                const ccbLocalidade = localStorage.getItem('ccbLocalidade');
                const chaveLocalidade = `ensaios_${ccbLocalidade.toLowerCase().replace(/\s+/g, '_')}`;
                
                // Salvar status 'excluido' no localStorage
                let eventos = JSON.parse(localStorage.getItem(chaveLocalidade) || '[]');
                eventos = eventos.map(evento => {
                    if (evento.id === id) {
                        return { ...evento, status: 'excluido' };
                    }
                    return evento;
                });
                localStorage.setItem(chaveLocalidade, JSON.stringify(eventos));
                
                // Remover do sessionStorage
                eventos = JSON.parse(sessionStorage.getItem(chaveLocalidade) || '[]');
                eventos = eventos.map(evento => {
                    if (evento.id === id) {
                        return { ...evento, status: 'excluido' };
                    }
                    return evento;
                });
                sessionStorage.setItem(chaveLocalidade, JSON.stringify(eventos));
                
                // Notificar sucesso e recarregar a página
                Swal.fire({
                    title: 'Excluído!',
                    text: 'O ensaio foi excluído com sucesso.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.reload();
                });
            } catch (error) {
                console.error('Erro ao excluir ensaio:', error);
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao excluir o ensaio. Por favor, tente novamente.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    });
}

function gerarPDF(evento) {
    // Mostrar loading com SweetAlert2
    Swal.fire({
        title: 'Gerando PDF',
        text: 'Por favor, aguarde...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Verificar se html2pdf.js está carregado
    if (typeof html2pdf === 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'A biblioteca html2pdf.js não está carregada corretamente.',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    // Chamada para a função de geração de PDF (definida em gerarPdf.js)
    try {
        window.gerarPDF(evento)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'PDF gerado com sucesso!',
                    confirmButtonText: 'OK'
                });
            })
            .catch(error => {
                console.error('Erro ao gerar PDF:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.',
                    confirmButtonText: 'OK'
                });
            });
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao gerar o PDF. Por favor, verifique se o html2pdf.js está carregado corretamente.',
            confirmButtonText: 'OK'
        });
    }
} 
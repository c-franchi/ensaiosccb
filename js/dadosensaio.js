document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Iniciando Dados do Ensaio ===');
    
    // Mostrar mensagem de status
    mostrarStatus('Inicializando...');
    
    // Verificar se há dados de login
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    
    if (!ccbEnsaioType || !ccbLocalidade) {
        console.log('Usuário não está logado, redirecionando para login');
        mostrarStatus('Usuário não está logado, redirecionando...');
        window.location.href = 'login.html';
        return;
    }

    // Obter ID do ensaio da URL
    const urlParams = new URLSearchParams(window.location.search);
    const ensaioId = urlParams.get('id');
    
    if (!ensaioId) {
        console.error('ID do ensaio não encontrado');
        mostrarStatus('ID do ensaio não encontrado, redirecionando...');
        window.location.href = 'eventos.html';
        return;
    }

    console.log('ID do ensaio:', ensaioId);
    mostrarStatus('Carregando ensaio ID: ' + ensaioId);

    // Atualizar informações da localidade
    const localidadeInfo = document.getElementById('localidade-info');
    if (localidadeInfo) {
        localidadeInfo.textContent = `${ccbEnsaioType === 'regional' ? 'Ensaio Regional' : 'Ensaio Local'} - ${ccbLocalidade}`;
    }

    // Carregar dados do ensaio
    carregarDadosEnsaio(ensaioId);

    // Configurar campos específicos baseado no tipo de ensaio
    const camposRegional = document.getElementById('campos-regional');
    const camposLocal = document.getElementById('campos-local');
    const hinoAberturaContainer = document.getElementById('hino-abertura-container');
    
    if (ccbEnsaioType === 'regional') {
        camposRegional.classList.remove('d-none');
        camposLocal.classList.add('d-none');
        if (hinoAberturaContainer) hinoAberturaContainer.classList.remove('d-none');
    } else {
        camposRegional.classList.add('d-none');
        camposLocal.classList.remove('d-none');
        if (hinoAberturaContainer) hinoAberturaContainer.classList.add('d-none');
    }

    // adicionado para esconder palavra em ensaio local    
        const palavraContainer = document.getElementById('palavra-container');
    if (palavraContainer) {
        if (ccbEnsaioType === 'local') {
            palavraContainer.classList.add('d-none');
        } else {
            palavraContainer.classList.remove('d-none');
        }
    }

    
    // Configurar eventos de hinos
    const addHinoBtn = document.getElementById('add-hino-btn');
    const hinoInput = document.getElementById('hino-input');
    const hinosList = document.getElementById('hinos-list');
    const addHinoAberturaBtn = document.getElementById('add-hino-abertura-btn');
    const hinoAberturaInput = document.getElementById('hino-abertura');

    if (addHinoBtn && hinoInput && hinosList) {
        addHinoBtn.addEventListener('click', () => adicionarHino(hinoInput, hinosList));
        hinoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adicionarHino(hinoInput, hinosList);
            }
        });
    }

    if (addHinoAberturaBtn && hinoAberturaInput) {
        addHinoAberturaBtn.addEventListener('click', () => adicionarHinoAbertura(hinoAberturaInput));
        hinoAberturaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adicionarHinoAbertura(hinoAberturaInput);
            }
        });
    }

    // Configurar eventos para demais presenças
    const addAnciaoBtn = document.getElementById('add-anciao-btn');
    const anciaoInput = document.getElementById('anciao-input');
    const ancioesList = document.getElementById('ancioes-list');

    const addEncRegionalBtn = document.getElementById('add-enc-regional-btn');
    const encRegionalInput = document.getElementById('enc-regional-input');
    const encRegionaisList = document.getElementById('enc-regionais-list');

    const addExaminadoraBtn = document.getElementById('add-examinadora-btn');
    const examinadoraInput = document.getElementById('examinadora-input');
    const examinadorasList = document.getElementById('examinadoras-list');

    if (addAnciaoBtn && anciaoInput && ancioesList) {
        addAnciaoBtn.addEventListener('click', () => adicionarPresenca(anciaoInput, ancioesList, 'anciao'));
        anciaoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adicionarPresenca(anciaoInput, ancioesList, 'anciao');
            }
        });
    }

    if (addEncRegionalBtn && encRegionalInput && encRegionaisList) {
        addEncRegionalBtn.addEventListener('click', () => adicionarPresenca(encRegionalInput, encRegionaisList, 'enc-regional'));
        encRegionalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adicionarPresenca(encRegionalInput, encRegionaisList, 'enc-regional');
            }
        });
    }

    if (addExaminadoraBtn && examinadoraInput && examinadorasList) {
        addExaminadoraBtn.addEventListener('click', () => adicionarPresenca(examinadoraInput, examinadorasList, 'examinadora'));
        examinadoraInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adicionarPresenca(examinadoraInput, examinadorasList, 'examinadora');
            }
        });
    }

    // Ocultar mensagem de status quando tudo estiver pronto
    setTimeout(() => {
        ocultarStatus();
    }, 2000);
});

// Função para mostrar status na página
function mostrarStatus(mensagem) {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.textContent = mensagem;
        statusElement.classList.remove('d-none');
        statusElement.classList.remove('alert-danger');
        statusElement.classList.add('alert-info');
    }
    console.log('Status:', mensagem);
}

// Função para mostrar erro na página
function mostrarErro(mensagem) {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.textContent = mensagem;
        statusElement.classList.remove('d-none');
        statusElement.classList.remove('alert-info');
        statusElement.classList.add('alert-danger');
    }
    console.error('Erro:', mensagem);
}

// Função para ocultar status
function ocultarStatus() {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.classList.add('d-none');
    }
}

function carregarDadosEnsaio(ensaioId) {
    console.log('Carregando dados do ensaio:', ensaioId);
    
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    const chaveLocalidade = `ensaios_${ccbLocalidade.toLowerCase().replace(/\s+/g, '_')}`;
    
    try {
        // Buscar dados do ensaio
        let eventos = JSON.parse(localStorage.getItem(chaveLocalidade) || '[]');
        let ensaio = eventos.find(e => e.id === ensaioId);
        
        if (!ensaio) {
            // Tentar buscar no sessionStorage
            eventos = JSON.parse(sessionStorage.getItem(chaveLocalidade) || '[]');
            ensaio = eventos.find(e => e.id === ensaioId);
        }
        
        if (!ensaio) {
            mostrarErro('Ensaio não encontrado!');
            return;
        }
        
        console.log('Dados do ensaio carregados:', ensaio);
        
        // Preencher formulário
        document.getElementById('data').value = ensaio.data;
        document.getElementById('igreja').value = ensaio.igreja || ensaio.localidade;
        
        // Tipo do ensaio
        const tipoEnsaio = ensaio.tipo;
        const camposRegional = document.getElementById('campos-regional');
        const camposLocal = document.getElementById('campos-local');
        
        if (tipoEnsaio === 'regional') {
            camposRegional.classList.remove('d-none');
            camposLocal.classList.add('d-none');
            
            // Preencher campos específicos para ensaio regional
            document.getElementById('atendimento-anciao').value = ensaio.atendimentoAnciao || '';
            document.getElementById('regencia1').value = ensaio.regencia1 || '';
            document.getElementById('regencia2').value = ensaio.regencia2 || '';
            document.getElementById('examinadora').value = ensaio.examinadora || '';
        } else {
            camposRegional.classList.add('d-none');
            camposLocal.classList.remove('d-none');
            
            // Preencher campos específicos para ensaio local
            document.getElementById('atendimento-ensaio').value = ensaio.atendimentoEnsaio || '';
            document.getElementById('regencia-local1').value = ensaio.regenciaLocal1 || '';
            document.getElementById('regencia-local2').value = ensaio.regenciaLocal2 || '';
        }
        
        // Preencher dados da Palavra
        if (ensaio.palavra) {
            document.getElementById('palavra-livro').value = ensaio.palavra.livro || '';
            document.getElementById('palavra-capitulo').value = ensaio.palavra.capitulo || '';
            document.getElementById('palavra-versiculo').value = ensaio.palavra.versiculo || '';
        }
        
        // Preencher instrumentos
        if (ensaio.instrumentos) {
            console.log('Preenchendo instrumentos:', ensaio.instrumentos);
            Object.entries(ensaio.instrumentos).forEach(([id, valor]) => {
                const input = document.getElementById(id);
                if (input) {
                    input.value = valor;
                } else {
                    console.warn(`Campo instrumento #${id} não encontrado no DOM`);
                }
            });
        } else {
            console.warn('Objeto instrumentos não encontrado no ensaio');
        }
        
        // Preencher hinos
        const hinosList = document.getElementById('hinos-list');
        hinosList.innerHTML = '';
        
        if (ensaio.hinos && ensaio.hinos.length > 0) {
            ensaio.hinos.forEach(hino => {
                if (hino.startsWith('Abertura:')) {
                    const hinoNum = hino.replace('Abertura:', '').trim();
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center hino-abertura';
                    li.innerHTML = `
                        <strong>Hino de Abertura:</strong> ${hinoNum}
                        <button class="btn btn-danger btn-sm" onclick="removerHino(this)">Remover</button>
                    `;
                    hinosList.appendChild(li);
                } else {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.innerHTML = `
                        Hino ${hino}
                        <button class="btn btn-danger btn-sm" onclick="removerHino(this)">Remover</button>
                    `;
                    hinosList.appendChild(li);
                }
            });
        }
        
        // Preencher demais presenças
        if (ensaio.demaisPresencas) {
            // Anciões
            const ancioesList = document.getElementById('ancioes-list');
            ancioesList.innerHTML = '';
            if (ensaio.demaisPresencas.ancioes && ensaio.demaisPresencas.ancioes.length > 0) {
                ensaio.demaisPresencas.ancioes.forEach(anciao => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.dataset.tipo = 'anciao';
                    li.innerHTML = `
                        ${anciao}
                        <button class="btn btn-danger btn-sm" onclick="removerPresenca(this)">Remover</button>
                    `;
                    ancioesList.appendChild(li);
                });
            }
            
            // Encarregados Regionais
            const encRegionaisList = document.getElementById('enc-regionais-list');
            encRegionaisList.innerHTML = '';
            if (ensaio.demaisPresencas.encRegionais && ensaio.demaisPresencas.encRegionais.length > 0) {
                ensaio.demaisPresencas.encRegionais.forEach(encRegional => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.dataset.tipo = 'enc-regional';
                    li.innerHTML = `
                        ${encRegional}
                        <button class="btn btn-danger btn-sm" onclick="removerPresenca(this)">Remover</button>
                    `;
                    encRegionaisList.appendChild(li);
                });
            }
            
            // Examinadoras
            const examinadorasList = document.getElementById('examinadoras-list');
            examinadorasList.innerHTML = '';
            if (ensaio.demaisPresencas.examinadoras && ensaio.demaisPresencas.examinadoras.length > 0) {
                ensaio.demaisPresencas.examinadoras.forEach(examinadora => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.dataset.tipo = 'examinadora';
                    li.innerHTML = `
                        ${examinadora}
                        <button class="btn btn-danger btn-sm" onclick="removerPresenca(this)">Remover</button>
                    `;
                    examinadorasList.appendChild(li);
                });
            }
            
            // Observações
            if (ensaio.observacoes) {
                document.getElementById('observacoes').value = ensaio.observacoes;
            }
        }
        
        document.getElementById('ensaio-id').value = ensaioId;
        ocultarStatus();
    } catch (error) {
        console.error('Erro ao carregar ensaio:', error);
        mostrarErro('Erro ao carregar os dados do ensaio!');
    }
}

// Funções para incremento/decremento de presença
function increment(id) {
    const input = document.getElementById(id);
    if (!input) {
        console.error(`Elemento com ID ${id} não encontrado`);
        return;
    }
    
    let val = parseInt(input.value, 10) || 0;
    val++;
    input.value = val;
    
    // Registrar a mudança no console para debug
    console.log(`Incrementado ${id} para ${val}`);
}

function decrement(id) {
    const input = document.getElementById(id);
    if (!input) {
        console.error(`Elemento com ID ${id} não encontrado`);
        return;
    }
    
    let val = parseInt(input.value, 10) || 0;
    if (val > 0) {
        val--;
        input.value = val;
        
        // Registrar a mudança no console para debug
        console.log(`Decrementado ${id} para ${val}`);
    }
}

// Função para adicionar hino de abertura
function adicionarHinoAbertura(input) {
    const hino = input.value.trim();
    
    if (!hino) return;
    
    // Remover hino de abertura anterior se existir
    const hinoAberturaAnterior = document.querySelector('.hino-abertura');
    if (hinoAberturaAnterior) {
        hinoAberturaAnterior.remove();
    }
    
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center hino-abertura';
    li.innerHTML = `
        <strong>Hino de Abertura:</strong> ${hino}
        <button class="btn btn-danger btn-sm" onclick="removerHino(this)">Remover</button>
    `;
    document.getElementById('hinos-list').insertBefore(li, document.getElementById('hinos-list').firstChild);
    input.value = '';
}

// Função para adicionar hino
function adicionarHino(input, lista) {
    const hino = input.value.trim();
    
    if (!hino) return;
    
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
        Hino ${hino}
        <button class="btn btn-danger btn-sm" onclick="removerHino(this)">Remover</button>
    `;
    lista.appendChild(li);
    input.value = '';
}

// Função para remover hino
function removerHino(button) {
    button.closest('li').remove();
}

function adicionarPresenca(input, lista, tipo) {
    const nome = input.value.trim();
    if (!nome) return;

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
        ${nome}
        <button class="btn btn-danger btn-sm" onclick="removerPresenca(this)">Remover</button>
    `;
    li.dataset.tipo = tipo;
    lista.appendChild(li);
    input.value = '';
}

function removerPresenca(button) {
    button.closest('li').remove();
}

function salvarAlteracoes() {
    mostrarStatus('Preparando para salvar alterações...');
    
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    const urlParams = new URLSearchParams(window.location.search);
    const ensaioId = urlParams.get('id');
    
    if (!ensaioId) {
        mostrarErro('ID do ensaio não encontrado!');
        return;
    }
    
    // Coletar dados básicos
    const data = document.getElementById('data').value;
    const igreja = document.getElementById('igreja').value;
    
    if (!data || !igreja) {
        mostrarErro('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Coletar dados específicos baseado no tipo de ensaio
    let dadosEspecificos = {};
    if (ccbEnsaioType === 'regional') {
        dadosEspecificos = {
            atendimentoAnciao: document.getElementById('atendimento-anciao').value,
            regencia1: document.getElementById('regencia1').value,
            regencia2: document.getElementById('regencia2').value,
            examinadora: document.getElementById('examinadora').value,
        };
    } else {
        dadosEspecificos = {
            atendimentoEnsaio: document.getElementById('atendimento-ensaio').value,
            regenciaLocal1: document.getElementById('regencia-local1').value,
            regenciaLocal2: document.getElementById('regencia-local2').value
        };
    }

    // Coletar instrumentos
    const instrumentos = {};
    const instrumentosIds = [
        // Cordas
        'violino', 'viola', 'violoncelo',
        // Madeiras (incluindo saxofones)
        'flauta', 'oboe', 'oboeAmore', 'corneIngles', 'clarinete', 'clarineteAlto', 
        'clarineteBaixo', 'fagote', 'saxSoprano', 'saxAlto', 'saxTenor', 'saxBaritono',
        // Metais
        'trompete', 'flugelhorn', 'trompa', 'trombone', 'baritono', 'eufonio', 'tuba',
        // Outros
        'organistas', 'acordeon', 'nao-inclusos'
    ];

    instrumentosIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            instrumentos[id] = parseInt(input.value, 10) || 0;
        }
    });

    // Coletar hinos
    const hinos = [];
    const hinoAbertura = document.querySelector('.hino-abertura');
    if (hinoAbertura) {
        const hinoAberturaText = hinoAbertura.textContent.trim();
        const hinoAberturaNum = hinoAberturaText.replace('Hino de Abertura:', '').replace('Remover', '').trim();
        hinos.push(`Abertura: ${hinoAberturaNum}`);
    }
    
    document.querySelectorAll('#hinos-list li:not(.hino-abertura)').forEach(li => {
        const hinoText = li.textContent.trim();
        const hinoNum = hinoText.replace('Hino ', '').replace('Remover', '').trim();
        hinos.push(hinoNum);
    });

    // Coletar demais presenças
    const demaisPresencas = {
        ancioes: [],
        encRegionais: [],
        examinadoras: []
    };

    document.querySelectorAll('#ancioes-list li').forEach(li => {
        demaisPresencas.ancioes.push(li.textContent.trim().replace('Remover', '').trim());
    });

    document.querySelectorAll('#enc-regionais-list li').forEach(li => {
        demaisPresencas.encRegionais.push(li.textContent.trim().replace('Remover', '').trim());
    });

    document.querySelectorAll('#examinadoras-list li').forEach(li => {
        demaisPresencas.examinadoras.push(li.textContent.trim().replace('Remover', '').trim());
    });

    // Coletar observações
    const observacoesInput = document.getElementById('observacoes');
    const observacoes = observacoesInput ? observacoesInput.value.trim() : '';

    // Coletar dados da Palavra
    const palavraLivro = document.getElementById('palavra-livro');
    const palavraCapitulo = document.getElementById('palavra-capitulo');
    const palavraVersiculo = document.getElementById('palavra-versiculo');
    
    const palavra = {
        livro: palavraLivro ? palavraLivro.value.trim() : '',
        capitulo: palavraCapitulo ? palavraCapitulo.value.trim() : '',
        versiculo: palavraVersiculo ? palavraVersiculo.value.trim() : ''
    };

    // Criar objeto do ensaio atualizado
    const ensaioAtualizado = {
        id: ensaioId,
        data: data,
        igreja: igreja,
        tipo: ccbEnsaioType,
        localidade: ccbLocalidade,
        status: 'ativo',
        ...dadosEspecificos,
        instrumentos: instrumentos,
        hinos: hinos,
        demaisPresencas: demaisPresencas,
        observacoes: observacoes,
        palavra: palavra,
        dataCriacao: new Date().toISOString()
    };

    try {
        mostrarStatus('Salvando alterações...');
        console.log('Ensaio atualizado:', ensaioAtualizado);
        
        // Criar chave única para a localidade
        const chaveLocalidade = `ensaios_${ccbLocalidade.toLowerCase().replace(/\s+/g, '_')}`;
        
        // Atualizar no localStorage
        let ensaios = JSON.parse(localStorage.getItem(chaveLocalidade) || '[]');
        const index = ensaios.findIndex(e => e.id === ensaioId);
        
        if (index !== -1) {
            ensaios[index] = ensaioAtualizado;
            localStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
            console.log(`Ensaio atualizado no localStorage, índice ${index}`);
        } else {
            console.warn('Ensaio não encontrado no localStorage, adicionando novo');
            ensaios.push(ensaioAtualizado);
            localStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
        }
        
        // Atualizar também no sessionStorage
        ensaios = JSON.parse(sessionStorage.getItem(chaveLocalidade) || '[]');
        const indexSession = ensaios.findIndex(e => e.id === ensaioId);
        
        if (indexSession !== -1) {
            ensaios[indexSession] = ensaioAtualizado;
            sessionStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
            console.log(`Ensaio atualizado no sessionStorage, índice ${indexSession}`);
        } else {
            console.warn('Ensaio não encontrado no sessionStorage, adicionando novo');
            ensaios.push(ensaioAtualizado);
            sessionStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
        }
        
        mostrarStatus('Ensaio atualizado com sucesso!');
        
        // Redirecionar para a página de eventos após breve delay
        setTimeout(() => {
            window.location.href = 'eventos.html';
        }, 1000);
    } catch (error) {
        console.error('Erro ao atualizar ensaio:', error);
        mostrarErro('Erro ao atualizar o ensaio: ' + error.message);
    }
}

function salvarEnsaio() {
    mostrarStatus('Salvando ensaio...');
    
    // Obter ID do ensaio da URL
    const urlParams = new URLSearchParams(window.location.search);
    const ensaioId = urlParams.get('id');
    
    if (!ensaioId) {
        mostrarStatus('ID do ensaio não encontrado, redirecionando...', 'danger');
        alert('ID do ensaio não encontrado!');
        window.location.href = 'eventos.html';
        return;
    }

    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    
    // Coletar dados básicos
    const data = document.getElementById('data').value;
    const igreja = document.getElementById('igreja').value;
    
    if (!data || !igreja) {
        mostrarStatus('Campos obrigatórios faltando', 'warning');
        Swal.fire({
            icon: 'warning',
            title: 'Campos obrigatórios',
            text: 'Por favor, preencha todos os campos obrigatórios.',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Coletar dados específicos baseado no tipo de ensaio
    let dadosEspecificos = {};
    if (ccbEnsaioType === 'regional') {
        dadosEspecificos = {
            atendimentoAnciao: document.getElementById('atendimento-anciao').value,
            regencia1: document.getElementById('regencia1').value,
            regencia2: document.getElementById('regencia2').value,
            examinadora: document.getElementById('examinadora').value
        };
    } else {
        dadosEspecificos = {
            atendimentoEnsaio: document.getElementById('atendimento-ensaio').value,
            regenciaLocal1: document.getElementById('regencia-local1').value,
            regenciaLocal2: document.getElementById('regencia-local2').value
        };
    }

    // Coletar instrumentos
    const instrumentos = {};
    const instrumentosIds = [
        // Cordas
        'violino', 'viola', 'violoncelo',
        // Madeiras (incluindo saxofones)
        'flauta', 'oboe', 'oboeAmore', 'corneIngles', 'clarinete', 'clarineteAlto', 
        'clarineteBaixo', 'fagote', 'saxSoprano', 'saxAlto', 'saxTenor', 'saxBaritono',
        // Metais
        'trompete', 'flugelhorn', 'trompa', 'trombone', 'baritono', 'eufonio', 'tuba',
        // Outros
        'organistas', 'acordeon', 'nao-inclusos'
    ];

    instrumentosIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            instrumentos[id] = parseInt(input.value, 10) || 0;
        }
    });

    // Coletar hinos
    const hinos = [];
    const hinoAbertura = document.querySelector('.hino-abertura');
    if (hinoAbertura) {
        const hinoAberturaText = hinoAbertura.textContent.trim();
        const hinoAberturaNum = hinoAberturaText.replace('Hino de Abertura:', '').replace('Remover', '').trim();
        hinos.push(`Abertura: ${hinoAberturaNum}`);
    }
    
    document.querySelectorAll('#hinos-list li:not(.hino-abertura)').forEach(li => {
        const hinoText = li.textContent.trim();
        const hinoNum = hinoText.replace('Hino ', '').replace('Remover', '').trim();
        hinos.push(hinoNum);
    });

    // Coletar demais presenças
    const demaisPresencas = {
        ancioes: [],
        encRegionais: [],
        examinadoras: []
    };

    document.querySelectorAll('#ancioes-list li').forEach(li => {
        demaisPresencas.ancioes.push(li.textContent.trim().replace('Remover', '').trim());
    });

    document.querySelectorAll('#enc-regionais-list li').forEach(li => {
        demaisPresencas.encRegionais.push(li.textContent.trim().replace('Remover', '').trim());
    });

    document.querySelectorAll('#examinadoras-list li').forEach(li => {
        demaisPresencas.examinadoras.push(li.textContent.trim().replace('Remover', '').trim());
    });

    // Coletar observações
    const observacoesInput = document.getElementById('observacoes');
    const observacoes = observacoesInput ? observacoesInput.value.trim() : '';

    // Coletar dados da Palavra
    const palavraLivro = document.getElementById('palavra-livro');
    const palavraCapitulo = document.getElementById('palavra-capitulo');
    const palavraVersiculo = document.getElementById('palavra-versiculo');
    
    const palavra = {
        livro: palavraLivro ? palavraLivro.value.trim() : '',
        capitulo: palavraCapitulo ? palavraCapitulo.value.trim() : '',
        versiculo: palavraVersiculo ? palavraVersiculo.value.trim() : ''
    };

    // Criar objeto do ensaio atualizado
    const ensaioAtualizado = {
        id: ensaioId,
        data: data,
        igreja: igreja,
        tipo: ccbEnsaioType,
        localidade: ccbLocalidade,
        status: 'ativo',
        ...dadosEspecificos,
        instrumentos: instrumentos,
        hinos: hinos,
        demaisPresencas: demaisPresencas,
        observacoes: observacoes,
       // palavra: palavra,
        dataCriacao: new Date().toISOString()
    };

    try {
        mostrarStatus('Salvando alterações...');
        console.log('Ensaio atualizado:', ensaioAtualizado);
        
        // Criar chave única para a localidade
        const chaveLocalidade = `ensaios_${ccbLocalidade.toLowerCase().replace(/\s+/g, '_')}`;
        
        // Atualizar no localStorage
        let ensaios = JSON.parse(localStorage.getItem(chaveLocalidade) || '[]');
        const index = ensaios.findIndex(e => e.id === ensaioId);
        
        if (index !== -1) {
            ensaios[index] = ensaioAtualizado;
            localStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
            console.log(`Ensaio atualizado no localStorage, índice ${index}`);
        } else {
            console.warn('Ensaio não encontrado no localStorage, adicionando novo');
            ensaios.push(ensaioAtualizado);
            localStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
        }
        
        // Atualizar também no sessionStorage
        ensaios = JSON.parse(sessionStorage.getItem(chaveLocalidade) || '[]');
        const indexSession = ensaios.findIndex(e => e.id === ensaioId);
        
        if (indexSession !== -1) {
            ensaios[indexSession] = ensaioAtualizado;
            sessionStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
            console.log(`Ensaio atualizado no sessionStorage, índice ${indexSession}`);
        } else {
            console.warn('Ensaio não encontrado no sessionStorage, adicionando novo');
            ensaios.push(ensaioAtualizado);
            sessionStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
        }
        
        mostrarStatus('Ensaio atualizado com sucesso!');
        
        // Notificar o usuário com SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Ensaio salvo com sucesso!',
            confirmButtonText: 'OK'
        }).then(() => {
            // Redirecionar para a página de eventos
            window.location.href = 'eventos.html';
        });
    } catch (error) {
        console.error('Erro ao salvar ensaio:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Ocorreu um erro ao salvar o ensaio. Por favor, tente novamente.',
            confirmButtonText: 'OK'
        });
    }
} 

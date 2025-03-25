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

    // Atualizar visibilidade dos campos de nomes
    atualizarCamposNomes();
    
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

    const addEncarregadoBtn = document.getElementById('add-encarregado-btn');
    const encarregadoInput = document.getElementById('encarregado-input');
    const encarregadosList = document.getElementById('encarregados-list');

    if (addAnciaoBtn && anciaoInput && ancioesList) {
        addAnciaoBtn.addEventListener('click', () => adicionarPresenca(anciaoInput, ancioesList, 'anciao'));
        anciaoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adicionarPresenca(anciaoInput, ancioesList, 'anciao');
            }
        });
    }

    if (addEncarregadoBtn && encarregadoInput && encarregadosList) {
        addEncarregadoBtn.addEventListener('click', () => adicionarEncarregado(encarregadoInput, encarregadosList));
        encarregadoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adicionarEncarregado(encarregadoInput, encarregadosList);
            }
        });
    }

    // Adicionar listeners para os contadores
    const contadores = ['anciao', 'cooperador', 'cooperadorJovens', 'encarregadoRegional', 
                       'encarregadoLocal', 'examinadora', 'irmaos', 'irmas'];
    
    contadores.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', atualizarTotalPresencas);
        }
    });

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
    mostrarStatus('Carregando dados do ensaio...');
    
    // Guardar o ID do ensaio na sessionStorage para usar depois
    sessionStorage.setItem('ensaioId', ensaioId);
    
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    if (!ccbLocalidade) {
        mostrarErro('Localidade não encontrada');
        return;
    }

    // Criar chave única para a localidade
    const chaveLocalidade = `ensaios_${ccbLocalidade.toLowerCase().replace(/\s+/g, '_')}`;
    
    // Buscar no localStorage
    const ensaios = JSON.parse(localStorage.getItem(chaveLocalidade) || '[]');
    const ensaio = ensaios.find(e => e.id === ensaioId);
    
    if (!ensaio) {
        mostrarErro('Ensaio não encontrado');
        return;
    }

    // Preencher campos básicos
    document.getElementById('data').value = ensaio.data;
    document.getElementById('igreja').value = ensaio.igreja;
    document.getElementById('observacoes').value = ensaio.observacoes || '';

    // Preencher palavra
    if (ensaio.palavra) {
        document.getElementById('palavra-livro').value = ensaio.palavra.livro || '';
        document.getElementById('palavra-capitulo').value = ensaio.palavra.capitulo || '';
        document.getElementById('palavra-versiculo').value = ensaio.palavra.versiculo || '';
    }

    // Preencher campos específicos baseado no tipo
    if (ensaio.tipo === 'regional') {
        document.getElementById('campos-regional').classList.remove('d-none');
        document.getElementById('campos-local').classList.add('d-none');
        document.getElementById('hino-abertura-container').classList.remove('d-none');
        
        document.getElementById('atendimento-anciao').value = ensaio.atendimentoAnciao || '';
        document.getElementById('regencia1').value = ensaio.regencia1 || '';
        document.getElementById('regencia2').value = ensaio.regencia2 || '';
        document.getElementById('examinadora').value = ensaio.examinadora || '';

        // Carregar presenças com nomes
        if (ensaio.presencas) {
            Object.entries(ensaio.presencas).forEach(([tipo, dados]) => {
                const inputQuantidade = document.getElementById(tipo);
                const inputNomes = document.getElementById(`${tipo}-nomes`);
                if (inputQuantidade) inputQuantidade.value = dados.quantidade || 0;
                if (inputNomes) inputNomes.value = dados.nomes || '';
            });
        }
    } else {
        document.getElementById('campos-regional').classList.add('d-none');
        document.getElementById('campos-local').classList.remove('d-none');
        document.getElementById('hino-abertura-container').classList.add('d-none');
        
        document.getElementById('atendimento-ensaio').value = ensaio.atendimentoEnsaio || '';
        
        if (ensaio.regenciaLocal1) {
            document.getElementById('regencia-local1').value = ensaio.regenciaLocal1.nome || '';
            const radio1 = document.querySelector(`input[name="tipo-regencia1"][value="${ensaio.regenciaLocal1.tipo}"]`);
            if (radio1) radio1.checked = true;
        }
        
        if (ensaio.regenciaLocal2) {
            document.getElementById('regencia-local2').value = ensaio.regenciaLocal2.nome || '';
            const radio2 = document.querySelector(`input[name="tipo-regencia2"][value="${ensaio.regenciaLocal2.tipo}"]`);
            if (radio2) radio2.checked = true;
        }

        // Carregar apenas quantidades
        if (ensaio.presencas) {
            Object.entries(ensaio.presencas).forEach(([tipo, quantidade]) => {
                const input = document.getElementById(tipo);
                if (input) input.value = quantidade || 0;
            });
        }
    }

    // Carregar hinos
    const hinosList = document.getElementById('hinos-list');
    if (hinosList) {
        hinosList.innerHTML = '';
        
        if (ensaio.hinoAbertura) {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center hino-abertura';
            li.innerHTML = `
                <strong>Hino de Abertura:</strong> ${ensaio.hinoAbertura}
                <button class="btn btn-danger btn-sm" onclick="removerHino(this)">Remover</button>
            `;
            hinosList.appendChild(li);
        }
        
        if (ensaio.hinos) {
            ensaio.hinos.forEach(hino => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    Hino ${hino}
                    <button class="btn btn-danger btn-sm" onclick="removerHino(this)">Remover</button>
                `;
                hinosList.appendChild(li);
            });
        }
    }

    // Carregar instrumentos
    if (ensaio.instrumentos) {
        Object.entries(ensaio.instrumentos).forEach(([instrumento, quantidade]) => {
            const input = document.getElementById(instrumento);
            if (input) input.value = quantidade;
        });
    }

    ocultarStatus();
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

function adicionarEncarregado(input, lista) {
    const nome = input.value.trim();
    if (!nome) return;

    const tipo = document.querySelector('input[name="tipo-encarregado"]:checked').value;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    
    const span = document.createElement('span');
    span.textContent = `${nome} (${tipo === 'regional' ? 'Regional' : 'Local'})`;
    
    const button = document.createElement('button');
    button.className = 'btn btn-danger btn-sm';
    button.textContent = 'Remover';
    button.onclick = () => removerPresenca(button);
    
    li.appendChild(span);
    li.appendChild(button);
    lista.appendChild(li);
    input.value = '';
}

function salvarAlteracoes() {
    mostrarStatus('Salvando alterações...');
    
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    const ensaioId = sessionStorage.getItem('ensaioId');
    
    if (!ccbEnsaioType || !ccbLocalidade || !ensaioId) {
        mostrarErro('Dados necessários não encontrados!');
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
            presencas: {
                anciao: {
                    quantidade: parseInt(document.getElementById('anciao').value) || 0,
                    nomes: document.getElementById('anciao-nomes').value
                },
                cooperador: {
                    quantidade: parseInt(document.getElementById('cooperador').value) || 0,
                    nomes: document.getElementById('cooperador-nomes').value
                },
                cooperadorJovens: {
                    quantidade: parseInt(document.getElementById('cooperadorJovens').value) || 0,
                    nomes: document.getElementById('cooperadorJovens-nomes').value
                },
                encarregadoRegional: {
                    quantidade: parseInt(document.getElementById('encarregadoRegional').value) || 0,
                    nomes: document.getElementById('encarregadoRegional-nomes').value
                },
                encarregadoLocal: {
                    quantidade: parseInt(document.getElementById('encarregadoLocal').value) || 0,
                    nomes: document.getElementById('encarregadoLocal-nomes').value
                },
                examinadora: {
                    quantidade: parseInt(document.getElementById('examinadora').value) || 0,
                    nomes: document.getElementById('examinadora-nomes').value
                },
                irmaos: parseInt(document.getElementById('irmaos').value) || 0,
                irmas: parseInt(document.getElementById('irmas').value) || 0
            }
        };
    } else {
        dadosEspecificos = {
            atendimentoEnsaio: document.getElementById('atendimento-ensaio').value,
            regenciaLocal1: {
                nome: document.getElementById('regencia-local1').value,
                tipo: document.querySelector('input[name="tipo-regencia1"]:checked').value
            },
            regenciaLocal2: {
                nome: document.getElementById('regencia-local2').value,
                tipo: document.querySelector('input[name="tipo-regencia2"]:checked').value
            },
            presencas: {
                anciao: parseInt(document.getElementById('anciao').value) || 0,
                cooperador: parseInt(document.getElementById('cooperador').value) || 0,
                cooperadorJovens: parseInt(document.getElementById('cooperadorJovens').value) || 0,
                encarregadoRegional: parseInt(document.getElementById('encarregadoRegional').value) || 0,
                encarregadoLocal: parseInt(document.getElementById('encarregadoLocal').value) || 0,
                examinadora: parseInt(document.getElementById('examinadora').value) || 0,
                irmaos: parseInt(document.getElementById('irmaos').value) || 0,
                irmas: parseInt(document.getElementById('irmas').value) || 0
            }
        };
    }

    // Coletar instrumentos
    const instrumentos = {};
    const instrumentosIds = [
        'violino', 'viola', 'violoncelo', 'flauta', 'oboe', 'oboeAmore', 'corneIngles',
        'clarinete', 'clarineteAlto', 'clarineteBaixo', 'fagote', 'saxSoprano', 'saxAlto',
        'saxTenor', 'saxBaritono', 'trompete', 'flugelhorn', 'trompa', 'trombone',
        'baritono', 'eufonio', 'tuba', 'organistas', 'acordeon', 'nao-inclusos'
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

    // Criar objeto do ensaio
    const ensaio = {
        id: ensaioId,
        data: data,
        igreja: igreja,
        tipo: ccbEnsaioType,
        localidade: ccbLocalidade,
        status: 'ativo',
        ...dadosEspecificos,
        instrumentos: instrumentos,
        hinos: hinos,
        observacoes: observacoes,
        palavra: palavra,
        dataCriacao: new Date().toISOString()
    };

    try {
        console.log('Ensaio a ser salvo:', ensaio);
        
        // Criar chave única para a localidade
        const chaveLocalidade = `ensaios_${ccbLocalidade.toLowerCase().replace(/\s+/g, '_')}`;
        
        // Recuperar ensaios existentes
        let ensaios = JSON.parse(localStorage.getItem(chaveLocalidade) || '[]');
        
        // Procurar o ensaio pelo ID
        const index = ensaios.findIndex(e => e.id === ensaioId);
        
        if (index !== -1) {
            // Substituir o ensaio existente
            ensaios[index] = ensaio;
        } else {
            // Adicionar novo ensaio
            ensaios.push(ensaio);
        }
        
        // Salvar no localStorage
        localStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
        console.log('Ensaio salvo com sucesso no localStorage');
        
        // Mostrar mensagem de sucesso
        mostrarStatus('Alterações salvas com sucesso!');
        Swal.fire({
            title: 'Sucesso!',
            text: 'Alterações salvas com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'eventos.html';
            }
        });
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        mostrarErro('Erro ao salvar as alterações: ' + error.message);
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
            regenciaLocal1: {
                nome: document.getElementById('regencia-local1').value,
                tipo: document.querySelector('input[name="tipo-regencia1"]:checked').value
            },
            regenciaLocal2: {
                nome: document.getElementById('regencia-local2').value,
                tipo: document.querySelector('input[name="tipo-regencia2"]:checked').value
            }
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

function atualizarTotalPresencas() {
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    let total = 0;
    
    // Lista dos campos que devem ser somados
    const campos = [
        'anciao', 'cooperador', 'cooperadorJovens',
        'encarregadoRegional', 'encarregadoLocal', 'examinadora',
        'irmaos', 'irmas'
    ];
    
    // Somar todos os campos independentemente do tipo de ensaio
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        if (input) {
            total += parseInt(input.value) || 0;
        }
    });
    
    // Atualizar o campo de total
    const totalInput = document.getElementById('total-presencas');
    if (totalInput) {
        totalInput.value = total;
    }
}

function atualizarCamposNomes() {
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    const camposNomes = document.querySelectorAll('[id$="-nomes"]');
    
    camposNomes.forEach(campo => {
        if (campo.id === 'irmaos-nomes' || campo.id === 'irmas-nomes') {
            // Sempre esconder campos de nomes para irmãos e irmãs
            campo.style.display = 'none';
        } else {
            // Mostrar campos de nomes apenas para ensaio regional
            campo.style.display = ccbEnsaioType === 'regional' ? 'block' : 'none';
        }
    });
    
    // Garantir que todos os acordeões estejam visíveis
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.style.display = 'block';
    });
    
    console.log(`Campos de nomes atualizados para ensaio ${ccbEnsaioType}`);
} 

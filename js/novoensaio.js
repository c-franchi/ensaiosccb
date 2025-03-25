// js/novoensaio.js

/**
 * Funções para incremento/decremento de presença
 */
function increment(id) {
  const input = document.getElementById(id);
  if (input) {
    const currentValue = parseInt(input.value) || 0;
    input.value = currentValue + 1;
    atualizarTotalPresencas();
  }
}

function decrement(id) {
  const input = document.getElementById(id);
  if (input) {
    const currentValue = parseInt(input.value) || 0;
    if (currentValue > 0) {
      input.value = currentValue - 1;
      atualizarTotalPresencas();
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Iniciando Novo Ensaio ===');
    
    // Verificar se há dados de login
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    
    if (!ccbEnsaioType || !ccbLocalidade) {
        console.log('Usuário não está logado, redirecionando para login');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('Tipo de ensaio:', ccbEnsaioType);

    // Atualizar informações da localidade
    const localidadeInfo = document.getElementById('localidade-info');
    if (localidadeInfo) {
        localidadeInfo.textContent = `${ccbEnsaioType === 'regional' ? 'Ensaio Regional' : 'Ensaio Local'} - ${ccbLocalidade}`;
    }

    // Preencher campo de igreja automaticamente
    const igrejaInput = document.getElementById('igreja');
    if (igrejaInput) {
        igrejaInput.value = ccbLocalidade;
    }

    // Mostrar/esconder campos específicos baseado no tipo de ensaio
    const camposRegional = document.getElementById('campos-regional');
    const camposLocal = document.getElementById('campos-local');
    const hinoAberturaContainer = document.getElementById('hino-abertura-container');
    
    if (ccbEnsaioType === 'regional') {
        camposRegional.classList.remove('d-none');
        camposLocal.classList.add('d-none');
        if (hinoAberturaContainer) hinoAberturaContainer.classList.remove('d-none');
        
        // Mostrar campos de nomes para todos exceto irmãos e irmãs
        const camposNomes = document.querySelectorAll('.campo-nome');
        camposNomes.forEach(campo => {
            const id = campo.id;
            if (id !== 'irmaos-nomes' && id !== 'irmas-nomes') {
                campo.style.display = 'block';
            } else {
                campo.style.display = 'none';
            }
        });
    } else {
        camposRegional.classList.add('d-none');
        camposLocal.classList.remove('d-none');
        if (hinoAberturaContainer) hinoAberturaContainer.classList.add('d-none');
        
        // Esconder todos os campos de nomes
        const camposNomes = document.querySelectorAll('.campo-nome');
        camposNomes.forEach(campo => {
            campo.style.display = 'none';
        });
    }

    // Adicionado para esconder palavra em ensaio local
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
    
    // Configurar event listener para o botão salvar
    const botaoSalvar = document.getElementById('salvar-ensaio');
    if (botaoSalvar) {
        console.log('Configurando event listener para o botão salvar');
        botaoSalvar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão salvar clicado');
            salvarEnsaio();
        });
    } else {
        console.error('Botão salvar não encontrado');
    }
    
    // Configurar a data atual como default
    const dataInput = document.getElementById('data');
    if (dataInput) {
        const dataAtual = new Date().toISOString().split('T')[0];
        dataInput.value = dataAtual;
    }
    
    // Configurar increment/decrement e cálculos de total
    document.querySelectorAll('.btn-increment, .btn-decrement').forEach(botao => {
        botao.addEventListener('click', function() {
            const acao = this.classList.contains('btn-increment') ? 'increment' : 'decrement';
            const alvo = this.getAttribute('data-target');
            
            if (acao === 'increment') {
                increment(alvo);
            } else {
                decrement(alvo);
            }
        });
    });
    
    // Adicionar listeners para os contadores
    const contadores = ['anciao', 'cooperador', 'cooperadorJovens', 'encarregadoRegional', 
                        'encarregadoLocal', 'examinadora', 'irmaos', 'irmas'];
    
    contadores.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', atualizarTotalPresencas);
        }
    });
    
    // Calcular total inicial
    atualizarTotalPresencas();
});

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

// Função para mostrar/esconder campos de nomes baseado no tipo de ensaio
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

function salvarEnsaio() {
    console.log('Iniciando salvamento do ensaio...');
    mostrarStatus('Salvando ensaio...');
    
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    
    console.log('Tipo de ensaio:', ccbEnsaioType);
    console.log('Localidade:', ccbLocalidade);
    
    if (!ccbEnsaioType || !ccbLocalidade) {
        console.error('Dados necessários não encontrados!');
        mostrarErro('Dados necessários não encontrados!');
        return;
    }

    // Coletar dados básicos
    const data = document.getElementById('data').value;
    const igreja = document.getElementById('igreja').value;
    
    console.log('Data:', data);
    console.log('Igreja:', igreja);
    
    if (!data || !igreja) {
        console.error('Campos obrigatórios não preenchidos!');
        mostrarErro('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Coletar dados específicos baseado no tipo de ensaio
    let dadosEspecificos = {};
    if (ccbEnsaioType === 'regional') {
        // Lógica para ensaio regional
        console.log('Coletando dados para ensaio regional...');
        dadosEspecificos = {
            atendimentoAnciao: document.getElementById('atendimento-anciao').value,
            regencia1: document.getElementById('regencia1').value,
            regencia2: document.getElementById('regencia2').value,
            examinadora: document.getElementById('examinadora-nome').value,
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
        // Lógica para ensaio local
        console.log('Coletando dados para ensaio local...');
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
        id: Date.now().toString(),
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

    console.log('Objeto do ensaio completo:', ensaio);

    try {
        // Criar chave única para a localidade
        const chaveLocalidade = `ensaios_${ccbLocalidade.toLowerCase().replace(/\s+/g, '_')}`;
        console.log('Chave de localidade:', chaveLocalidade);
        
        // Salvar no localStorage
        let ensaios = JSON.parse(localStorage.getItem(chaveLocalidade) || '[]');
        ensaios.push(ensaio);
        localStorage.setItem(chaveLocalidade, JSON.stringify(ensaios));
        console.log('Ensaio salvo no localStorage. Total de ensaios:', ensaios.length);
        
        mostrarStatus('Ensaio salvo com sucesso!', 'success');
        
        // Mostrar mensagem de sucesso
        Swal.fire({
            title: 'Sucesso!',
            text: 'Ensaio salvo com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'eventos.html';
            }
        });
    } catch (error) {
        console.error('Erro ao salvar ensaio:', error);
        mostrarErro('Erro ao salvar o ensaio: ' + error.message);
    }
}

function atualizarTotalPresencas() {
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    let total = 0;
    
    const campos = [
        'anciao', 'cooperador', 'cooperadorJovens',
        'encarregadoRegional', 'encarregadoLocal', 'examinadora',
        'irmaos', 'irmas'
    ];
    
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

function cancelar() {
    window.location.href = 'eventos.html';
}

// Função para mostrar status na página
function mostrarStatus(mensagem, tipo = 'info') {
    const statusEl = document.getElementById('status-message');
    if (statusEl) {
        statusEl.textContent = mensagem;
        statusEl.className = `alert alert-${tipo}`;
        statusEl.classList.remove('d-none');
        
        // Esconder a mensagem após 5 segundos se for uma mensagem de sucesso
        if (tipo === 'success') {
            setTimeout(() => {
                statusEl.classList.add('d-none');
            }, 5000);
        }
    } else {
        console.warn('Elemento de status não encontrado');
    }
}

// Função para mostrar erro na página
function mostrarErro(mensagem) {
    console.error(mensagem);
    mostrarStatus(mensagem, 'danger');
}

// Função para ocultar status
function ocultarStatus() {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.classList.add('d-none');
    }
}

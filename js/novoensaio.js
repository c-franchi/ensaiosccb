// js/novoensaio.js

/**
 * Funções para incremento/decremento de presença
 */
function increment(id) {
  const input = document.getElementById(id);
  let val = parseInt(input.value, 10) || 0;
  val++;
  input.value = val;
}

function decrement(id) {
  const input = document.getElementById(id);
  let val = parseInt(input.value, 10) || 0;
  if (val > 0) {
    val--;
    input.value = val;
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

    // Configurar formulário
    const form = document.getElementById('novo-ensaio-form');
    if (form) {
        form.addEventListener('submit', function(e) {
    e.preventDefault();
            console.log('Formulário submetido');
            
            salvarEnsaio();
        });
    } else {
        console.error('Formulário não encontrado');
    }
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

function salvarEnsaio() {
    const ccbEnsaioType = localStorage.getItem('ccbEnsaioType');
    const ccbLocalidade = localStorage.getItem('ccbLocalidade');
    
    // Coletar dados básicos
    const data = document.getElementById('data').value;
    const igreja = document.getElementById('igreja').value;
    
    if (!data || !igreja) {
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
    const observacoes = document.getElementById('observacoes').value.trim();

    // Coletar dados da Palavra
    const palavra = {
        livro: document.getElementById('palavra-livro').value.trim(),
        capitulo: document.getElementById('palavra-capitulo').value.trim(),
        versiculo: document.getElementById('palavra-versiculo').value.trim()
    };

    try {
        // Gerar ID único para o ensaio
        const ensaioId = Date.now().toString();
        
        // Criar objeto do ensaio
        const ensaio = {
            id: ensaioId,
            data: data,
            igreja: igreja,
            localidade: igreja,
            tipo: ccbEnsaioType,
            status: 'ativo',
            ...dadosEspecificos,
            instrumentos: instrumentos,
            hinos: hinos,
            palavra: palavra,
            demaisPresencas: demaisPresencas,
            observacoes: observacoes,
            dataCriacao: new Date().toISOString()
        };
        
        // Salvar no localStorage
        const chaveLocalidade = `ensaios_${ccbLocalidade.toLowerCase().replace(/\s+/g, '_')}`;
        let eventos = JSON.parse(localStorage.getItem(chaveLocalidade) || '[]');
        eventos.push(ensaio);
        localStorage.setItem(chaveLocalidade, JSON.stringify(eventos));
        
        // Salvar no sessionStorage para acesso rápido
        eventos = JSON.parse(sessionStorage.getItem(chaveLocalidade) || '[]');
        eventos.push(ensaio);
        sessionStorage.setItem(chaveLocalidade, JSON.stringify(eventos));
        
        console.log('Ensaio salvo com sucesso:', ensaio);
        
        // Mostrar mensagem de sucesso
        Swal.fire({
            icon: 'success',
            title: 'Ensaio salvo!',
            text: 'O ensaio foi registrado com sucesso.',
            confirmButtonText: 'OK'
        }).then(() => {
            // Redirecionar para a página de eventos
            window.location.href = 'eventos.html';
        });
    } catch (error) {
        console.error('Erro ao salvar ensaio:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao salvar o ensaio. Por favor, tente novamente.',
            confirmButtonText: 'OK'
        });
    }
}

function cancelar() {
    window.location.href = 'eventos.html';
}

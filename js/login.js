document.addEventListener('DOMContentLoaded', () => {
    console.log('=== Iniciando Login ===');
    
    // Limpa dados anteriores ao iniciar
    localStorage.clear();
    console.log('LocalStorage limpo ao iniciar');
    
    const ensaioType = document.getElementById('ensaioType');
    const regionalGroup = document.getElementById('regional-group');
    const localGroup = document.getElementById('local-group');
    const loginForm = document.getElementById('login-form');

    // Verifica se já está logado
    const tipoSalvo = localStorage.getItem('ccbEnsaioType');
    const localidadeSalva = localStorage.getItem('ccbLocalidade');
    
    console.log('Verificando login existente:', { tipoSalvo, localidadeSalva });
    
    if (tipoSalvo && localidadeSalva) {
        console.log('Login encontrado, redirecionando para eventos');
        window.location.href = 'eventos.html';
        return;
    }

    // Gerencia a visibilidade dos grupos baseado no tipo de ensaio
    ensaioType.addEventListener('change', () => {
        const tipo = ensaioType.value;
        console.log('Tipo de ensaio selecionado:', tipo);
        
        if (tipo === 'regional') {
            regionalGroup.classList.remove('d-none');
            localGroup.classList.add('d-none');
            document.getElementById('regional-select').required = true;
            document.getElementById('local-select').required = false;
        } else if (tipo === 'local') {
            regionalGroup.classList.add('d-none');
            localGroup.classList.remove('d-none');
            document.getElementById('regional-select').required = false;
            document.getElementById('local-select').required = true;
        } else {
            regionalGroup.classList.add('d-none');
            localGroup.classList.add('d-none');
            document.getElementById('regional-select').required = false;
            document.getElementById('local-select').required = false;
        }
    });

    // Handler do formulário de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Formulário submetido');
        
        const tipo = ensaioType.value;
        let localidade = '';
        
        if (tipo === 'regional') {
            localidade = document.getElementById('regional-select').value;
        } else if (tipo === 'local') {
            localidade = document.getElementById('local-select').value;
        }
        
        console.log('Dados do formulário:', { tipo, localidade });
        
        if (!tipo || !localidade) {
            alert('Por favor, selecione o tipo de ensaio e a localidade.');
            return;
        }

        try {
            // Gera um ID único para o usuário se não existir
            if (!localStorage.getItem('ccbUsuarioId')) {
                localStorage.setItem('ccbUsuarioId', 'user_' + Date.now());
            }

            // Salva dados no localStorage
            localStorage.setItem('ccbEnsaioType', tipo);
            localStorage.setItem('ccbLocalidade', localidade);
            
            console.log('Dados salvos com sucesso');
            
            // Redireciona para a página de eventos
            window.location.href = 'eventos.html';
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro ao salvar os dados. Por favor, tente novamente.');
        }
    });

    console.log('Login inicializado com sucesso');
});
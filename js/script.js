// js/script.js

/**
 * Classe principal que gerencia o Dashboard.
 */
class DashboardApp {
    constructor() {
      // Elementos do DOM para manipulação
      this.totalEnsaiosEl = document.getElementById('total-ensaios');
      this.musicosUltimoEl = document.getElementById('musicos-ultimo');
      this.ultimoEnsaioEl = document.getElementById('ultimo-ensaio');
      this.naipeDestaqueEl = document.getElementById('naipe-destaque');
  
      // Elementos para porcentagem de naipes
      this.percCordasEl = document.getElementById('perc-cordas');
      this.percMadeirasEl = document.getElementById('perc-madeiras');
      this.percMetaisEl = document.getElementById('perc-metais');
      this.percOutrosEl = document.getElementById('perc-outros');
  
      // Elementos para ensaios recentes
      this.ensaiosRecentesBody = document.getElementById('ensaios-recentes');
      this.nenhumEnsaioMsg = document.getElementById('nenhum-ensaio');
  
      // Dados de ensaio (mock). Em um projeto real, poderia vir de localStorage ou de uma API
      this.ensaioData = [
        {
          data: '2025-01-10',
          local: 'NOVA EUROPA - CENTRAL',
          ministerio: 'Anciães, Diáconos, Cooperadores',
          totalMusicos: 120,
          naipes: {
            cordas: 50,
            madeiras: 30,
            metais: 35,
            outros: 5
          }
        },
        {
          data: '2025-02-15',
          local: 'NOVA EUROPA - CENTRAL',
          ministerio: 'Anciães, Cooperadores de Jovens',
          totalMusicos: 90,
          naipes: {
            cordas: 40,
            madeiras: 20,
            metais: 25,
            outros: 5
          }
        }
      ];
  
      // Inicializa o dashboard
      this.initDashboard();
  
      // Configura o botão para togglar a sidebar
      this.initSidebarToggle();
    }
  
    /**
     * Inicializa o dashboard, calculando estatísticas e populando o DOM.
     */
    initDashboard() {
      // Se não houver ensaios, mostra a mensagem e sai
      if (this.ensaioData.length === 0) {
        this.showNoEnsaioMessage();
        return;
      }
  
      // 1. Total de Ensaios
      this.totalEnsaiosEl.textContent = this.ensaioData.length;
  
      // 2. Último Ensaio (pega o mais recente da lista - no exemplo, assume que o último item é o mais recente)
      const ultimoEnsaio = this.ensaioData[this.ensaioData.length - 1];
      this.ultimoEnsaioEl.textContent = ultimoEnsaio.data;
  
      // 3. Músicos no Último Ensaio
      this.musicosUltimoEl.textContent = ultimoEnsaio.totalMusicos;
  
      // 4. Naipe Destaque (o que tiver a maior quantidade no último ensaio)
      const naipeDestaque = this.calcularNaipeDestaque(ultimoEnsaio.naipes);
      this.naipeDestaqueEl.textContent = naipeDestaque.nome;
  
      // 5. Porcentagens de Naipes
      const naipesPercentuais = this.calcularPercentuais(ultimoEnsaio.naipes);
      this.percCordasEl.textContent = naipesPercentuais.cordas + '%';
      this.percMadeirasEl.textContent = naipesPercentuais.madeiras + '%';
      this.percMetaisEl.textContent = naipesPercentuais.metais + '%';
      this.percOutrosEl.textContent = naipesPercentuais.outros + '%';
  
      // 6. Listar Ensaios Recentes na Tabela
      this.popularEnsaiosRecentes();
    }
  
    /**
     * Mostra a mensagem de "Nenhum ensaio registrado" e esconde a tabela.
     */
    showNoEnsaioMessage() {
      this.nenhumEnsaioMsg.style.display = 'block';
      this.ensaiosRecentesBody.innerHTML = '';
    }
  
    /**
     * Popula a tabela de "Ensaios Recentes" usando os dados do array `ensaioData`.
     */
    popularEnsaiosRecentes() {
      this.ensaiosRecentesBody.innerHTML = '';
      this.nenhumEnsaioMsg.style.display = 'none';
  
      // Exemplo: exibe todos os ensaios na tabela
      this.ensaioData.forEach((ensaio) => {
        const tr = document.createElement('tr');
  
        // Data
        const tdData = document.createElement('td');
        tdData.textContent = ensaio.data;
        tr.appendChild(tdData);
  
        // Local
        const tdLocal = document.createElement('td');
        tdLocal.textContent = ensaio.local;
        tr.appendChild(tdLocal);
  
        // Ministério
        const tdMinisterio = document.createElement('td');
        tdMinisterio.textContent = ensaio.ministerio;
        tr.appendChild(tdMinisterio);
  
        // Total de Músicos
        const tdTotal = document.createElement('td');
        tdTotal.textContent = ensaio.totalMusicos;
        tr.appendChild(tdTotal);
  
        this.ensaiosRecentesBody.appendChild(tr);
      });
    }
  
    /**
     * Calcula qual é o naipe com maior quantidade de músicos.
     * @param {Object} naipes - Objeto com contagem de cada naipe.
     * @returns {Object} - { nome: string, valor: number }
     */
    calcularNaipeDestaque(naipes) {
      let maiorValor = 0;
      let naipeNome = 'Cordas';
  
      for (const [nome, valor] of Object.entries(naipes)) {
        if (valor > maiorValor) {
          maiorValor = valor;
          naipeNome = this.capitalize(nome);
        }
      }
  
      return { nome: naipeNome, valor: maiorValor };
    }
  
    /**
     * Calcula o percentual de cada naipe com base no total.
     * @param {Object} naipes - Objeto { cordas, madeiras, metais, outros }
     * @returns {Object} - { cordas: number, madeiras: number, metais: number, outros: number }
     */
    calcularPercentuais(naipes) {
      const total = Object.values(naipes).reduce((acc, val) => acc + val, 0);
      const percentuais = {};
  
      for (const [nome, valor] of Object.entries(naipes)) {
        // Exemplo: (valor / total) * 100
        const perc = total > 0 ? Math.round((valor / total) * 100) : 0;
        percentuais[nome] = perc;
      }
  
      return percentuais;
    }
  
    /**
     * Inicializa o botão de toggle do menu lateral (sidebar).
     */
    initSidebarToggle() {
      const menuToggle = document.getElementById('menu-toggle');
      const wrapper = document.getElementById('wrapper');
  
      menuToggle.addEventListener('click', () => {
        wrapper.classList.toggle('toggled');
      });
    }
  
    /**
     * Função auxiliar para capitalizar a primeira letra.
     * @param {string} str - A string a ser capitalizada.
     */
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
  
  // Quando a página carregar, iniciamos o dashboard
  document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
  });
  
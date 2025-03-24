// Função para formatar a data no padrão brasileiro
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Função para formatar a lista de hinos
function formatarHinos(hinos) {
    if (!hinos || !hinos.length) return '';
    return hinos.join(', ');
}

/**
 * Calcula contagem por naipe e ministério
 */
function calcularInstrumentos(instrumentos) {
    if (!instrumentos) return {};

    // Calcular totais por naipe
    const totais = {
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
        outros: (instrumentos.organistas || 0) + (instrumentos.acordeon || 0) + 
                (instrumentos['nao-inclusos'] || 0)
    };
    
    // Calcular total geral
    totais.total = Object.values(totais).reduce((a, b) => a + b, 0);

    // Calcular porcentagens
    totais.cordasPct = totais.total > 0 ? Math.round((totais.cordas / totais.total) * 100) : 0;
    totais.madeirasPct = totais.total > 0 ? Math.round((totais.madeiras / totais.total) * 100) : 0;
    totais.metaisPct = totais.total > 0 ? Math.round((totais.metais / totais.total) * 100) : 0;
    totais.outrosPct = totais.total > 0 ? Math.round((totais.outros / totais.total) * 100) : 0;

    return totais;
}

async function gerarPDF(evento) {
    console.log('Gerando PDF para o evento:', evento);
    
    return new Promise(async (resolve, reject) => {
        try {
            // Carregar o template
            const response = await fetch('templates/relatorio.html');
            if (!response.ok) {
                throw new Error(`Erro ao carregar o template: ${response.status} ${response.statusText}`);
            }
            
            let template = await response.text();

            // Calcular totais e porcentagens
            const instrumentos = evento.instrumentos || {};
            const totalCordas = (instrumentos.violino || 0) + (instrumentos.viola || 0) + 
                            (instrumentos.violoncelo || 0);
            const totalMadeiras = (instrumentos.flauta || 0) + (instrumentos.clarinete || 0) + 
                                (instrumentos.oboe || 0) + (instrumentos.fagote || 0) + 
                                (instrumentos.saxAlto || 0) + (instrumentos.saxTenor || 0) + 
                                (instrumentos.saxBaritono || 0);
            const totalMetais = (instrumentos.trompete || 0) + (instrumentos.trompa || 0) + 
                            (instrumentos.trombone || 0) + (instrumentos.bombardino || 0) + 
                            (instrumentos.tuba || 0);
            const totalOutros = instrumentos.acordeon || 0;
            const totalNaoInclusos = instrumentos['nao-inclusos'] || 0;
            const totalInstrumentos = totalCordas + totalMadeiras + totalMetais + totalOutros + totalNaoInclusos;

            // Calcular ministério (valores de exemplo, ajustar conforme necessário)
            const qtdeAnciaes = evento.demaisPresencas?.ancioes?.length || 0;
            const qtdeDiaconos = 0; // Não temos esse campo ainda
            const qtdeCooperadores = 0; // Não temos esse campo ainda
            const qtdeCoopDiversos = 0; // Não temos esse campo ainda
            const qtdeEncRegionais = evento.demaisPresencas?.encRegionais?.length || 0;
            const qtdeEncLocais = 0; // Não temos esse campo ainda
            const qtdeExaminadoras = evento.demaisPresencas?.examinadoras?.length || 0;
            const qtdeAdministracao = 0; // Não temos esse campo ainda
            const totalMinisterio = qtdeAnciaes + qtdeDiaconos + qtdeCooperadores + qtdeCoopDiversos + 
                                qtdeEncRegionais + qtdeEncLocais + qtdeExaminadoras + qtdeAdministracao;

            // Separar hinos entre cantado e ensaiados
            const hinos = evento.hinos || [];
            let hinoCantado = '';
            let hinosEnsaiados = [];
            
            hinos.forEach(hino => {
                if (hino.startsWith('Abertura:')) {
                    hinoCantado = hino.replace('Abertura:', '').trim();
                } else {
                    hinosEnsaiados.push(hino);
                }
            });

            // Dados para substituir no template
            const dados = {
                localidade: evento.localidade,
                data: formatarData(evento.data),
                atendimentoAnciao: evento.atendimentoAnciao || '',
                regencia1: evento.regencia1 || '',
                regencia2: evento.regencia2 || '',
                examinadora: evento.examinadora || '',
                
                // Demais presenças
                demaisAncioes: evento.demaisPresencas?.ancioes.join(', ') || '',
                demaisEncRegionais: evento.demaisPresencas?.encRegionais.join(', ') || '',
                demaisExaminadoras: evento.demaisPresencas?.examinadoras.join(', ') || '',
                
                // Instrumentos
                violino: instrumentos.violino || 0,
                viola: instrumentos.viola || 0,
                violoncelo: instrumentos.violoncelo || 0,
                flauta: instrumentos.flauta || 0,
                clarinete: instrumentos.clarinete || 0,
                oboe: instrumentos.oboe || 0,
                fagote: instrumentos.fagote || 0,
                saxAlto: instrumentos.saxAlto || 0,
                saxTenor: instrumentos.saxTenor || 0,
                saxBaritono: instrumentos.saxBaritono || 0,
                trompete: instrumentos.trompete || 0,
                flugelhorn: 0, // Não temos este campo no sistema ainda
                trompa: instrumentos.trompa || 0,
                trombone: instrumentos.trombone || 0,
                bombardino: instrumentos.bombardino || 0,
                tuba: instrumentos.tuba || 0,
                acordeon: instrumentos.acordeon || 0,
                naoInclusos: instrumentos['nao-inclusos'] || 0,
                
                // Totais
                totalCordas: totalCordas,
                totalMadeiras: totalMadeiras,
                totalMetais: totalMetais,
                totalOutros: totalOutros,
                totalNaoInclusos: totalNaoInclusos,
                totalInstrumentos: totalInstrumentos,
                
                // Porcentagens
                percentualCordas: Math.round((totalCordas / totalInstrumentos) * 100) || 0,
                percentualMadeiras: Math.round((totalMadeiras / totalInstrumentos) * 100) || 0,
                percentualMetais: Math.round((totalMetais / totalInstrumentos) * 100) || 0,
                percentualOutros: Math.round((totalOutros / totalInstrumentos) * 100) || 0,
                percentualNaoInclusos: Math.round((totalNaoInclusos / totalInstrumentos) * 100) || 0,
                
                // Organistas
                organistas: instrumentos.organistas || 0,
                
                // Total Geral
                totalGeral: totalInstrumentos + (instrumentos.organistas || 0),
                
                // Ministério
                qtdeAnciaes: qtdeAnciaes,
                qtdeDiaconos: qtdeDiaconos,
                qtdeCooperadores: qtdeCooperadores,
                qtdeCoopDiversos: qtdeCoopDiversos,
                qtdeEncRegionais: qtdeEncRegionais,
                qtdeEncLocais: qtdeEncLocais,
                qtdeExaminadoras: qtdeExaminadoras,
                qtdeAdministracao: qtdeAdministracao,
                totalMinisterio: totalMinisterio,
                
                // Hinos
                hinoCantado: hinoCantado,
                hinosEnsaiados: hinosEnsaiados.join(', '),
                
                // Observação
                observacao: evento.observacoes || ''
            };

            // Substituir as variáveis no template
            Object.keys(dados).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                template = template.replace(regex, dados[key]);
            });

            // Criar um elemento temporário para renderizar o HTML
            const element = document.createElement('div');
            element.innerHTML = template;
            document.body.appendChild(element);

            // Preencher dados adicionais no DOM
            // Palavra
            element.querySelector('#palavra-livro').textContent = evento.palavra?.livro || '';
            element.querySelector('#palavra-capitulo').textContent = evento.palavra?.capitulo || '';
            element.querySelector('#palavra-versiculo').textContent = evento.palavra?.versiculo || '';
            
            // Demais presenças
            element.querySelector('#anciaos').textContent = dados.demaisAncioes;
            element.querySelector('#enc-regionais').textContent = dados.demaisEncRegionais;
            element.querySelector('#examinadoras-outros').textContent = dados.demaisExaminadoras;
            
            // Preencher listas de presenças
            const ancioesPrint = element.querySelector('#ancioes-print');
            if (ancioesPrint && evento.demaisPresencas?.ancioes) {
                evento.demaisPresencas.ancioes.forEach(anciao => {
                    const li = document.createElement('li');
                    li.textContent = anciao;
                    ancioesPrint.appendChild(li);
                });
            }
            
            const encRegionaisPrint = element.querySelector('#enc-regionais-print');
            if (encRegionaisPrint && evento.demaisPresencas?.encRegionais) {
                evento.demaisPresencas.encRegionais.forEach(encRegional => {
                    const li = document.createElement('li');
                    li.textContent = encRegional;
                    encRegionaisPrint.appendChild(li);
                });
            }
            
            const examinadorasPrint = element.querySelector('#examinadoras-print');
            if (examinadorasPrint && evento.demaisPresencas?.examinadoras) {
                evento.demaisPresencas.examinadoras.forEach(examinadora => {
                    const li = document.createElement('li');
                    li.textContent = examinadora;
                    examinadorasPrint.appendChild(li);
                });
            }
            
            // Hinos
            element.querySelector('#hinos-cantados').textContent = dados.hinoCantado;
            element.querySelector('#hinos-ensaiados').textContent = dados.hinosEnsaiados;
            
            // Totais de hinos
            element.querySelector('#total-hinos-cantados').textContent = hinoCantado ? 1 : 0;
            element.querySelector('#total-hinos-ensaiados').textContent = hinosEnsaiados.length;
            
            // Lista de hinos
            const listaHinos = element.querySelector('#lista-hinos');
            if (listaHinos) {
                if (hinoCantado) {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>Hino de Abertura:</strong> ${hinoCantado}`;
                    listaHinos.appendChild(p);
                }
                
                if (hinosEnsaiados.length > 0) {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>Hinos Ensaiados:</strong> ${hinosEnsaiados.join(', ')}`;
                    listaHinos.appendChild(p);
                }
            }
            
            // Observações
            const observacoesPrint = element.querySelector('#observacoes-print');
            const observacoesTexto = element.querySelector('#observacoes-texto');
            if (observacoesPrint) observacoesPrint.textContent = evento.observacoes || '';
            if (observacoesTexto) observacoesTexto.textContent = evento.observacoes || '';

            // Configurações do PDF
            const opt = {
                margin: 10,
                filename: `relatorio_ensaio_${dados.data.replace(/\//g, '_')}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Gerar o PDF
            if (typeof html2pdf === 'undefined') {
                document.body.removeChild(element);
                throw new Error('A biblioteca html2pdf.js não está carregada corretamente.');
            }
            
            await html2pdf().set(opt).from(element).save();
            console.log('PDF gerado com sucesso!');
            document.body.removeChild(element);
            resolve();
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            reject(error);
        }
    });
} 
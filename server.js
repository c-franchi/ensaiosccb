const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Habilita CORS
app.use(cors());
app.use(express.json());

// Armazena os eventos ativos e suas contagens
const eventosAtivos = new Map();
// Armazena as conexões WebSocket ativas por evento
const conexoesPorEvento = new Map();

// Endpoint para criar novo evento
app.post('/api/eventos', (req, res) => {
    const { id, tipo, localidade } = req.body;
    eventosAtivos.set(id, {
        id,
        tipo,
        localidade,
        contagens: {},
        usuarios: new Set()
    });
    res.json({ message: 'Evento criado com sucesso' });
});

// Endpoint para atualizar contagem
app.post('/api/contagem', (req, res) => {
    const { eventoId, instrumentoId, valor, usuarioId } = req.body;
    
    const evento = eventosAtivos.get(eventoId);
    if (!evento) {
        return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Atualiza a contagem
    evento.contagens[instrumentoId] = valor;
    
    // Notifica todos os clientes conectados a este evento
    const conexoes = conexoesPorEvento.get(eventoId) || [];
    const mensagem = JSON.stringify({
        tipo: 'atualizacao_contagem',
        eventoId,
        instrumentoId,
        valor
    });

    conexoes.forEach(cliente => {
        if (cliente.readyState === WebSocket.OPEN) {
            cliente.send(mensagem);
        }
    });

    res.json({ message: 'Contagem atualizada com sucesso' });
});

// Gerenciamento de conexões WebSocket
wss.on('connection', (ws, req) => {
    console.log('Nova conexão WebSocket estabelecida');

    ws.on('message', (message) => {
        try {
            const dados = JSON.parse(message);
            
            if (dados.tipo === 'registrar_evento') {
                const { eventoId, usuarioId } = dados;
                
                // Registra a conexão para o evento
                if (!conexoesPorEvento.has(eventoId)) {
                    conexoesPorEvento.set(eventoId, new Set());
                }
                conexoesPorEvento.get(eventoId).add(ws);
                
                // Adiciona usuário ao evento
                const evento = eventosAtivos.get(eventoId);
                if (evento) {
                    evento.usuarios.add(usuarioId);
                }
                
                // Envia estado atual do evento para o novo cliente
                ws.send(JSON.stringify({
                    tipo: 'estado_inicial',
                    contagens: evento?.contagens || {}
                }));
            }
        } catch (error) {
            console.error('Erro ao processar mensagem WebSocket:', error);
        }
    });

    ws.on('close', () => {
        // Remove a conexão de todos os eventos
        for (const [eventoId, conexoes] of conexoesPorEvento.entries()) {
            conexoes.delete(ws);
            if (conexoes.size === 0) {
                conexoesPorEvento.delete(eventoId);
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 
import express from 'express';
import fs from 'node:fs/promises';
import cors from 'cors';

const server = express();
const noticiasBitcoins = [];

// Função assíncrona para carregar os dados
async function puxaDados() {
    try {
        const data = await fs.readFile('./Bitcoins.json', 'utf-8');
        const jsonData = JSON.parse(data);
        jsonData.forEach(element => {
            noticiasBitcoins.push(element);
        });
        console.log(noticiasBitcoins); // Log dos dados carregados
    } catch (err) {
        console.log('Erro ao ler arquivo', err.message);
    }
}

// Chama a função e aguarda o carregamento antes de iniciar o servidor
puxaDados().then(() => {
    server.use(express.json());
    server.use(cors());

    server.get('/', (req, res) => {
        res.json(noticiasBitcoins); // Retorna o array já preenchido
    });

    server.get('/:id', (req, res) => {
        const { id } = req.params;
        const noticiaIndex = noticiasBitcoins.findIndex(noticia => noticia.id === +id);
        if (noticiaIndex !== -1) {
            res.json(noticiasBitcoins[noticiaIndex]); // Retorna a notícia correspondente
        } else {
            res.status(404).json({ message: 'Notícia não encontrada' }); // Lida com ID inválido
        }
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Servidor Iniciado na porta http://localhost:${PORT}/`);
    });
}).catch(err => {
    console.log('Erro ao iniciar o servidor:', err);
});

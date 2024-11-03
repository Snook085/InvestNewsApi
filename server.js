import express from 'express';
import fs from 'node:fs/promises';
import cors from 'cors';

const server = express();
const noticiasBitcoins = [];

async function puxaDados() {
    try {
        const data = await fs.readFile('./Bitcoins.json', 'utf-8');
        const jsonData = JSON.parse(data);
        jsonData.forEach(element => {
            noticiasBitcoins.push(element);
        });
        console.log(noticiasBitcoins); 
    } catch (err) {
        console.log('Erro ao ler arquivo', err.message);
    }
}


puxaDados().then(() => {
    server.use(express.json());
    server.use(cors());

    server.get('/', (req, res) => {
        res.json(noticiasBitcoins);
    });

    server.get('/:id', (req, res) => {
        const { id } = req.params;
        const noticiaIndex = noticiasBitcoins.findIndex(noticia => noticia.id === +id);
        if (noticiaIndex !== -1) {
            res.json(noticiasBitcoins[noticiaIndex]);
        } else {
            res.status(404).json({ message: 'Notícia não encontrada' });
        }
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Servidor Iniciado na porta http://localhost:${PORT}/`);
    });
}).catch(err => {
    console.log('Erro ao iniciar o servidor:', err);
});

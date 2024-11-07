import express from 'express';
import fs from 'node:fs/promises';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Criação do servidor Express
const server = express();
const noticiasBitcoins = [];
const noticiasFiis = [];

// Obtendo __dirname em um módulo ES6
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Caminhos absolutos para os arquivos JSON
const bitcoinsPath = path.resolve(__dirname, '../Bitcoins.json');
const fiisPath = path.resolve(__dirname, '../Fiis.json');

// Função para buscar os dados a partir dos arquivos JSON
async function puxaDados() {
    try {
        const bitcoins = await fs.readFile(bitcoinsPath, 'utf-8');
        const fiis = await fs.readFile(fiisPath, 'utf-8');
        
        const jsonBtc = JSON.parse(bitcoins);
        const jsonFiis = JSON.parse(fiis);
        
        // Limpa as listas antes de preencher
        noticiasBitcoins.length = 0;
        noticiasFiis.length = 0;

        // Adiciona os dados aos arrays
        jsonFiis.forEach(element => {
            noticiasFiis.push(element);
        });
        jsonBtc.forEach(element => {
            noticiasBitcoins.push(element);
        });

        console.log('Dados carregados:');
        console.log(noticiasBitcoins);
        console.log('-----------------');
        console.log(noticiasFiis);
    } catch (err) {
        console.log('Erro ao ler arquivo', err.message);
    }
}

// Atualiza os dados periodicamente (por exemplo, a cada 3 segundos)
const startDataUpdate = () => {
    setInterval(() => {
        puxaDados();
    }, 3000);  // Atualiza os dados a cada 3 segundos
};

// Inicia a atualização de dados
startDataUpdate();

// Inicia o servidor Express
server.use(express.json());
server.use(cors());

// Endpoint para retornar os dados de Bitcoin
server.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(noticiasBitcoins);
});

// Endpoint para retornar os dados de FIIs
server.get('/Fiis', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(noticiasFiis);
});

// Inicia o servidor na porta fornecida pela Vercel ou na porta 3000 para teste local
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor Iniciado na porta http://localhost:${PORT}/`);
});

// Carrega os dados inicialmente
puxaDados().catch(err => {
    console.log('Erro ao carregar os dados inicialmente:', err);
});

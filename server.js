import express from 'express';
import fs from 'node:fs/promises';
import cors from 'cors';
import main from './Bitcoins.js';
import Fiis from './Fiis.js';

const server = express();
const noticiasBitcoins = [];
const noticiasFiis = [];
let intervalID;

// Função para buscar os dados a partir dos arquivos JSON
async function puxaDados() {
    try {
        const bitcoins = await fs.readFile('./Bitcoins.json', 'utf-8');
        const Fiis = await fs.readFile('./Fiis.json','utf-8');
        
        const jsonBtc = JSON.parse(bitcoins);
        const jsonFiis = JSON.parse(Fiis);
        
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

// Função para iniciar o scraping em intervalos
const startScraping = () => {
    if (!intervalID) {
        intervalID = setInterval(() => {
            try {
                main();  // Função que coleta dados de Bitcoin
                Fiis();  // Função que coleta dados de FIIs
            } catch (err) {
                console.log('Erro ao executar scraping:', err.message);
            }
        }, 600000);  // Intervalo de 10 minutos (600.000ms)
    }
};

// Função para recarregar os dados periodicamente
const startDataUpdate = () => {
    setInterval(() => {
        puxaDados();
    }, 3000);  // Atualiza os dados a cada 3 segundos
};

// Inicia a coleta de dados e o scraping
startDataUpdate();
startScraping();

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

// Inicia o servidor na porta 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor Iniciado na porta http://localhost:${PORT}/`);
});

// Garantir que o scraping não impede o servidor de iniciar
puxaDados().catch(err => {
    console.log('Erro ao carregar os dados inicialmente:', err);
});

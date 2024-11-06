import express from 'express';
import fs from 'node:fs/promises';
import cors from 'cors';
import main from './Bitcoins.js';
import Fiis from './Fiis.js';


const server = express();
const noticiasBitcoins = [];
const noticiasFiis = []
let intervalID;
async function puxaDados() {
    try {
        const bitcoins = await fs.readFile('./Bitcoins.json', 'utf-8');
        const Fiis = await fs.readFile('./Fiis.json','utf-8')
        const jsonBtc = JSON.parse(bitcoins);
        const jsonFiis = JSON.parse(Fiis)
        noticiasBitcoins.length = 0
        noticiasFiis.length = 0
        jsonFiis.forEach(element => {
            noticiasFiis.push(element)
        })
        jsonBtc.forEach(element => {
            noticiasBitcoins.push(element);
        });
        console.log(noticiasBitcoins);
        console.log('-----------------')
        console.log(noticiasFiis)
    } catch (err) {
        console.log('Erro ao ler arquivo', err.message);
    }
}

const startScraping = () => {
    if(!intervalID){
        intervalID = setInterval(() => {
            main()
            Fiis()
        },600000)
    }
}
setInterval(()=> {
    puxaDados()
},3000)

startScraping()


puxaDados().then(() => {
    server.use(express.json());
    server.use(cors());
    

    server.get('/', (req, res) => {
        res.set('Cache-Control','no-store');
        res.json(noticiasBitcoins);
    });

    server.get('/Fiis',(req,res) => {
        res.set('Cache-Control','no-store');
        res.json(noticiasFiis)
    })

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Servidor Iniciado na porta http://localhost:${PORT}/`);
    });
}).catch(err => {
    console.log('Erro ao iniciar o servidor:', err);
});

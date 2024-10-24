import express from 'express'

const server = express()



server.use(express.json())

server.get('/',(req,res) => {
    res.send('Bitcoins')
})

const PORT = 3000
server.listen(PORT,()=>{
    console.log(`Servidor Iniciado na porta http://localhost:${PORT}/`)
})
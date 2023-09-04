const {Jokenpo, ApostaCores, VinteUm} = require('../jogos.js')
const Conta = require('../contas.js')

const commandJokenpo = {
    name: 'Jokenpô',
    description: 'Inicia um jogo de Jokenpô',

    execute(message, autor, args){
        const jogo = new Jokenpo(autor, args[0])
        message.reply(jogo.message)
    }
}

const commandAposta = {
    name: 'Apostar cores',
    description: 'Inicial um jogo de apostar cores',

    execute(message, autor, args){

        const corAposta = args[0];
        const valorAposta = Number(args[1]);

        // if (autor.id === client.user.id) return;

        const jogo = new ApostaCores(autor, corAposta, valorAposta)
        message.reply(jogo.message)
    }
}

const commandVinteUm = {
    name: '21',
    description: 'Inicial um jogo de 21',

    execute(message, autor, args, client){
        if (Conta.db.get(autor.username).saldo < args[0]) {
            message.reply('Você não tem saldo o suficienta para essa aposta')
            return
        }
        if (args[0] < 0){
            message.reply('Você não pode apostar um número negativo.')
            return
        }
        if (isNaN(Number(args[0]))){
            message.reply('Valor de aposta precisa ser  um número.')
            return
        }

        const resposta = message.channel.createMessageCollector({ filter: (m) => { return !m.author.bot }, time: 60000 });
        if (args[1] !== undefined && !Conta.db.has(args[1])) {
            message.reply('Esse usuário não existe no banco de dados')
            throw new Error({ctx:message, message: 'Esse usuário não existe no banco de dados'})
        }
        const versus = Conta.db.get(args[1]) || client.user
 

        const jogo = new VinteUm(autor, versus, args[0])

        message.reply(`${jogo.mostrarMaos()}\n suas opções: <sacar/parar>`)

        
        resposta.on('collect', (response) => {
            
            if (response.content === "mostrar"){
                message.reply(`${jogo.mostrarMaos()}\n`)
            }

            if (response.content === 'sacar') {
                if (jogo.player1.turno && jogo.player1.user.id === response.author.id) {
                    message.reply(jogo.player1.sacar())
                    jogo.player1.passarTurno(jogo.player2)
                }
                if (jogo.player2.turno && jogo.player2.user.id === response.author.id) {
                    message.reply(jogo.player2.sacar())
                    jogo.player2.passarTurno(jogo.player1)

                }
                if (versus.bot && jogo.player2.turno) {
                    if (jogo.player2.pontos <= 13 || jogo.player2.pontos < jogo.player1.pontos) {
                        message.reply(jogo.player2.sacar())
                    } 
                    jogo.player2.passarTurno(jogo.player1)
                }

                if (jogo.player1.pontos > 21 || jogo.player2.pontos > 21) {

                    jogo.pararJogo()   
                    resposta.stop()
                }

            }

            else if (response.content === 'parar') {
                if (response.author.id === jogo.player1.user.id && !versus.bot) {
                    message.reply(jogo.player1.passarTurno(jogo.player2))
                } else if (response.author.id === jogo.player2.user.id && !versus.bot) {
                    jogo.player2.passarTurno(jogo.player1)
                } else if (versus.bot && jogo.player2.user.pontos >= 16) {
                    jogo.pararJogo()
                    resposta.stop()
                } else {
                    jogo.pararJogo()
                    resposta.stop()
                }
            }
        })
        resposta.on('end', () => {
            message.reply(`${jogo.mostrarMaos()}\n`)
            message.reply(`${jogo.reply.message}, Fim do jogo!`)

            const conta = Conta.db.get(autor.username)
            const conta2 = Conta.db.get(versus.username) || {saldo: 0}

            if (jogo.reply.status === 'perdeu') {
                conta.saldo -= jogo.valorAposta
                conta2.saldo += jogo.valorAposta
            } else {
                conta.saldo += jogo.valorAposta
                conta2.saldo -= jogo.valorAposta
            }
        })
    }
}

module.exports = {commandJokenpo, commandAposta, commandVinteUm}
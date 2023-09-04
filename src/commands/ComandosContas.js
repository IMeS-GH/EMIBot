const Conta = require('../contas.js')

const commandConta = {
    name: 'conta',
    description: 'Exibe os dados da conta.',
    execute(message, conta) {
        const dados = conta.mostrarConta()
        let resposta = ''

        if (dados.id !== 'dead') {
            resposta = `> **ID:** ${dados.id}\n> **Usuário:**${dados.username}\n> **Nome:**${dados.nome}\n> **Saldo:** ${dados.saldo}\n`
        } else {
            resposta = `> **Usuário ${dados.username} está morto**`
        }

        message.reply(resposta);
    }
}

const commandContas = {
    name: 'contas',
    description: 'Exibe a lista de contas',
    execute(message){
        const contas = Conta.db;
        let resposta = ''
        contas.forEach((conta) => {
            if (!message.author.bot) {
                resposta += `> **ID:** ${conta.id}\n> **Usuário:**${conta.username}\n> **Nome:**${conta.nome}\n> **Saldo:** ${conta.saldo}\n`
                resposta += '\n'
            }
        })

        message.reply(resposta)
    }
}

const commandTrabalhar = {
    name: 'trabalhar',
    description: 'Trabalha para ganhar dinheiro.',
    execute(message, conta){

        let resposta = ''

        const trabalho = conta.trabalhar()
        if (trabalho) {
            resposta = `Usuário ${conta.nome} trabalhou, ganhando ${trabalho} dinheiros`
        } else {
            resposta = `Usuário ${conta.nome} não pode trabalhar!`;
        }

        message.reply(resposta)
    }
}

const commandTransferir = {
    name: 'Transferir',
    description: 'Transfere saldo de uma conta para outra',

    execute(message, conta, args){
        if (args.length === 2) {
            const contaDestinatario = Conta.db.get(args[0])
            const valorTransferencia = Number(args[1])
            let resposta = ''
    
            if (contaDestinatario === undefined || isNaN(valorTransferencia)) message = ("Conta ou valor inválido!")
    
            const transferencia = conta.transferir(contaDestinatario, valorTransferencia)
            message.reply(transferencia)
        }
    }
}

const commandClonar = {
    name: 'Clonar',
    description: 'Cria uma conta falsa chamada laranja para testes',

    execute(message, conta){

        if (Conta.db.has('laranja')) {
            message.reply("Já existe uma conta laranja no banco de dados.")
            return
        }
    
        if (conta.saldo <= 50) {
            message.reply("você precisa pagar 50 graninhas para clonar uma conta.")
        } else {
            conta.saldo -= 50
            const contaLaranja = new Conta({
                id: 0,
                nome: 'Laranja da Silva',
                username: 'laranja'
            })
    
            Conta.db.set(contaLaranja.username, contaLaranja)
    
            message.reply('Conta laranja criada com sucesso!')
        }
    }    
}

module.exports = { commandConta , commandContas, commandTrabalhar, commandTransferir, commandClonar}
const { Client, GatewayIntentBits } = require("discord.js");
const Conta = require('./contas.js');
const { Jokenpo, ApostaCores, VinteUm } = require('./jogos.js')
const helpCommand = require('./commands/help.js');

require('dotenv').config();

const token = process.env.token;
const prefix = process.env.prefix || '!'; // Se o prefix não for encontrado no arquivo .env, ! é utilizado

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]

});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    const conteudo = message.content;
    const autor = message.author;

    const args = conteudo.slice(prefix.length).split(' ');

    if (!Conta.db.has(autor.username) && !autor.bot) {
        const novaConta = new Conta({
            id: autor.id,
            nome: autor.globalName,
            username: autor.username,
            saldo: 0,
            ultimoTrabalho: 0
        })

        Conta.db.set(autor.username, novaConta)
    };
    const conta = Conta.db.get(autor.username) // Conta do usuário do contexto da mensagem

    // Verifique se a mensagem começa com o prefixo e não foi enviada pelo bot
    if (!conteudo[0].startsWith(prefix) || autor.bot) return;

    // Divide a mensagem em partes
    const comando = args.shift().toLowerCase();


    if (comando === "conta") {
        const dados = conta.mostrarConta()
        message.reply(`> **ID:** ${dados.id}\n> **Usuário:**${dados.username}\n> **Nome:**${dados.nome}\n> **Saldo:** ${dados.saldo}\n`)
    };

    if (comando === "trab" || comando === "trabalhar") {
        const trabalho = conta.trabalhar()
        if (trabalho) {
            message.reply(`Usuário ${conta.nome} trabalhou, ganhando ${trabalho} dinheiros`)
        } else {
            message.reply(`Usuário ${conta.nome} não pode trabalhar!`);
        }
    };

    if (comando === "contas") {
        const mensagem = Conta.db;
        mensagem.forEach((conta) => {
            console.log(conta);
            // Verifique se a mensagem foi enviada pelo bot
            if (!message.author.bot) {
                message.channel.send(`> **ID:** ${conta.id}\n> **Usuário:**${conta.username}\n> **Nome:**${conta.nome}\n> **Saldo:** ${conta.saldo}\n`);
            }
        })
    }

    if (comando === "trans" || comando === "transferir") {
        if (args.length === 2) {
            const contaDestinatario = Conta.db.get(args[0])
            const valorTransferencia = Number(args[1])

            console.log(contaDestinatario, valorTransferencia)

            if (contaDestinatario === undefined || isNaN(valorTransferencia)) return ("Conta ou valor inválido!")

            const transferencia = conta.transferir(contaDestinatario, valorTransferencia)
            message.reply(transferencia)
        }
    }

    if (comando === "clonar") {
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

    if (comando === "jokenpo") {
        const jogo = new Jokenpo(autor, args[0])

        message.reply(jogo.message)

    }

    if (comando === "aposta") {
        const corAposta = args[0];
        const valorAposta = Number(args[1]);

        if (autor.id === client.user.id) return;

        const jogo = new ApostaCores(autor, corAposta, valorAposta)
        message.reply(jogo.message)

    }

    if (comando === "21" || comando === "vinteum") {
        const resposta = message.channel.createMessageCollector({filter: (m) => {return autor.id === m.author.id && !m.author.bot}, time: 30000 });
        const versus = args[1] || client.user
        console.log(versus)
        const jogo = new VinteUm(autor, versus, args[0])

        message.reply(`${jogo.mostrarMaos()}\n suas opções: <sacar/parar>`)

        resposta.on('collect', (response) => {
            if (response.content === 'sacar') {

                jogo.player1.sacar()
                message.reply(`**${autor.username}** sacou uma carta!`)
                message.reply(`${jogo.mostrarMaos()}`)

                if (jogo.player1.pontos > 21) {
                    jogo.pararJogo()
                    resposta.stop()
                }
                else if (jogo.player2.pontos <= 13 || jogo.player2.pontos <= jogo.player1.pontos){
                    jogo.player2.sacar()
                    message.reply(`**${versus.username}** sacou uma carta!`)
                    message.reply(`${jogo.mostrarMaos()}`)
                    if (jogo.player2.pontos > 21) {
                        jogo.pararJogo()
                        resposta.stop()
                    }
                }
            }
            else if (response.content === 'parar'){

                jogo.pararJogo()
                message.reply(`${jogo.mostrarMaos()}`)
                resposta.stop()

            }
        })

        resposta.on('end', () => {
            message.reply(`${jogo.reply.message}, Fim do jogo!`)

            if (jogo.reply.status === 'perdeu' && conta.saldo < 0){
                message.author.send('Ora ora... Parece que você está sem dinheiro')
                setTimeout(() => message.author.send('*Infelizmente, nosso contrato encerra aqui.*'), 6000)
                setTimeout(() => message.author.send('https://i1.sndcdn.com/avatars-6MYmIsqrQG5zqYs7-CAXKkg-t500x500.jpg'), 10000)
                setTimeout(() => message.author.send('**Hasta la vista**'), 15000)

            }
        })
    }

    if (comando === 'help') {
        helpCommand.execute(message, prefix);
    }
});

client.login(token);
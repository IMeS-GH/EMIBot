const { Client, GatewayIntentBits } = require("discord.js");
const Conta = require('./contas.js');
const { Jokenpo, ApostaCores } = require('./jogos.js')
const helpCommand = require('./commands/help.js');
const data = './database/users.json'

require('dotenv').config();

const token = process.env.token;
const prefix = process.env.prefix || '!'; // Se o prefix não for encontrado no arquivo .env, ! é utilizado

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    const conteudo = message.content;
    const autor = message.author;

    if (!autor.bot) { //Verifica se a mensagem não foi disparada por um bot
        if (!Conta.db.has(autor.username)) {
            Conta.db.set(autor.username, new Conta({ id: autor.id, nome: autor.globalName, username: autor.username }))
            console.log(`${autor.globalName} cadastrado`);
            const conta = Conta.db.get(autor.username)
            console.log(conta)
        }

        const args = conteudo.slice(prefix.length).split(' ');

        if (conteudo[0].startsWith(prefix)) { // Verifique se a mensagem começa com o prefixo
            const comando = args.shift().toLowerCase(); // Divide a mensagem em partes

            if (comando === "conta") {
                const conta = Conta.db.get(autor.username) // Conta do usuário do contexto da mensagem
                const dados = conta.mostrarConta()
                message.reply(`> **ID:** ${dados.id}\n> **Usuário:**${dados.username}\n> **Nome:**${dados.nome}\n> **Saldo:** ${conta.saldo}\n`)
            };

            if (comando === "trab" || comando === "trabalhar") {
                const conta = Conta.db.get(autor.username) // Conta do usuário do contexto da mensagem
                console.log(conta.saldo, conta.nome)
                const salario = conta.trabalhar()
                console.log(conta.saldo, conta.nome)
                if (salario) {
                    message.reply(`Usuário ${conta.nome} trabalhou, ganhando ${salario} dinheiros.\n\nSaldo atual: ${conta.saldo}`)
                } else {
                    message.reply(`Usuário ${conta.nome} não pode trabalhar!`);
                }
            };

            if (comando === "contas") {
                const conta = Conta.db.get(autor.username) // Conta do usuário do contexto da mensagem
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
                const conta = Conta.db.get(autor.username) // Conta do usuário do contexto da mensagem
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
                const conta = Conta.db.get(autor.username) // Conta do usuário do contexto da mensagem
                if (Conta.db.has('laranja')) {
                    message.reply("Já existe uma conta laranja no banco de dados.")
                    return
                }

                if (conta.saldo < 50) {
                    message.reply(`você precisa pagar 50 reais para criar uma conta laranja.\n\nObs: Isso não tem nenhuma relação com politica.`)
                } else {
                    conta.saldo -= 50
                    const contaLaranja = new Conta({ id: 0, nome: 'Laranja da Silva', username: 'laranja' })

                    Conta.db.set(contaLaranja.username, contaLaranja)

                    message.reply('Conta laranja criada com sucesso!')
                }
            }

            if (comando === "jokenpo") {
                const jogo = new Jokenpo(autor, args[0])

                message.reply(jogo.resultado)
            }

            if (comando === "aposta") {
                const corAposta = args[0];
                const valorAposta = Number(args[1]);

                if (autor.id === client.user.id) return;

                const jogo = new ApostaCores(autor, corAposta, valorAposta)
                message.reply(jogo.message)
            }

            if (comando === 'help') {
                helpCommand.execute(message, prefix);
            }
        }
    }
});

client.login(token);
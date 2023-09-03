const { Client, GatewayIntentBits } = require("discord.js");
const Conta = require('./contas.js');

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

    // Verifique se a mensagem começa com o prefixo e não foi enviada pelo bot
    if (!conteudo[0].startsWith(prefix) || autor.bot) return;

    // Divide a mensagem em partes
    const comando = args.shift().toLowerCase();

    if (!Conta.db.has(autor.username)) {
        const novaConta = new Conta({
            id: autor.id,
            nome: autor.globalName,
            username: autor.username,
            saldo: 0,
            ultimoTrabalho: 0
        })

        Conta.db.set(autor.username, novaConta)
    };

    const conta = Conta.db.get(autor.username)

    if (comando === "calopsita") {
        message.reply('https://media.discordapp.net/attachments/519307505822597144/1108096092706439198/cockatiel.gif')
    };

    if (comando === "conta") {
        const dados = conta.mostrarConta()
        message.reply(`Usuário ${dados.nome} possui ${dados.saldo} dinheiros.`)
    };

    if (comando === "trab") {
        const trabalho = conta.trabalhar()
        if (trabalho) {
            message.reply(`Usuário ${conta.nome} trabalhou, ganhando ${trabalho} dinheiros`)
        } else {
            message.reply(`Usuário ${conta.nome} não pode trabalhar!`);
        }
    };

    if (comando === "con") {
        const mensagem = Conta.db;
        mensagem.forEach((conta) => {
            console.log(conta);
            // Verifique se a mensagem foi enviada pelo bot
            if (!message.author.bot) {
                message.channel.send(`${conta.id}\n${conta.nome}\n${conta.saldo}`);
            }
        })
    }

    if (comando === "trans" || comando === "transferir"){
        if (args.length === 2){
            const contaDestinatario = Conta.db.get(args[0])
            const valorTransferencia = Number(args[1])

            if (contaDestinatario === undefined || isNaN(valorTransferencia)) return ("Conta ou valor inválido!")
        
            const transferencia = conta.transferir(contaDestinatario, valorTransferencia)
            message.reply(transferencia)
        }
    }

});

client.login(token);

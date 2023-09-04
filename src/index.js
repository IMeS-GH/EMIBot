const { Client, GatewayIntentBits, resolveColor } = require("discord.js");
const Conta = require('./contas.js');
const { Jokenpo, ApostaCores, VinteUm } = require('./jogos.js')
const helpCommand = require('./commands/help.js');
const {commandConta, commandTrabalhar, commandContas, commandTransferir, commandClonar} = require('./commands/ComandosContas.js');
const { commandJokenpo, commandAposta, commandVinteUm } = require("./commands/ComandosJogos.js");

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
    try {
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

    // COMANDOS ============================================================================

    if (conta.saldo < 0){
        
        message.author.send('Ora ora... Parece que você está sem dinheiro')
        setTimeout(() => message.author.send('*Infelizmente, nosso contrato encerra aqui.*'), 6000)
        setTimeout(() => message.author.send('https://i1.sndcdn.com/avatars-6MYmIsqrQG5zqYs7-CAXKkg-t500x500.jpg'), 10000)
        setTimeout(() => message.author.send('**Hasta la vista**'), 15000)

        conta.id = 'dead'
        
    }

    if (comando === "conta") {
        commandConta.execute(message, conta)
    };

    if (comando === "trab" || comando === "trabalhar") {
        commandTrabalhar.execute(message, conta)
    };

    if (comando === "contas") {
        commandContas.execute(message)
    };

    if (comando === "trans" || comando === "transferir") {
        commandTransferir.execute(message, conta, args)
    }

    if (comando === "clonar") {
        commandClonar.execute(message, conta)
    }

    if (comando === "jokenpo") {
        commandJokenpo.execute(message, autor, args)
    }

    if (comando === "aposta") {
       commandAposta.execute(message, autor, args)
    }

    if (comando === "21" || comando === "vinteum") {
        commandVinteUm.execute(message, autor, args, client)
    }

    if (comando === 'help') {
        helpCommand.execute(message, prefix);
    }}
    catch (err) {
        console.error(err)
    }
});

client.login(token);
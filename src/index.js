const { Client, GatewayIntentBits } = require("discord.js");
const Conta = require('./contas.js');
require('dotenv').config();

const token = process.env.token
const prefix = '+'

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

    // Verifique se a mensagem começa com o prefixo e não foi enviada pelo bot
    if (!conteudo.startsWith(prefix) || autor.bot) return;

    // Divide a mensagem em partes
    const args = conteudo.slice(prefix.length).trim().split(/ +/);
    const comando = args.shift().toLowerCase();

    if (!Conta.db.has(autor.id)){
        Conta.db.set(autor.id, new Conta({
            id: autor.id, 
            nome: autor.globalName, 
            username: autor.username, 
            saldo: 0, 
            ultimoTrabalho: 0
        }))
    } 
    
    const conta = Conta.db.get(autor.id)

    if(comando === "conta"){
        const dados = conta.mostrarConta()
        message.reply(`Usuário ${dados.nome} possui ${dados.saldo} dinheiros.`)
    }

    if(comando === "trab"){
        const trabalho = conta.trabalhar()
        if (trabalho){
            message.reply(`Usuário ${conta.nome} trabalhou, ganhando ${trabalho} dinheiros`)
        } else {
            message.reply(`Usuário ${conta.nome} não pode trabalhar!`)
        }
    }

    if (comando === "con") {
        const mensagem = Conta.db;
        mensagem.forEach((conta) => {
            console.log(conta);
            // Verifique se a mensagem foi enviada pelo bot
            if (!message.author.bot) {
                message.channel.send(`${conta.id}\n${conta.user}\n${conta.saldo}`);
            }
        })
    }

    if (comando === "transf") {
        const targetUsername = args[0];
        const transferAmount = parseInt(args[1]);

        if (!targetUsername || isNaN(transferAmount)) {
            message.reply("Comando de transferência inválido. Use !transf <username> <valor>.");
            return;
        }

        const targetUser = Array.from(Conta.db.values()).find((user) => user.username === targetUsername);

        if (!targetUser) {
            message.reply("Usuário de destino não encontrado.");
            return;
        }

        const transferResult = conta.transferir(targetUser, transferAmount);

        if (typeof transferResult === "string") {
            message.reply(transferResult);
        } else {
            message.reply(transferResult);
        }
    }
});

client.login(token);

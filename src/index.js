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
    const conteudo = message.content.split(' ').length === 1 ? message.content : message.content.split(' ');
    const autor = message.author;

    // Verifique se a mensagem começa com o prefixo e não foi enviada pelo bot
    if (!conteudo.startsWith(prefix) || autor.bot) return;

    // Divide a mensagem em partes
    const args = conteudo.slice(prefix.length).trim().split(/ +/);
    const comando = args.shift().toLowerCase();

    if (!Conta.db.has(autor.id)){
        Conta.db.set(autor.id, new Conta({id: autor.id, nome: autor.globalName, username: autor.username, saldo: 0, ultimoTrabalho: 0}))
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
                message.channel.send(`${conta.id}\n${conta.nome}\n${conta.saldo}`);
            }
        })

    if (autor.bot) return

    if (!Conta.db.has(autor.username)) {
        Conta.db.set(autor.username, new Conta(
            {
                id: autor.id,
                nome: autor.username,
                nickname: autor.globalName
            }))
    }

    const conta = Conta.db.get(autor.username)

    if (typeof conteudo === 'object') {

        if (conteudo[0] === '!transferir') {
            const conta2 = Conta.db.get(conteudo[1])

            if (conta2 === undefined) {
                message.channel.send(`Esse usuário não existe, impossível transferir uma graninha`)
            }
            else {
                message.channel.send(conta.transferir(conta2, conteudo[2]))
            }

        }
    }
    // Comandos -------------------------------------------------------

    if (conteudo === "Calopsita") {
        message.channel.send('https://media.discordapp.net/attachments/519307505822597144/1108096092706439198/cockatiel.gif')
    }

    if (conteudo === "!conta") {
        const dados = conta.mostrarConta()
        message.channel.send(`Usuário ${dados.nickname} possui ${dados.saldo} sementes de girassol`)
    }

    if (conteudo === "!trabalhar") {
        const trabalho = conta.trabalhar()
        if (trabalho) {
            message.channel.send(`Usuário ${conta.nickname} trabalhou, ganhando ${trabalho} sementes de girassól`)
        } else {
            message.channel.send(`Usuário ${conta.nickname} não pode trabalhar, está muito cansado.`)
        }
    }

    if (conteudo === "!consulta") {
        const mensagem = Conta.db
        mensagem.forEach((conta) => {
            console.log(conta)
            message.channel.send(`${conta.id}\n${conta.nickname}\n${conta.saldo}`)

        })
    }
    }
})

client.login(token);

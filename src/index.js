const { Client, GatewayIntentBits } = require("discord.js");
const Conta = require('./Conta')
require('dotenv').config();
const token = process.env.token

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    const conteudo = message.content.split(' ').length === 1 ? message.content : message.content.split(' '); 
    const autor = message.author; 

    
    if (autor.bot) return
    
    if (!Conta.db.has(autor.id)){
        Conta.db.set(autor.id, new Conta({id: autor.id, nome: autor.username, nickname: autor.globalName}))
    } 
    
    const conta = Conta.db.get(autor.id)
    
    if(typeof conteudo === 'object'){
        if(conteudo[0] === '!transferir'){
            const conta2 = Conta.db.get(autor)

        }
    }
    // Comandos -------------------------------------------------------

    if(conteudo === "Calopsita"){
        message.channel.send('https://media.discordapp.net/attachments/519307505822597144/1108096092706439198/cockatiel.gif')
    }

    if(conteudo === "!conta"){
        const dados = conta.mostrarConta()
        message.channel.send(`Usuário ${dados.nickname} possui ${dados.saldo} sementes de girassol`)
    }

    if(conteudo === "!trabalhar"){
        const trabalho = conta.trabalhar()
        if (trabalho){
            message.channel.send(`Usuário ${conta.nickname} trabalhou, ganhando ${trabalho} sementes de girassól`)
        } else {
            message.channel.send(`Usuário ${conta.nickname} não pode trabalhar, está muito cansado.`)
        }
    }

    if(conteudo === "!consulta"){
        const mensagem = Conta.db
        mensagem.forEach((conta) => {
            console.log(conta)
            message.channel.send(`${conta.id}\n${conta.nickname}\n${conta.saldo}`)

        })
    }
});

client.login(token);

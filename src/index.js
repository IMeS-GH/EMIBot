const { Client, GatewayIntentBits } = require("discord.js");
const Conta = require('./Conta')
require('dotenv').config();
const token = process.env.token

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    const conteudo = message.content; 
    const autor = message.author; 

    if (!Conta.db.has(autor.id)){
        Conta.db.set(autor.id, new Conta({id: autor.id, nome: autor.username}))
    } 

    const conta = Conta.db.get(autor.id)

    if (conteudo === "debug"){
        message.channel.send(`${message}`)
    }

    if(conteudo === "Calopsita"){
        message.channel.send('https://media.discordapp.net/attachments/519307505822597144/1108096092706439198/cockatiel.gif')
    }

    if(conteudo === "!conta"){
        const dados = conta.mostrarConta()
        message.channel.send(`Usuário ${dados.nome}, o id é ${dados.id} possui ${dados.saldo} sementes de girassol`)
    }
    if(conteudo === "!trabalhar"){
        const trabalho = conta.trabalhar()
        if (trabalho){
            message.channel.send(`Usuário ${conta.nome} trabalhou, ganhando ${trabalho} sementes de girassól`)
        } else {
            message.channel.send(`Usuário ${conta.nome} não pode trabalhar, está muito cansado.`)
        }
    }

});

client.login(token);

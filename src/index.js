require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");
const token = process.env.token;
const prefix = process.env.prefix;

const Conta = require('./obj/Conta');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    const conteudo = message.content; 
    const autor = message.author; 

    if(!autor.bot){
        if (!Conta.db.has(autor.id)){
            Conta.db.set(autor.id, new Conta({id: autor.id, nome: autor.globalName, nick: autor.username}))
            console.log(`${autor.globalName} cadastrado`)
        } 
        if(message.content.startsWith(prefix)){
        // comandos
        if(conteudo.includes('trabalhar')){
            let conta = Conta.db.get(autor.id);
            
            let salario = conta.trabalhar()
            if(salario){
                message.reply(`${autor.globalName} trabalhou igual um camelo e recebeu ${salario} moedas verdes`)
            }else{
                message.reply('Até camelos precisam descansar, tente mais tarde!')
            }
        }
        if(conteudo.includes('saldo')){
            message.reply(`${autor.globalName} possui ${teste} moedas verdes`)
        }
        if(conteudo.includes('conta')){
            let conta = Conta.db.get(autor.id);
            let info = conta.conta();
            message.reply(`informações do usúario ${info.nome}\n\nIdentificado como ${info.nick}\nSaldo: ${info.saldo}\nSituação: ${info.situacao}\nDescanso: ${info.descanso} `)
        }
        if(conteudo.includes('transferir')){
            const conta = Conta.db.get(autor.id);
            const nomeDaConta = conteudo.slice('$transferir '.length);

            console.log(nomeDaConta)
        }
        if(conteudo.includes('apostar')){
            message.reply(`É o cassino o jogo da galera`)
        }
        }
    }
    
});

client.login(token);

const { Client, GatewayIntentBits } = require("discord.js");
require('dotenv').config();
const token = process.env.token

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    const conteudo = message.content; 
    const autor = message.author; 

    if(conteudo === "AAA") {
        message.channel.send("BBB");
    }
});

client.login(token);

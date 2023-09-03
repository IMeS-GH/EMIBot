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
    const args = conteudo.slice(prefix.length).split(' ');

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
            const conta = Conta.db.get(autor.id);
            let info = conta.conta();
            message.reply(`informações do usúario ${info.nome}\n\nIdentificado como ${info.nick}\nSaldo: ${info.saldo}\nSituação: ${info.situacao}\nDescanso: ${info.descanso} `)
        }
        if (conteudo.includes('transferir')) {
           if(args.length === 1){
            
            message.channel.send('Para qual usuário você deseja realizar uma transferência?');
            
            // Filtra o id do usuário que enviou $transferir e cria um coletor para aguardar a resposta
            const userId = (response) => response.author.id === autor.id;
            const resposta = message.channel.createMessageCollector({ filter: userId, time: 30000 }); // 30 seg = tempo maximo do processo
        
            resposta.on('collect', (response) => {
                const validation = response.content; 
                resposta.stop();

                const idTransf = isNaN(Number(validation.replace("<@","").replace(">", ""))) ? null : validation.replace("<@","").replace(">", "")//Usado em caso do usuario ser selecionado atráves de mention
                
                const destinatario = Conta.db.get(idTransf)
               
                console.log(destinatario)
                if(destinatario === undefined){
                message.channel.send('Usúario inexistente, tente novamente.');
                return
               }
                
                message.channel.send(`Qual o valor da transferência para ${destinatario.nome}`);
        
                // Filtra o id do usuário novamente para o segundo coletor
                const resposta2 = message.channel.createMessageCollector({ filter: userId, time: 30000 });
        
                resposta2.on('collect', (response2) => {
                    const valor = parseInt(response2.content);
                    resposta2.stop();

                    message.channel.send(`Tem certeza que deseja transferir R$${valor} para ${destinatario} `);
                    
                    
                    const confirmacao = message.channel.createMessageCollector({ filter: userId, time: 30000 });

                    confirmacao.on('collect', (response)=>{
                        const autorizacao = response.content

                        if(autorizacao === 'sim'){
                            const conta = Conta.db.get(autor.id);
                            const transacao = conta.depositar(destinatario, valor);
                            
                            if(transacao){
                                message.reply(`Transação para ${destinatario.nome} feita com sucesso!\n\n\nSaldo atual: ${conta.saldo}`)
                            }else{
                                message.reply(`Operação cancelada`)
                            }
                        }
                    })
                });
        
                resposta2.on('end', (collected2, reason2) => {
                    if (reason2 === 'time') {
                        message.channel.send('Tempo limite de resposta para o valor expirado.');
                    }
                });
            });

            //executa caso o tempo maximo para execução seja atingido 
            resposta.on('end', (collected, reason) => {
                if (reason === 'time') {
                    message.channel.send('Tempo limite de resposta para o destinatário expirado.');
                }
            });
           }else if(args.length === 3){
            const destinatario = args[1];
            const valor = Number(args[2]);

            if(destinatario === typeof(string) && valor === typeof(Number)){
                
            }else{
                message.reply(`Formato correto: $transferir <usuario> <valor> ou apenas $transferir`)
            }
           }
            
        }
        if(conteudo.includes('apostar')){
            message.reply(`É o cassino o jogo da galera`)
        }
        }
    }
    
});

client.login(token);

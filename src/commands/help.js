module.exports = {
    name: 'help',
    description: 'Exibe a lista de comandos disponíveis.',
    execute(message, prefix) {
        const helpMessage = `**Comandos Disponíveis:**\n
        ${prefix}conta - Exibe os dados da conta
        ${prefix}trab - Trabalha para ganhar dinheiro
        ${prefix}transferir <conta> <valor> - Realiza uma transferencia
        ${prefix}aposta <cor> <valor> - Realiza uma aposta`;

        message.channel.send(helpMessage);
    },
};
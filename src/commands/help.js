module.exports = {
    name: 'help',
    description: 'Exibe a lista de comandos disponíveis.',
    execute(message, prefix) {
        const helpMessage = `**Comandos Disponíveis:**\n
        ${prefix}conta - Exibe os dados da conta
        ${prefix}clonar - Clona uma conta
        ${prefix}costas - Exibe a lista de contas
        ${prefix}jokenpo <emoji> - Joga um jogo
        ${prefix}trab - Trabalha para ganhar dinheiro
        ${prefix}transferir <conta> <valor> - Realiza uma transferencia
        ${prefix}aposta <cor> <valor> - Realiza uma aposta`;

        message.reply(helpMessage);
    },
};
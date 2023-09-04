const Conta = require("./contas")

class Jogo{
    
    static tipos = ['Jokenpo', '21', 'ApostaCores']

    /**
     * 
     * @param {string} tipo tipo do jogo, esse parâmetro é passado pelo comando
     * @param {User} autor Autor da mensagem que utilizou o comando
     * @returns 
     */
    constructor(autor){
        this.tipo = this.constructor.name
        this.autor = autor
        this.contaAutor = Conta.db.get(autor.username)

        if(!Jogo.tipos.includes(this.tipo)) throw new Error({message: 'Esse jogo não existe.'})

    }
}

class Jokenpo extends Jogo{

    // Lógica;
    // 0 -> pedra  || 0 -> 2  ✊ 
    // 1 -> papel || 1 -> 0 ✋
    // 2 -> tesoura || 2 -> 1 ✌️

    static opcoes = new Map(
        [['✊', {perde: '✋', vence: '✌️', emoji: '✊'}],
         ['✋', {perde: '✌️', vence: '✊', emoji: '✋'}],
          ['✌️', {perde: '✊', vence: '✋', emoji: '✌️'}]]
        )
    
    static opKeys = {
        0 : '✊',
        1 : '✋',
        2 : '✌️'
    }

    constructor(autor, escolha_player){
        super(autor)

        this.player = Jokenpo.opcoes.get(escolha_player)
        this.bot = Jokenpo.opcoes.get(Jokenpo.opKeys[Math.floor(Math.random() * 3)])
        this.reply = {message: 'Algo deu errado', status: 'fail'}

        if (this.player.emoji === this.bot.emoji) this.reply = {status: 'ok', valor: 0, message: `${this.autor.globalName} ${this.player.emoji} x ${this.bot.emoji}, empate!`}
        if (this.player.vence === this.bot.emoji) this.reply = {status: 'ok', valor: 100, message: `${this.autor.globalName} ${this.player.emoji} x ${this.bot.emoji}, você venceu!`}
        if (this.player.perde === this.bot.emoji) this.reply = {status: 'ok', valor: -100, message: `${this.autor.globalName} ${this.player.emoji} x ${this.bot.emoji}, você perdeu!`}
       
        this.contaAutor.saldo += this.reply.valor
       
        return this.reply
    }

}

class ApostaCores extends Jogo{
    
    
    static coresAposta = ['vermelho', 'preto', 'branco']

    /**
     * 
     * @param {User} autor Autor da mensagem
     * @param {string} corApostada Cor utilizada na aposta
     * @param {number} valorAposta Valor que será apostado
    */
   constructor(autor, corApostada, valorAposta){

        super(autor)
        this.corApostada = corApostada
        this.valorAposta = Number(valorAposta)
        this.reply = {message: 'Algo deu errado', status: 'fail'}

        if (!ApostaCores.coresAposta.includes(corApostada) || isNaN(valorAposta)) return {message: 'Uso correto: !aposta <vermelho/preto/branco> <valor>', status: 'fail'}
        if(this.contaAutor.saldo < valorAposta) return {message: 'Você não tem saldo suficiente para fazer essa aposta.', status: 'fail'}

        this.resultado = Math.floor(Math.random() * 100) + 1;

        this.reply.message = `Você apostou ${valorAposta} na cor ${corApostada}.\n`;

        if (corApostada === 'branco' && this.resultado <= 10) { // 10% de chance para branco
            const ganho = valorAposta * 9; // Pagamento 9x
            this.contaAutor.saldo += ganho;
            this.reply.message += `Você ganhou! Seu saldo agora é ${this.contaAutor.saldo}.`;
        } else if (
            (corApostada === 'vermelho' && this.resultado <= 45) ||
            (corApostada === 'preto' && this.resultado <= 45)
        ) {
            const ganho = valorAposta * 2; // Pagamento 2x
            this.contaAutor.saldo += ganho;
            this.reply.message += `Você ganhou! Seu saldo agora é ${this.contaAutor.saldo}.`;
        } else {
            this.contaAutor.saldo -= valorAposta;
            this.reply.message += `Você perdeu! Seu saldo agora é ${this.contaAutor.saldo}.`;
        }

        return this.reply
    }
}

module.exports = {ApostaCores, Jokenpo}
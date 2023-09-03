class Jogo{
    
    static tipos = ['jokenpo', '21']

    constructor(tipo){
        if(!Jogo.tipos.includes(tipo)) return {message: 'Esse jogo não existe.'}

        this.tipo = tipo
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

    constructor(escolha_player){
        super(...arguments)

        this.player = Jokenpo.opcoes.get(escolha_player)
        this.bot = Jokenpo.opcoes.get(Jokenpo.opKeys[Math.floor(Math.random() * 3)])

        if (this.player.emoji === this.bot.emoji) return {resultado: `${this.player.emoji} x ${this.bot.emoji}, empate!`}
        if (this.player.vence === this.bot.emoji) return {resultado: `${this.player.emoji} x ${this.bot.emoji}, você venceu!`}
        if (this.player.perde === this.bot.emoji) return {resultado: `${this.player.emoji} x ${this.bot.emoji}, você perdeu!`}
        // return {resultado: `${this.player.emoji}, ${this.bot.emoji}`}
    }


}


module.exports = {Jokenpo}
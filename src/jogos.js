class Jogo{
    
    static tipos = ['Jokenpo', '21']

    /**
     * 
     * @param {string} tipo tipo do jogo, esse parâmetro é passado pelo comando
     * @param {User} autor Autor da mensagem que utilizou o comando
     * @returns 
     */
    constructor(autor){
        this.tipo = this.constructor.name
        this.autor = autor

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

        if (this.player.emoji === this.bot.emoji) return {resultado: `${this.autor.globalName} ${this.player.emoji} x ${this.bot.emoji}, empate!`}
        if (this.player.vence === this.bot.emoji) return {resultado: `${this.autor.globalName} ${this.player.emoji} x ${this.bot.emoji}, você venceu!`}
        if (this.player.perde === this.bot.emoji) return {resultado: `${this.autor.globalName} ${this.player.emoji} x ${this.bot.emoji}, você perdeu!`}
        return {resultado: `${this.player.emoji}, ${this.bot.emoji}`}
    }

}


module.exports = {Jokenpo}
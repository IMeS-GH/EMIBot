const Conta = require("./contas")

class Jogo{
    
    static tipos = ["Jokenpo", "VinteUm", "ApostaCores"]

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

        if(!Jogo.tipos.includes(this.tipo)) throw new Error({message: "Esse jogo não existe."})

    }
}

class Jokenpo extends Jogo{

    // Lógica;
    // 0 -> pedra  || 0 -> 2  ✊ 
    // 1 -> papel || 1 -> 0 ✋
    // 2 -> tesoura || 2 -> 1 ✌️

    static opcoes = new Map(
        [["✊", {perde: "✋", vence: "✌️", emoji: "✊"}],
         ["✋", {perde: "✌️", vence: "✊", emoji: "✋"}],
          ["✌️", {perde: "✊", vence: "✋", emoji: "✌️"}]]
        )
    
    static opKeys = {
        0 : "✊",
        1 : "✋",
        2 : "✌️"
    }

    constructor(autor, escolha_player){
        super(autor)

        this.player = Jokenpo.opcoes.get(escolha_player)
        this.bot = Jokenpo.opcoes.get(Jokenpo.opKeys[Math.floor(Math.random() * 3)])
        this.reply = {message: "Algo deu errado", status: "fail"}

        if (this.player.emoji === this.bot.emoji) this.reply = {status: "ok", valor: 0, message: `${this.autor.globalName} ${this.player.emoji} x ${this.bot.emoji}, empate!`}
        if (this.player.vence === this.bot.emoji) this.reply = {status: "ok", valor: 100, message: `${this.autor.globalName} ${this.player.emoji} x ${this.bot.emoji}, você venceu!`}
        if (this.player.perde === this.bot.emoji) this.reply = {status: "ok", valor: -100, message: `${this.autor.globalName} ${this.player.emoji} x ${this.bot.emoji}, você perdeu!`}
       
        this.contaAutor.saldo += this.reply.valor
       
        return this.reply
    }

}

class ApostaCores extends Jogo{
    
    
    static coresAposta = ["vermelho", "preto", "branco"]

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
        this.reply = {message: "Algo deu errado", status: "fail"}

        if (!ApostaCores.coresAposta.includes(corApostada) || isNaN(valorAposta)) return {message: "Uso correto: !aposta <vermelho/preto/branco> <valor>", status: "fail"}
        if(this.contaAutor.saldo < valorAposta) return {message: "Você não tem saldo suficiente para fazer essa aposta.", status: "fail"}

        this.resultado = Math.floor(Math.random() * 100) + 1;

        this.reply.message = `Você apostou ${valorAposta} na cor ${corApostada}.\n`;

        if (corApostada === "branco" && this.resultado <= 10) { // 10% de chance para branco
            const ganho = valorAposta * 9; // Pagamento 9x
            this.contaAutor.saldo += ganho;
            this.reply.message += `Você ganhou! Seu saldo agora é ${this.contaAutor.saldo}.`;
        } else if (
            (corApostada === "vermelho" && this.resultado <= 45) ||
            (corApostada === "preto" && this.resultado <= 45)
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

class Player {

    constructor(user, turno){

        this.user = Conta.db.get(user) || new Conta({id: user.id, nome: user.nome, username: user.username})
        this.baralho = []
        this.pontos = 0
        this.turno = turno
        this.bot = user.bot
    }

    passarTurno(player){
        this.turno = false
        player.turno = true
        return `${this.user.username} Passou o turno! agora é a vez de ${player.user.username}`
    }
    
    sacar (){
        const carta = VinteUm.gerarCarta()
        this.baralho.push(carta)
        this.pontos = this.baralho.reduce((acc, carta) => acc + VinteUm.Cartas.get(carta), 0)
        return `${this.user.username} sacou uma carta! A carta é **${carta}**.`
    }

}

class VinteUm extends Jogo{

    static Cartas = new Map([
        ["1", 1],
        ["2", 2],
        ["3", 3],
        ["4", 4],
        ["5", 5],
        ["6", 6],
        ["7", 7],
        ["8", 8],
        ["9", 9],
        ["10", 10],
        ["J", 10],
        ["Q", 10],
        ["K", 10]
    ])

    static gerarCarta(num=1){

        const baralho = []

        for (let i = 0; i < num; i++){
            const carta =  [...VinteUm.Cartas.keys()][1 + parseInt(Math.random() * 12)]
            baralho.push(carta)
        }

        return baralho.length === 1 ? baralho[0] : baralho
    }


    constructor(autor, versus, valorAposta=100){
        super(autor)
        
        this.versus = versus
        this.reply = {status: "fail", message: "Algo deu errado", valor: 0}
        this.valorAposta = Number(valorAposta)
        this.player1 = new Player(autor, true)
        this.player2 = new Player(versus, false)

    }

    pararJogo(){
        if (this.player1.pontos > 21){
            this.reply.message = `${this.autor.username} Perdeu!`
            this.player1.user.saldo -= this.valorAposta
            this.player2.user.saldo += this.valorAposta
            this.reply.status = "perdeu"
        } 
        else if (this.player2.pontos > 21) {
            this.reply.message = `${this.versus.username} Perdeu!`
            this.player1.user.saldo += this.valorAposta
            this.player2.user.saldo -= this.valorAposta
            this.reply.status = "venceu"
        } 
        else if (this.player1.pontos > this.player2.pontos) {
            this.reply.message = `${this.autor.username} Venceu!`
            this.player1.user.saldo += this.valorAposta
            this.player2.user.saldo -= this.valorAposta
            this.reply.status = "venceu"
        }
        else if (this.player1.pontos < this.player2.pontos) {
            this.reply.message = `${this.versus.username} Venceu!`
            this.player1.user.saldo -= this.valorAposta
            this.player2.user.saldo += this.valorAposta
            this.reply.status = "perdeu"

        } 
        else if (this.player1.pontos === this.player2.pontos) this.reply.message = `Empate!`
    }

    mostrarMaos(){
        return `**${this.autor.username}:** ${this.player1.baralho} (${this.player1.pontos} pontos)\n**${this.versus.username}:** ${this.player2.baralho} (${this.player2.pontos} pontos)`
    }
}

module.exports = {ApostaCores, Jokenpo, VinteUm}
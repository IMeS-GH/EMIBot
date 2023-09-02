class Conta{

    static db = new Map()


    constructor({id, nome, nickname}){
        this.id = id
        this.nome = nome
        this.nickname = nickname
        this.saldo = 0
        this.ultimoTrabalho = 0
    }

    mostrarConta(){
        return this
    }

    trabalhar(){
        const horaTrabalho = new Date().valueOf()
        if (horaTrabalho - this.ultimoTrabalho > 30000){
            
            const dinheiro = 100 + Math.ceil(Math.random() * 500)
            this.ultimoTrabalho = horaTrabalho
            this.saldo += dinheiro
            return dinheiro
        }

        return false
    }
}

module.exports = Conta
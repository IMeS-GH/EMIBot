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

    transferir(usuario, valor){
        valor = Number(valor)
        if (usuario === undefined || isNaN(valor)) return ('Não foi possível realizar essa transferência, conta ou valor não existe')
        if (valor > this.saldo) return ('https://i1.sndcdn.com/avatars-6MYmIsqrQG5zqYs7-CAXKkg-t500x500.jpg \nVocê não tem dinheiro o suficiente.')


        this.saldo -= Number(valor)
        usuario.saldo += Number(valor)

        return (`Usuário ${this.nickname} transferiu ${valor} para ${usuario.nickname}.`)
    }
}

module.exports = Conta
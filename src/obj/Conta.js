class Conta {

    static db = new Map();

    constructor({id, nick ,nome}){
        this.id = id;
        this.nick = nick;
        this.nome = nome;
        this.saldo = 0; 
        this.descanso = 0;
    }
    conta(){
        let tempoTrabalhado = new Date().valueOf()
       const info = {
            nome: this.nome,
            nick: this.nick,
            saldo: this.saldo,
            situacao: this.saldo < 1000 ? "Lascado e pobre" : "Endinheirado, mas lascado",
            descanso: tempoTrabalhado - this.descanso > 30000 ? "Descansado" : "Destruido de tão cansado"
        }
        return info
    }

    trabalhar(){
        const cargaHoraria = new Date().valueOf();

        if(cargaHoraria - this.descanso > 30000){
            this.descanso = cargaHoraria;
            let salario = 100 + Math.ceil(Math.random() * 500)
            this.saldo += salario;
            return salario
        }else{
            return false
        }
    }

    depositar(saldo){
        this.saldo -= saldo
        return this
    }
    
}

module.exports = Conta;
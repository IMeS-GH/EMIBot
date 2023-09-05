const dataJSON = require('./dataValidation.js');
 

class Conta {
    static db = new Map()
   
    #saldo
    constructor({ id, nome, username }) {
        this.id = id;
        this.nome = nome;
        this.username = username;
        this.#saldo = 0;
        this.ultimoTrabalho = 0;
    }
    mostrarConta() {
        return this;
    }
    get saldo(){
        return this.#saldo;
    }
    set saldo(novoValor){
        this.#saldo = novoValor;

        let dados = dataJSON.carregarDados();
        let user = dataJSON.encontrarUsuario(this.username);
        user.saldo += this.#saldo;

        dataJSON.salvarDados(dados);
    }
    trabalhar() {
        const horaTrabalho = new Date().valueOf()
        if (horaTrabalho - this.ultimoTrabalho > 30000) {

            const dinheiro = 100 + Math.ceil(Math.random() * 500);
            this.ultimoTrabalho = horaTrabalho;
            this.#saldo += dinheiro; 
            return dinheiro;
        }

        return false;
    }

    transferir(destino, valor) {
        if (valor <= 0) {
            return "O valor da transferência deve ser maior que zero.";
        }

        if (this.#saldo < valor) {
            return "Saldo insuficiente para realizar a transferência.";
        }

        this.#saldo -= valor;
        destino.saldo += valor;
        return `Transferência bem-sucedida! ${this.nome} transferiu ${valor} dinheiros para ${destino.nome}.`;
    }
}

module.exports = Conta;
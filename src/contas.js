const fs = require('fs');
const path = require('path');

class Conta {
    static db = new Map()
    static filePath = path.join(__dirname, 'database', 'users.json');

    constructor({ id, nome, username }) {
        this.id = id;
        this.nome = nome;
        this.username = username;
        this.saldo = 0;
        this.ultimoTrabalho = 0;

        const conta = this;
        
        this.cadastrarUser(conta)
    }
    mostrarConta() {
        return this;
    }

    trabalhar() {
        const horaTrabalho = new Date().valueOf()
        if (horaTrabalho - this.ultimoTrabalho > 30000) {

            const dinheiro = 100 + Math.ceil(Math.random() * 500);
            this.ultimoTrabalho = horaTrabalho;
            this.saldo += dinheiro;
            return dinheiro;
        }

        return false;
    }

    transferir(destino, valor) {
        if (valor <= 0) {
            return "O valor da transferência deve ser maior que zero.";
        }

        if (this.saldo < valor) {
            return "Saldo insuficiente para realizar a transferência.";
        }

        this.saldo -= valor;
        destino.saldo += valor;
        return `Transferência bem-sucedida! ${this.nome} transferiu ${valor} dinheiros para ${destino.nome}.`;
    }
    cadastrarUser(conta) {
       const dados = this.carregarDados();

         dados.push({
            id: conta.id,
            nome: conta.nome,
            username: conta.username,
            saldo: conta.saldo,
            ultimoTrabalho: conta.ultimoTrabalho
        });
        
        this.salvarDados(dados);
    }
    carregarDados() {
        return JSON.parse(fs.readFileSync(Conta.filePath, "utf-8"));
    }
    salvarDados(dados){
       return fs.writeFileSync(Conta.filePath, JSON.stringify(dados, null, " "));
    }
}
module.exports = Conta;
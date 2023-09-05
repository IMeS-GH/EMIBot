const path = require('path');
const fs = require('fs');

const validation = {
    filePath: path.join(__dirname, 'database', 'users.json'),
    
    validarExistencia(id){
        const usuarios = this.carregarDados();
        if(typeof id === "string"){
            let usuario = usuarios.find(usuario => usuario.username === id)
            if(usuario){
                return true;
            }else{
                return false;
            }
        }else if(typeof id === "number"){
            let usuario = usuarios.find(usuario => usuario.id === id)
            if(usuario){
                return true;
            }else{
                return false;
            }
        }
    },
    encontrarUsuario(id){
        const usuarios = this.carregarDados();
        console.log(id)
        if(typeof id === "string"){
            let usuario = usuarios.find(usuario => usuario.username == id)

            return usuario;
        }else if(typeof id === "number"){
            let usuario = usuarios.find(usuario => usuario.id == id)

            return usuario;
        }else{
            return false
        }
    },
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
     },
    trabalhar(salario, id) {
        const usuarios = this.carregarDados();
        let usuario = usuarios.find(usuario => usuario.username == id);

        usuario.saldo += salario;

        this.salvarDados(usuarios);
    },
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
    },
    salvarDados(dados){
        console.log(dados)
        return fs.writeFileSync(this.filePath, JSON.stringify(dados, null, " "));
     },
     carregarDados() {
         return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
     },
}

module.exports = validation;

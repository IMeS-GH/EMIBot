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
    salvarDados(dados){
       return fs.writeFileSync(this.filePath, JSON.stringify(dados, null, " "));
    },
    carregarDados() {
        return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    },
    
}

module.exports = validation;

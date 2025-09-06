//verifica o perfil do usuario, vendo se ele pode acessar aquela rota 
const database = require('../models'); 

const roles = (listaRoles) => {
    return async (req, res, next) => {
        const { usuarioId } = req; 

        const usuario = await database.usuarios.findeOne({
            include: [
                { 

                    model: database.roles, 
                    as: 'usuario_roles', 
                    attributes: ['id', 'nome']

                }
            ], 
            where: {
                id: usuarioId
            }
        }); 

        if(!usuario) {
            return res.status(401).send('Usuario nao cadastrado')
        }

        const rolesCadastradas = usuario.usuario_roles
            .map((role) => role.nome)
            //se possui a informacao igual, se o usuario realmente possui a permissao 
            .some((role) => listaRoles.includes(role))

        if(!rolesCadastradas) {
            return res.status(401).send('Usuario nao possui acesso a essa rota ')
        }

        //o fluxo do usuario volta a ser seguido normalmente com a permissao que ele tem 
        return next(); 
    }
}

module.exports = roles; 
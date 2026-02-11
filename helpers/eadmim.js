//aqui vamos fazer a verificação do usurio, verificaremos se ele está autenticado e se ele é ADMIM

module.exports = {

    eadmim: function(req, res, next){
        if(req.isAuthenticated() && req.user.eadmim == 1){
            return next()
        }
        // codigo acima verifica se o usuario é autenticado e admim 

        req.flash('error_msg', 'Você precisa ser ADMIM')
        res.redirect('/')
    }
   

}
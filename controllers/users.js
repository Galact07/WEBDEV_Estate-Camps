const User=require('../models/user')

module.exports.renderRegister=(req,res)=>{
    res.render('users/register')
}
module.exports.register =async(req,res)=>{
    try {
        const {email,username,password}= req.body
    const user= new User({email,username})
    const registeredUser= await User.register(user,password)
    req.login(registeredUser,(err)=>{
        if(err) next(err);
          req.flash('success','Welcome to flash')
          res.redirect('/campgrounds')
    })
    
    } catch (e) {
        req.flash('error',e.message)
        res.redirect('/register')
    }
    
}

module.exports.renderLogin =(req,res)=>{
    res.render('users/login')
}

module.exports.login=(req,res)=>{
    req.flash('success',"Welcome Back")  
    const redirectUrl= req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
   
}

module.exports.logout= (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            req.flash('error',  err.message)
        return next(err)
        }
         req.flash('success',"Logged out successfully")
         res.redirect('/campgrounds')
    })
   
}
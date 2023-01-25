const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy;

const users = [{
  _id: 1,
  username:'adm',
  password:'$2a$06$HT.EmXYUUhNo3UQMl9APmeC0SwoGsx7FtMoAWdzGicZJ4wR1J8alW',
  email: 'diego@br.com.br'
}]

module.exports = function(passport){
  const findUser = (username)=>{
     return users.find(item => item.username === username);
  }
  const findUserById = (id) =>{
    return users.find(item => item._id === id )
  }

  passport.serializeUser((user,done)=>{
    done(null , user._id)
  })
  passport.deserializeUser((id,done)=>{
    try{
      const user =findUserById(id);
      done(null,user);
    }
    catch(err){
    console.log(err)
    return done(err,null);
  }
})

  passport.use(new LocalStrategy({
    usernameField:'username',
    passwordField:'password'
  },
  (username,password , done)=>{
try{
  const user =findUser(username);
  if(!user) return done(null,false);

  const isValid = bcrypt.compareSync(password, user.password)
  if(!isValid) return done(null, false)
  return done(null, true);
}
catch(err){
  console.log(err);
  return done(err,false)
}
  }))
}
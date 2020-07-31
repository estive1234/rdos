const localStrategy = require('passport-local').Strategy
const {pool} = require('./DB_Config')
const bcrypt = require('bcrypt')




function initialize (passport){
    
    const autheticateUser = (nick,password, done)=>{
        pool.query(
            `SELECT * FROM users WHERE nick = $1`,[nick],(err, results)=>{
                if(err){
                    throw err  
                }
                console.log(results.rows)
                if(results.rows.length >0) {
                    const user = results.rows[0]  
                    
                    
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err){
                            throw err
                            
                        }
                        if(isMatch){
                            return done(null,user)
                        }else{
                            return done(null,false,{message:'Senha incorreta'})
                        }
                    })
                }else{
                    return done(null,false,'Usuario não registrado')
                }
            }
            )
        }
        
        
        passport.use(new localStrategy({
            usernameField:'nick',
            passwordField:'password'
        },
        autheticateUser
        )
        )
        passport.serializeUser((user,done)=>done(null,user.id))
        passport.deserializeUser((id,done)=>{
            pool.query(
                `SELECT * FROM users WHERE id=$1`,[id],(err,results)=>{
                    if(err){
                        throw err
                    }
                    return done(null,results.rows[0])
                }
                )
            })
        }
        
        
        
        module.exports =initialize
        
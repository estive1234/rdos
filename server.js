const express = require('express')
const app = express()
const {pool} = require ('./DB_Config')
const bcrypt = require ('bcrypt')
const session = require ('express-session')
const flash = require('express-flash')
const passport =require ('passport')
const initializePassaport=require('./passportConfig')
const { Pool } = require('pg')



initializePassaport(passport)


const PORT = process.env.PORT || 4000 

app.use(express.static('./'))
app.set('view engine','ejs')
app.set('views', './views')
app.use(express.urlencoded({extended : false}))
app.use(session({
    secret : 'dennis',
    
    resave: false,
    
    saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())


app.get('/',(req,res)=>{
    res.render('index')
    
    
    
});


app.get('/users/register',checkNotAuthenticated,(req,res)=>{
    
    res.render('register')
});



app.get('/users/login',checkAuthenticated,(req,res)=>{
    
    res.render('login')
});




app.get('/users/dashboard',checkNotAuthenticated,(req,res)=>{
    
    res.render('dashboard',{nick: req.user.name})
});




app.get('/users/logout',(req,res)=>{
    req.logOut()
    req.flash('success_msg','Voce saiu com sucesso')
    res.redirect('/users/login')
})


app.get('/users/rdo',checkNotAuthenticated,(req,res)=>{
    res.render ('rdo')
}) 

app.get('/users/lista',checkNotAuthenticated,(req,res)=>{
    res.render ('lista')
})

app.get("/users/4682",async (req,res)=>{
    const rows=await valor_hh()
    
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(rows))
    
})

app.get('/users/projetos',async(req,res)=>{
    res.render ('projetos') 
}
)


app.post('/users/projetos',async(req,res)=>{
    const reqJson =req.body
    console.log(reqJson)
    const rows = await buscar_projetos(reqJson.projeto,reqJson.oc,reqJson.fornecedor)
    res.redirect('/users/projetos')  
})

app.post('/users/projetos2',async(req,res)=>{
    const reqJson =req.body
    console.log(reqJson)
    const rows = await deletar_projetos(reqJson.deletar)
    res.redirect('/users/projetos')
})

app.get("/users/2222",async (req,res)=>{
    const rows=await buscar()
    
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(rows))
    
})










app.get('/users/nova_oc',checkNotAuthenticated,async(req,res)=>{
    res.render ('nova_oc') 
}
)

app.post('/users/nova_oc',checkNotAuthenticated,async(req,res)=>{
    const reqJson =req.body
    console.log(reqJson)
    const rows = await criar_oc(reqJson.projeto,reqJson.oc,reqJson.empresa,reqJson.valor)
    res.redirect('/users/nova_oc')  
})









app.get('/users/novo_rdo',checkNotAuthenticated,async(req,res)=>{
    res.render ('novo_rdo') 
}
)



app.post('/users/novo_rdo',async(req,res)=>{
    const reqJson =req.body
    console.log(reqJson)
    const rows = await novo_rdo(reqJson.projeto,reqJson.responsavel,reqJson.Nome,reqJson.codigo,reqJson.entrada,reqJson.saida,reqJson.normais,reqJson.horas_60,reqJson.horas_100,reqJson.adicional_noturno)
    res.redirect('/users/novo_rdo')  
})
app.post("/users/novo_rdo2",async(req,res)=>{
    const reqJson =req.body
    console.log(reqJson)
    const rows = await deletar_rdo(reqJson.deletar)
    res.redirect('/users/novo_rdo')
})

app.get("/users/4444",async (req,res)=>{
    const rows=await buscar_rdo_sermotec()

    
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(rows))
    
})

app.post('/users/4444',async(req,res)=>{
    res.redirect('/users/novo_rdo/descricao')  
})


app.get('/users/8080',async(req,res)=>{
    const rows= await calculo()
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(rows))
})


app.get('/users/novo_rdo/descricao',checkNotAuthenticated,async(req,res)=>{
    res.render('descricao')
})
app.post('/users/novo_rdo/descricao',async(req,res)=>{
    const reqJson =req.body
    console.log(reqJson)
    const rows = await descricao(reqJson.descricao,reqJson.obs,reqJson.numero)
    res.redirect('/users/novo_rdo')
})


app.get('/users/meio',checkNotAuthenticated,async(req,res)=>{
    res.render('meio')
})






app.get('/users/numero',checkNotAuthenticated,async(req,res)=>{
    res.render('numero')
})



app.post('/users/numero',async(req,res)=>{
    const reqJson =req.body
    console.log(reqJson)
    const rows = await aprovar_nao_projeto(reqJson.rdo,reqJson.oc,reqJson.oc2,reqJson.projeto)
    res.redirect('/users/numero')
})


app.post('/users/ver_descricao',async(req,res)=>{
    const reqJson =req.body
    console.log(reqJson)
    const rows = await ver_descricao(reqJson.descricao)
    res.redirect('/users/mostrar_descricao')
})



app.post('/users/recusar',async(req,res)=>{
    const reqJson =req.body
    console.log(reqJson)
    const rows = await recusar(reqJson.recusar)
    res.redirect('/users/numero')
})






app.get('/users/8484',async(req,res)=>{
    const rows=await buscar_nao_projeto()
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(rows))
})




app.get('/users/mostrar_descricao',checkNotAuthenticated,async(req,res)=>{
    res.render('mostrar_descricao')
})






app.get('/users/2224',async(req,res)=>{
    const rows=await buscar_descricao()
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(rows))
})



app.get('/users/aprovados',checkNotAuthenticated,async(req,res)=>{
    res.render ('aprovados') 
}
)
app.get('/users/6922',async(req,res)=>{
    const rows=await buscar_aprovados2()
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(rows))

}
)





app.get('/users/recusados',checkNotAuthenticated,async(req,res)=>{
    res.render ('recusados') 
}
)

app.get('/users/6988',async(req,res)=>{
    const rows=await buscar_recusados()
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(rows))

}
)









app.post('/users/register',async (req,res)=>{
    
    let {name,nick,password,password2} =req.body
    console.log({
        name,
        nick,
        password,
        password2
    })
    
    let errors = [];
    
    if (!name ||!nick||!password||!password2){
        errors.push({message:" Por favor preencher todos os campos"})
    }
    
    if (password.length < 6) {
        errors.push({message:"A senha deve ter no minimo 6 caracteres"})
    }
    
    if(password != password2) {
        errors.push({message:" As senhas não estao iguais"})
    }
    
    if (errors.length > 0 ){
        res.render('register',{errors})
    }
    else{
        let hashedPassword = await bcrypt.hash(password,10)
        console.log(hashedPassword)
        
        
        pool.query(`SELECT * FROM users
        WHERE nick =$1`,[nick],
        (err,results)=>{
            if(err){
                throw err
            }
            console.log(results.rows)
            if(results.rows.length > 0){
                errors.push({message:"usuario ja está em uso"})
                res.render('register',{errors})
            } else{
                pool.query(
                    `INSERT INTO users (name,nick,password)
                    VALUES ($1,$2,$3)
                    RETURNING id,password`,[name,nick,hashedPassword],(err,results)=>{
                        if (err){
                            throw err
                        }
                        console.log(results.rows)
                        req.flash('success_msg','Conta criada com sucesso')
                        res.redirect('login')
                        
                    } 
                    
                    )
                }
            })
            
        }
        
        
    })
    
    
    
    
    app.post('/users/login',passport.authenticate('local',{
        successRedirect:'/users/dashboard',
        failureRedirect:'/users/login',
        failureFlash :true
    }))
    
    
    
    
    
    
    
    
    
    
    
    function checkAuthenticated(req,res,next){
        if(req.isAuthenticated()) {
            return res.redirect('/users/dashboard')
        }
        next()
    }
    function checkNotAuthenticated (req,res,next){
        if (req.isAuthenticated()){
            return next()
        }
        res.redirect('/users/login')
    }
    
    
    
    async function valor_hh(){
        try{
            const result = await pool.query ('SELECT * FROM valor_hh');
            return result.rows;
        }
        catch(err){
            throw err;
        }
    }
    
    
    
    
    
    
    
    
    
    async function buscar_projetos(projeto,oc,fornecedor){
        let errors =[]
        if(!projeto && !oc && !fornecedor){
            errors.push({message:'Favor preencher formulario'})
            return errors
        } else{ if(!projeto && !fornecedor){
            pool.query(`SELECT * FROM projetos WHERE oc = $1`,[oc],
            (err,result)=>{
                if(err){
                    throw err
                }
                if(result.rows.length==0){
                    errors.push({message:'Essa OC não existe ou não está cadastrada'})
                    return errors
                    
                    
                }else{
                    console.log(result.rows)
                    pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE oc =$1`,[oc],
                    (err,result)=>{
                        if(err){
                            throw err}
                        })
                        return result.rows
                        
                        
                    }
                })
            } else{ if(!projeto && !oc){
                pool.query(`SELECT * FROM projetos WHERE empresa = $1`,[fornecedor],
                (err,result)=>{
                    if(err){
                        throw err
                    }
                    if(result.rows.length==0){
                        errors.push({message:'Esse fornecedor não existe ou não está cadastrada'})
                        return errors
                        
                        
                    }else{
                        console.log(result.rows)
                        pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE empresa =$1`,[fornecedor],
                        (err,result)=>{
                            if(err){
                                throw err}
                            })
                            return result.rows
                            
                            
                        }
                    })
                }else{if(!oc && !fornecedor){
                    pool.query(`SELECT * FROM projetos WHERE numero_projeto = $1`,[projeto],
                    (err,result)=>{
                        if(err){
                            throw err
                        }
                        //console.log(result.rows)
                        if(result.rows.length==0){
                            errors.push({message:'Esse projeto não existe ou não está cadastrada'})
                            return errors
                            
                        }else{
                            console.log(result.rows)
                            pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE numero_projeto =$1`,[projeto],
                            (err,result)=>{
                                if(err){
                                    throw err}
                                })
                                return result.rows
                                
                                
                            }
                        })
                    }else{if(!projeto){
                        pool.query(`SELECT * FROM projetos WHERE (oc,empresa) = ($1,$2)`,[oc,fornecedor],
                        (err,result)=>{
                            if(err){
                                throw err
                            }
                            //console.log(result.rows)
                            if(result.rows.length==0){
                                errors.push({message:'Não há fornecedor com essa OC'})
                                return errors
                                
                            }else{
                                console.log(result.rows)
                                pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE (oc,empresa) =($1,$2)`,[oc,fornecedor],
                                (err,result)=>{
                                    if(err){
                                        throw err}
                                    })
                                    return result.rows
                                    
                                    
                                }
                            })
                        }else{if(!oc){
                            pool.query(`SELECT * FROM projetos WHERE (numero_projeto,empresa) = ($1,$2)`,[projeto,fornecedor],
                            (err,result)=>{
                                if(err){
                                    throw err
                                }
                                
                                if(result.rows.length==0){
                                    errors.push({message:'Não existe esse fornecedor no projeto indicado'})
                                    return errors
                                    
                                }else{
                                    console.log(result.rows)
                                    pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE (numero_projeto,empresa) =($1,$2)`,[projeto,fornecedor],
                                    (err,result)=>{
                                        if(err){
                                            throw err}
                                        })
                                        return result.rows
                                        
                                        
                                    }
                                })
                            }else{if(!fornecedor){
                                pool.query(`SELECT * FROM projetos WHERE (numero_projeto,oc) = ($1,$2)`,[projeto,oc],
                                (err,result)=>{
                                    if(err){
                                        throw err
                                    }
                                    //console.log(result.rows)
                                    if(result.rows.length==0){
                                        errors.push({message:'Essa OC não existe nesse projeto'})
                                        return errors
                                        
                                    }else{
                                        console.log(result.rows)
                                        pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE (numero_projeto,oc) =($1,$2)`,[projeto,oc],
                                        (err,result)=>{
                                            if(err){
                                                throw err}
                                            })
                                            return result.rows
                                            
                                            
                                        }
                                    })
                                }else{
                                    pool.query(`SELECT * FROM projetos WHERE (numero_projeto,oc,empresa) = ($1,$2,$3)`,[projeto,oc,fornecedor],
                                    (err,result)=>{
                                        if(err){
                                            throw err
                                        }
                                        //console.log(result.rows)
                                        if(result.rows.length==0){
                                            errors.push({message:'Dados nao conferem'})
                                            return errors
                                            
                                        }
                                        else{
                                            console.log(result.rows)
                                            pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE (numero_projeto,oc,empresa) =($1,$2,$3)`,[projeto,oc,fornecedor],
                                            (err,result)=>{
                                                if(err){
                                                    throw err}
                                                })
                                                return result.rows
                                                
                                                
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } 



        async function deletar_projetos(oc){
        try{
            pool.query(`DELETE FROM projetos WHERE oc = $1`,[oc])
            pool.query(`DELETE FROM buscar WHERE oc = $1`,[oc])
        }
        catch(err){
            throw err
        }
        }
        
        
        
        async function buscar(){
            try{
                const result = await pool.query ('SELECT * FROM buscar');
                console.log(result.rows)
                return result.rows;
            }
            catch(err){
                throw err;
            }
        }
        
        
        
        async function criar_oc(projeto,oc,empresa,valor){
            let errors = []
            var valor2= valor.replace(/,/g,".")
            console.log (valor2)
            pool.query(`SELECT * FROM projetos WHERE oc =$1`,[oc],(err,result)=>{
                if(err){
                    throw err
                }
                if(result.rows.length >0){
                    errors.push({message:'OC ja cadastrada'})
                }
                else{pool.query('INSERT INTO projetos (numero_projeto,oc,empresa,valor_faturado,valor_total) VALUES ($1,$2,$3,0,$4)',[projeto,oc,empresa,valor2],
                (err,result)=>{
                    if(err){
                        return errors
                    }
                    errors.push({message:'OC cadastrada com sucesso'})
                })}
            })
        }





        
        
        
        async function novo_rdo(projeto,responsavel,nome,codigo,entrada,saida,normais,horas_60,horas_100,noturno){
            errors =[]
            console.log(nome)
           var normais2 = normais.replace(/,/g,".")
           var horas_602 =horas_60.replace(/,/g,".")
           var horas_1002 = horas_100.replace(/,/g,".")
           var noturno2 = noturno.replace(/,/g,".")
            if(!projeto){
                pool.query(`INSERT INTO sermotec (funcao,valor_hh,status1) SELECT funcao,valor_hora,status FROM valor_hh WHERE id = $1 `,[codigo],(err,result)=>{
                    if(err){
                        throw err
                    }
                })
                pool.query(`UPDATE sermotec SET responsavel=$1,nome_funcionario=$2,entrada=$3,saida=$4,horas_normais=$5,horas_60=$6,horas_100=$7,adicional_noturno=$8,status1=$9 WHERE status1=$10`,
                [responsavel,nome,entrada,saida,normais2,horas_602,horas_1002,noturno2,'pendente','1'],(err,result)=>
                {if(err){
                    return errors}
                return result.rows
            })
        
            }else{
           pool.query(`SELECT * FROM projetos where numero_projeto =$1`,[projeto],(err,result)=>{
               if(err){
                   throw err
               }
               if(result.rows.length =0){
                   errors.push({message:'Projeto nao cadastrado'})
               } else{
                 pool.query(`INSERT INTO sermotec (funcao,valor_hh,status1) SELECT funcao,valor_hora,status FROM valor_hh WHERE id = $1 `,[codigo],(err,result)=>{
                    if(err){
                        throw err
                    }
                })
                pool.query(`UPDATE sermotec SET responsavel=$1,nome_funcionario=$2,entrada=$3,saida=$4,horas_normais=$5,horas_60=$6,horas_100=$7,adicional_noturno=$8,status1=$9,numero_projeto =$10 WHERE status1=$10`,
                [responsavel,nome,entrada,saida,normais,horas_60,horas_100,noturno,'pendente','1',projeto],(err,result)=>
                {if(err){
                    throw err}
                return result.rows
            })
                    pool.query(`INSERT INTO calculo (valor_atual,valor_projeto) SELECT SUM(valor_atual),SUM(valor_total) FROM projetos where numero_projeto = $1`,[projeto],(err,result)=>{
                       if(err){
                           throw err
                       }
                   })
                   pool.query(`UPDATE calculo SET valor_novo = SELECT SUM(valor_total) FROM sermotec WHERE status = $1`,['pendente'],(err,result)=>{
                       if(err){
                           throw err
                       }
                   })
               }
           })}
           
        }


        
        async function deletar_rdo(id){
            try{
                pool.query(`DELETE FROM sermotec WHERE id = $1`,[id])
                pool.query(`DELETE FROM sermotec WHERE id = $1`,[id])
            }
            catch(err){
                throw err
            }
            }
           

        
        
        
        async function buscar_rdo_sermotec(){
            try{
                const result = await pool.query (`SELECT id,responsavel,nome_funcionario,funcao,entrada,saida,horas_normais,horas_60,horas_100,adicional_noturno,valor_hh,valor_total,status1,numero_projeto FROM sermotec WHERE status1=$1 ORDER BY id`,['pendente'])
                const rows=result.rows
                

                return result.rows;
            }
            catch(err){
                throw err;
            }
        }

        

        async function descricao(descricao,obs,numero){
            pool.query(`UPDATE sermotec SET status1 = $1 ,status2=$2, numero_rdo=$3,descricao=$4,observacao=$5 WHERE status1=$6`,['confirmado','pendente',numero,descricao,obs,'pendente'],(err,result)=>{
                if(err){
                    throw err
                } 
                return result.rows
            })
        }

        async function calculo() {
            try{
                const result = await pool.query ('SELECT * FROM calculo');
                console.log(result.rows)
                return result.rows;
            }
            catch(err){
                throw err;
            }
            
        
        }








        async function buscar_nao_projeto(){
            try{
                const result = await pool.query (`SELECT id,responsavel,  nome_funcionario, funcao, entrada, saida, horas_normais, horas_60, horas_100 ,adicional_noturno, valor_hh, valor_total, numero_rdo ,status2 FROM sermotec WHERE status2 = $1 AND numero_projeto IS null ORDER BY id`,['pendente'])
                const rows=result.rows
                

                return result.rows;
            }
            catch(err){
                throw err;
            }

        }




        async function recusar(rdo){
            errors = []
            try{
                const result = await pool.query (`SELECT * FROM sermotec WHERE numero_rdo = $1`,[rdo])
                if(result.rows.length ==0){
                    return errors
                }else{
                    pool.query(`UPDATE sermotec SET status2 = $1 WHERE numero_rdo = $2`,['Recusado',rdo])
                    return errors
                }
                

                return result.rows;
            }
            catch(err){
                throw err;
            }

        }


        


        async function buscar_descricao(){
            try{
                const result = await pool.query (`SELECT * FROM descricao`)
                console.log(result.rows)
                const rows=result.rows
                

                return result.rows;
            }
            catch(err){
                throw err;
            }

        }






        async function aprovar_nao_projeto(rdo,oc,oc2,projeto){
            errors = []
            pool.query(`SELECT SUM(valor_total) AS soma FROM sermotec WHERE numero_rdo = $1 and status2=$2 `,[rdo,'pendente'],(err,results)=>{
                if(err){
                    throw err
                }
                if(results.rows.length==0){
                    errors.push({message:'Favor escolher numero de rdo valido'})
                }
                else{
                    pool.query(`SELECT * FROM projetos WHERE oc =$1`,[oc],(err,valor)=>{
                        if(err){
                            throw err
                        }
                        if(valor.rows.length==0){
                            errors.push({message:'Projeto nao cadastrado'})
                        }
                        else{
                            if(!oc2){
                                const x =(parseInt(valor.rows[0].valor_total)-parseInt(valor.rows[0].valor_faturado)-parseInt(results.rows[0].soma))
                                const y =(parseInt(valor.rows[0].valor_faturado)+parseInt(results.rows[0].soma))
                          if(x<0){
                              errors.push({message:`Essa oc nao tem saldo para pagar esse RDO`})
                          }else{
                              pool.query(`UPDATE sermotec SET status2=$1 , numero_oc=$2,numero_projeto =$4 WHERE numero_rdo = $3` ,['Aprovado',oc,rdo,projeto],(err,t)=>{
                              if(err){
                                  throw err
                              }}
                              )
                              pool.query(`UPDATE projetos SET valor_faturado = $1 WHERE oc=$2 `,[y,oc],(err,l)=>{
                                  if(err){  
                                      throw err
                                  }
                              })
                          }
                        }
                    }

                    })

                }

                
            })
        }







        async function buscar_aprovados(rdo,projeto){
            let errors =[]
            if(!projeto && rdo){
                errors.push({message:'Favor preencher formulario'})
                return errors
            } else{ if(!projeto){
                pool.query(`SELECT * FROM sermotec WHERE oc = $1`,[oc],
                (err,result)=>{
                    if(err){
                        throw err
                    }
                    if(result.rows.length==0){
                        errors.push({message:'Essa OC não existe ou não está cadastrada'})
                        return errors
                        
                        
                    }else{
                        console.log(result.rows)
                        pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE oc =$1`,[oc],
                        (err,result)=>{
                            if(err){
                                throw err}
                            })
                            return result.rows
                            
                            
                        }
                    })
                } else{ if(!projeto && !oc){
                    pool.query(`SELECT * FROM projetos WHERE empresa = $1`,[fornecedor],
                    (err,result)=>{
                        if(err){
                            throw err
                        }
                        if(result.rows.length==0){
                            errors.push({message:'Esse fornecedor não existe ou não está cadastrada'})
                            return errors
                            
                            
                        }else{
                            console.log(result.rows)
                            pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE empresa =$1`,[fornecedor],
                            (err,result)=>{
                                if(err){
                                    throw err}
                                })
                                return result.rows
                                
                                
                            }
                        })
                    }else{if(!oc && !fornecedor){
                        pool.query(`SELECT * FROM projetos WHERE numero_projeto = $1`,[projeto],
                        (err,result)=>{
                            if(err){
                                throw err
                            }
                            //console.log(result.rows)
                            if(result.rows.length==0){
                                errors.push({message:'Esse projeto não existe ou não está cadastrada'})
                                return errors
                                
                            }else{
                                console.log(result.rows)
                                pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE numero_projeto =$1`,[projeto],
                                (err,result)=>{
                                    if(err){
                                        throw err}
                                    })
                                    return result.rows
                                    
                                    
                                }
                            })
                        }else{if(!projeto){
                            pool.query(`SELECT * FROM projetos WHERE (oc,empresa) = ($1,$2)`,[oc,fornecedor],
                            (err,result)=>{
                                if(err){
                                    throw err
                                }
                                //console.log(result.rows)
                                if(result.rows.length==0){
                                    errors.push({message:'Não há fornecedor com essa OC'})
                                    return errors
                                    
                                }else{
                                    console.log(result.rows)
                                    pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE (oc,empresa) =($1,$2)`,[oc,fornecedor],
                                    (err,result)=>{
                                        if(err){
                                            throw err}
                                        })
                                        return result.rows
                                        
                                        
                                    }
                                })
                            }else{if(!oc){
                                pool.query(`SELECT * FROM projetos WHERE (numero_projeto,empresa) = ($1,$2)`,[projeto,fornecedor],
                                (err,result)=>{
                                    if(err){
                                        throw err
                                    }
                                    
                                    if(result.rows.length==0){
                                        errors.push({message:'Não existe esse fornecedor no projeto indicado'})
                                        return errors
                                        
                                    }else{
                                        console.log(result.rows)
                                        pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE (numero_projeto,empresa) =($1,$2)`,[projeto,fornecedor],
                                        (err,result)=>{
                                            if(err){
                                                throw err}
                                            })
                                            return result.rows
                                            
                                            
                                        }
                                    })
                                }else{if(!fornecedor){
                                    pool.query(`SELECT * FROM projetos WHERE (numero_projeto,oc) = ($1,$2)`,[projeto,oc],
                                    (err,result)=>{
                                        if(err){
                                            throw err
                                        }
                                        //console.log(result.rows)
                                        if(result.rows.length==0){
                                            errors.push({message:'Essa OC não existe nesse projeto'})
                                            return errors
                                            
                                        }else{
                                            console.log(result.rows)
                                            pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE (numero_projeto,oc) =($1,$2)`,[projeto,oc],
                                            (err,result)=>{
                                                if(err){
                                                    throw err}
                                                })
                                                return result.rows
                                                
                                                
                                            }
                                        })
                                    }else{
                                        pool.query(`SELECT * FROM projetos WHERE (numero_projeto,oc,empresa) = ($1,$2,$3)`,[projeto,oc,fornecedor],
                                        (err,result)=>{
                                            if(err){
                                                throw err
                                            }
                                            //console.log(result.rows)
                                            if(result.rows.length==0){
                                                errors.push({message:'Dados nao conferem'})
                                                return errors
                                                
                                            }
                                            else{
                                                console.log(result.rows)
                                                pool.query(`INSERT INTO buscar SELECT * FROM projetos WHERE (numero_projeto,oc,empresa) =($1,$2,$3)`,[projeto,oc,fornecedor],
                                                (err,result)=>{
                                                    if(err){
                                                        throw err}
                                                    })
                                                    return result.rows
                                                    
                                                    
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } 

         
                async function buscar_aprovados2(){
                    try{
                        const result = await pool.query ('SELECT numero_rdo,numero_projeto,numero_oc,valor_total,status2 FROM sermotec WHERE status2=$1 ORDER BY id',['Aprovado']);
                        console.log(result.rows)
                        return result.rows;
                    }
                    catch(err){
                        throw err;
                    }
                }



                async function ver_descricao(rdo){
                    try{
                        const result = await pool.query (`INSERT INTO descricao SELECT descricao , observacao FROM sermotec WHERE numero_rdo = $1`,[rdo]);
                        console.log(result.rows)
                        return result.rows;
                    }
                    catch(err){
                        throw err;
                    }
                }
        


                async function buscar_recusados(){
                    try{
                        const result = await pool.query (`SELECT numero_rdo,responsavel,status2 FROM sermotec WHERE status2 = $1`,['Recusado']);
                        console.log(result.rows)
                        return result.rows;
                    }
                    catch(err){
                        throw err;
                    }
                }

                


            

        
        
        app.listen(PORT,()=>{
            console.log(`server rodando na porta ${PORT}`)
        }
        )
        
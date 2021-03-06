const express = require("express") 
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const server = require("http").createServer(app)
const DB = require("./model/db")
const usr = require("./model/user")


DB.NewCollection(usr.nameData, usr)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")


app.get("/", (req, res)=>{
    res.render("index")
})

app.get("/search", (req, res)=>{
    res.render("search")
})

app.get("/all-data", (req, res)=>{
    usr.Find().then((data)=>{
        let textToPrint = ``
        data.forEach(date => {
            textToPrint += `
                |-----------------------------<br/>
                | Email: ${date.email}<br/>
                |-----------------------------<br/>
                | Nome: ${date.nome || "Não informado"}<br/>
                |-----------------------------<br/>
                | Idade: ${date.idade || "Não informado"}<br/>
                |-----------------------------<br/>
            `
        });
        res.send(textToPrint)
    }).catch((e)=>{
        console.log(e);
        res.redirect("/")
    })
})

app.post("/usr-add", (req, res)=>{
    usr.FindOne({email: req.body.user_email}).then((data)=>{
        if(data){
            res.send("Esse dado existe! <a href=\"/\">Voltar ao inicio</a>")
        }else{
            usr.AddData({
                nome: req.body.user_name,
                idade: req.body.user_idade,
                email: req.body.user_email
            })
            res.redirect("/")
        }
    }).catch(err=>{
        console.log(err);
        res.redirect("/")
    })
})

app.post("/usr-delete", (req, res)=>{
    usr.FindOne({email: req.body.user_email}).then((data)=>{
        if(data){
            usr.DeleteOne({email: req.body.user_email}).then(()=>{
                res.redirect("/search")
            }).catch((err)=>{
                console.log(err);
                res.redirect("/")
            })
        }else{
            res.redirect("/")
        }
    }).catch(err=>{
        console.log(err);
        res.redirect("/")
    })
})


app.post("/update-usr", (req, res)=>{
    usr.UpdateData({email: req.body.n_user_email}, {
        nome: req.body.n_user_name,
        idade: req.body.n_user_idade,
        email: req.body.n_user_email
    }).then(()=>{
        res.redirect("/")
    }).catch((e)=>{
        res.redirect("/")
        console.log(e);
    })
})



app.post("/search", (req, res)=>{
    usr.FindOne({email: req.body.user_email}).then((data)=>{
        if(data){
            res.send(`
                |-----------------------------<br/>
                | Nome: ${data.nome || "Não informado"}<br/>
                |-----------------------------<br/>
                | Idade: ${data.idade || "Não informado"}<br/>
                |-----------------------------<br/>
                | Email: ${data.email}<br/>
                |-----------------------------

            `)
        }else{
            res.send("Esse dado não existe! <a href=\"/\">Voltar ao inicio</a>")
        }
    }).catch(err=>{
        console.log(err);
        res.redirect("/")
    })
})

server.listen(12435, ()=>{
    console.log(`http://localhost:12435`);
})
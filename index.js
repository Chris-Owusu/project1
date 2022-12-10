const express = require("express")
const hbs = require("hbs")
const bcrypt = require("bcrypt")
const path = require("path")
const collection = require("./mongodb")

const app = express()
const templatePath = path.join(__dirname, './templates')

app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templatePath)
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render("landingpage")
})

app.get("/SignIn", (req, res) => {
    res.render("SignIn")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/main", (req, res) => {
    res.render("main")
})


app.post("/signup", async (req, res) => {
    try {
        if (req.body.password === req.body.conpassword) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const data = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }
            await collection.insertMany([data])
            // console.log(req.body.conpassword)
            
        res.render("SignIn")
    }else {
        res.send("Password doesn't match....")
    }

    } catch (e) {
        console.log(e)
        res.redirect("/SignIn")
    }
})

app.post("/SignIn", async (req, res) => {

    try {
        const check = await collection.findOne({email:req.body.email})

        if(check.password === req.body.password) {
            res.render("main")
        } else {
            res.send("wrong password")
        }
        
    } catch {
        res.send("wrong details")
        
    }


})

// app.post("/login", async (req, res) => {
//     console.log(req.body.email)
//     try {
//         const check = await collection.findOne({'email': req.body.email})
//         console.log(check)
//         const hash = await bcrypt.hash(req.body.password, 10);
//         console.log(hash);
//         bcrypt.compare(req.body.password, hash, function(err, result) {
//             console.log(result)
//             if(result) {
//                 return  res.render("main");
//             }
//             res.send("Wrong credentials")
//         });
//         /*
//         if (check.password === hash.toString()) {
//             res.render("main")
//         } 
//         else {
//             res.send("wrong password")
//         }
//         */
//     } catch (err){
//         // console.log(err.)
//         res.send("wrong details")
//     }
// })

app.listen(5050, () => {
    console.log("port connected......")
})
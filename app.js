require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const ejs = require('ejs')
const { default: mongoose } = require('mongoose')
const encryption = require('mongoose-encryption')

const app = express()
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password:String
})


const secret = process.env.SECRET 
userSchema.plugin(encryption,{secret:secret, encryptedFields:['password']})

const User = new mongoose.model('User', userSchema)

app.get('/', (req, res)=>{
    res.render('home')
})


app.get('/login', (req, res)=>{
    res.render('login')
})


app.get('/register', (req, res)=>{
    res.render('register')
})


app.post('/register',(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save()
    .catch(err=>{
        console.error('error saving user', err.message)
    })
    res.render('secrets')
})


app.post('/login', (req,res)=>{
    const username =req.body.username
    const password = req.body.password

    User.findOne({email:username})
    .then(user => {
        if (user){
            if (user.password === password){
                console.log('correct password')
                res.render('secrets')
            }else{
                console.log('Worng password')
            }
        }else{
            console.log('Email dose not exite in the data base')
        }
    })
    .catch(err =>{
        console.error('Error checking email', err)
    })
})

app.listen(3000, ()=>{
    console.log('server started on port 3000.')
})

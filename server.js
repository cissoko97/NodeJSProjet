let express = require('express');
let bodyParser = require('body-parser');
let multer = require('multer');
let session = require('express-session');
let methodOverride = require('method-override');
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let app = express();

/*
* Moteur de template
* Faut d'abord i --save ejs*/
app.set('view engine', 'ejs');

//Nos middlewares
//distribution des paquets statiques
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

//Configuartion de la session
app.use(session({
    secret: 'boris@ck97',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use(methodOverride('_method'));

app.use(require('./middlewares/flash'));


app.get('/', (req, res) => {
    let FlowerRepository = require('./repository/flowerRepository');
    FlowerRepository.findAll((flowers) => {
        res.render('pages/index', {flowers: flowers});
    })
});

app.post('/', (req, res) => {
    let FlowerRepository = require('./repository/flowerRepository');
    let Flower = require('./models/flower');

    flower = new Flower(req.body.name, req.body.race, req.body.price, req.body.description)
    FlowerRepository.create(flower, () => {
        req.flash('success', 'Merci!!');
        res.redirect('/');
    })
});

app.delete('/flowers/:id', (req, res) => {
    //console.log('delete request');
    let FlowerRepository = require('./repository/flowerRepository');
    FlowerRepository.Delete(req.params.id, () => {
        req.flash('success', 'Success delete!!!');
        res.redirect('/');
    });
});

app.get('/flowers', (req, res) => {
    res.render('pages/add');
});

app.listen(3000);


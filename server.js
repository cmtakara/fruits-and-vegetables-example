require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jsxViewEngine = require('jsx-view-engine');
const methodOverride = require('method-override');

const app = express();
// replaced when we replaced the array of fruit with the mongoDb model
// const fruits = require('./models/fruits.js');
const Fruit = require('./models/fruits.js');
// const vegetables = require('./models/vegetables.js');
const Vegetable = require('./models/vegetables.js');


// Global configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;
// Connect to Mongo
mongoose.connect(mongoURI);
mongoose.connection.once('open', () => {
    console.log('connected to mongo');
});

app.set('view engine', 'jsx');
app.set('views', './views');
app.engine('jsx', jsxViewEngine());

// moving the fruits to models/fruits.js in order to have compartmentalized code
// we are using MVC - models-views-controllers - architecture
// https://developer.mozilla.org/en-US/docs/Glossary/MVC
// const fruits = [
//     {
//         name:'apple',
//         color: 'red',
//         readyToEat: true
//     },
//     {
//         name:'pear',
//         color: 'green',
//         readyToEat: false
//     },
//     {
//         name:'banana',
//         color: 'yellow',
//         readyToEat: true
//     }
// ];

// ================ Middleware ================
//
app.use((req, res, next) => {
    // console.log('Middleware: I run for all routes');
    next();
})

//near the top, around other app.use() calls
app.use(express.urlencoded({extended:false}));

app.use(methodOverride('_method'));

// These are my routes
// We are going to create the 7 RESTful routes
// There is an order for them to listed in the code
// I - N - D - U - C - E - S
//  Action      HTTP Verb   CRUD 
// I - Index    GET         READ - display a list of elements
// N - New      GET         CREATE * - but this allows user input
// D - Delete   DELETE      DELETE
// U - Update   PUT         UPDATE * - this updates our database
// C - Create   POST        CREATE * - this adds to our database
// E - Edit     GET         UPDATE * - but this allows user input
// S - Show     GET         READ - display a specific element

app.get('/', (req, res) => {
    res.send(
        '<div>this is my fruits AND VEGETABLES root route<br/><a href="/fruits">fruits</a><br/><a href="/vegetables">vegetables</a></div>'
        );
});

// demonstrating seed route - you can also add one for vegetables
// app.get('/fruits/seed', async (req, res)=>{
//     try {
//     await Fruit.create([
//         {
//             name:'grapefruit',
//             color:'pink',
//             readyToEat:true
//         },
//         {
//             name:'grape',
//             color:'purple',
//             readyToEat:false
//         },
//         {
//             name:'avocado',
//             color:'green',
//             readyToEat:true
//         }
//     ])
//     res.status(200).redirect('/fruits'); 
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// I - INDEX - dsiplays a list of all fruits
app.get('/fruits/', async (req, res) => {
    try {
        const foundFruits = await Fruit.find({});
        res.status(200).render('fruits/Index', {fruits: foundFruits})
    } catch (err) {
        res.status(400).send(err);
    }
    // res.send(fruits);
    // replaced when updated to use mongoDb
    // res.render('fruits/Index', {fruits: fruits});
});

// I - INDEX - dsiplays a list of all vegetables
app.get('/vegetables/', async (req, res) => {
    try {
        const foundVegetables = await Vegetable.find({});
        res.status(200).render('vegetables/Index', {vegetables: foundVegetables})
    } catch (err) {
        res.status(400).send(err);
    }
    // res.render('vegetables/Index', {vegetables: vegetables});
});


// N - NEW - allows a user to input a new fruit
app.get('/fruits/new', (req, res) => {
    res.render('fruits/New');
});

// N - NEW - allows a user to input a new vegetable
app.get('/vegetables/new', (req, res) => {
    res.render('vegetables/New');
});

// D - DELETE - allows a user to permanently remove and item from the database
app.delete('/fruits/:id', async (req, res) => {
    // res.send('deleting...');
    try {
        const deletedFruit = await Fruit.findByIdAndDelete(req.params.id);
        console.log(deletedFruit);
            res.status(200).redirect('/fruits');
        } catch (err) {
        res.status(400).send(err);
    }
});

// D - DELETE - allows a user to permanently remove and item from the database
app.delete('/vegetables/:id', async (req, res) => {
    // res.send('deleting...');
    try {
        const deletedVegetable = await Vegetable.findByIdAndDelete(req.params.id);
        console.log(deletedVegetable);
            res.status(200).redirect('/vegetables');
        } catch (err) {
        res.status(400).send(err);
    }
});


// U - UPDATE - allows a user to update a database entry using inputs from EDIT form
app.put('/fruits/:id', async (req, res)=>{
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    try {
        const updatedFruit = await Fruit.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        console.log(updatedFruit);
        res.redirect(`/fruits/${req.params.id}`);
    } catch (err) {
        res.status(400).send(err);
    }
});

// U - UPDATE - allows a user to update a database entry using inputs from EDIT form
app.put('/vegetables/:id', async (req, res)=>{
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    try {
        const updatedVegetable = await Vegetable.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        console.log(updatedVegetable);
        res.redirect(`/vegetables/${req.params.id}`);
    } catch (err) {
        res.status(400).send(err);
    }
});


// C - CREATE - update our data store
app.post('/fruits', async (req, res) => {
    if(req.body.readyToEat === 'on') { //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else {  //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }

    try {
        const createdFruit = await Fruit.create(req.body);
        res.status(200).redirect('/fruits');
    } catch (err) {
        res.status(400).send(err);
    }
    // old way - no longer accepted
    // Fruit.create(req.body, (error, createdFruit) => {
    //     res.send(createdFruit);
    // });

    // Replaced when updated and used mongoDb model rather than array
    // fruits.push(req.body);
    // console.log(fruits);
    // console.log(req.body)
    // res.send('data received');
    // res.redirect('/fruits'); // send user back to /fruits
})

// C - CREATE - update our data store
app.post('/vegetables', async (req, res) => {
    if(req.body.readyToEat === 'on') { //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else {  //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
    try {
        const createdVegetable = await Vegetable.create(req.body);
        res.status(200).redirect('/vegetables');
    } catch (err) {
        res.status(400).send(err);
    }
    // vegetables.push(req.body);
    // console.log(req.body)
    // res.send('data received');
    // res.redirect('/vegetables'); // send user back to /fruits
})

// E - EDIT - update an existing entry in the database
app.get('/fruits/:id/edit', async (req, res)=>{
    try {
        const foundFruit = await Fruit.findById(req.params.id);
        res.status(200).render('fruits/Edit', { fruit: foundFruit});
    } catch (err) {
        res.status(400).send(err);
    }
});

// E - EDIT - update an existing entry in the database
app.get('/vegetables/:id/edit', async (req, res)=>{
    try {
        const foundVegetable = await Vegetable.findById(req.params.id);
        res.status(200).render('vegetables/Edit', { vegetable: foundVegetable});
    } catch (err) {
        res.status(400).send(err);
    }
});

// S - SHOW - show route displays details of an individual fruit
app.get('/fruits/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const foundFruit = await Fruit.findById(req.params.id);
        // res.send(foundFruit);
        res.render('fruits/Show', {fruit: foundFruit});
    } catch (err) {
        res.status(400).send(err);
    }
    // res.send(fruits[req.params.indexOfFruitsArray]);
    // res.render('fruits/Show', {// second parameter must be an object
    //     fruit: fruits[req.params.indexOfFruitsArray]
    // });
})

// S - SHOW - show route displays details of an individual vegetable
app.get('/vegetables/:id', async (req, res) => {
    try {
        // console.log(req.params.id);
        const foundVegetable = await Vegetable.findById(req.params.id);
        res.render('vegetables/Show', {vegetable: foundVegetable});
    } catch (err) {
        res.status(400).send(err);
    }
    // res.render('vegetables/Show', {// second parameter must be an object
    //     vegetable: vegetables[req.params.indexOfVegetablesArray]
    // });
})

app.listen(3001, () => {
    console.log('listening');
});
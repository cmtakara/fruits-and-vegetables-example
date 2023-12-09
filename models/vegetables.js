const mongoose = require('mongoose');

const vegetableSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    color:  { type: String, required: true },
    readyToEat: Boolean
});

const Vegetable = mongoose.model('Vegetable', vegetableSchema);

module.exports = Vegetable;

// const vegetables = [
//     {
//         name:'cucumber',
//         color: 'green',
//         readyToEat: true
//     },
//     {
//         name:'carrot',
//         color: 'orange',
//         readyToEat: false
//     },
//     {
//         name:'celery',
//         color: 'yellow',
//         readyToEat: false
//     },
//     {
//         name:'broccoli',
//         color: 'green',
//         readyToEat: true
//     },
//     {
//         name:'kale',
//         color: 'green',
//         readyToEat: true
//     }
// ];

// module.exports = vegetables;
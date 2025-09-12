const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { // Event name
        type: String,
        required: true
    },

    month: {
        type: Number,
        required: true,
        min: 0, // January is 0
        max: 11 // December is 11
    },

    date: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },

    year: {
        type: Number,
        required: true
    },

    hour: {
        type: Number,
        required: false
    },

    minute: {
        type: Number,
        required: false
    },

    timePeriod: { // AM or PM
        type: String,
        required: false
    },

    reminderInput: { // How many hours, minutes, or seconds
        type: Number,
        required: false
    },

    reminderUnit: { // Hours, minutes, seconds
        type: String,
        required: false
    }
})

const Event = mongoose.model('Event', productSchema);
module.exports = Event;
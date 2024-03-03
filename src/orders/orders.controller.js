const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// Middleware Functions

// Verify deliverTo exists and isn't empty
function hasDeliverTo(req, res, next) {

}

// Verify mobile number exists and isn't empty
function hasMobileNumber(req, res, next) {

}

// Verify dishes exists, isn't empty, and is an array
function hasDishes(req, res, next) {
    
} 

// CRUDLE Functions

// Creates a new order and adds to orders array
function create(req, res) {
    const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body; 
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes,
    }
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

// Lists the orders data
function list(req, res) {
    res.json({ data: orders });
}

module.exports = {
    create,
    list,
}
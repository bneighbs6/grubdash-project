const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// Middleware Functions
// Verify name exists and isn't empty
function hasName (req, res, next) {
    const { data: { name } = {} } = req.body;
    if (!name) {
        next({
            status: 400,
            message: "Dish must include a name"
        })
    }
    // This line passes the name data to the locals body for next midware/error handler to handle
    res.locals.body = name; 
    return next()
}

// Verify Description exists and isn't empty
function hasDescription(req, res, next) {
    const { data: { description } = {} } = req.body; 
    if (!description) {
        next({
            status: 400,
            message: "Dish must include a description"
        });
    }
    return next();
}

// Verify price exists and isn't empty
function hasPrice(req, res, next) {
    const { data: { price } = {} } = req.body; 
    if (!price || price < 0) {
        next({
            status: 400,
            message: "Dish must include a price"
        });
    }
    return next(); 
}

// Verify image_url exists and isn't empty
function hasImage(req, res, next) {

}

// CRUDL Functions

function create(req, res) {
    const { data: { id, name, description, price, image_url } = {} } = req.body; 
    const newDish = {
        id: nextId(), 
        name,
        description,
        price,
        image_url,
    }
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

function list(req, res) {
    res.json({ data: dishes });
}

module.exports = {
    create: [hasName, hasDescription, hasPrice, create],
    list, 
}
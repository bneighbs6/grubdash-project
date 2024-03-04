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
    if (!price || price < 0 || !Number.isInteger(price)) {
        next({
            status: 400,
            message: "Dish must include a price"
        });
    }
    return next(); 
}

// Verify image_url exists and isn't empty
function hasImage(req, res, next) {
    const { data: { image_url } = {} } = req.body; 
    if (!image_url) {
        next({
            status: 400,
            message: "Description must include an image_url"
        });
    }
    return next(); 
}

function hasIdMatchRouteId(req, res, next) {
    const { dishId } = req.params; 
    const { data: { id } = {} } = req.body;
    if (id) {
        if (id === dishId) {
            return next();
        }
        next({
            status: 400,
            message: `Dish id does not match Route id. Dish: ${id}, Route: ${dishId}`,
        })
    }
    return next();
}

// Verify if dish exists
function dishExists(req, res, next) {
    const {dishId} = req.params; 
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `No matching dish for id: ${dishId}`,
    })
}

// CRUDL Functions

// Creates a new dish
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

// Reads data from a GET request to "/:dishId"
function read(req, res) {
    res.json({ data: res.locals.dish })
}

// Updates the dish with a PUT request to "/:dishId"
function update(req, res) {
    const dish = res.locals.dish;
    const { data: { id, name, description, price, image_url } = {} } = req.body;

    // Update the dish 
    dish.id = id;
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url; 

    // Respond with json data of updated dish
    res.json({ data: dish });
}

// Lists the dishes data
function list(req, res) {
    res.json({ data: dishes });
}

module.exports = {
    create: [hasName, hasDescription, hasPrice, hasImage, create],
    read: [dishExists, read],
    update: [dishExists, hasName, hasDescription, hasPrice, hasImage, hasIdMatchRouteId, update],
    list, 
}
const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// Middleware Functions

// Verify deliverTo exists and isn't empty
function hasDeliverTo(req, res, next) {
    const { data: { deliverTo } = {} } = req.body; 
    if (!deliverTo) {
        next({
            status: 400,
            message: "Order must include a deliverTo"
        });
    }
    return next(); 
}

// Verify mobile number exists and isn't empty
function hasMobileNumber(req, res, next) {
    const { data: { mobileNumber } = {} } = req.body; 
    if (!mobileNumber) {
        next({
            status: 400,
            message: "Order must include a mobileNumber"
        });
    }
    return next(); 
}

/* // Verify dishes exists, isn't empty, and is an array
function hasDishes(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (!dishes || !dishes.length || !Array.isArray(dishes)) {
        next({
            status: 400,
            message: "Order must include at least one dish"
        });
    }
    return next(); 
/* }  */

// Look up reduce method for reducing dishes array to those with improper quantity values
function dishesHasQuantity(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    // Checks if dishes array exists and is not empty
    if (!dishes || !dishes.length || !Array.isArray(dishes)) {
        next({
            status: 400,
            message: "Order must include at least one dish"
        });
    }
    // Defines invalidDishes array
    // Filters dishes that do not exist, or are less than 0
    const invalidDishes = dishes.filter((dish) => {
        if (!dish.quantity || dish.quantity < 0 || !Number.isInteger(dish.quantity)) {
            return true; 
        }
        return false; 
    });
    // If invalidDishes array contains ANY length, return error status & message
    if (invalidDishes.length > 0) {
        return next({
            status: 400,
            message: `dish ${index} must have a quantity that is an integer greater than 0`
        })
    }
    // IF invalidDishes array is empty, it moves on to next middleware fx
    return next(); 
}

// Validates status is pending
// Used with destroy();
function hasValidStatus(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder.status === "pending") {
        return next();
    }
    next({
        status: 400,
        message: "An order cannot be deleted unless it is pending. Returns a 400 status code"
    })
}

// Verifies order exists
function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
  
    if (foundOrder) {
      res.locals.order = foundOrder;
      return next();
    }
    next({
      status: 404,
      message: `No matching order is found for orderId ${orderId}.`,
    });
  }

// CRUDLE Functions

// Creates a new order and adds to orders array
// Ran with PUT request
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

// Reads data res.locals.order 
// Ran with GET request
function read(req, res) {
    res.json({ data: res.locals.order });
  }

// Deletes an order
// Ran with DELETE request
function destroy(req, res) {
    const { orderId } = req.params;
    const orderIndex = orders.findIndex((order) => order.id === Number(orderId));
    deletedOrder = orders.splice(orderIndex, 1);
    res.sendStatus(204);
}

// Lists the orders data
// Ran with GET request
function list(req, res) {
    res.json({ data: orders });
}

module.exports = {
    create: [hasDeliverTo, hasMobileNumber, dishesHasQuantity, create],
    read: [orderExists, read],
    delete: [orderExists, hasValidStatus, destroy],
    list,
}
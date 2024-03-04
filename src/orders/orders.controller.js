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

// Verify dishes exists, isn't empty, and is an array
function hasDishes(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (!dishes || !dishes.length || !Array.isArray(dishes)) {
        next({
            status: 400,
            message: "Order must include at least one dish"
        });
    }
    return next(); 
}  

function dishesHasQuantity(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    // Loop through dishes array
    for (let i = 0; i < dishes.length; i++) {
        const dish = dishes[i];

        // Checks if dish object does not have 'quantity' property
        if (!dish.hasOwnProperty("quantity")) {
            return next({
                status: 400,
                message: `dish ${i} must have a quantity that is an integer greater than 0`,
            });
        }

        // Checks if 'quantity' property is not an inter or is less than 0
        if (!Number.isInteger(dish.quantity) || dish.quantity <= 0) {
            return next({
                status: 400,
                message: `dish ${i} must have a quantity that is an integer greater than 0`,
            });
        }
    }
    // If no invalid dish found, move to next middleware
    return next();
}

// create hasValidStatus to check is status is anything but delivered
function hasValidStatus(req, res, next) {
    const { orderId } = req.params; 
    const foundOrder = orders.find((order) => order.id === orderId);
    if (!foundOrder.status || foundOrder.status === "" || foundOrder.status === "invalid") {
        return next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, or delivered."
        });
    }
    return next(); 
}

// Validates status is pending
// Used with destroy();
function orderIsPending(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
  // If status is pending, go to next middleware 
    if (foundOrder.status === "pending") {
      return next();
    }
  // If status !== pending, return this next error
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending. Returns a 400 status code",
    });
  }

function hasIdMatchRouteId(req, res, next) {
    // Define parameter and request body
    const { orderId } = req.params; 
    const { data: { id } = {} } = req.body;
    // if id exists, then check if id match orderId
    if (id) {
    // if id matches orderId, return next, otherwise throw error status and message    
        if (id === orderId) {
            return next();
        }
        next({
            status: 400,
            message: `Order id does not match Route id. Order: ${id}, Route: ${orderId}`,
        })
    }
    return next();
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
// Ran with POST request
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

// Updates an order w/ PUT request to "/:orderId"
function update(req, res) {
    const order = res.locals.order;
    const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body; 

    // Update the order
    order.id,
    order.deliverTo = deliverTo; 
    order.mobileNumber = mobileNumber;
    order.status = status; 
    order.dishes = dishes; 

    // Respond with json data of new order
    res.json({ data: order })
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

// Updates export needs a hasValidStatus validation midware function with it
module.exports = {
    create: [hasDeliverTo, hasMobileNumber, hasDishes, dishesHasQuantity, create],
    read: [orderExists, read],
    update: [orderExists, hasDeliverTo, hasMobileNumber, hasDishes, dishesHasQuantity, orderIsPending, hasValidStatus, hasIdMatchRouteId, update],
    delete: [orderExists, orderIsPending, destroy],
    list,
}
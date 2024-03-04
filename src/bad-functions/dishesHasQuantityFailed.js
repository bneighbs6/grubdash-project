function dishesHasQuantity(req, res, next) {
    const { data: { dishes } = {} } = req.body;

    // Defines invalidDishes array
    // Filters dishes that do not exist, or are less than 0
    const invalidDishes = dishes.filter((dish, index) => {
        if (!dish.hasOwnProperty('quantity') || !Number.isInteger(dish.quantity) || dish.quantity <= 0) {
          return true;
        }
        return false;
      });
    // If invalidDishes array contains ANY length, return error status & message
    if (invalidDishes.length > 0) {
        const errorMessage = invalidDishes.map((dish, index) => {
          return `dish ${index} must have a quantity that is an integer greater than 0`;
        }).join(", ");
    
        return next({
          status: 400,
          message: errorMessage,
        });
      }
    // IF invalidDishes array is empty, it moves on to next middleware fx
    return next(); 
}


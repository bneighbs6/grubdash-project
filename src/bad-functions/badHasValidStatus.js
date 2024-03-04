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
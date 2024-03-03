const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./orders.controller")
// TODO: Implement the /orders routes needed to make the tests pass

//New route for "/:orderId"
router.route("/:orderId").get(controller.read);

// New route for "/"
router.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed);

module.exports = router;

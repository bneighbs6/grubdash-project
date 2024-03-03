const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed")

// Route for "/:dishId"
router.route("/:dishId")
.get(controller.read);

// TODO: Implement the /dishes routes needed to make the tests pass
router.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed);

module.exports = router;

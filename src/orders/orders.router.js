const router = require("express").Router();
const controller = require("./orders.controller")
// TODO: Implement the /orders routes needed to make the tests pass

// New route for /
router.route("/").get(controller.list);

module.exports = router;

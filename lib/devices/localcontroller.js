/**
 * Module dependencies.
 */
const proto_device = require('./../device');


let localController = {};

// Add proto_device prototype to localController thus inheriting all the attributes of 'Device'.
localController = Object.create(proto_device, localController);

localController.sendEnergy = function() {
    return new Promise((resolve, reject) => {
        
    })
}

/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */
localController.sendEnergy = function() {
    return new Promise((resolve, reject) => {
        
    })
}


/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */
localController.sendEnergy = function() {
    return new Promise((resolve, reject) => {
        
    })
}


module.exports = localController;
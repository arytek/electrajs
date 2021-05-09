/**
 * Module dependencies.
 */
const proto_device = require('./../device');


let grid = {};

// Add proto_device prototype to grid thus inheriting all the attributes of 'Device'.
grid = Object.create(proto_device, grid);

grid.sendEnergy = function() {
    return new Promise((resolve, reject) => {
        
    })
}

module.exports = grid;
 
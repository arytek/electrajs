/**
 * Module dependencies.
 */
 var generator = require('./lib/devices/generator').generator;
 var grid = require('./lib/devices/grid').grid;
 var localcontroller = require('./lib/devices/localcontroller').localcontroller;
 var smartswitch = require('./lib/devices/smartswitch').smartswitch;
 var storage = require('./lib/devices/storage').storage;

const electra = {
    generator: generator,
    localcontroller: localcontroller,
    storage: storage, 
    smartswitch: smartswitch,
    grid: grid
}

module.exports = electra; 

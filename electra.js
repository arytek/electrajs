/**
 * Module dependencies.
 */
 var generator = require('./lib/devices/generator').generator;
 var grid = require('./lib/devices/grid');
 var localcontroller = require('./lib/devices/localcontroller').localcontroller;
 var smartswitch = require('./lib/devices/smartswitch');
 var storage = require('./lib/devices/storage');

const electra = {
    generator: generator,
    localcontroller: localcontroller
}

module.exports = electra;
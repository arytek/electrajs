/**
 * Module dependencies.
 */
 const { app, proto_device } = require('./../device');
 const { v4: uuidv4 } = require('uuid');
 
 // Add proto_device prototype to grid thus inheriting all the attributes of 'device'.
 const grid = new proto_device();
 
 grid.grid = function(deviceAddress, deviceName) {
     grid.deviceId = uuidv4();
     grid.deviceAddress = deviceAddress;
     grid.deviceType = "grid";
     grid.deviceName = deviceName;
     return grid;
 }
 
 grid.sendEnergy = function() {
     return new Promise((resolve, reject) => {
         
     })
 }
 
 module.exports = grid;
 
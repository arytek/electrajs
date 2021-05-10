/**
 * Module dependencies.
 */
 const proto_device = require('./../device');
 const { v4: uuidv4 } = require('uuid');
 
 // Add proto_device prototype to localcontroller thus inheriting all the attributes of 'device'.
 const localcontroller = new proto_device();
 
 localcontroller.localcontroller = function(deviceAddress) {
     localcontroller.deviceId = uuidv4();
     localcontroller.deviceAddress = deviceAddress;
     localcontroller.deviceType = "localcontroller";
     return localcontroller;
 }
 
 localcontroller.routeEnergyContract = function() {
     return new Promise((resolve, reject) => {
         
     })
 }
 
 module.exports = localcontroller;
 
/**
 * Module dependencies.
 */
 const proto_device = require('./../device');
 const { v4: uuidv4 } = require('uuid');
 
 // Add proto_device prototype to smartswitch thus inheriting all the attributes of 'device'.
 const smartswitch = new proto_device();
 
 smartswitch.smartswitch = function(deviceAddress) {
     smartswitch.deviceId = uuidv4();
     smartswitch.deviceAddress = deviceAddress;
     smartswitch.deviceType = "smartswitch";
     return smartswitch;
 }
 
 smartswitch.sendEnergy = function() {
     return new Promise((resolve, reject) => {
         
     })
 }
 
 module.exports = smartswitch;
 
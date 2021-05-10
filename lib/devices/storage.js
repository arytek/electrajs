/**
 * Module dependencies.
 */
 const proto_device = require('./../device');
 const { v4: uuidv4 } = require('uuid');
 
 // Add proto_device prototype to storage thus inheriting all the attributes of 'device'.
 const storage = new proto_device();
 
 storage.storage = function(deviceAddress) {
     storage.deviceId = uuidv4();
     storage.deviceAddress = deviceAddress;
     storage.deviceType = "storage";
     return storage;
 }
 
 storage.sendEnergy = function() {
     return new Promise((resolve, reject) => {
         
     })
 }
 
 module.exports = storage;
 
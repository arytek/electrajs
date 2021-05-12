/**
 * Module dependencies.
 */
 const { app, proto_device } = require('./../device');
 const { v4: uuidv4 } = require('uuid');
 
 // Add proto_device prototype to storage thus inheriting all the attributes of 'device'.
 const storage = new proto_device();
 
 storage.storage = function(deviceAddress) {
     storage.deviceId = uuidv4();
     storage.deviceAddress = deviceAddress;
     storage.deviceType = "storage";
     return storage;
 }
 
 storage.onEnergyContract = function(success, failure) {
    app.get('/api/econtract', (req, res) => {
        const eContract = req.body;
        res.send(eContract);
        success(eContract);
        if (eContract == undefined) failure(console.log('Error: Malformed eContract.'));
    });
 }
 
 module.exports = storage;
 
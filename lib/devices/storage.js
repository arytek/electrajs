/**
 * Module dependencies.
 */
 const { app, proto_device } = require('./../device');
 const { v4: uuidv4 } = require('uuid');
 
 // Add proto_device prototype to storage thus inheriting all the attributes of 'device'.
 const storage = new proto_device();
 
 storage.storage = function(deviceAddress, deviceName) {
     storage.deviceId = uuidv4();
     storage.deviceAddress = deviceAddress;
     storage.deviceType = "storage";
     storage.deviceName = deviceName;
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

storage.sendMetadataToLC = function(currentCapacity) {
return new Promise((resolve, reject) => {
    const lc = storage.getConnectedDeviceOfType('localcontroller');
    if (lc == null) reject('No local controller connected. Please add a local controller.');

    const metadataPacket = new storage.metadataPacket(storage, currentCapacity);

    const endpoint = '/api/metadata';
    const URL = 'http://' + lc.deviceAddress;

    // Send's the metadataPacket in a controlled fashion every 5 seconds.
    setTimeout(() => {
        storage.createHTTPRequest(
            URL, endpoint, 'get', undefined, metadataPacket
        )
        .then(resolve)
        .catch((error) => {
            reject(error);
        });
    }, 5000);
})
}

storage.metadataPacket = function(device, currentCapacity) {
this.device = device;
this.metadata = {
    currentCapacity: currentCapacity
};
}

 module.exports = storage;
 
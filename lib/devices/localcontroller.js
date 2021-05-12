/**
 * Module dependencies.
 */
 const { app, proto_device } = require('./../device');
 const { v4: uuidv4 } = require('uuid');
 const fs = require('fs');

 // Add proto_device prototype to localcontroller thus inheriting all the attributes of 'device'.
 const localcontroller = new proto_device();

localcontroller.localcontroller = function(deviceAddress) {
    localcontroller.deviceId = uuidv4();
    localcontroller.deviceAddress = deviceAddress;
    localcontroller.deviceType = "localcontroller";
    localcontroller.analytics();
    return localcontroller;
}
 
localcontroller.onEnergyContract = function(success, failure) {
    app.get('/api/econtract', (req, res) => {
        const eContract = req.body;
        
        const endpoint = '/api/econtract';
        const URL = 'http://' + eContract.sink.deviceAddress;

        localcontroller.createHTTPRequest(
            URL, endpoint, 'get', undefined, eContract
        )
        .then((response) => {
            res.send(Object.assign({status: 'SENT'}, eContract));
            success(response.data);
        })
        .catch((error) => {
            failure(error);
        });
    });
}

localcontroller.analytics = function(success) {
    app.get('/api/metadata', (req, res) => {
        const analyticsPacket = req.body;
    
        res.send();
        success(device_data);
    });
}

function createAnalyticsJSON() {

}
 
module.exports = localcontroller;
 
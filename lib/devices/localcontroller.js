/**
 * Module dependencies.
 */
 const { app, proto_device } = require('./../device');
 const { v4: uuidv4 } = require('uuid');
 const fs = require('fs');

 // Add proto_device prototype to localcontroller thus inheriting all the attributes of 'device'.
 const localcontroller = new proto_device();

localcontroller.localcontroller = function(deviceAddress, deviceName) {
    localcontroller.deviceId = uuidv4();
    localcontroller.deviceAddress = deviceAddress;
    localcontroller.deviceType = "localcontroller";
    localcontroller.deviceName = deviceName;
    
    createAnalyticsJSON();
    createLogJSON();
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

localcontroller.analytics = function() {
    app.get('/api/metadata', (req, res) => {
        const metadataPacket = req.body;
        const deviceType = metadataPacket.device.deviceType;
        updateAnalyticsJSON(deviceType, metadataPacket.metadata)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Failed to read metadata request. ', error)
        });
    });
}

function createAnalyticsJSON() {
    const data = {
        generator: {
            currentWattage: null
        }, 
        grid: {
            netProfitLoss: null
        }, 
        localcontroller: {
            todaysEnergyTransfers: null
        }, 
        smartswitch: {
            energyConsumption: null
        }, 
        storage: {
            currentCapacity: null
        }, 
    };
    fs.writeFileSync('./analytics.json', JSON.stringify(data, null, 2));
}

function createLogJSON() {
    const data = {
        eContracts: []
    };
    fs.writeFileSync('./log.json', JSON.stringify(data));
}

function updateAnalyticsJSON(deviceType, deviceMetadata) {
    return new Promise((resolve, reject) => {
        const filePath = './analytics.json';

        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            data = JSON.parse(data);
            data[deviceType] = deviceMetadata;
            data = JSON.stringify(data, null, 2);

            fs.writeFile(filePath, data, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    })
}
 
module.exports = localcontroller;
 
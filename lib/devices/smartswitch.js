/**
 * Module dependencies.
 */
 const { app, proto_device } = require('./../device');
 const { v4: uuidv4 } = require('uuid');
 
 // Add proto_device prototype to smartswitch thus inheriting all the attributes of 'device'.
 const smartswitch = new proto_device();
 
 smartswitch.smartswitch = function(deviceAddress) {
     smartswitch.deviceId = uuidv4();
     smartswitch.deviceAddress = deviceAddress;
     smartswitch.deviceType = "smartswitch";
     return smartswitch;
 }
 
 smartswitch.sendEnergy = function(wattage) {
     return new Promise((resolve, reject) => {
         const lc = smartswitch.getConnectedDeviceOfType('localcontroller');
         const st = smartswitch.getConnectedDeviceOfType('storage');
 
         const eContract = new smartswitch.energyContract(
             uuidv4(), this, st, Date.now(), wattage
         );
 
         console.log('sdsdsasdasdasd', eContract);
         const endpoint = '/api/econtract';
         const URL = 'http://' + lc.deviceAddress;
 
         // Send's the eContract in a controlled fashion every 5 seconds.
         setTimeout(() => {
             smartswitch.createHTTPRequest(
                 URL, endpoint, 'get', undefined, eContract
             )
             .then((response) => {
                 resolve(response.data);
             })
             .catch((error) => {
                 reject(error);
             });
         }, 5000);
     })
 }
 
 smartswitch.sendMetadataToLC = function(currentWattage) {
     return new Promise((resolve, reject) => {
         const lc = smartswitch.getConnectedDeviceOfType('localcontroller');
         if (lc == null) reject('No local controller connected. Please add a local controller.');
 
         const metadataPacket = new smartswitch.metadataPacket(device, currentWattage);
 
         const endpoint = '/api/analytics';
         const URL = 'http://' + lc.deviceAddress;
         smartswitch.createHTTPRequest(
             URL, endpoint, 'get', undefined, metadataPacket
         )
         .then((response) => {
             resolve(response.data);
         })
         .catch((error) => {
             reject(error);
         });
     })
 }
 
 smartswitch.metadataPacket = function(device, currentWattage) {
     this.device = device;
     this.currentWattage = currentWattage;
 }
 
 module.exports = smartswitch;
 
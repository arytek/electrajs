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
 
 grid.private = {
        netEnergyTransferred: 0, 
        netProfitLoss: 0, 
        tarifRate: 0, // In cents.
 }

 grid.sendEnergy = function(wattage) {
     return new Promise((resolve, reject) => {
         const lc = grid.getConnectedDeviceOfType('localcontroller');
         const st = grid.getConnectedDeviceOfType('storage'); // destination.
         const sanitizedSelf = grid.sanitizeDevice(grid); // origin.
         
         const eContract = new grid.energyContract(
             uuidv4(), grid.methodEnum.SEND, sanitizedSelf, st, Date.now(), wattage
         );
         
         const endpoint = '/api/econtract';
         const URL = 'http://' + lc.deviceAddress;
 
         // Send's the eContract in a controlled fashion after 5 seconds.
         setTimeout(() => {
             grid.createHTTPRequest(
                 URL, endpoint, 'get', undefined, eContract
             )
             .then((response) => {
                 grid.SetNetEnergyTransferred(eContract.establishment_time, eContract.wattage, eContract.method);
                 resolve(response.data);
             })
             .catch((error) => {
                 reject(error);
             });
         }, 5000);
     })
 }
 
grid.setTarifRate = function(tarif) {
    grid.private.tarifRate = tarif;
}

grid.SetNetEnergyTransferred = function(time, wattage, eContractMethod) {
    if (eContractMethod == grid.methodEnum.SEND) {
        let elapsedTime = Math.abs((time / 1000) - (Date.now() / 1000)); // Elapsed time in seconds.
        let energy = (wattage / 3600) * (elapsedTime);
        energy = Math.round(energy * 100) / 100; // Round to 2 decimal places.
        grid.private.netEnergyTransferred += energy;

    } else if (eContractMethod == grid.methodEnum.RECEIVE) {
        let elapsedTime = Math.abs((time / 1000) - (Date.now() / 1000)); // Elapsed time in seconds.
        let energy = (wattage / 3600) * (elapsedTime);
        energy = Math.round(energy * 100) / 100; // Round to 2 decimal places.
        grid.private.netEnergyTransferred -= energy;
    }
}

     return new Promise((resolve, reject) => {
         
     })
 }
 
 module.exports = grid;
 
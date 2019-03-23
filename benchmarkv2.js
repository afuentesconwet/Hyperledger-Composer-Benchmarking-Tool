const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const uuidv4 = require('uuid/v4');
let cardname = "al@conwet-network"

function conectar(conn) {
    return new Promise((resolve, reject) => {
            resolve(conn.bizNetworkConnection.connect(cardname));
            reject(error)
        }
    )
}

function createAgreement(conn){
    createAcquisition(conn)
    createPaymentCompleted(conn)
    createAcceptAgreement(conn)
}

function createPaymentCompleted(conn){
    var data = require('./benchmark-assets/paymentcompleted')
    var jobId = uuidv4()

    data.$class = "org.conwet.biznet.PaymentCompleted"
    data.jobId = jobId

    let serializer = conn.businessNetworkDefinition.getSerializer();
    let resource = serializer.fromJSON(data);

    return new Promise((resolve, reject) => {
        resolve(conn.bizNetworkConnection.submitTransaction(resource));
        reject(error)
    })
}

function createAcceptAgreement(conn){
    var data = new Object()

    var jobId = uuidv4()

    var tangleStreamDataObj = new Object();
    tangleStreamDataObj.side_key = uuidv4()
    tangleStreamDataObj.root = uuidv4()

    data.agreementId = "aydear5";
    data.dataStream = tangleStreamDataObj;
    data.$class = "org.conwet.biznet.AcceptAgreement"
    data.jobId = jobId

    let serializer = conn.businessNetworkDefinition.getSerializer();
    let resource = serializer.fromJSON(data);

    return new Promise((resolve, reject) => {
        resolve(conn.bizNetworkConnection.submitTransaction(resource));
        reject(error)
    })
}

function createAcquisition(conn){
    var data = require('./benchmark-assets/onetimeaqc')
    var jobId = uuidv4()

    var tangleStreamQueryObj = new Object();
    tangleStreamQueryObj.side_key = uuidv4()
    tangleStreamQueryObj.root = uuidv4()

    data.queryStream = tangleStreamQueryObj;
    data.options.$class = "org.conwet.biznet.Options"

    data.$class = "org.conwet.biznet.MakeAgreement"
    data.jobId = jobId

    data.agreementId = uuidv4().substr(0,7)

    let serializer = conn.businessNetworkDefinition.getSerializer();
    let resource = serializer.fromJSON(data);

    return new Promise((resolve, reject) => {
        resolve(conn.bizNetworkConnection.submitTransaction(resource));
        reject(error)
    })
}

function createDataset(conn){
    var data = require('./benchmark-assets/dataset')
    var jobId = uuidv4()

    data.$class = "org.conwet.biznet.CreateDataset"
    data.jobId = jobId
    data.datasetId = jobId.substr(0,7)

    let serializer = conn.businessNetworkDefinition.getSerializer();
    let resource = serializer.fromJSON(data);

    return new Promise((resolve, reject) => {
        resolve(conn.bizNetworkConnection.submitTransaction(resource));
        reject(error)
    })
}

function createOffering(conn){
    var data = require('./benchmark-assets/offering')
    var jobId = uuidv4()

    data.$class = "org.conwet.biznet.CreateOffering"
    data.jobId = jobId
    data.offeringId = jobId.substr(0,7)

    let serializer = conn.businessNetworkDefinition.getSerializer();
    let resource = serializer.fromJSON(data);

    return new Promise((resolve, reject) => {
        resolve(conn.bizNetworkConnection.submitTransaction(resource));
        reject(error)
    })
}

var startMain;

let conn = new Object()
conn.bizNetworkConnection = new BusinessNetworkConnection()
conectar(conn)
    .then(res =>{

        conn.bizNetworkConnection.on('event', (event) => {
            if (event.resourceType == "Dataset") {
                if (event.resourceId == "FAILURE") {
                    console.log("FAILURE EVENT");
                } else {
                    var time = new Date()-event.timestamp;
                    var elapsed = new Date() - startMain;
                    console.log("Created a new Dataset in: "+time)
                    console.log("Elapsed Time: "+elapsed)
                }
            }
            if (event.resourceType == "Offering") {
                if (event.resourceId == "FAILURE") {
                    console.log("FAILURE EVENT");
                } else {
                    var time = new Date()-event.timestamp;
                    var elapsed = new Date() - startMain;
                    console.log("Created a new Offering in: "+time)
                    console.log("Elapsed Time: "+elapsed)
                }
            }
            if (event.resourceType == "AGREEMENT ACCEPTED") {
                if (event.resourceId == "FAILURE") {
                    console.log("FAILURE EVENT");
                } else {
                    var time = new Date()-event.timestamp;
                    var elapsed = new Date() - startMain;
                    console.log("Accepted Agreement in: "+time)
                    console.log("Elapsed Time: "+elapsed)
                }
            }
            if (event.resourceType == "Agreement") {
                if (event.resourceId == "FAILURE") {
                    console.log("FAILURE EVENT");
                } else {
                    var time = new Date()-event.timestamp;
                    var elapsed = new Date() - startMain;
                    console.log("Acquisition created in: "+time)
                    console.log("Elapsed Time: "+elapsed)
                }
            }
            if (event.resourceType == "PaymentCompleted") {
                if (event.resourceId == "FAILURE") {
                    console.log("FAILURE EVENT");
                } else {
                    var time = new Date()-event.timestamp;
                    var elapsed = new Date() - startMain;
                    console.log("Payment Completed in: "+time)
                    console.log("Elapsed Time: "+elapsed)
                }
            }
        });

        conn.businessNetworkDefinition = res;

        var args = process.argv.slice(2)
        if(args.length % 2 != 0) {
            console.log("ERR")
            process.exit(1)
        }
        args = args.reduce(function(result, value, index, array) {
            if (index % 2 === 0)
                result.push(array.slice(index, index + 2));
            return result;
        }, []);

        startMain = new Date()

        for(var i = 0; i < args.length; i++){
            if (args[i][0] == '-d') {
                for(var j = 0; j < args[i][1]; j++){
                    createDataset(conn)
                }
            } else if (args[i][0] == '-o') {
                for(var j = 0; j < args[i][1]; j++){
                    createOffering(conn)
                }
            } else if (args[i][0] == '-ao') {
                for(var j = 0; j < args[i][1]; j++){
                    createAgreement(conn)
                }
            }
        }
    })
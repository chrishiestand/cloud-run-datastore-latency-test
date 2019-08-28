
console.log('COLD START');

const {GCP_KEY} = process.env;
const b = Buffer.from(GCP_KEY, "base64");
const fs = require("fs");

fs.writeFileSync("/tmp/key.json", b);
process.env.GOOGLE_APPLICATION_CREDENTIALS="/tmp/key.json";

const express = require("express");


const startModuleLoadTime = Date.now();
const {Datastore} = require('@google-cloud/datastore');
const moduleLoadTime = Date.now() - startModuleLoadTime;

const {PORT, NAMESPACE, KIND, ID} = process.env;

const app = express();
app.listen(PORT, () => {
    console.log(`started http listener on :${PORT}`);
})

const dsOptions = {}
if (NAMESPACE) {
    dsOptions.namespace = NAMESPACE;
}
const datastore = new Datastore(dsOptions);

async function test(req, res) {

    const key = datastore.key([KIND, ID]);
    const startTime = Date.now();
    const [dsObj] = await datastore.get(key);
    const endTime = Date.now();

    const myObj = dsObj || {};
    const getTime = endTime - startTime;
    const objString = JSON.stringify(myObj);
    const result = {
        objStringLength: objString.length,
        moduleLoadTime,
        getTime,
    };
    console.log(result);
    res.json(result);
    console.log('done');
}

app.get("/", test);
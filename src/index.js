
console.log('COLD START');

const express = require("express");

const startModuleLoadTime = Date.now();
const {Datastore} = require('@google-cloud/datastore');
const moduleLoadTime = Date.now() - startModuleLoadTime;

const {PORT, PROJECT_ID, NAMESPACE, KIND, ID, CLIENT_EMAIL, PRIVATE_KEY} = process.env;

const app = express();
app.listen(PORT, () => {
    console.log(`started http listener on :${PORT}`);
})

const dsOptions = {}
if (PROJECT_ID) {
    dsOptions.projectId = PROJECT_ID;
}
if (NAMESPACE) {
    dsOptions.namespace = NAMESPACE;
}

if (CLIENT_EMAIL && PRIVATE_KEY) {
    const privateKey0a = PRIVATE_KEY.replace(/\\n/g, "\n");
    dsOptions.credentials = {
        client_email: CLIENT_EMAIL,
        private_key: privateKey0a,
    }
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
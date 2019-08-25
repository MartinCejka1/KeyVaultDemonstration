/* 
Author: Martin Cejka
About: This project demonstrates working with a secrete value stored in Key Vault on Azure. See more in doc.txt
*/

var http = require('http');     // load a pakcage to create server 
require('dotenv').config();     // load a package to work with environmental variables so .env can be created and process.env have values from .env

const KeyVault = require('azure-keyvault');     // load package to work with KeyVault resource on Azure
const msRestAzure = require('ms-rest-azure');   // load package to work with azure account

const WA = require('ibm-watson/assistant/v1');  // load package to work with watson assistant (WA) on ibm cloud
global.secretValue='';                          // global variable to keep a secret value (apikey)
global.answer = '';                             // global variable to keep an answer from WA

function getKeyVaultCredentials(){ // Logs in using envrionmental variables and returns credentials 
    return msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'});
}

function getKeyVaultSecret(credentials) {
    let keyVaultClient = new KeyVault.KeyVaultClient(credentials); // creates Key Vault client using credentials and retrieves secret object called cs-secret from Key Vault resource
    return keyVaultClient.getSecret('https://cs-keyvaultstorage.vault.azure.net/', 'cs-secret', "");
}

function getAndUseSecretValue(){        // Get credentials, get secret using them, get answer from WA using secret  
    getKeyVaultCredentials().then(      // call for credentials and wait until receive them
        getKeyVaultSecret               // call for secret and wait until recieve the object
    ).then(function (secret){ 
        secretValue = secret.value;     // retrive value of the secret and put it into a global variable
        console.log(secret.value);      // print into a azure logs (resources --> your app --> log stream)
        const testApi = new WA({        // create new instance of watson assistant, as apikey use retrieved secret
          version: '2019-02-28',        
          iam_apikey: secretValue,
          url: 'https://gateway-fra.watsonplatform.net/assistant/api'
        });
        testApi.message({               // send message to WA
          workspace_id: '1f6ab258-6b10-4afc-9bc4-1c4564d7f93b',
          input: {'text': 'Jak se mas?'}
          })
          .then(res => {
            console.log(res.output.text);   // print the answer of WA
            answer = res.output.text;       // save the answer into a global variable
          })
          .catch(err => {                   // hanndling errors
            return(err);
          });   
    }).catch(function (err) {
        throw (err);
    });
    
}

var server = http.createServer(function(request, response) {    // Create a server
    response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
    
    var url = "https://" + "cs-keyvaultstorage" + ".vault.azure.net/";      // store URL of Key Vault resource running on Azure
    response.write("Keyvault URL: " + url + "\n");                          // display the URL 
    
    // Display environmental variables (environment in Azure should keep these values, localy is set as: LOCAL)
    response.write("MSI_SECRET: " + process.env.MSI_SECRET + "\n");
    response.write("MSI_ENDPOINT: " + process.env.MSI_ENDPOINT + "\n");

    getAndUseSecretValue()                                           // call function to get secret, use it to call WA and store both in global variables
    response.write("SECRET_VALUE: " + secretValue + "\n");           // display the secret value
    response.write('ANSWER FROM WA: ' + answer + "\n");              // display the answer of WA
  
    response.end();                                                 // end the response
});
 
var port = process.env.PORT || 1337;                            // set PORT, if not set in .env, use 1337
server.listen(port);                                            // start server

console.log("Server running at http://localhost:%d", port);     // print confirmation, visible in app log on Azure
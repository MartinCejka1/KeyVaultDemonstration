/* 
Author: Martin Cejka
About: This project demonstrates working with a secrete value stored in Key Vault on Azure. See more in doc.txt
*/

var http = require('http');     // load a pakcage to create server 
require('dotenv').config();     // load a package to work with environmental variables so .env can be created and process.env have values from .env

const KeyVault = require('azure-keyvault');     // load package to work with KeyVault resource on Azure
const msRestAzure = require('ms-rest-azure');   // load package to work with azure account

const WA = require('ibm-watson/assistant/v1');  // load package to work with watson assistant (WA) on ibm cloud
global.secretValue='';


function getKeyVaultCredentials(){ // Logs in using envrionmental variables and returns credentials 
    return msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'});
}

function getKeyVaultSecret(credentials) {
    let keyVaultClient = new KeyVault.KeyVaultClient(credentials); // creates Key Vault client using credentials and retrieves secret object called cs-secret from Key Vault resource
    return keyVaultClient.getSecret('https://cs-keyvaultstorage.vault.azure.net/', 'cs-secret', "");
}

function getSecretValue(){ // returning value of the secret using functions getKeyVaultCredentials and getKeyVaultSecret in asynchronous way
    getKeyVaultCredentials().then(
        getKeyVaultSecret
    ).then(function (secret){
        secretValue = 'HOUBY';
        console.log(secret.value);
    }).catch(function (err) {
        throw (err);
    });
}
/*
function getKeyVaultCredentials(){
    msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'}).then((value)=>{console.log(value);return value;});
}

function getKeyVaultSecret(credentials) {
    let keyVaultClient = new KeyVault.KeyVaultClient(credentials);
    var url = getUrl();
    keyVaultClient.getSecret(url, 'watsonAssistentApikey', "").then((value)=>{return value;});
  }

function loginTheOtheWay(){
    let clientId = process.env['CLIENT_ID'] || '8f87c1ea-37a1-4d12-a372-e67de6d7ff45'; // service principal
    let domain = process.env['DOMAIN']; // tenant id
    let secret = process.env['APPLICATION_SECRET'] || 'watsonAssistantApikey';
    if (process.env.APPSETTING_WEBSITE_SITE_NAME){
      return msRestAzure.loginWithAppServiceMSI();
    } else {
      return msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain);
    }
  }
  
function getSecretOtherWay(credentialsOtherWay) {
    let keyVaultClient = new KeyVault.KeyVaultClient(credentialsOtherWay);
    var url = getUrl();
    keyVaultClient.getSecret(url, 'watsonAssistentApikey', "").then((value)=>{return value;});
}
*/
function useSecret(){
    const testApi = new WA({
        version: '2019-02-28',
        iam_apikey: '6RiEt_DkhzxZO7PdVasxVTdv6KbHYHuA8UpK3V72qJtg', // secret
        url: 'https://gateway-fra.watsonplatform.net/assistant/api'
      });
      testApi.message({
        workspace_id: '1f6ab258-6b10-4afc-9bc4-1c4564d7f93b',
        input: {'text': 'Jak se mas?'}
        })
        .then(res => {
          return(JSON.stringify(res, null, 2));
        })
        .catch(err => {
          return(err);
        });   
    }

var server = http.createServer(function(request, response) {    // Create a server
    response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
    
    var url = "https://" + "cs-keyvaultstorage" + ".vault.azure.net/";      // store URL of Key Vault resource running on Azure
    response.write("Keyvault URL: " + url + "\n");                          // display the URL 
    
    //var credentials = getKeyVaultCredentials();
    //var credentialString = JSON.stringify(credentials);
    //var credentialsOtherWay = loginTheOtheWay();
    //var credentialsOtherWayString = JSON.stringify(credentialsOtherWay);

    //var secret = getKeyVaultSecret(credentials);
    //var secretString = JSON.stringify(secret);
    //var secretOtherWay = getSecretOtherWay(credentialsOtherWay);
    //var secretOtherWayString = JSON.stringify(secretOtherWay);

    //var secretUsed = useSecret(secret);

    // Display environmental variables (environment in Azure should keep these values, localy is set as: LOCAL)
    response.write("MSI_SECRET: " + process.env.MSI_SECRET + "\n");
    response.write("MSI_ENDPOINT: " + process.env.MSI_ENDPOINT + "\n");

    //response.write("credentials: " + credentials + "\n");
    //response.write("credentials as string: " + credentialString + "\n");
    //response.write("credentials another way: " + credentialsOtherWay + "\n");
    //response.write("credentials another way as string: " + credentialsOtherWayString + "\n");
    // var secret = getSecretValue();                          // call function that returns the stored secret value
    response.write("SECRET_VALUE: " + secretValue + "\n");       // display the secret value

    var message = useSecret();                        // call function that uses secret as apikey for WA and returns response
    response.write("MESSAGE FROM WA: " + message + "\n");       // display message from Watson Assistant
    //response.write("secret as string: " + secretString + "\n");
    //response.write("secret another way: " + secretOtherWay + "\n");
    //response.write("secret another way: " + secretOtherWayString + "\n");
    //response.write("WA returns: " + secretUsed + "\n");

    response.end(); //end the response
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);

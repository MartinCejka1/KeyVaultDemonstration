var http = require('http');

// const KeyVault = require('azure-keyvault');
// const msRestAzure = require('ms-rest-azure');
// const WA = require('ibm-watson/assistant/v1');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    
    var msiSecret = getMSISecret();
    var msiEndpoint = getMSIEndpoint();
    var clientId = getClientId();
    var domain = getDomain();
    var url = getUrl();

    //var credentials = getKeyVaultCredentials();
    //var credentialString = JSON.stringify(credentials);
    //var credentialsOtherWay = loginTheOtheWay();
    //var credentialsOtherWayString = JSON.stringify(credentialsOtherWay);

    //var secret = getKeyVaultSecret(credentials);
    //var secretString = JSON.stringify(secret);
    //var secretOtherWay = getSecretOtherWay(credentialsOtherWay);
    //var secretOtherWayString = JSON.stringify(secretOtherWay);

    //var secretUsed = useSecret(secret);
    
    response.write("MSI SECRET: " + process.env.MSI_SECRET + "\n");
    response.write("MSI ENDPOINT: " + msiEndpoint + "\n");
    response.write("CLIENT ID: " + clientId + "\n");
    response.write("DOMAIN: " + domain + "\n");
    response.write("Keyvault URL: " + url + "\n");
    //response.write("credentials: " + credentials + "\n");
    //response.write("credentials as string: " + credentialString + "\n");
    //response.write("credentials another way: " + credentialsOtherWay + "\n");
    //response.write("credentials another way as string: " + credentialsOtherWayString + "\n");
    //response.write("secret: " + secret + "\n");
    //response.write("secret as string: " + secretString + "\n");
    //response.write("secret another way: " + secretOtherWay + "\n");
    //response.write("secret another way: " + secretOtherWayString + "\n");
    //response.write("WA returns: " + secretUsed + "\n");

    response.end(); //end the response
});

function getMSISecret(){
    secret = process.env["MSI_SECRET"] || '5986117EDD954D678104AC1A415CCC90';
    return secret;
}

function getClientId(){
    secret = process.env["CLIENT_ID"] || '8f87c1ea-37a1-4d12-a372-e67de6d7ff45';
    return secret;
}

function getMSIEndpoint(){
    secret = process.env["MSI_ENDPOINT"] || 'http://127.0.0.1:41076/MSI/token/';
    return secret;
}

function getDomain(){
  secret = process.env["MSI_DOMAIN"] || 'TEST';
  return secret;
}

function getUrl(){
    var vaultUri = "https://" + "cs-keyvaultstorage" + ".vault.azure.net/"; 
    return vaultUri;
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

function useSecret(secret){
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
*/
var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);

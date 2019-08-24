var http = require('http');
const KeyVault = require('azure-keyvault');
const msRestAzure = require('ms-rest-azure');


var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(process.env["MSI_SECRET"]);    
});

// The ms-rest-azure library allows us to login with MSI by providing the resource name. In this case the resource is Key Vault.
// For public regions the resource name is Key Vault
function getKeyVaultCredentials(){
    return msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'});
}

function getKeyVaultSecret(credentials) {
    let keyVaultClient = new KeyVault.KeyVaultClient(credentials);
    return keyVaultClient.getSecret('https://cs-keyvaultstorage.vault.azure.net/', 'cs-secret', "");
}

getKeyVaultCredentials().then(
    getKeyVaultSecret
).then(function (secret){
    console.log(`Your secret value is: ${secret.value}.`);
}).catch(function (err) {
    throw (err);
});


var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);

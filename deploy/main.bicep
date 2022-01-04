var resourceBaseName = 'recipes'

resource storage 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: '${resourceBaseName}${uniqueString(resourceGroup().id)}'
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    allowBlobPublicAccess: true
    supportsHttpsTrafficOnly: true
    accessTier: 'Hot'
  }
}

output stgAccName string = storage.name
#disable-next-line outputs-should-not-contain-secrets
output stgAccKey string = storage.listKeys().keys[0].value

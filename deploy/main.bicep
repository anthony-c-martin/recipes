targetScope = 'subscription'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'recipes'
  location: deployment().location
}

module storage './storage.bicep' = {
  scope: rg
  name: 'recipes-module'
}

output stgAccName string = storage.outputs.stgAccName
output stgAccKey string = storage.outputs.stgAccKey

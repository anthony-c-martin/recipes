@description('The base domain name (e.g. "foo.com")')
param domainName string

@description('The child domain name (e.g. "bar")')
param subDomainName string

@description('The name of the resource group where the dnsZone resource exists')
param dnsResourceGroup string

@description('An Azure region supported by Static Web Apps')
param location string = 'eastus2'

@description('Use Free for personal projects or Standard when an SLA is required')
@allowed([
  'Free'
  'Standard'
])
param skuName string = 'Free'

var fullSubDomainName = '${subDomainName}.${domainName}'

resource staticWebApp 'Microsoft.Web/staticSites@2025-03-01' = {
  name: '${subDomainName}-${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: skuName
    tier: skuName
  }
  properties: {}
}

module dns 'dns.bicep' = {
  name: 'dns'
  scope: resourceGroup(dnsResourceGroup)
  params: {
    domainName: domainName
    subDomainName: subDomainName
    staticWebAppHostname: staticWebApp.properties.defaultHostname
  }
}

resource customDomain 'Microsoft.Web/staticSites/customDomains@2025-03-01' = {
  parent: staticWebApp
  name: fullSubDomainName
  properties: {
    validationMethod: 'cname-delegation'
  }
  dependsOn: [
    dns
  ]
}

output staticWebAppName string = staticWebApp.name

@description('The base domain name (e.g. "foo.com")')
param domainName string

@description('The child domain name (e.g. "bar")')
param subDomainName string

@description('The name of the resource group where the dnsZone resource exists')
param dnsResourceGroup string

@description('The location to deploy non-global resources')
param location string = resourceGroup().location

var fullSubDomainName = '${subDomainName}.${domainName}'
var domainResourceName = replace(fullSubDomainName, '.', '-')

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '${subDomainName}${uniqueString(resourceGroup().id)}'
    location: location
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

var storageHostname = replace(replace(storage.properties.primaryEndpoints.web, 'https://', ''), '/', '')

module dns 'dns.bicep' = {
  name: 'dns'
  scope: resourceGroup(dnsResourceGroup)
  params: {
    cdnEndpointFqdn: cdnEnpoint.properties.hostName
    cdnEndpointId: cdnEnpoint.id
    domainName: domainName
    subDomainName: subDomainName
  }
}

resource cdnProfile 'Microsoft.Cdn/profiles@2024-06-01-preview' = {
  name: subDomainName
  location: 'Global'
  sku: {
    name: 'Standard_AzureFrontDoor'
  }
  properties: {
    originResponseTimeoutSeconds: 30
  }
}

resource afdEndpoint 'Microsoft.Cdn/profiles/afdendpoints@2024-06-01-preview' = {
  parent: cdnProfile
  name: domainResourceName
  location: 'Global'
  properties: {
    enabledState: 'Enabled'
  }
}

resource ruleSet 'Microsoft.Cdn/profiles/rulesets@2024-06-01-preview' = {
  parent: cdnProfile
  name: domainResourceName
}

resource customDomainSecret 'Microsoft.Cdn/profiles/secrets@2024-06-01-preview' = {
  parent: cdnProfile
  name: domainResourceName
  properties: {
    parameters: {
      type: 'ManagedCertificate'
    }
  }
}

resource customDomain 'Microsoft.Cdn/profiles/customdomains@2024-06-01-preview' = {
  parent: cdnProfile
  name: domainResourceName
  properties: {
    hostName: fullSubDomainName
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
      cipherSuiteSetType: 'TLS12_2022'
      secret: {
        id: customDomainSecret.id
      }
    }
  }
  dependsOn: [
    dns
  ]
}

resource originGroup 'Microsoft.Cdn/profiles/origingroups@2024-06-01-preview' = {
  parent: cdnProfile
  name: domainResourceName
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 2
      additionalLatencyInMilliseconds: 0
    }
  }
}

resource storageOrigin 'Microsoft.Cdn/profiles/origingroups/origins@2024-06-01-preview' = {
  parent: originGroup
  name: domainResourceName
  properties: {
    hostName: storageHostname
    originHostHeader: storageHostname
  }
}

resource enforceHttpsRule 'Microsoft.Cdn/profiles/rulesets/rules@2024-06-01-preview' = {
  parent: ruleSet
  name: 'EnforceHTTPS'
  properties: {
    order: 1
    conditions: [
      {
        name: 'RequestScheme'
        parameters: {
          typeName: 'DeliveryRuleRequestSchemeConditionParameters'
          matchValues: [
            'HTTP'
          ]
          operator: 'Equal'
          negateCondition: false
          transforms: []
        }
      }
    ]
    actions: [
      {
        name: 'UrlRedirect'
        parameters: {
          typeName: 'DeliveryRuleUrlRedirectActionParameters'
          redirectType: 'Found'
          destinationProtocol: 'Https'
        }
      }
    ]
    matchProcessingBehavior: 'Continue'
  }
}

resource profiles_recipes_name_profiles_recipes_name_ant_ninja_profiles_recipes_name_antninja 'Microsoft.Cdn/profiles/afdendpoints/routes@2024-06-01-preview' = {
  parent: afdEndpoint
  name: domainResourceName
  properties: {
    cacheConfiguration: {
      compressionSettings: {
        isCompressionEnabled: true
        contentTypesToCompress: [
          'application/eot'
          'application/font'
          'application/font-sfnt'
          'application/javascript'
          'application/json'
          'application/opentype'
          'application/otf'
          'application/pkcs7-mime'
          'application/truetype'
          'application/ttf'
          'application/vnd.ms-fontobject'
          'application/xhtml+xml'
          'application/xml'
          'application/xml+rss'
          'application/x-font-opentype'
          'application/x-font-truetype'
          'application/x-font-ttf'
          'application/x-httpd-cgi'
          'application/x-javascript'
          'application/x-mpegurl'
          'application/x-opentype'
          'application/x-otf'
          'application/x-perl'
          'application/x-ttf'
          'font/eot'
          'font/ttf'
          'font/otf'
          'font/opentype'
          'image/svg+xml'
          'text/css'
          'text/csv'
          'text/html'
          'text/javascript'
          'text/js'
          'text/plain'
          'text/richtext'
          'text/tab-separated-values'
          'text/xml'
          'text/x-script'
          'text/x-component'
          'text/x-java-source'
        ]
      }
      queryStringCachingBehavior: 'IgnoreQueryString'
    }
    customDomains: [
      {
        id: customDomain.id
      }
    ]
    grpcState: 'Disabled'
    originGroup: {
      id: originGroup.id
    }
    ruleSets: [
      {
        id: ruleSet.id
      }
    ]
    supportedProtocols: [
      'Http'
      'Https'
    ]
    patternsToMatch: [
      '/*'
    ]
    forwardingProtocol: 'MatchRequest'
    linkToDefaultDomain: 'Enabled'
    httpsRedirect: 'Disabled'
    enabledState: 'Enabled'
  }
}

resource cdnEnpoint 'Microsoft.Cdn/profiles/endpoints@2021-06-01' = {
  parent: cdnProfile
  name: replace(fullSubDomainName, '.', '-')
  location: 'global'
  properties: {
    originHostHeader: storageHostname
    // we enforce an http redirect with the rules engine, but this must be set to true for it to work
    isHttpAllowed: true
    isHttpsAllowed: true
    isCompressionEnabled: true
    queryStringCachingBehavior: 'IgnoreQueryString'
    optimizationType: 'GeneralWebDelivery'
    contentTypesToCompress: [
      'application/eot'
      'application/font'
      'application/font-sfnt'
      'application/javascript'
      'application/json'
      'application/opentype'
      'application/otf'
      'application/pkcs7-mime'
      'application/truetype'
      'application/ttf'
      'application/vnd.ms-fontobject'
      'application/xhtml+xml'
      'application/xml'
      'application/xml+rss'
      'application/x-font-opentype'
      'application/x-font-truetype'
      'application/x-font-ttf'
      'application/x-httpd-cgi'
      'application/x-javascript'
      'application/x-mpegurl'
      'application/x-opentype'
      'application/x-otf'
      'application/x-perl'
      'application/x-ttf'
      'font/eot'
      'font/ttf'
      'font/otf'
      'font/opentype'
      'image/svg+xml'
      'text/css'
      'text/csv'
      'text/html'
      'text/javascript'
      'text/js'
      'text/plain'
      'text/richtext'
      'text/tab-separated-values'
      'text/xml'
      'text/x-script'
      'text/x-component'
      'text/x-java-source'
    ]
    origins: [
      {
        name: replace(storageHostname, '.', '-')
        properties: {
          hostName: storageHostname
          originHostHeader: storageHostname
        }
      }
    ]
    deliveryPolicy: {
      rules: [
        {
          name: 'EnforceHTTPS'
          order: 1
          conditions: [
            {
              name: 'RequestScheme'
              parameters: {
                typeName: 'DeliveryRuleRequestSchemeConditionParameters'
                matchValues: [
                  'HTTP'
                ]
                operator: 'Equal'
                negateCondition: false
                transforms: []
              }
            }
          ]
          actions: [
            {
              name: 'UrlRedirect'
              parameters: {
                typeName: 'DeliveryRuleUrlRedirectActionParameters'
                redirectType: 'Found'
                destinationProtocol: 'Https'
              }
            }
          ]
        }
      ]
    }
  }
}

output stgAccName string = storage.name

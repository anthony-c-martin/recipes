param domainName string
param subDomainName string
param cdnHostname string
param cdnValidationToken string

resource dnsZone 'Microsoft.Network/dnsZones@2018-05-01' existing = {
  name: domainName

  resource cname 'CNAME' = {
    name: subDomainName
    properties: {
      TTL: 3600
      CNAMERecord: {
        cname: cdnHostname
      }
    }
  }

  resource cdnverify 'TXT' = {
    name: '_dnsauth.${subDomainName}'
    properties: {
      TTL: 3600
      TXTRecords: [
        {
          value: [
            cdnValidationToken
          ]
        }
      ]
    }
  }
}

param domainName string
param subDomainName string
param staticWebAppHostname string

resource dnsZone 'Microsoft.Network/dnsZones@2018-05-01' existing = {
  name: domainName

  resource cname 'CNAME' = {
    name: subDomainName
    properties: {
      TTL: 3600
      CNAMERecord: staticWebAppHostname
    }
  }
}

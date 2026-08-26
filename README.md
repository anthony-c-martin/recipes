# Builds & Deploys [Ant's Recipes](https://recipes.ant.ninja)

## Azure hosting

The site is hosted on Azure Static Web Apps. Deployments use the Free plan by
default, which is suitable for this personal static site and includes global
content distribution, managed TLS, custom domains, and 100 GB of monthly
bandwidth.

The Free plan has no SLA and limits each app to 250 MB. Set `skuName` to
`Standard` in `deploy/main.bicepparam` if an SLA or higher limits are required.

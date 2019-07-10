[![Netlify Status](https://api.netlify.com/api/v1/badges/30bdf828-42eb-41ca-9053-8f5c7fd31e90/deploy-status)](https://app.netlify.com/sites/heimdall-vue/deploys)

https://heimdall-vue.netlify.com

# [Heimdall-Vue](https://www.github.com/mitre/heimdall-vue)

## Samples

Example JSON profiles are stored in `sample_jsons/`

## Project setup
``` bash
npm install
```

### Compiles and hot-reloads for development
``` bash
npm run serve
```

### Compiles and minifies for production
``` bash
npm run build
```

### Compiles and runs as electron application
``` bash
npm run electron
```

### Run your tests
``` bash
npm run test
```

### Lints and fixes files
``` bash
npm run lint
```

### Run your end-to-end tests
``` bash
npm run test:e2e
```

### Run your unit tests
``` bash
npm run test:unit
```

### Run storybook
``` bash
npm run storybook
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Notes/Commmon Problems

### Proxy Notes

If you have a proxy, remember to setup your NPM enviroment to respect the proxy
- https://jjasonclark.com/how-to-setup-node-behind-web-proxy/
- `npm config set strict-ssl false`
- `npm config set proxy http://myproxy:8080`
- `npm config set https-proxy https://myproxy:443`

## Contributing

### Components

When developing Vue components, add your component to `src/components`, following a similar style to existing components.

#### Storybook integration

For visual components it is advised to add a story view of the component to
storybook. This will serve as a visualization of the component under test
conditions and serves to help other developers know how newly developed
components are supposed to be used.

First thing to do is after creating the component, register it in storybooks config.js file (`.storybook/config.js`)

``` js
import MyComponent from '../src/components/MyComponent.vue';
Vue.component('MyComponent',MyComponent);
```

This needs to be done as storybook runs its own instance of vue.

Next step is to add a story to `stories/index.stories.js` or add one to a file in `stories/` then import said story into `stories/index.stories.js`

Stories look like the following example from https://storybook.js.org/docs/guides/guide-vue/:

``` js 
storiesOf('Button', module)
  .add('with text', () => '<my-button>with text</my-button>')
  .add('with emoji', () => '<my-button>😀 😎 👍 💯</my-button>')
  .add('as a component', () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">rounded</my-button>'
  }));
```

### Install Problems

If you run "npm install" and get the error "unable to get local issuer certificate", you can run this command:
```
  npm config set strict-ssl false
```

If you run "npm install" and get the error "node-pre-gyp ERR! Completion callback never invoked!", you can delete the "package-lock.json" file and try it again.

## Release Process 

### Branches
The master branch contains the latest version of the software leading up to a new release.

Other branches contain feature-specific updates.

### Tags
Tags indicate official releases of the project.

Please note 0.x releases are works in progress (WIP) and may change at any time.

## Legal Stuff

### NOTICE

© 2018 The MITRE Corporation.  

Approved for Public Release; Distribution Unlimited. Case Number 18-3678.  

## NOTICE
MITRE hereby grants express written permission to use, reproduce, distribute, modify, and otherwise leverage this software to the extent permitted by the licensed terms provided in the LICENSE.md file included with this project.

### NOTICE  

This software was produced for the U. S. Government under Contract Number HHSM-500-2012-00008I, and is subject to Federal Acquisition Regulation Clause 52.227-14, Rights in Data-General.  

No other use other than that granted to the U. S. Government, or to those acting on behalf of the U. S. Government under that Clause is authorized without the express written permission of The MITRE Corporation.

For further information, please contact The MITRE Corporation, Contracts Management Office, 7515 Colshire Drive, McLean, VA  22102-7539, (703) 983-6000.

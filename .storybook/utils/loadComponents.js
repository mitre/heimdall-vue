import Vue from 'vue'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

const loadComponents = () => {
  const componentContext = require.context(
    '../../src/components',
    true,
    /[`a-zA-Z]\w+\.(vue)$/
  )

  componentContext.keys().forEach(fileName => {
    const componentConfig = componentContext(fileName)

    const componentName = upperFirst(
      camelCase(
        fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
      )
    )

    Vue.component(componentName, componentConfig.default || componentConfig)
  })
}

export {
  loadComponents
}
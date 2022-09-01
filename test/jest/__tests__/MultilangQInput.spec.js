import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import MultilangInput from '../../../src/components/MultilangInput.vue'
import { mount } from '@vue/test-utils'

import { describe, expect, it } from '@jest/globals'

installQuasarPlugin()

describe('MultilanguageInput', () => {
  const multilangWrapper = mount(MultilangInput, {
    props: {
      modelValue: {
        en: 'test text',
        it: 'testo test'
      },
      languages: ['en', 'it'],
      required: false,
      readonly: false
    }
  })

  it('should mount the component and expose for testing', () => {
    expect(multilangWrapper.find('div').exists()).toBeTruthy()
    expect(multilangWrapper.find('input').exists()).toBeTruthy()
  })

  it('sets the correct default data', () => {
    const { vm } = multilangWrapper

    expect(vm.$props.modelValue.en).toBe('test text')
    expect(vm.$props.modelValue.it).toBe('testo test')

    const inputs = multilangWrapper.findAll('input')
    expect(inputs.length).toBe(2)
    expect(inputs.at(0).isVisible()).toBe(true)
    expect(inputs.at(1).isVisible()).toBe(true)

    expect(inputs.at(0).element.value).toBe('test text')
    expect(inputs.at(1).element.value).toBe('testo test')
  })

  it('sets the translated texts', async () => {
    const inputs = multilangWrapper.findAll('input')
    const { vm } = multilangWrapper

    expect(inputs.length).toBe(2)
    await inputs.at(0).setValue('test 1')
    await inputs.at(1).setValue('testo 2')

    expect(vm.$props.modelValue.en).toBe('test 1')
    expect(vm.$props.modelValue.it).toBe('testo 2')
  })
})

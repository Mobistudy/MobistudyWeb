import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import MyInput from './demo/MyInput'
import { mount } from '@vue/test-utils'

import { describe, expect, it } from '@jest/globals'

installQuasarPlugin()

describe('MyInput-demo', () => {
  it('should mount the component and expose for testing', () => {
    const wrapper = mount(MyInput)

    expect(wrapper.find('div').exists()).toBeTruthy()
    expect(wrapper.find('.my-input').exists()).toBeTruthy()
  })

  it('props are set correctly', () => {
    const wrapper = mount(MyInput, {
      props: {
        modelValue: 'test'
      }
    })
    const { vm } = wrapper

    expect(vm.$props.modelValue).toBe('test')
  })

  it('sets a value correctly', async () => {
    const wrapper = mount(MyInput, {
      props: {
        modelValue: 'test'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('test 1')

    expect(input.element.value).toBe('test 1')

    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('test 1')
  })
})

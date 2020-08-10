import { shallowMount } from '@vue/test-utils'
import TokenPrice from '@/components/TokenPrice.vue'

describe('TokenPrice.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(TokenPrice, {
      propsData: {
        msg,
      },
    })
    expect(wrapper.text()).toMatch(msg)
  })
})

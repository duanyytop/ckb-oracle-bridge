import { shallowMount } from '@vue/test-utils'
import PriceItem from '@/components/PriceItem.vue'

describe('PriceItem.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(PriceItem, {
      propsData: { msg },
    })
    expect(wrapper.text()).toMatch(msg)
  })
})

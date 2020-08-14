import { shallowMount } from '@vue/test-utils'
import TokenPrice from '@/components/TokenPrice.vue'

describe('TokenPrice.vue', () => {
  it('renders props.tokenInfo when passed', () => {
    const tokenInfo = {
      token: 'btc',
      price: '11979.80',
      from: 'Coinbase',
      timestamp: '1583195520',
      change: '12.45%',
    }
    const wrapper = shallowMount(TokenPrice, {
      propsData: {
        tokenInfo,
      },
    })
    expect(wrapper).toBeDefined()
  })
})

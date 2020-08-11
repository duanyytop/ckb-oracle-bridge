import { shallowMount } from '@vue/test-utils'
import TokenPrice from '@/components/TokenPrice.vue'

describe('TokenPrice.vue', () => {
  it('renders props.tokenInfo when passed', () => {
    const tokenInfo = {
      token: 'BTC/USDT',
      price: '11979.80',
      from: 'Coinbase',
      timestamp: '3min ago',
      change: '12.45%',
      icon: 'btc.png',
    }
    const wrapper = shallowMount(TokenPrice, {
      propsData: {
        tokenInfo,
      },
    })
    expect(wrapper.text()).toBe('BTC/USDT Coinbase 11979.80 3min ago 12.45%')
  })
})

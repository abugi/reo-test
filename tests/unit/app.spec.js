import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
  it('ensure the map container is visible', () => {
    
    const wrapper = mount(App)

    const mapContainer = wrapper.get('#map')

    expect(mapContainer.isVisible()).toBe(true)
  })

  it('does not render the map before it is injected', () => {
    
    const wrapper = mount(App)

    const map = wrapper.get('#map')

    expect(map.find('div').exists()).toBe(false)
  })

  it('renders the map after it has been injected', () => {
    
    const wrapper = mount(App)

    const map = wrapper.get('#map')

    setTimeout(() => {
      expect(map.get('div').exists()).toBe(true)
    }, 10)
  })
})

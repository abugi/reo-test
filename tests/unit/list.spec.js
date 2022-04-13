import { mount } from '@vue/test-utils'
import List from '@/components/ListView.vue'

describe('List of locations and Coordinates', () => {
    it('does not display list of location and coordinates before markers are placed', () => {
      
      const wrapper = mount(List)
  
      const ul = wrapper.get('ul')
  
      expect(ul.find('li').exists()).toBe(false)
    })
  
    it('renders list of location and coordinates after markers are placed', async () => {
      
      const wrapper = mount(List, {
        props: {
            placedPoints: null,
            groups: null
        }
      })

      await wrapper.setProps({placedPoints: [
        {name: 'Palo Alto', lat: 37.4419, lng: 122.1430}
    ]})

    const domNodes = wrapper.findAll('li')

    expect(domNodes).toHaveLength(1)
    })
  })

  describe('Render groups', () => {
    it('does not group when less than 9 point are placed', () => {
      
      const wrapper = mount(List)

      const component = wrapper.find('ul')
  
      expect(component.attributes()).toEqual({
        class: 'locations'
      })
    })

    it('renders list of location and coordinates after markers are placed', async () => {
      
        const wrapper = mount(List, {
          props: {
              placedPoints: null,
              groups: null
          }
        })
  
        await wrapper.setProps({groups: {
          lower: []
        }})

        expect(wrapper.find('ul').attributes()).toEqual({
            class: 'groups'
          })

        expect(wrapper.text()).toContain('Group')
      })
  })
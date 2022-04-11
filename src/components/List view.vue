<template>
  <aside class="list-wrapper" @click.stop="eventDeligate">
    <ul v-if="!Object.keys(groups).length">
      <li v-for="(item, index) in placedPoints" :key="index">
        <span class="location-name">
          {{ item.name }}
        </span>
        <span class="location-coords">{{ item.lat }}, {{ item.lng }}</span>
      </li>
    </ul>
    <ul v-if="Object.keys(groups).length">
      <li v-for="(group, key) in groups" :key="key">
        <section class="group-heading">
          <div class="group-highlight"></div>
          <div class="group-title" @click.self="changeHighlighColor">
            {{ key === 'undefined' ? 'Ungrouped' : 'Group' }}
          </div>
        </section>
        <div
          v-for="(item, index) in group"
          :key="index"
          class="location-groups"
        >
          <div>
            <span class="location-name">{{ item.name }}</span>
            <span class="location-coords">{{ item.lat }}, {{ item.lng }}</span>
          </div>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'ListView',
  props: {
    placedPoints: {
      type: Array,
      default: null,
    },
    groups: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    groups() {
      if (Object.keys(this.groups).length) {
        this.appplyHightlightColor('.group-highlight')
      }
    },
  },
  methods: {
    eventDeligate(event) {
      const target = event.target

      if ([...target.classList].includes('location-name')) {
        target.setAttribute('contenteditable', true)
        target.focus()
      }
    },
    generateRandomColor() {
      return Math.floor(100000 + Math.random() * 900000)
    },
    appplyHightlightColor(selector) {
      this.$nextTick(() => {
        const nodes = document.querySelectorAll(selector)

        nodes.forEach((node) => {
          node.style.backgroundColor = `#${this.generateRandomColor()}`
        })
      })
    },
    changeHighlighColor(event) {
      const target = event.target.previousElementSibling
      target.style.backgroundColor = `#${this.generateRandomColor()}`
    },
  },
}
</script>

<style scoped>
.list-wrapper {
  width: 30%;
  flex-shrink: 0;
  font-size: 0.9rem;
  padding: 0 1.5rem;
  overflow-y: scroll;
  overscroll-behavior-y: contain;
}

.location-name,
.group-title {
  font-weight: 600;
}

.location-coords {
  color: #889;
  margin-left: 6px;
}

.location-groups {
  margin: 0.6rem 0;
}

.location-name:focus {
  padding: 6px;
  background: #fff;
}

ul {
  list-style-type: none;
  margin: 2em 0;
  padding: 0;
}

ul > li {
  margin: 1.7rem 0;
}

.group-heading {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.group-title {
  cursor: pointer;
  user-select: none;
}

.group-highlight {
  width: 12px;
  height: 12px;
  margin-right: 7px;
}
</style>

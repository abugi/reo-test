<template>
  <ol @click.stop.enter="eventDeligate">
    <li v-for="(item, index) in placedPoints" :key="index">
      <h5 class="location-name">
        {{ item.name }}
      </h5>
      :
      <span>{{ item.lat }}, {{ item.lng }}</span>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'ListView',
  props: {
    placedPoints: {
      type: Array,
      default: null,
    },
  },
  methods: {
    eventDeligate(event) {
      const target = event.target
      const tagName = event.target.tagName

      if (tagName.toLowerCase() === 'h5') {
        target.setAttribute('contenteditable', true)
        target.focus()
      }
    },
  },
}
</script>

<style scoped>
ol {
  width: 30%;
  flex-shrink: 0;
}

li {
  padding: 0.6rem 0.2rem;
}

.location-name {
  color: #2366f1;
  display: inline-block;
  font-weight: 600;
  margin: 0;
}

.location-name:focus {
  padding: 12px;
}
</style>

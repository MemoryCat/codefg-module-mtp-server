<template>
  <div>
    dashboard<button @[btnEvent]="action">按钮</button>
    <button-counter />
  </div>
</template>
<script>
export default {
  components: {
    "button-counter": {
      data() {
        return {
          count: 0,
        };
      },
      template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`,
    },
  },
  data() {
    return {
      btnEvent: "click",
    };
  },
  created() {},
  methods: {
    action() {
      alert("action");
    },
  },
};
</script>
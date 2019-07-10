<template>
  <vx-card class="overflow-hidden" content-color="#fff" :card-background="background">
    <div slot="no-body">
      <div
        class="p-6 pb-0"
        :class="{'flex justify-between flex-row-reverse items-center': iconRight}"
      >
        <feather-icon
          :icon="icon"
          class="p-3 inline-flex rounded-full"
          :class="[`text-$white`, {'mb-4': !iconRight}]"
        ></feather-icon>
        <div>
          <h1 style="color:white;font-size:40px;" class="mb-1 fold-bold">{{statistic}}</h1>
        </div>
      </div>

      <div class="p-6 pb-4">
        <h2 style="color:white;">{{statisticTitle}}</h2>
        <span>{{statisticSub}}</span>
      </div>
    </div>
  </vx-card>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    statistic: {
      type: [Number, String],
      required: true
    },
    statisticTitle: {
      type: String
    },
    statisticSub: {
      type: String
    },
    background: {
      type: String
    },
    iconRight: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    themePrimaryColor() {
      return this.$store.state.theme.themePrimaryColor;
    }
  },
  methods: {
    getHex() {
      let rgb = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(`--vs-${this.color}`);
      rgb = rgb.split(",");
      return (
        "#" +
        (
          (1 << 24) +
          (Number(rgb[0]) << 16) +
          (Number(rgb[1]) << 8) +
          Number(rgb[2])
        )
          .toString(16)
          .slice(1)
      );
    }
  }
};
</script>
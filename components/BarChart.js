import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["data", "options"],
  mounted() {
    this.renderChart(this.data, this.options);
  },
  watch: {
    data: {
      handler: function(to, from) {
        this.renderChart(this.data, this.options)
      }
    }
  },
};

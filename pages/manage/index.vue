<template>
  <section class="section">
    <div class="container">
      <div class="level">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-5">
              <strong>{{ salesTodayCount }}</strong> sold today
            </p>
          </div>
        </div>

        <!-- Right side -->
        <div class="level-right">
          <div class="level-item">
            <b-field>
              <b-select
                v-model="saleChartPeriodSelectedOption"
                placeholder="Select a period"
                icon="calendar"
              >
                <option
                  v-for="option in saleChartPeriodOptions"
                  :value="option.id"
                  :key="option.id"
                >{{ option.value }}</option>
              </b-select>
            </b-field>
          </div>
        </div>
      </div>
      <LineChart :data="salesChartData" :options="salesChartOptions"></LineChart>
    </div>
  </section>
</template>

<script>
import LineChart from "~/components/LineChart";

export default {
  data() {
    return {
      isSalesDataLoading: false,

      saleChartPeriodOptions: [
        {
          id: 0,
          value: "3 days"
        },
        {
          id: 1,
          value: "1 week"
        },
        {
          id: 2,
          value: "1 month"
        },
        {
          id: 3,
          value: "1 year"
        },
        {
          id: 4,
          value: "All time"
        }
      ],
      saleChartPeriodSelectedOption: 2,
      salesData: {},
      salesTodayCount: 0,
      salesChartData: {},
      salesChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Number of sales"
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    };
  },
  created() {
    this.fetchSales();
  },
  components: {
    LineChart
  },

  methods: {
    async fetchSales() {
      let data = [];
      let isMore = true;
      let pageNumber = 1;

      this.isSalesDataLoading = true;

      while (isMore) {
        await this.$axios
          .$get("/v1/sale/", {
            params: {
              page: pageNumber,
              ordering: "datetime_created"
            }
          })
          .then(res => {
            data.push(...res.results);
            isMore = res.previous == null ? false : true;
          })
          .catch(err => {
            console.log("Error fetching sales data", err);
          });

        pageNumber++;
      }

      this.salesData = data;
      this.isSalesDataLoading = false;
    },
    populateChart(data) {
      let today = new Date();
      let endDate = new Date();
      let saleCounts = {};
      let chartData = {
        labels: [],
        datasets: [
          {
            label: "Sales",
            data: []
          }
        ]
      };

      switch (this.saleChartPeriodSelectedOption) {
        case 0:
          endDate.setDate(today.getDate() - 3);
          break;
        case 1:
          endDate.setDate(today.getDate() - 7);
          break;
        case 2:
          endDate.setDate(today.getDate() - 30);
          break;
        case 3:
          endDate.setDate(today.getDate() - 365);
          break;
        default:
          endDate = today;
      }

      endDate.setHours(0, 0, 0, 0);

      // Reset value.
      this.salesTodayCount = 0;

      data.forEach(result => {
        let saleDate = new Date(result.datetime_created);

        saleCounts[saleDate.toDateString()] =
          saleCounts[saleDate.toDateString()] + result.quantity ||
          result.quantity;
      });

      for (const key in saleCounts) {
        // key == Date obj

        if (saleCounts.hasOwnProperty(key)) {
          let count = saleCounts[key];

          if (key == today.toDateString()) {
            // Items sold today.

            this.salesTodayCount = count;
          }

          let date = new Date(key);

          date.setHours(0, 0, 0, 0);

          if (date > endDate || endDate == today) {
            chartData.labels.push(key);
            chartData.datasets[0].data.push(count);
          }
        }
      }

      // Set chart data.
      this.salesChartData = chartData;
    }
  },
  watch: {
    salesData: {
      handler: function(val, oldVal) {
        this.populateChart(val);
      }
    },
    saleChartPeriodSelectedOption: {
      handler: function(val, oldVal) {
        this.fetchSales();
      }
    }
  }
};
</script>
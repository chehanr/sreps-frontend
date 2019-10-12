<template>
  <section class="section">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <b-field class="level-item">
            <b-input @input="fetchSales" icon="magnify" placeholder="Search..." type="search"></b-input>
          </b-field>
        </div>
        <div class="level-right">
          <b-button
            class="level-item"
            tag="nuxt-link"
            to="/manage/invoice/add"
            type="is-primary"
            icon-left="plus"
            disabled
          >Add Invoice</b-button>
        </div>
      </div>
      <div v-show="checkedRowsData.length" class="level">
        <div class="level-left">
          <b-field class="level-item">
            <b-button
              :disabled="!checkedRowsData.length"
              @click="checkedRowsData = []"
              class="level-item"
              size="is-small"
              type="is-danger"
              icon-left="select-off"
            >Clear Checked</b-button>
          </b-field>
        </div>
        <div class="level-right">
          <b-button
            :disabled="!checkedRowsData.length"
            class="level-item"
            icon-left="check-circle"
            size="is-small"
          >Set Available</b-button>
          <b-button
            :disabled="!checkedRowsData.length"
            class="level-item"
            icon-left="circle"
            size="is-small"
          >Set Unavailable</b-button>
        </div>
      </div>
      <b-table
        :checked-rows.sync="checkedRowsData"
        :data="pageData"
        :default-sort="[sortField, sortOrder]"
        :default-sort-direction="defaultSortDirection"
        :loading="isLoading"
        :per-page="perPageRows"
        :total="totalRows"
        @select="onSelect"
        @sort="onSort"
        @page-change="onPageChange"
        aria-current-label="Current page"
        aria-next-label="Next page"
        aria-page-label="Page"
        aria-previous-label="Previous page"
        backend-pagination
        backend-sorting
        checkable
        paginated
      >
        <template slot-scope="props">
          <b-table-column field="id" label="ID" numeric sortable>{{ props.row.id }}</b-table-column>
          <b-table-column
            field="salesperson"
            label="Salesperson"
            sortable
          >{{ props.row.salesperson.username }}</b-table-column>
          <b-table-column
            field="customer"
            label="Customer"
            sortable
          >#{{ props.row.customer.id }} {{ props.row.customer.name }}</b-table-column>
          <b-table-column
            field="products_price"
            label="Price"
            numeric
          >${{ props.row.products_price.toFixed(2) }}</b-table-column>
          <b-table-column
            field="other_cost"
            label="Other cost"
            numeric
            sortable
          >${{ props.row.other_cost.toFixed(2) }}</b-table-column>
          <b-table-column
            field="tax_amount"
            label="Tax Amount"
            numeric
            sortable
          >{{ props.row.tax_amount }}%</b-table-column>
          <b-table-column
            field="total_price"
            label="Total"
            numeric
          >${{ props.row.total_price.toFixed(2) }}</b-table-column>
          <b-table-column field="datetime_pay_due" label="Payment due" centered sortable>
            <span class="tag">{{ new Date(props.row.datetime_pay_due).toLocaleDateString() }}</span>
          </b-table-column>
          <b-table-column field="is_paid" label="Paid" boolean centered sortable>
            <div class="tags has-addons">
              <b-icon :icon="props.row.is_paid === true ? 'check-circle' : 'circle'"></b-icon>
            </div>
          </b-table-column>
          <b-table-column field="datetime_paid" label="Paid on" centered sortable>
            <span class="tag">{{ new Date(props.row.datetime_paid).toLocaleDateString() }}</span>
          </b-table-column>
          <b-table-column field="datetime_created" label="Date added" centered sortable>
            <span class="tag">{{ new Date(props.row.datetime_created).toLocaleDateString() }}</span>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,

      checkedRowsData: [],
      pageData: [],

      defaultSortDirection: "asc",
      sortField: "id",
      sortOrder: "asc",
      page: 1,
      perPageRows: 30,
      totalRows: 0
    };
  },
  created() {
    this.fetchSales();
  },
  methods: {
    async fetchSales(input = null) {
      this.isLoading = true;

      this.checkedRowsData = [];

      await this.$axios
        .$get("/v1/invoice/", {
          params: {
            search: input,
            page: this.page,
            ordering: `${this.sortOrder == "desc" ? "-" : ""}${this.sortField}`
          }
        })
        .then(res => {
          this.pageData = res.results;
          this.totalRows = res.count;
        })
        .catch(err => {
          console.log("Error fetching results", err);

          this.pageData = [];
          this.totalRows = 0;
        });

      this.isLoading = false;
    },
    onPageChange(page) {
      this.page = page;

      this.fetchSales();
    },
    onSelect(item) {
      // TODO: Implement better method.
      // this.$router.push({ path: `invoices/${item.id}/update/` });
    },
    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;

      this.fetchSales();
    }
  }
};
</script>

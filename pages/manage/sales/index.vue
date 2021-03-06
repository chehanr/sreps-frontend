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
            @click="fetchExport"
            class="level-item"
            icon-left="export"
            v-bind:loading="isLoadingExport"
          >Export</b-button>
          <b-button
            class="level-item"
            tag="nuxt-link"
            to="/manage/sales/add"
            type="is-primary"
            icon-left="plus"
            disabled
          >Add Sales</b-button>
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
            field="invoice__id"
            label="Invoice ID"
            numeric
            sortable
          >{{ props.row.invoice }}</b-table-column>

          <b-table-column
            field="product__id"
            label="Product"
            sortable
          >#{{ props.row.product.id }} {{ props.row.product.name }}</b-table-column>

          <b-table-column
            field="quantity"
            label="Quantity"
            numeric
            sortable
          >{{ props.row.quantity }}</b-table-column>

          <b-table-column field="datetime_created" label="Date added" centered sortable>
            <span class="tag">{{ new Date(props.row.datetime_created).toLocaleDateString() }}</span>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </section>
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
      isLoadingExport: false,

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
        .$get("/v1/sale/", {
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
    async fetchExport() {
      this.isLoadingExport = true;

      await this.$axios
        .$get("/v1/sale/export/", {
          responseType: "blob",
          timeout: 30000
        })
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res], {type: 'text/csv'}));
          const link = document.createElement("a");
          const fileName = `sales-${new Date().toLocaleString()}.csv`;

          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
        })
        .catch(err => {
          console.log("Error fetching export data", err);
        });

      this.isLoadingExport = false;
    },
    onPageChange(page) {
      this.page = page;

      this.fetchSales();
    },
    onSelect(item) {
      // TODO: Implement better method.
      // this.$router.push({ path: `sales/${item.id}/update/` });
    },
    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;

      this.fetchSales();
    }
  }
};
</script>

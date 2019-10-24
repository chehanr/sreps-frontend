<template>
  <section class="section">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <b-field class="level-item">
            <b-input @input="fetchProducts" icon="magnify" placeholder="Search..." type="search"></b-input>
          </b-field>
        </div>

        <div class="level-right">
          <b-button
            class="level-item"
            tag="nuxt-link"
            to="/manage/products/add"
            type="is-primary"
            icon-left="plus"
          >Add Product</b-button>
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

          <b-table-column field="name" label="Name" sortable>{{ props.row.name }}</b-table-column>

          <b-table-column
            field="category"
            label="Category"
            sortable
          >{{ props.row.category ? props.row.category.name : ''}}</b-table-column>

          <b-table-column
            field="base_price"
            label="Base price"
            numeric
            sortable
          >${{ props.row.base_price.toFixed(2) }}</b-table-column>

          <b-table-column
            field="discount_amount"
            label="Discount"
            numeric
            sortable
          >{{ props.row.discount_amount }}%</b-table-column>

          <b-table-column
            field="price"
            label="Price"
            numeric
          >${{ calcPrice(props.row.base_price, props.row.discount_amount) }}</b-table-column>

          <b-table-column field="datetime_created" label="Date added" centered sortable>
            <span class="tag">{{ new Date(props.row.datetime_created).toLocaleDateString() }}</span>
          </b-table-column>

          <b-table-column 
            field="monthly_predicted" 
            label="Monthly predicted" 
            numeric
          >{{ Math.floor(props.row.stock_quantity/3) }}</b-table-column>

          <b-table-column
            field="stock_quantity"
            label="Stock"
            numeric
            sortable
          >{{ props.row.stock_quantity }}</b-table-column>

          <b-table-column field="stock_status" label="Stock status" boolean centered>
            <b-tooltip
              v-if="props.row.stock_quantity <= props.row.low_stock_threshold"
              :label="'Below threshold (' + props.row.low_stock_threshold + ')'"
              type="is-warning"
            >
              <b-icon icon="alert-circle" type="is-warning"></b-icon>
            </b-tooltip>
            <b-tooltip
              v-else
              :label="'Above threshold (' + props.row.low_stock_threshold + ')'"
              type="is-success"
            >
              <b-icon icon="check-circle" type="is-success"></b-icon>
            </b-tooltip>
          </b-table-column>

          <b-table-column field="is_available" label="Available" boolean centered sortable>
            <span>
              <b-icon :icon="props.row.is_available === true ? 'check-circle' : 'circle'"></b-icon>
            </span>
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
    this.fetchProducts();
  },
  methods: {
    async fetchProducts(input = null) {
      this.isLoading = true;

      this.checkedRowsData = [];

      await this.$axios
        .$get("/v1/product/", {
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
    calcPrice(basePrice, discountAmount) {
      // TODO: Make helper function.

      return (basePrice - (basePrice * discountAmount) / 100).toFixed(2);
    },
    onPageChange(page) {
      this.page = page;

      this.fetchProducts();
    },
    onSelect(item) {
      // TODO: Implement better method.
      this.$router.push({ path: `products/${item.id}/update/` });
    },
    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;

      this.fetchProducts();
    }
  }
};
</script>

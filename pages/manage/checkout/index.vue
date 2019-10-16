<template>
  <section class="section">
    <div class="container">
      <b-field
        :message="formErrorData.customer"
        :type="{ 'is-danger': formErrorData.customer }"
        label="Customer"
      >
        <b-autocomplete
          :data="customerSearchData"
          :loading="isFetchingCustomers"
          @select="option => formData.customer = option"
          @typing="fetchCustomers"
          field="name"
          placeholder="e.g. John Smith"
        >
          <template slot="header">
            <nuxt-link to="/manage/customers/add" target="_blank">Add new...</nuxt-link>
          </template>
        </b-autocomplete>
      </b-field>
      <form>
        <b-field
          :message="formErrorData.products"
          :type="{ 'is-danger': formErrorData.products }"
          label="Add products"
        >
          <b-autocomplete
            :data="productSearchData"
            :loading="isFetchingProducts"
            @select="option => addProduct(option)"
            @typing="fetchProducts"
            field="name"
            placeholder="e.g. Ibuprofen"
          >
            <template slot="header">
              <nuxt-link to="/manage/products/add" target="_blank">Add new...</nuxt-link>
            </template>
          </b-autocomplete>
        </b-field>

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
              @click="removeCheckedProducts"
              class="level-item"
              icon-left="delete"
              size="is-small"
            >Remove</b-button>
          </div>
        </div>
        <b-table
          :checked-rows.sync="checkedRowsData"
          :data.sync="formData.products"
          ref="productTable"
          checkable
        >
          <template slot-scope="props">
            <b-table-column label="Product">#{{ props.row.id }} {{ props.row.name }}</b-table-column>
            <b-table-column label="Quantity" centered>
              <b-numberinput
                min="1"
                :max="props.row.stock_quantity"
                size="is-small"
                :v-model="props.quantity"
                @input="changeProductQuantity(props.row, $event)"
              ></b-numberinput>
            </b-table-column>
            <b-table-column
              label="Price"
              numeric
            >${{ (props.row.quantity * props.row.price).toFixed(2) }}</b-table-column>
          </template>
        </b-table>
        <b-field
          :message="formErrorData.taxAmount"
          :type="{ 'is-danger': formErrorData.taxAmount }"
          label="Tax amount (%)"
        >
          <b-input v-model.number="formData.taxAmount" placeholder="0.00"></b-input>
        </b-field>
        <b-field
          :message="formErrorData.otherCost"
          :type="{ 'is-danger': formErrorData.otherCost }"
          label="Other costs ($)"
        >
          <b-input v-model.number="formData.otherCost" placeholder="0.00"></b-input>
        </b-field>
        <b-field
          :message="formErrorData.dateTimePayDue"
          :type="{ 'is-danger': formErrorData.dateTimePayDue }"
          label="Payment due date"
        >
          <b-datepicker
            v-model="formData.dateTimePayDue"
            icon="calendar-today"
            placeholder="Click to select..."
          >
            <b-button
              @click="formData.dateTimePayDue = new Date()"
              icon-left="calendar-today"
              type="is-primary"
            >Today</b-button>
            <b-button
              @click="formData.dateTimePayDue = null"
              icon-left="close"
              type="is-danger"
            >Clear</b-button>
          </b-datepicker>
        </b-field>
        <b-field
          :message="formErrorData.description"
          :type="{ 'is-danger': formErrorData.description }"
          label="Description"
        >
          <b-input placeholder="Styling with Markdown is supported" type="textarea"></b-input>
        </b-field>
        <b-button @click.stop.prevent="onFormSubmit" type="is-primary">Add</b-button>
        <b-button @click="onFormCancel">Cancel</b-button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isFetchingProducts: false,
      isFetchingCustomers: false,

      productSearchData: [],
      customerSearchData: [],
      checkedRowsData: [],

      formData: {
        customer: {},
        products: [],
        taxAmount: "0.00",
        otherCost: "0.00",
        description: "",
        dateTimePayDue: null
      },
      formErrorData: {
        customer: null,
        products: null,
        taxAmount: null,
        otherCost: null,
        description: null,
        dateTimePayDue: null
      }
    };
  },
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  created() {},
  methods: {
    async fetchProducts(input) {
      if (!input.length) {
        this.productSearchData = [];
        return;
      }
      this.isFetchingProducts = true;

      await this.$axios
        .$get("/v1/product/?is_available=true", {
          params: {
            search: input
          }
        })
        .then(res => {
          this.productSearchData = res.results;
          this.isFetchingProducts = false;
        })
        .catch(err => {
          this.productSearchData = [];
          this.isFetchingProducts = false;
        });
    },
    async fetchCustomers(input) {
      if (!input.length) {
        this.customerSearchData = [];
        return;
      }
      this.isFetchingCustomers = true;

      await this.$axios
        .$get("/v1/customer/", {
          params: {
            search: input
          }
        })
        .then(res => {
          this.customerSearchData = res.results;
          this.isFetchingCustomers = false;
        })
        .catch(err => {
          this.customerSearchData = [];
          this.isFetchingCustomers = false;
        });
    },
    async onFormSubmit() {
      // Set form errors to null.
      for (var key in this.formErrorData) {
        this.formErrorData[key] = null;
      }

      var payload = {
        salesperson: this.loggedInUser.id,
        customer: this.formData.customer.id || null,
        products: this.formData.products || {},
        other_cost: this.formData.otherCost,
        tax_amount: this.formData.taxAmount,
        description: this.formData.description,
        datetime_pay_due: this.formData.dateTimePayDue
      };

      await this.$axios
        .$post("/v1/invoice/", payload)
        .then(res => {
          console.log(`Invoice added: #${res.id}`, res);
          // Success, show toast.
          this.$buefy.toast.open({
            duration: 3000,
            message: `Invoice ID: ${res.id} added!`,
            position: "is-bottom",
            type: "is-success"
          });
        })
        .catch(err => {
          console.log("Error adding invoice", err.response);

          if (err.response.data) {
            // Has form errors.
            this.formErrorData.salesperson =
              err.response.data.salesperson || null;
            this.formErrorData.customer = err.response.data.customer || null;
            this.formErrorData.products = err.response.data.products || null;
            this.formErrorData.otherCost = err.response.data.other_cost || null;
            this.formErrorData.taxAmount = err.response.data.tax_amount || null;
            this.formErrorData.description =
              err.response.data.description || null;
            this.formErrorData.dateTimePayDue =
              err.response.data.datetime_pay_due || null;
          } else {
            // Show error toast.
            this.$buefy.toast.open({
              duration: 3000,
              message: err.response,
              position: "is-bottom",
              type: "is-danger"
            });
          }
        });
    },
    resetTable() {
      // Reset columns (prevent buefy bug where columns add up)
      // TODO: find solution.
      this.$refs.productTable.columns = [];
    },
    addProduct(product) {
      if (product != null) {
        product.quantity = 1;
        this.formData.products.push(product);
      }
    },
    removeProduct(product) {
      let index = this.formData.products.indexOf(product);
      if (index !== -1) this.formData.products.splice(index, 1);
    },
    removeCheckedProducts() {
      this.checkedRowsData.forEach(element => {
        this.removeProduct(element);
      });

      this.checkedRowsData = [];
    },
    changeProductQuantity(product, event) {
      product.quantity = parseInt(event, 10);

      this.resetTable();
    },
    onFormCancel() {
      // Go back.
      this.$router.back();
    }
  }
};
</script>

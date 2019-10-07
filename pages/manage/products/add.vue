<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Add Product</h1>
            <h2 v-if="formData.name" class="subtitle">{{ formData.name }} | ${{ calcPrice(this.formData.basePrice, this.formData.discountAmount) }}</h2>
            <form>
                <b-field :message="formErrorData.name" :type="{ 'is-danger': formErrorData.name }" label="Name">
                    <b-input v-model.trim="formData.name" maxlength="128"></b-input>
                </b-field>
                <b-field :message="formErrorData.category" :type="{ 'is-danger': formErrorData.category }" label="Category">
                    <b-autocomplete :data="productCategoryData" :loading="isFetchingProductCategories" @select="option => formData.category = option" @typing="fetchProductCategories" field="name" placeholder="e.g. Pain medication">
                        <template slot="header">
                  <nuxt-link to="/manage/categories/add" target="_blank">Add new...</nuxt-link>
</template>
<template slot-scope="props">
    {{ props.option.name }}
</template>
          </b-autocomplete>
        </b-field>
        <b-field
          :message="formErrorData.description"
          :type="{ 'is-danger': formErrorData.description }"
          label="Description"
        >
          <b-input
            v-model.trim="formData.description"
            placeholder="Styling with Markdown is supported"
            type="textarea"
          ></b-input>
        </b-field>
        <b-field grouped group-multiline>
          <b-field
            :message="formErrorData.stockQuantity"
            :type="{ 'is-danger': formErrorData.stockQuantity }"
            label="Stock quantity"
          >
            <b-numberinput v-model.number="formData.stockQuantity" min="0" placeholder="0"></b-numberinput>
          </b-field>
          <b-field
            :message="formErrorData.basePrice"
            :type="{ 'is-danger': formErrorData.basePrice }"
            label="Base price ($)"
          >
            <b-input v-model.number="formData.basePrice" placeholder="0.00"></b-input>
          </b-field>
          <b-field
            :message="formErrorData.discountAmount"
            :type="{ 'is-danger': formErrorData.discountAmount }"
            label="Discount amount (%)"
          >
            <b-input v-model.number="formData.discountAmount" placeholder="0.00"></b-input>
          </b-field>
        </b-field>
        <b-field
          :message="formErrorData.availability"
          :type="{ 'is-danger': formErrorData.availability }"
          label="Availability"
        >
          <b-checkbox
            v-model="formData.availability"
            false-value="Unavailable"
            true-value="Available"
          >{{ formData.availability }}</b-checkbox>
        </b-field>
        <b-field
          :message="formErrorData.dateExpiration"
          :type="{ 'is-danger': formErrorData.dateExpiration }"
          label="Expiration date"
        >
          <b-datepicker
            v-model="formData.dateExpiration"
            icon="calendar-today"
            placeholder="Click to select..."
          >
            <b-button
              @click="formData.dateExpiration = new Date()"
              icon-left="calendar-today"
              type="is-primary"
            >Today</b-button>
            <b-button
              @click="formData.dateExpiration = null"
              icon-left="close"
              type="is-danger"
            >Clear</b-button>
          </b-datepicker>
        </b-field>
        <b-button @click.stop.prevent="onFormSubmit" type="is-primary">Add</b-button>
        <b-button @click="onFormCancel">Cancel</b-button>
      </form>
    </div>
  </section>
</template>

<script>
import { async } from "q";

export default {
    data() {
        return {
            isFetchingProductCategories: false,

            productCategoryData: [],

            formData: {
                name: null,
                category: {},
                description: null,
                stockQuantity: 0,
                basePrice: 0,
                discountAmount: 0,
                availability: "Available",
                dateExpiration: null
            },
            formErrorData: {
                name: null,
                category: null,
                description: null,
                stockQuantity: null,
                basePrice: null,
                discountAmount: null,
                availability: null,
                dateExpiration: null
            }
        };
    },
    methods: {
        async fetchProductCategories(input) {
            if (!input.length) {
                this.productCategoryData = [];
                return;
            }
            this.isFetchingProductCategories = true;

            await this.$axios
                .$get("/v1/product-category/", {
                    params: {
                        search: input
                    }
                })
                .then(res => {
                    this.productCategoryData = res.results;
                    this.isFetchingProductCategories = false;
                })
                .catch(err => {
                    this.productCategoryData = [];
                    this.isFetchingProductCategories = false;
                });
        },

        async onFormSubmit() {
            var payload = {
                name: this.formData.name,
                category: this.formData.category.id || null,
                description: this.formData.description,
                stock_quantity: this.formData.stockQuantity,
                base_price: this.formData.basePrice,
                discount_amount: this.formData.discountAmount,
                is_available: this.formData.availability == "Available" ? true : false,
                datetime_expire: this.formData.dateExpiration
            };

            // Set form errors to null.
            for (var key in this.formErrorData) {
                this.formErrorData[key] = null;
            }

            await this.$axios
                .$post("/v1/product/", payload)
                .then(res => {
                    console.log(`Product added: #${res.id}`, res);

                    // Success, show toast.
                    this.$buefy.toast.open({
                        duration: 3000,
                        message: `Product ID: ${res.id} added!`,
                        position: "is-bottom",
                        type: "is-success"
                    });
                })
                .catch(err => {
                    console.log("Error adding product", err);

                    if (err.response.data) {
                        // Has form errors.
                        this.formErrorData.name = err.response.data.name || null;
                        this.formErrorData.category = err.response.data.category || null;
                        this.formErrorData.description =
                            err.response.data.description || null;
                        this.formErrorData.stockQuantity =
                            err.response.data.stock_quantity || null;
                        this.formErrorData.basePrice = err.response.data.base_price || null;
                        this.formErrorData.discountAmount =
                            err.response.data.discount_amount || null;
                        this.formErrorData.availability =
                            err.response.data.is_available || null;
                        this.formErrorData.dateExpiration =
                            err.response.data.datetime_expire || null;
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
        onFormCancel() {
            // Go back.
            this.$router.back();
        },
        calcPrice(basePrice, discountAmount) {
            // TODO: Make helper function.

            return (basePrice - (basePrice * discountAmount) / 100).toFixed(2);
        }
    }
};
</script>

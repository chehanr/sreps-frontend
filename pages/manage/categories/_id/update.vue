<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Update Category</h1>
      <form>
        <b-field
          :message="formErrorData.name"
          :type="{ 'is-danger': formErrorData.name }"
          label="Name"
        >
          <b-input v-model.trim="formData.name" maxlength="128"></b-input>
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
        <b-button @click.stop.prevent="onFormSubmit" type="is-primary">Update</b-button>
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
      // isFetchingProductCategories: false,

      // productCategoryData: [],

      formErrorData: {
        name: null,
        description: null,
      }
    };
  },
  async asyncData({ $axios, params }) {
    const formData = {};

    await $axios.$get(`/v1/product-category/${params.id}/`).then(res => {
      formData.name = res.name;
      formData.description = res.description;
    });

    return { formData };
  },
  methods: {
   
    async onFormSubmit() {
      var payload = {
        name: this.formData.name,
        category: this.formData.category.id || null,
        description: this.formData.description,
        stock_quantity: this.formData.stockQuantity,
        base_price: this.formData.basePrice,
        discount_amount: this.formData.discountAmount,
        is_available: this.formData.availability == "Available" ? true : false,
        datetime_expire: this.formData.dateExpiration || null
      };

      // Set form errors to null.
      for (var key in this.formErrorData) {
        this.formErrorData[key] = null;
      }

      await this.$axios
        .$put(`/v1/product-category/${this.$route.params.id}/`, payload)
        .then(res => {
          console.log(`Category updated: #${res.id}`, res);

          // Success, show toast.
          this.$buefy.toast.open({
            duration: 3000,
            message: `Category ID: ${res.id} updated!`,
            position: "is-bottom",
            type: "is-success"
          });
        })
        .catch(err => {
          console.log("Error adding category", err);

          if (err.response.data) {
            // Has form errors.
            this.formErrorData.name = err.response.data.name || null;
            this.formErrorData.description =
              err.response.data.description || null;
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
  }
};
</script>

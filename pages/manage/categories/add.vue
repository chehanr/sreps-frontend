<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Add Category</h1>

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
          <b-input v-model.trim="formData.description" placeholder="eg Tablet" type="textarea"></b-input>
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
      formData: {
        name: null,
        description: null
      },
      formErrorData: {
        name: null,
        description: null
      }
    };
  },
  methods: {
    async onFormSubmit() {
      var payload = {
        name: this.formData.name,
        description: this.formData.description
      };

      // Set form errors to null.
      for (var key in this.formErrorData) {
        this.formErrorData[key] = null;
      }

      await this.$axios
        .$post("/v1/product-category/", payload)
        .then(res => {
          console.log(`Category added: #${res.id}`, res);

          // Success, show toast.
          this.$buefy.toast.open({
            duration: 3000,
            message: `Category ID: ${res.id} added!`,
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
    }
  }
};
</script>

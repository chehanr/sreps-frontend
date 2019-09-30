<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Add Customer</h1>
      <!-- <h2
        v-if="formData.name"
        class="subtitle"
      >{{ formData.name }}</h2> -->
      <form>
        <b-field
          :message="formErrorData.name"
          :type="{ 'is-danger': formErrorData.name }"
          label="Name"
        >
          <b-input v-model.trim="formData.name" maxlength="28" placeholder="John Smith"></b-input>
        </b-field>
        
        <b-field
          :message="formErrorData.phone"
          :type="{ 'is-danger': formErrorData.phone }"
          label="Phone"
        ><b-input v-model.trim="formData.phone" maxlength="10" placeholder="0400111222"></b-input>
        </b-field>

        <b-field
            :message="formErrorData.email"
            :type="{ 'is-danger': formErrorData.email }"
            label="Email"
            ><b-input v-model.trim="formData.email" placeholder="john@mail.com"></b-input>
          </b-field>

          <b-field
            :message="formErrorData.address"
            :type="{ 'is-danger': formErrorData.address }"
            label="Address"
            ><b-input v-model.trim="formData.address" placeholder="10 Smith St, Hawthorn 3120"></b-input>
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
        phone: null,
        email: null,
        address: null,
      },
      formErrorData: {
        name: null,
        phone: null,
        email: null,
        address: null,
      }
    };
  },
  methods: {

    async onFormSubmit() {
      var payload = {
        name: this.formData.name,
        phone: this.formData.phone,
        email: this.formData.email,
        address: this.formData.address,
      };

      // Set form errors to null.
      for (var key in this.formErrorData) {
        this.formErrorData[key] = null;
      }

      await this.$axios
        .$post("/v1/customer/", payload)
        .then(res => {
          console.log(`Customer added: #${res.id}`, res);

          // Success, show toast.
          this.$buefy.toast.open({
            duration: 3000,
            message: `Customer ID: ${res.id} added!`,
            position: "is-bottom",
            type: "is-success"
          });
        })
        .catch(err => {
          console.log("Error adding customer", err);

          if (err.response.data) {
            // Has form errors.
            this.formErrorData.name = err.response.data.name || null;
            this.formErrorData.phone =
              err.response.data.phone || null;
            this.formErrorData.email =
              err.response.data.email || null;
            this.formErrorData.address = err.response.data.address || null;
           
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

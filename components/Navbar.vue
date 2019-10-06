<template>
    <b-navbar>
    
        <template slot="brand">
    
          <a href="/" class="navbar-item">
    
            <img
    
              src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
    
              alt="SRePs"
    
            />
    
          </a>
</template>
<template slot="start">
    <nuxt-link v-if="isAuthenticated" to="/manage" class="navbar-item">
    
        Manage</nuxt-link>
</template>
<template slot="end">
    <b-navbar-item tag="div">
    
        <a v-if="isAuthenticated" class="button" @click="logout()">Logout ({{ loggedInUser.username }})</a>
    
        <nuxt-link v-else to="/login" class="button">Log in</nuxt-link>
    
    </b-navbar-item>
</template>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters(["isAuthenticated", "loggedInUser"])
    },
    methods: {
        async logout() {
            await this.$auth.logout();
        }
    }
};
</script>

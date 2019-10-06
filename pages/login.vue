<template>
    <section class="section">
    
        <div class="container">
    
            <div class="column is-4 is-offset-4">
    
                <b-field label="Username">
    
                    <b-input type="username" name="username" v-model="username"></b-input>
    
                </b-field>
    
                <b-field label="Password">
    
                    <b-input type="password" name="password" v-model="password"></b-input>
    
                </b-field>
    
                <button type="submit" class="button is-fullwidth" @click="login()">Log In</button>
    
            </div>
    
        </div>
    
    </section>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
            error: null
        };
    },

    methods: {
        async login() {
            try {
                await this.$auth.loginWith("local", {
                    data: {
                        username: this.username,
                        password: this.password
                    }
                });

                this.$router.push("/manage");
            } catch (e) {
                this.error = e.response.data.message;
            }
        }
    }
};
</script>

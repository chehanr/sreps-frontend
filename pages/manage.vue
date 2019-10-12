<template>
    <section class="columns is-fullheight">
        <aside class="column is-3 is-fullheight is-narrow-mobile section">
            <b-menu>
                <b-menu-list label="Menu">
                    <b-menu-item icon="information-outline" label="Dashboard" tag="nuxt-link" to="/manage/" exact></b-menu-item>
                    <b-menu-item icon="settings" expanded>
                        <template slot="label" slot-scope="props">
    
                  Administrator
    
                  <b-icon :icon="props.expanded ? 'menu-down' : 'menu-up'" class="is-pulled-right"></b-icon>
</template>
            <b-menu-item icon="pill" label="Products" tag="nuxt-link" to="/manage/products"></b-menu-item>
            <b-menu-item icon="shape" label="Categories" tag="nuxt-link" to="/manage/categories"></b-menu-item>
            <b-menu-item icon="account-multiple" label="Customers" tag="nuxt-link" to="/manage/customers"></b-menu-item>
            <b-menu-item icon="cash" label="Sales" tag="nuxt-link" to="/manage/sales"></b-menu-item>
            <b-menu-item icon="cash-multiple" label="Invoices" tag="nuxt-link" to="/manage/invoices"></b-menu-item>
          </b-menu-item>
          <b-menu-item icon="account">
<template slot="label" slot-scope="props">
     My Account
    
    <b-icon :icon="props.expanded ? 'menu-down' : 'menu-up'" class="is-pulled-right"></b-icon>
</template>
            <b-menu-item label="Account data"></b-menu-item>
            <b-menu-item label="Addresses"></b-menu-item>
          </b-menu-item>
        </b-menu-list>
        <b-menu-list>
          <b-menu-item label="Expo" icon="link" tag="router-link" target="_blank" to="/expo"></b-menu-item>
        </b-menu-list>
        <b-menu-list label="Actions">
          <b-menu-item label="Logout"></b-menu-item>
        </b-menu-list>
      </b-menu>
    </aside>
    <div class="column is-9">
      <nuxt-child />
    </div>
  </section>
</template>

<script>
export default {
    middleware: "auth"
};
</script>
<template>
  <div class="wrapper">
    <side-bar title="Vega">
      <template slot="links">
        <sidebar-link :name="$t('sidebar.proposals')" icon="tim-icons icon-chart-pie-36" to="/proposals"/>
        <sidebar-link :name="$t('sidebar.wallet')" icon="tim-icons icon-key-25" to="/wallet"/>
        <sidebar-link name="My Votes" icon="tim-icons icon-book-bookmark" to="/myvotes"/>
        <sidebar-link :name="$t('sidebar.settings')" icon="tim-icons icon-settings" to="/settings"/>
        <sidebar-link name="About" icon="tim-icons icon-alert-circle-exc" to="/about"/>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./AppNavbar";
import ContentFooter from "./ContentFooter";
import DashboardContent from "./Content";
import MobileMenu from "./MobileMenu";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>

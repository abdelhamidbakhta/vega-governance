<template>
  <nav :class="{'bg-white': showMenu, 'navbar-transparent': !showMenu}"
       class="navbar navbar-expand-lg navbar-absolute">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div :class="{toggled: $sidebar.showSidebar}" class="navbar-toggle d-inline">
          <button class="navbar-toggler" type="button"
                  @click="toggleSidebar">
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <a class="navbar-brand" href="#">{{ routeName }}</a>
      </div>
      <button aria-controls="navigation-index" aria-label="Toggle navigation"
              class="navbar-toggler"
              data-target="#navigation"
              data-toggle="collapse"
              type="button"
              @click="toggleMenu">
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <!--collapse-transition>
        <div v-show="showMenu" class="collapse navbar-collapse show">
          <ul :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'" class="navbar-nav">
            <div class="search-bar input-group" @click="searchModalVisible = true">
              <button id="search-button" class="btn btn-link" data-target="#searchModal" data-toggle="modal">
                <i class="tim-icons icon-zoom-split"></i>
              </button>
            </div>
            <modal id="searchModal"
                   :centered="false"
                   :show-close="true"
                   :show.sync="searchModalVisible"
                   class="modal-search">
              <input id="inlineFormInputGroup" slot="header" v-model="searchQuery" class="form-control"
                     placeholder="SEARCH"
                     type="text">
            </modal>
            <base-dropdown :menu-on-right="!$rtl.isRTL"
                           class="nav-item"
                           menu-classes="dropdown-navbar"
                           tag="li"
                           title-tag="a">
              <a slot="title" aria-expanded="true" class="dropdown-toggle nav-link" data-toggle="dropdown" href="#">
                <div class="photo">
                  <img src="img/anime3.png">
                </div>
                <b class="caret d-none d-lg-block d-xl-block"></b>
                <p class="d-lg-none">
                  Wallet
                </p>
              </a>
              <li class="nav-link">
                <a class="nav-item dropdown-item" href="#">Profile</a>
              </li>
              <li class="nav-link">
                <a class="nav-item dropdown-item" href="#" @click="showSettings">Settings</a>
              </li>
              <div class="dropdown-divider"></div>
              <li class="nav-link">
                <a v-if="isLogged" class="nav-item dropdown-item" href="#" @click="logout">Log out</a>
                <a v-else class="nav-item dropdown-item" href="#" @click="login">Log in</a>
              </li>
            </base-dropdown>
          </ul>
        </div>
      </collapse-transition-->
    </div>
  </nav>
</template>
<script>
import {CollapseTransition} from 'vue2-transitions';
import Modal from '@/components/Modal';
import {mapState} from "vuex";
import { updateSettingsOnLocalStorage} from "@/settings";


export default {
  components: {
    CollapseTransition,
    Modal
  },
  computed: {
    routeName() {
      const {name} = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    isLogged (){
      return this.services.vegaWallet.token != null;
    },
    ...mapState([
      'services',
      'settings',
    ])
  },
  async mounted() {
    this.walletUrl = this.settings.vega.wallet.endpoint;
    this.governanceUrl = this.settings.vega.governance.endpoint;
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: '',
      walletUrl : '',
      governanceUrl : ''
    };
  },
  methods: {
    showSettings(){
      //this.$bvModal.show('modal-settings');
      this.$router.push('settings');
    },
    saveSettings(){
      this.$bvModal.hide('modal-settings');
      localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    async logout (){
      const isSuccess = await this.services.vegaWallet.logout();
      if(isSuccess){
        localStorage.removeItem("vega-token");
        this.$router.push("/");
      }
    },
    async login(){
      this.$router.push("/wallet");
    },
    async validate () {
      updateSettingsOnLocalStorage((settings)=>{
          settings.vega.wallet.endpoint = this.walletUrl;
        settings.vega.governance.endpoint = this.governanceUrl;
      });
      this.settings.vega.wallet.endpoint= this.walletUrl;
      this.settings.vega.governance.endpoint= this.governanceUrl;
      this.$store.commit("updateServices", this.settings);
      window.location.reload();
    }
  }
};
</script>
<style scoped>
 input.form-control{
   color: black!important;
 }
</style>

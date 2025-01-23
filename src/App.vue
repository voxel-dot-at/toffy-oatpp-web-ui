<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { RouterView } from "vue-router";

const drawer = ref(true);
const rail = ref(true);

const route = useRoute();
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list nav>
        <v-btn v-if="rail" icon="mdi-menu" variant="text" color="dark" @click.stop="rail = !rail"></v-btn>
        <v-btn v-if="!rail" icon="mdi-arrow-left" variant="text" class="float-end" color="dark" @click.stop="rail = !rail"></v-btn>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <!-- Home link with active state -->
        <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" :active="route.path === '/'" @click="$router.push('/')" @click.stop="rail = true"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer>
      <a href="https://www.voxel.at/" target="_blank">
        <v-img src="/logo.png" alt="VoXel Interaction Design" width="100" height="25"></v-img>
      </a>
      <a href="https://www.voxel.at/" target="_blank">www.voxel.at</a>
      <span>© {{ new Date().getFullYear() }} — <strong>VoXel Interaction Design</strong>. All rights reserved.</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
.v-main {
  display: flex;
  flex-direction: column;
}

.v-footer {
  flex: none;
  justify-content: center;
  font-size: 0.85rem;
  gap: 10px;
}

a:link {
  color: black;
  background-color: transparent;
  text-decoration: none;
}

a:visited {
  color: black;
  background-color: transparent;
  text-decoration: none;
}

@media (max-width: 600px) {
  .v-footer {
    flex-direction: column;
    font-size: 0.75rem;
    gap: 5px;
  }
}
</style>

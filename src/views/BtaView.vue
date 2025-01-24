<script setup lang="ts">
import axios from "axios";
import { onMounted, reactive, ref } from "vue";

// State variables for components
const loading = ref(false);
const snackbar = ref(false);
const errorMessage = ref<string | null>(null);
const snackbarMessage = ref<string>();

// Reactive object for /api/bta settings
const settings = reactive({
  integrationTime: 0,
  modulationFrequency: 0,
  frameRate: 0,
  globalOffset: 0,
});

// Helper function for error messages
const setError = (message: string | null) => {
  errorMessage.value = message;
  loading.value = false;
};

// Function to fetch data from /api/bta and populate settings
const fetchSettings = async () => {
  try {
    const response = await axios.get("/api/bta");
    Object.assign(settings, response.data);
  } catch (error) {
    console.error("Error fetching settings:", error);
    setError("Failed to load settings. Please try again later.");
  }
};

// Function to post the updated setting
const postSetting = async (
  setting: keyof typeof settings,
  value: number | boolean
) => {
  if (value === null) {
    setError(`Please enter a valid value for ${setting}.`);
    return;
  }

  const url = `/api/bta/${setting}/${value}`;

  try {
    await axios.post(url);
    snackbarMessage.value = `${setting
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^\w/, (c) => c.toUpperCase())} successfully updated.`;
    snackbar.value = true;
  } catch (error) {
    console.error(`Error setting ${setting}:`, error);
    setError(`Failed to set ${setting}. Please try again later.`);
  }
};

// Fetch settings on page load
onMounted(() => {
  loading.value = true;
  fetchSettings()
  loading.value = false;
});

</script>

<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>BTA SETTINGS</h1>
      </v-col>
    </v-row>

    <!-- Loader -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" :size="128" :width="12"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-row v-if="errorMessage">
      <v-alert type="error" class="mx-auto" elevation="2" closable>
        {{ errorMessage }}
      </v-alert>
    </v-row>

    <!-- Success Alert -->
    <v-snackbar v-model="snackbar" :timeout="3000" top color="success">
      {{ snackbarMessage }}
      <v-btn color="white" text="true" @click="snackbar = false"> Close </v-btn>
    </v-snackbar>

    <!-- Card with Textboxes, Buttons, and WBOX Data -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="8">
          <v-card-text>
            <v-row>
              <v-col>
                <v-btn prepend-icon="mdi-backup-restore" @click="fetchSettings()">
                  Refresh
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.integrationTime" label="Integration Time" @keyup.enter="postSetting('integrationTime', settings.integrationTime!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('integrationTime', settings.integrationTime!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.modulationFrequency" label="Modulation Frequency" @keyup.enter=" postSetting('modulationFrequency', settings.modulationFrequency!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click=" postSetting('modulationFrequency', settings.modulationFrequency!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.frameRate" label="Frame Rate" @keyup.enter="postSetting('frameRate', settings.frameRate!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('frameRate', settings.frameRate!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.globalOffset" label="Global Offset" @keyup.enter="postSetting('globalOffset', settings.globalOffset!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('globalOffset', settings.globalOffset!)">
                  Set
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>
h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.square-btn {
  width: 50px;
  min-height: 50px;
  margin-bottom: 20px;
}
</style>
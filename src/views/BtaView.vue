<script setup lang="ts">
import ky from "ky";
import { onMounted, reactive, ref } from "vue";

// State variables for components
const loading = ref(false);
const snackbar = ref(false);
const errorMessage = ref<string>();
const snackbarMessage = ref<string>();
const adressValue = ref<string>('');
const registerAdress = ref<string>('');
const registerValue = ref<string>('');

// Reactive object for /api/bta settings
const settings = reactive({
  integrationTime: 0,
  modulationFrequency: 0,
  frameRate: 0,
  globalOffset: 0,
});

// Function to fetch data from /api/bta and populate settings
const fetchSettings = async () => {
  try {
    const response = await ky.get("/api/bta").json() as number;
    Object.assign(settings, response);
  } catch (error: any) {
    if (error.response) {
      const errorText = await error.response.text();
      setError(`Failed to get settings: ${errorText}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

const fetchRegister = async () => {
  if (!adressValue.value) {
    setError(`Please enter a valid Value for Register Adress`)
    return;
  }

  const adress = adressValue.value.startsWith('0x')
    ? parseInt(adressValue.value, 16)
    : parseInt(adressValue.value, 10);

  try {
    const response = await ky.get(`/api/bta/reg/${adress}`).json() as string;
    registerAdress.value = response;
  } catch (error: any) {
    if (error.response) {
      const errorText = await error.response.text();
      setError(`Failed to get register address: ${errorText}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

const postRegister = async () => {
  if (!adressValue.value) {
    setError(`Please enter a valid Value for Register Adress`)
    return;
  }

  if (!registerValue.value) {
    setError(`Please enter a valid value for New Register Value`)
    return;
  }

  const adress = adressValue.value.startsWith('0x')
    ? parseInt(adressValue.value, 16)
    : parseInt(adressValue.value, 10);

  const value = registerValue.value.startsWith('0x')
    ? parseInt(registerValue.value, 16)
    : parseInt(registerValue.value, 10);

  try {
    const response = await ky.post(`/api/bta/reg/${adress}/${value}`).json() as string;
    registerAdress.value = response;
  } catch (error: any) {
    if (error.response) {
      const errorText = await error.response.text();
      setError(`Failed to set register address: ${errorText}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// Function to post the updated setting
const postSetting = async (setting: keyof typeof settings, value: number | boolean) => {
  if (!value) {
    setError(`Please enter a valid value for ${setting}.`);
    return;
  }

  const url = `/api/bta/${setting}/${value}`;

  try {
    await ky.post(url);
    snackbarMessage.value = `${setting
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^\w/, (c) => c.toUpperCase())} successfully updated.`;
    snackbar.value = true;
  } catch (error: any) {
    if (error.response) {
      const errorText = await error.response.text();
      setError(`Failed to set ${setting} : ${errorText}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// Helper function for error messages
const setError = (message: string) => {
  errorMessage.value = message;
  loading.value = false;
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
      <v-alert type="error" class="mx-auto" elevation="2">
        {{ errorMessage }}
      </v-alert>
    </v-row>

    <!-- Success Alert -->
    <v-snackbar v-model="snackbar" :timeout="2000" rounded="pill" color="success">
      {{ snackbarMessage }}
    </v-snackbar>

    <!-- Card with Textboxes, Buttons, and WBOX Data -->
    <v-row>
      <!-- BTA Settings -->
      <v-col cols="12" lg="6">
        <v-card elevation="8">
          <v-card-title class="text-h6">BTA Settings</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-btn prepend-icon="mdi-backup-restore" @click="fetchSettings()">
                  Refresh
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" class="d-flex">
                <v-text-field v-model="settings.integrationTime" label="Integration Time" @keyup.enter="postSetting('integrationTime', settings.integrationTime!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('integrationTime', settings.integrationTime!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" class="d-flex">
                <v-text-field v-model="settings.modulationFrequency" label="Modulation Frequency" @keyup.enter=" postSetting('modulationFrequency', settings.modulationFrequency!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click=" postSetting('modulationFrequency', settings.modulationFrequency!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" class="d-flex">
                <v-text-field v-model="settings.frameRate" label="Frame Rate" @keyup.enter="postSetting('frameRate', settings.frameRate!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('frameRate', settings.frameRate!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" class="d-flex">
                <v-text-field v-model="settings.globalOffset" label="Global Offset" @keyup.enter="postSetting('globalOffset', settings.globalOffset!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('globalOffset', settings.globalOffset!)">
                  Set
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Register Adress -->
      <v-col cols="12" lg="6">
        <v-card elevation="8">
          <v-card-title class="text-h6">Register Adress</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" class="d-flex">
                <v-text-field type="string" label="Register Adress" v-model="adressValue" hint="Enter decimal (123) or hex (0xabc)" @keyup.enter="fetchRegister"></v-text-field>
                <v-btn prepend-icon="mdi-download" class="square-btn" color="primary" @click="fetchRegister">
                  Get
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" class="d-flex">
                <v-text-field type="string" label="New Register Vaue" v-model="registerValue" hint="Enter decimal (123) or hex (0xabc)" @keyup.enter="fetchRegister"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postRegister">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" sm="5" class="d-flex">
                <v-text-field type="string" label="Register Value" variant="underlined" v-model="registerAdress" readonly></v-text-field>
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
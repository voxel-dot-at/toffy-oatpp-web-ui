<script setup lang="ts">
import axios from "axios";
import { onMounted, onUnmounted, reactive, ref } from "vue";

// State variables for components
const loading = ref(false);
const snackbar = ref(false);
const errorMessage = ref<unknown>();
const snackbarMessage = ref<string>();
const depthImage = ref("");
const amplImage = ref("");
let intervalId: number | undefined;

// State variables
const settings = reactive({
  integrationTime: 0,
  modulationFrequency: 0,
  frameRate: 0,
  globalOffset: 0,
});
const depthMinMax = reactive ({
  maxVal: 0,
  minVal: 0,
});
const amplMinMax = reactive({
  maxVal:0,
  minVal:0,
});
const frameInfo = reactive({
  fc: 0,
  mainTemp: 0,
  ledTemp: 0,
});

// Depth Image update function
const fetchDepthImage = async () => {
  try {
    const depthResponse = await axios.get("/api/frame/depth", {
      responseType: "arraybuffer",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    // Convert depth image to Object URL
    const depthUrl = URL.createObjectURL(new Blob([depthResponse.data]));

    // Set the Object URLs
    depthImage.value = depthUrl;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to load Depth Image : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// Ampl Image update function
const fetchAmplImage = async () => {
  try {
    const amplResponse = await axios.get("/api/frame/ampl", {
      responseType: "arraybuffer",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    // Convert depth image to Object URL
    const amplUrl = URL.createObjectURL(new Blob([amplResponse.data]));

    // Set the Object URLs
    amplImage.value = amplUrl;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to load Amplitude Image : ${error.response.data}`);
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

// Function to fetch data from /api/bta and populate textboxes
const fetchSettings = async () => {
  try {
    const response = await axios.get("/api/bta");
    Object.assign(settings, response.data);
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to load settings : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// Function to fetch data from /api/frame/depthMinMaxVal and populate textboxes
const fetchDepthMinMax = async () => {
  try {
    const response = await axios.get("/api/frame/depthMinMaxVal");
    Object.assign(depthMinMax, response.data);

    depthMinMax.maxVal = parseFloat(depthMinMax.maxVal.toFixed(3));
    depthMinMax.minVal = parseFloat(depthMinMax.minVal.toFixed(3));
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to load Depth Min & Max values : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// Function to fetch data from /api/frame/amplMinMaxVal and populate textboxes
const fetchAmplMinMax = async () => {
  try {
    const response = await axios.get("/api/frame/amplMinMaxVal");
    Object.assign(amplMinMax, response.data);

    amplMinMax.maxVal = parseFloat(amplMinMax.maxVal.toFixed(3));
    amplMinMax.minVal = parseFloat(amplMinMax.minVal.toFixed(3));
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to load Amplitude Min & Max values : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
}

// Function to fetch frame data
const fetchFrameInfo = async () => {
  try {
    const response = await axios.get("/api/frame/info");
    Object.assign(frameInfo, response.data);
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to load frame info : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// Function to fetch single settings based on the type
const fetchSingleSetting = async (setting: keyof typeof settings) => {
 let url = "";
 switch (setting) {
    case "integrationTime":
      url = `/api/bta/integrationTime`;
      break;
    case "frameRate":
      url = `/api/bta/frameRate`;
      break;
    case "modulationFrequency":
      url = `/api/bta/modulationFrequency`;
      break;
    case "globalOffset":
      url = `/api/bta/globalOffset`;
      break;
    default:
      console.error(`Unknown setting: ${setting}`);
      return;
  }

  try {
    const response = await axios.get(url);
    settings[setting] = response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to get ${setting} : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
}

// Function to fetch single settings based on the type
const fetchSingleDepthMinMax = async (setting: keyof typeof depthMinMax) => {
  let url = "";
 switch (setting) {
    case "maxVal":
      url = `/api/frame/depthMaxVal`;
      break;
    case "minVal":
      url = `/api/frame/depthMinVal`;
      break;
    default:
      console.error(`Unknown setting: ${setting}`);
      return;
  }

  try {
    const response = await axios.get(url);
    depthMinMax[setting] = response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to get ${setting} : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
}

// Function to fetch single settings based on the type
const fetchSingleAmplMinMax = async (setting: keyof typeof amplMinMax) => {
  let url = "";
 switch (setting) {
    case "maxVal":
      url = `/api/frame/amplMaxVal`;
      break;
    case "minVal":
      url = `/api/frame/amplMinVal`;
      break;
    default:
      console.error(`Unknown setting: ${setting}`);
      return;
  }

  try {
    const response = await axios.get(url);
    depthMinMax[setting] = response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to get ${setting} : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
}

// Functions to post the updated settings
const postSetting = async (setting: keyof typeof settings, value: number) => {
  let url = "";
  switch (setting) {
    case "integrationTime":
      url = `/api/bta/integrationTime/${value}`;
      break;
    case "frameRate":
      url = `/api/bta/frameRate/${value}`;
      break;
    case "modulationFrequency":
      url = `/api/bta/modulationFrequency/${value}`;
      break;
    case "globalOffset":
      url = `/api/bta/globalOffset/${value}`;
      break;
    default:
      console.error(`Unknown setting: ${setting}`);
      return;
  }

  try {
    await axios.post(url);
    snackbarMessage.value = `${setting
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^\w/, (c) => c.toUpperCase())} successfully updated.`;
    snackbar.value = true;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to set ${setting} : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// Functions to post the updated settings
const postDepthMinMax = async (setting: keyof typeof depthMinMax, value: number) => {
  let url = "";
  switch (setting) {
    case "maxVal":
      url = `/api/frame/depthMaxVal/${value}`;
      break;
    case "minVal":
      url = `/api/frame/depthMinVal/${value}`;
      break;
    default:
      console.error(`Unknown setting: ${setting}`);
      return;
  }

  try {
    await axios.post(url);
    snackbarMessage.value = `${setting
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^\w/, (c) => c.toUpperCase())} successfully updated.`;
    snackbar.value = true;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to set ${setting} : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// Functions to post the updated settings
const postAmplMinMax = async (setting: keyof typeof amplMinMax, value: number) => {
  let url = "";
  switch (setting) {
    case "maxVal":
      url = `/api/frame/amplMaxVal/${value}`;
      break;
    case "minVal":
      url = `/api/frame/amplMinVal/${value}`;
      break;
    default:
      console.error(`Unknown setting: ${setting}`);
      return;
  }

  try {
    await axios.post(url);
    snackbarMessage.value = `${setting
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^\w/, (c) => c.toUpperCase())} successfully updated.`;
    snackbar.value = true;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      setError(`Failed to set ${setting} : ${error.response.data}`);
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// Fetch lives, settings, and frame data on page load
onMounted(() => {
  loading.value = true;

  fetchDepthImage();
  fetchAmplImage();
  fetchFrameInfo();
  fetchSettings();
  fetchDepthMinMax();
  fetchAmplMinMax();

  loading.value = false;

  const startInterval = () => {
    intervalId = setInterval(() => {
      fetchDepthImage();
      fetchAmplImage();
      fetchFrameInfo();
    }, 300);
  };

  const stopInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      startInterval();
    } else {
      stopInterval();
    }
  };

  startInterval();

  document.addEventListener("visibilitychange", handleVisibilityChange);

  onUnmounted(() => {
    stopInterval();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });
});
</script>

<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>LIVE VIEW</h1>
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
    <v-snackbar v-model="snackbar" :timeout="3000" top color="success">
      {{ snackbarMessage }}
      <v-btn color="white" text="true" @click="snackbar = false"> Close </v-btn>
    </v-snackbar>

    <v-row>
      <!-- Depth Image -->
      <v-col cols="12" lg="6" class="text-center">
        <v-card elevation="8">
          <v-card-title class="text-h6">Depth Image</v-card-title>
          <v-card-text>
            <img :src="depthImage" alt="Depth Image" class="responsive-image" />
          </v-card-text>
          <v-card-title class="text-h6">Depth Settings</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="d-flex">
                <v-btn stacked size="x-small" prepend-icon="mdi-backup-restore" class="square-btn" color="primary" @click="fetchSingleDepthMinMax('maxVal')">
                  Default
                </v-btn>
                <v-text-field v-model="depthMinMax.maxVal" label="Max Value" @keyup.enter="postDepthMinMax('maxVal', depthMinMax.maxVal)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postDepthMinMax('maxVal', depthMinMax.maxVal)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" class="d-flex">
                <v-btn stacked size="x-small" prepend-icon="mdi-backup-restore" class="square-btn" color="primary" @click="fetchSingleDepthMinMax('minVal')">
                  Default
                </v-btn>
                <v-text-field v-model="depthMinMax.minVal" label="Min Value" @keyup.enter="postDepthMinMax('minVal', depthMinMax.minVal)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postDepthMinMax('minVal', depthMinMax.minVal)">
                  Set
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Amplitude Image -->
      <v-col cols="12" lg="6" class="text-center">
        <v-card elevation="8">
          <v-card-title class="text-h6">Amplitude Image</v-card-title>
          <v-card-text>
            <img :src="amplImage" alt="Amplitude Image" class="responsive-image" />
          </v-card-text>
          <v-card-title class="text-h6">Amplitude Settings</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="d-flex">
                <v-btn stacked size="x-small" prepend-icon="mdi-backup-restore" class="square-btn" color="primary" @click="fetchSingleAmplMinMax('maxVal')">
                  Default
                </v-btn>
                <v-text-field v-model="amplMinMax.maxVal" label="Max Value" @keyup.enter="postAmplMinMax('maxVal', amplMinMax.maxVal)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postAmplMinMax('maxVal', amplMinMax.maxVal)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" class="d-flex">
                <v-btn stacked size="x-small" prepend-icon="mdi-backup-restore" class="square-btn" color="primary" @click="fetchSingleAmplMinMax('minVal')">
                  Default
                </v-btn>
                <v-text-field v-model="amplMinMax.minVal" label="Min Value" @keyup.enter="postAmplMinMax('minVal', amplMinMax.minVal)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postAmplMinMax('minVal', amplMinMax.minVal)">
                  Set
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Left Side: Textboxes and Buttons -->
      <v-col cols="12" lg="9">
        <v-card elevation="8">
          <v-card-title class="text-h6">Settings</v-card-title>
          <v-card-text>
              <v-row>
                <v-col cols="12" md="6" class="d-flex">
                  <v-btn prepend-icon="mdi-download" class="square-btn" color="primary" @click="fetchSingleSetting('integrationTime')">
                    Get
                  </v-btn>
                  <v-text-field v-model="settings.integrationTime" label="Integration Time" @keyup.enter="postSetting('integrationTime', settings.integrationTime)"></v-text-field>
                  <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('integrationTime', settings.integrationTime)">
                    Set
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6" class="d-flex">
                  <v-btn prepend-icon="mdi-download" class="square-btn" color="primary" @click="fetchSingleSetting('frameRate')">
                    Get
                  </v-btn>
                  <v-text-field v-model="settings.frameRate" label="Frame Rate" @keyup.enter="postSetting('frameRate', settings.frameRate)"></v-text-field>
                  <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('frameRate', settings.frameRate)">
                    Set
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6" class="d-flex">
                  <v-btn prepend-icon="mdi-download" class="square-btn" color="primary" @click="fetchSingleSetting('modulationFrequency')">
                    Get
                  </v-btn>
                  <v-text-field v-model="settings.modulationFrequency" label="Modulation Frequency" @keyup.enter="postSetting('modulationFrequency',settings.modulationFrequency)"></v-text-field>
                  <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('modulationFrequency',settings.modulationFrequency)">
                    Set
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6" class="d-flex">
                  <v-btn prepend-icon="mdi-download" class="square-btn" color="primary" @click="fetchSingleSetting('globalOffset')">
                    Get
                  </v-btn>
                  <v-text-field v-model="settings.globalOffset" label="Global Offset" @keyup.enter="postSetting('globalOffset', settings.globalOffset)"></v-text-field>
                  <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('globalOffset', settings.globalOffset)">
                    Set
                  </v-btn>
                </v-col>
              </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Side: Frame Data -->
      <v-col cols="12" lg="3">
        <v-card elevation="8">
          <v-card-title class="text-h6">Frame Info</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="12">
                <p>Frame Count: <strong class="text-h6">{{ frameInfo.fc }}</strong></p>
                <p>Main Temperature: <v-chip size="x-large" :color="frameInfo.mainTemp <= 70 ? 'green' : 'red'" :prepend-icon="frameInfo.mainTemp <= 70 ? 'mdi-send-check-circle' : 'mdi-alert'"> {{ frameInfo.mainTemp }} °C </v-chip></p>
                <p>LED Temperature: <v-chip class="mt-2" size="x-large" :color="frameInfo.ledTemp <= 70 ? 'green' : 'red'" :prepend-icon="frameInfo.ledTemp <= 70 ? 'mdi-send-check-circle' : 'mdi-alert'"> {{ frameInfo.ledTemp }} °C </v-chip></p>
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

.responsive-image {
  max-width: 100%;
}

.square-btn {
  width: 50px;
  min-height: 50px;
  margin-bottom: 20px;
}
</style>

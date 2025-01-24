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
  dumpOnFail: false,
  dumpFiles: false,
  filesToDump: 0,
  distanceToPlane: 0,
  camTilt: 0,
  camYaw: 0,
  borderLeft: 0,
  borderRight: 0,
  borderTop: 0,
  borderBottom: 0,
  heightRange: 0,
  distanceRange: 0,
  minAmpl: 0,
  confidenceLimit: 0,
  maxHeightBorderHoriz: 0,
  maxHeightBorderVert: 0,
  horizDetectRow: 0,
  horizDetectRange: 0,
  horizDetectStride: 0,
  horizDetectRow2: 0,
  minimalMatchQuality: 0,
  verticalResultOffset: 0,
  hfMaxHIgnoreBorderWidth: 0,
  hfBoxShiftVector: 0,
  rgbBorderTop: 0,
  rgbBorderBottom: 0,
  rgbBorderLeft: 0,
  rgbBorderRight: 0,
  boxMinCenterY: 0,
  boxMaxCenterY: 0,
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

    settings.camTilt = parseFloat(settings.camTilt.toFixed(3));
    settings.camYaw = parseFloat(settings.camYaw.toFixed(3));
    settings.minimalMatchQuality = parseFloat(settings.minimalMatchQuality.toFixed(3));
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
        <h1>DTO SETTINGS</h1>
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
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('dumpOnFail', settings.dumpOnFail!)">
                  Set
                </v-btn>
                <v-checkbox v-model="settings.dumpOnFail" label="Dump On Fail" class="flex-grow-1"></v-checkbox>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('dumpFiles', settings.dumpFiles!)">
                  Set
                </v-btn>
                <v-checkbox v-model="settings.dumpFiles" label="Dump Files" class="flex-grow-1"></v-checkbox>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.filesToDump" label="Files To Dump" @keyup.enter="postSetting('filesToDump', settings.filesToDump!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('filesToDump', settings.filesToDump!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.distanceToPlane" label="Distance To Plane" @keyup.enter=" postSetting('distanceToPlane', settings.distanceToPlane!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click=" postSetting('distanceToPlane', settings.distanceToPlane!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.camTilt" label="Cam Tilt" @keyup.enter="postSetting('camTilt', settings.camTilt!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('camTilt', settings.camTilt!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.camYaw" label="Cam Yaw" @keyup.enter="postSetting('camYaw', settings.camYaw!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('camYaw', settings.camYaw!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.heightRange" label="Height Range" @keyup.enter="postSetting('heightRange', settings.heightRange!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('heightRange', settings.heightRange!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.distanceRange" label="Distance Range" @keyup.enter="postSetting('distanceRange', settings.distanceRange!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('distanceRange', settings.distanceRange!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.minAmpl" label="Min Ampl" @keyup.enter="postSetting('minAmpl', settings.minAmpl!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('minAmpl', settings.minAmpl!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.confidenceLimit" label="Confidence Limit" @keyup.enter="postSetting('confidenceLimit', settings.confidenceLimit!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('confidenceLimit', settings.confidenceLimit!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.minimalMatchQuality" label="Minimal Match Quality" @keyup.enter="postSetting('minimalMatchQuality', settings.minimalMatchQuality!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('minimalMatchQuality', settings.minimalMatchQuality!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.verticalResultOffset" label="Vertical Result Offset" @keyup.enter="postSetting('verticalResultOffset', settings.verticalResultOffset!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('verticalResultOffset', settings.verticalResultOffset!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.hfMaxHIgnoreBorderWidth" label="Hf MaxH Ignore Border Width" @keyup.enter="postSetting('hfMaxHIgnoreBorderWidth', settings.hfMaxHIgnoreBorderWidth!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('hfMaxHIgnoreBorderWidth', settings.hfMaxHIgnoreBorderWidth!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.hfBoxShiftVector" label="Hf Box Shift Vector" @keyup.enter="postSetting('hfBoxShiftVector',settings.hfBoxShiftVector!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('hfBoxShiftVector',settings.hfBoxShiftVector!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.boxMinCenterY" label="Box Min Center Y" @keyup.enter="postSetting('boxMinCenterY', settings.boxMinCenterY!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('boxMinCenterY', settings.boxMinCenterY!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.boxMaxCenterY" label="Box Max Center Y" @keyup.enter="postSetting('boxMaxCenterY', settings.boxMaxCenterY!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('boxMaxCenterY', settings.boxMaxCenterY!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.borderLeft" label="Border Left" @keyup.enter="postSetting('borderLeft', settings.borderLeft!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('borderLeft', settings.borderLeft!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.borderRight" label="Border Right" @keyup.enter="postSetting('borderRight', settings.borderRight!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('borderRight', settings.borderRight!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.borderTop" label="Border Top" @keyup.enter="postSetting('borderTop', settings.borderTop!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('borderTop', settings.borderTop!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.borderBottom" label="Border Bottom" @keyup.enter="postSetting('borderBottom', settings.borderBottom!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('borderBottom', settings.borderBottom!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.maxHeightBorderHoriz" label="Max Height Border Horiz" @keyup.enter="postSetting('maxHeightBorderHoriz',settings.maxHeightBorderHoriz!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('maxHeightBorderHoriz',settings.maxHeightBorderHoriz!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.maxHeightBorderVert" label="Max Height Border Vert" @keyup.enter="postSetting('maxHeightBorderVert', settings.maxHeightBorderVert!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('maxHeightBorderVert', settings.maxHeightBorderVert!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.rgbBorderTop" label="RGB Border Top" @keyup.enter="postSetting('rgbBorderTop', settings.rgbBorderTop!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('rgbBorderTop', settings.rgbBorderTop!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.rgbBorderBottom" label="RGB Border Bottom" @keyup.enter="postSetting('rgbBorderBottom', settings.rgbBorderBottom!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('rgbBorderBottom', settings.rgbBorderBottom!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.rgbBorderLeft" label="RGB Border Left" @keyup.enter="postSetting('rgbBorderLeft', settings.rgbBorderLeft!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('rgbBorderLeft', settings.rgbBorderLeft!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.rgbBorderRight" label="RGB Border Right" @keyup.enter="postSetting('rgbBorderRight', settings.rgbBorderRight!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('rgbBorderRight', settings.rgbBorderRight!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.horizDetectRow" label="Horiz Detect Row" @keyup.enter="postSetting('horizDetectRow', settings.horizDetectRow!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('horizDetectRow', settings.horizDetectRow!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.horizDetectRange" label="Horiz Detect Range" @keyup.enter="postSetting('horizDetectRange', settings.horizDetectRange!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('horizDetectRange', settings.horizDetectRange!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.horizDetectStride" label="Horiz Detect Stride" @keyup.enter="postSetting('horizDetectStride', settings.horizDetectStride!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('horizDetectStride', settings.horizDetectStride!)">
                  Set
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" lg="4" class="d-flex">
                <v-text-field v-model="settings.horizDetectRow2" label="Horiz Detect Row2" @keyup.enter="postSetting('horizDetectRow2', settings.horizDetectRow2!)"></v-text-field>
                <v-btn prepend-icon="mdi-send-check" class="square-btn" color="secondary" @click="postSetting('horizDetectRow2', settings.horizDetectRow2!)">
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
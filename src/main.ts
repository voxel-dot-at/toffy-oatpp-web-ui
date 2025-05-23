import "@mdi/font/css/materialdesignicons.css";
import { io } from "socket.io-client";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VBtn: { variant: "elevated", color: "primary", stacked: true, size: "x-small" },
    VTextField: { variant: "solo", type: "number", class: "flex-grow-1" },
  },
  theme: {
    defaultTheme: "light",
  },
  icons: {
    defaultSet: "mdi",
  },
});

const socket = io("ws://localhost:8000/cam", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

app.config.globalProperties.$socket = socket;

try {
  app.use(router);
  app.use(vuetify);
  app.mount("#app");
} catch (error) {
  console.error("Vue app initialization error:", error);
}

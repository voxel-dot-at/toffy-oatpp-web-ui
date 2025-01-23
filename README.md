# toffy-oatpp-web-ui

This is a Vue 3 project built with Vite and Vuetify. The project is part of the `toffy-oatpp` project. To properly retrieve and display the data, the `toffy-oatpp` project needs to be built and run. The `toffy-oatpp-web-ui` project displays a list of real-time images and settings retrieved from the `toffy-oatpp` API and provides functionality to view details and images. The user interface includes vertically listed cards for each real-time image and setting, and buttons for detailed views and image displays.

## Project Structure

- **Vue 3**
- **Vite** (Development environment)
- **Vuetify 3** (UI framework)

## Features

- Fetches real-time image and settings from an API.
- Displays each real-time image and settings in a vertically listed card format.
- Error handling for failed API calls.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

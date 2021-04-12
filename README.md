# task.json-web

![Build](https://github.com/DCsunset/task.json-web/actions/workflows/release.yml/badge.svg)

Task management app with Web UI written in React.js based on [task.json](https://github.com/DCsunset/task.json) format.


## Screenshots

![Light theme](./screenshots/screenshot-light.png)

![Dark theme](./screenshots/screenshot-dark.png)


## Features

* Material Design UI
* Local storage for all data (no back-end server)
* Task synchronization with `task.json-server`
* Dark and light themes
* Support for Android


## Online Demo

<https://task-json-web.vercel.app>

Note: the demo is a static page and the data will be stored in your browser's local storage.

## Releases

The GitHub releases include two packages:

* Web frontend
* Android APK

The web frontend can be self-hosted by running an HTTP server (e.g. Nginx, Caddy) to serve the files.

## Build

To manually build from source, clone this repository and run the following commands:

```
npm install
npm run build
```

The packed files can then be found in `build` directory.

To build Android APK, install Android SDK and run:

```
npm run build:android
```

## License

GPL-3.0

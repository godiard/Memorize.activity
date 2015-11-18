requirejs.config({
  baseUrl: "lib",
  shim: {},
  paths: {
    activity: "../js",
    mustache: '../lib/mustache',
    bell: '../sounds/small_bell.mp3',
    trumpet: '../sounds/bugle_music_chargel.mp3'
  }
});

requirejs(["activity/activity"]);

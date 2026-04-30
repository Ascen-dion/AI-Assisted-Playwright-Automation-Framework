// === FILE: mobile/pages/locators/youtube-player.locators.js ===
/**
 * YouTube Video Player Screen Locators
 */
const locators = {
  // Player surface — tap to reveal controls
  playerSurface:    (screen) => screen.getByType('SurfaceView').first(),

  // Controls (visible after tapping player surface)
  playPauseButton:  (screen) => screen.getByRole('button', { name: /play|pause/i }),
  fullscreenButton: (screen) => screen.getByRole('button', { name: /fullscreen/i }),
  seekBar:          (screen) => screen.getByRole('slider'),

  // Video metadata shown below player
  videoTitle:   (screen) => screen.getByType('TextView').first(),
  channelName:  (screen) => screen.getByType('TextView').nth(1),

  // Comments / description section
  descriptionPanel: (screen) => screen.getByType('NestedScrollView').first(),

  // Mini player controls when app is backgrounded
  miniPlayerClose: (screen) => screen.getByRole('button', { name: 'Close' }),
};

module.exports = locators;

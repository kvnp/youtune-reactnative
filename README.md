Youtube Music client for Android, iOS and Web built with React Native

What works:
- Displaying home screen
- Using search
- Opening Playlists and Artists
- Playing music from artist and playlist pages
- Playing music from search results
- Include provided music mix into playlist when playing a song
- Retain playlist after selecting a song from artist or playlist pages
- Links to music streams are deobfuscated (thanks to [NewPipeExtractor](https://github.com/TeamNewPipe/NewPipeExtractor))
- Youtube Music API requests are proxied over webpack-dev-server or Nginx using provided config
- Control playback through notifications (Android, iOS, Web(only Chrome so far))
- Dark mode
- Basic PWA support
- Deep linking based on Youtube's URL structure

Features that need to be fixed:
- The next song is played back even if repeat is set

Features that are being worked on:
- Download playlists and songs
- Create custom playlists that are kept locally
- Keep track of songs that have been liked
- Download songs for offline playback
- Proper PWA support with offline caching

How to run:
- npm install

- npm run ios
or
- npm run android
or
- npm run web

the terminal will either display an URL to follow or additional instructions
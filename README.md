Youtube Music client for Android, iOS and Web built with React Native

![alt text](youtune.jpg)

What works:
- Displaying home screen
- Using search
- Opening Playlists and Artists
- Playing music from artist and playlist pages
- Playing music from search results
- Include song recommendations
- Retain playlist after selecting a song from artist or playlist pages
- Links to music streams are deobfuscated (thanks to [NewPipeExtractor](https://github.com/TeamNewPipe/NewPipeExtractor))
- Youtube Music API requests are proxied over webpack-dev-server or Nginx using provided config
- Control playback through notifications
- Dark mode
- PWA support with asset caching for offline use
- Deep linking based on Youtube's URL structure
- Downloading songs on web and storing them via Indexed DB

Features that are being worked on:
- Create custom playlists that are kept locally
- Keep track of songs that have been liked
- Download songs on Android/iOS for offline playback

How to run:

`npm install`

denpending on your platform:

`npm run ios`
`npm run android`
`npm run web`

the terminal will either display an URL to follow or additional instructions
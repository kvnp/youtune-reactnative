Youtube Music client for Android, iOS and Web built with React Native

What works:
- Displaying home screen
- Using search
- Opening Playlists and Artists
- Playing music from artist and playlist pages
- Playing music from search results
- Include provided music mix into playlist when playing a song
- Retain playlist after selecting a song from artist or playlist pages
- Links to music streams are deobfuscated (thanks to NewPipeExtractor)
- HTTP Requests are proxied through webpack for Web to bypass CORS (nginx config will be provided soon)
- Control playback through notifications (Android, iOS, Web(only Chrome))
- Dark mode

Features that need to be fixed:
- The next song is played back even if repeat is set

Features that are being worked on:
- Download playlists and songs
- Create custom playlists that are kept locally
- Keep track of songs that have been liked
- Download songs for offline playback
- PWA support

How to run:
- npm install
- npm run "android, ios, web"
- follow the steps provided in the terminal output after running above command
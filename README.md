Youtube Music client for Android, iOS and Web built with React Native that allows you to listen to music from Youtube. You can download songs and listen to them while being offline.

![alt text](youtune.jpg)

How to run:

`npm install`

In order to run the web version type:

`npm run web`

Even though YouTune acts as a PWA you need to keep the proxy running when interacting with Youtube due to CORS. Youtune itself and already downloaded songs will work fine. You can also use the example nginx config for self-hosting Youtune. Run the following command to build your own distribution of Youtune:

`npm run dist`

Expect the Android and iOS versions to not work for now as I'm more focused on getting the web version to work reliably. You can test these using the following commands:

`npm run ios`
`npm run android`
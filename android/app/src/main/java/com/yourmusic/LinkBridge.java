package com.yourmusic;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.yourmusic.utils.DownloaderImpl;

import org.schabi.newpipe.extractor.NewPipe;
import org.schabi.newpipe.extractor.linkhandler.LinkHandler;
import org.schabi.newpipe.extractor.services.youtube.extractors.YoutubeStreamExtractor;
import org.schabi.newpipe.extractor.services.youtube.linkHandler.YoutubeStreamLinkHandlerFactory;
import org.schabi.newpipe.extractor.stream.AudioStream;

import java.util.List;

public class LinkBridge extends ReactContextBaseJavaModule {
    public LinkBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "LinkBridge";
    }

    private String getLastLink(String url) {
        try {
            NewPipe.init(DownloaderImpl.getInstance());
            LinkHandler linkHandler = YoutubeStreamLinkHandlerFactory.getInstance().fromUrl(url);

            YoutubeStreamExtractor youtubeStreamExtractor = new YoutubeStreamExtractor(NewPipe.getService(0), linkHandler);
            youtubeStreamExtractor.fetchPage();
            List<AudioStream> audioStreams = youtubeStreamExtractor.getAudioStreams();

            for (AudioStream audio : youtubeStreamExtractor.getAudioStreams()) {
                System.out.println(audio.getAverageBitrate());
                System.out.println(audio.url);
            }

            return audioStreams.get(audioStreams.size() - 1).url;

        } catch(Exception e) {
            return null;
        }
    }

    @ReactMethod
    public void getString(String url, Callback stringCallback) {
        stringCallback.invoke(getLastLink(url));
    }
}

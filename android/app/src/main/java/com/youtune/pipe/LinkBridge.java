package com.youtune.pipe;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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

    @ReactMethod
    public void getLink(String url, Callback stringCallback) {
        String audioStream;

        try {
            NewPipe.init(DownloaderImpl.getInstance());
            LinkHandler linkHandler = YoutubeStreamLinkHandlerFactory.getInstance().fromUrl(url);

            YoutubeStreamExtractor youtubeStreamExtractor = new YoutubeStreamExtractor(NewPipe.getService(0), linkHandler);
            youtubeStreamExtractor.fetchPage();

            List<AudioStream> audioStreams = youtubeStreamExtractor.getAudioStreams();
            audioStream = audioStreams.get(audioStreams.size() - 1).url;
        } catch (Exception e) {
            audioStream = null;
        }

        stringCallback.invoke(audioStream);
    }
}

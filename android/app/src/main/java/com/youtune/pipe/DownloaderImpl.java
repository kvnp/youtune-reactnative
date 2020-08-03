package com.youtune.pipe;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.net.ssl.HttpsURLConnection;

import org.schabi.newpipe.extractor.downloader.Downloader;
import org.schabi.newpipe.extractor.downloader.Request;
import org.schabi.newpipe.extractor.downloader.Response;
import org.schabi.newpipe.extractor.exceptions.ReCaptchaException;

public class DownloaderImpl extends Downloader {
    private static final String USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0";
    private static DownloaderImpl instance;

    private DownloaderImpl() {}

    /**
     * It's recommended to call exactly once in the entire lifetime of the application.
     * @return a new instance of {@link DownloaderImpl}
     */
    public static DownloaderImpl init() {
        return new DownloaderImpl();
    }

    public static DownloaderImpl getInstance() {
        if (instance == null)
            instance = init();

        return instance;
    }

    @Override
    public Response execute(@Nonnull final Request request) throws IOException, ReCaptchaException {
        final String httpMethod = request.httpMethod();
        final String url = request.url();
        final Map<String, List<String>> headers = request.headers();
        final byte[] dataToSend = request.dataToSend();

        final URL Url = new URL(url);
        HttpsURLConnection httpURLConnection = (HttpsURLConnection) Url.openConnection();

        httpURLConnection.setRequestMethod(httpMethod);
        httpURLConnection.setRequestProperty("User-Agent", USER_AGENT);
        httpURLConnection.setDoInput(true);

        for (Map.Entry<String, List<String>> pair : headers.entrySet()) {
            final String headerName = pair.getKey();
            final List<String> headerValueList = pair.getValue();

            if (headerValueList.size() > 1) {
                boolean first = true;
                for (String headerValue : headerValueList) {
                    if (first) {
                        httpURLConnection.setRequestProperty(headerName, headerValue);
                        first = false;
                    }
                    httpURLConnection.addRequestProperty(headerName, headerValue);
                }

            } else if (headerValueList.size() == 1) {
                httpURLConnection.setRequestProperty(headerName, headerValueList.get(0));
            }
        }

        if (dataToSend != null) {
            httpURLConnection.setDoOutput(true);
            OutputStream outStream = httpURLConnection.getOutputStream();
            outStream.write(dataToSend);
            outStream.flush();
            outStream.close();
        }

        if (httpURLConnection.getResponseCode() == 429)
            throw new ReCaptchaException("reCaptcha Challenge requested", httpURLConnection.getURL().toString());

        BufferedReader in = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
        String inputLine;

        StringBuilder responseBody = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            responseBody.append(inputLine);
        } in.close();

        System.out.println(
            "moooin" + "\n" +
            httpURLConnection.getResponseCode() + "\n" +
            httpURLConnection.getResponseMessage() + "\n" +
            httpURLConnection.getHeaderFields().toString() + "\n" +
            responseBody.toString() + "\n" +
            httpURLConnection.getURL().toString() + "\n"
        );

        return new Response(
            httpURLConnection.getResponseCode(),
            httpURLConnection.getResponseMessage(),
            httpURLConnection.getHeaderFields(),
            responseBody.toString(),
            httpURLConnection.getURL().toString()
        );
    }
}

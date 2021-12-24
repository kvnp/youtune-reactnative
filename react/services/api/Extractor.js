import digestBrowseResponse from "./extractor/BrowseResponse";
import digestHomeResponse from "./extractor/HomeResponse";
import digestResultResponse from "./extractor/SearchResponse";
import digestNextResponse from "./extractor/NextResponse";
import digestAudioInfoResponse from "./extractor/AudioInfoResponse";
import digestStreamResponse from "./extractor/StreamResponse";

export default class Extractor {
    static digestResultResponse = digestResultResponse;
    static digestHomeResponse = digestHomeResponse;
    static digestBrowseResponse = digestBrowseResponse;
    static digestStreamResponse = digestStreamResponse;
    static digestNextResponse = digestNextResponse;
    static digestAudioInfoResponse = digestAudioInfoResponse;
}
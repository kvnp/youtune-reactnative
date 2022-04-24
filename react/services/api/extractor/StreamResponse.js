import Device from "../../device/Device";
import Settings from "../../device/Settings";
import HTTP from "../HTTP";

export default function digestStreamResponse(parse) {
    let current = {
        audioQuality: null,
        url: null
    };

    let formats = parse.streamingData.adaptiveFormats
        ? parse.streamingData.adaptiveFormats
        : parse.streamingData.formats

    for (let i = 0; i < formats.length; i++) {
        let mimeType = formats[i].mimeType;
        if (["audio", "video"].includes(mimeType.split("/")[0])) {
            let audioQuality;
            switch (formats[i].audioQuality) {
                case "AUDIO_QUALITY_MEDIUM":
                    audioQuality = 2;
                    break;
                case "AUDIO_QUALITY_HIGH":
                    audioQuality = 3;
                    break;
                default:
                    audioQuality = 1;
            }
            
            if (audioQuality > current.audioQuality) {
                let url = Settings.Values.visualizerEnabled && Device.Platform == "web"
                    ? HTTP.getProxyUrl(formats[i].url)
                    : formats[i].url;
                current = {
                    audioQuality: audioQuality,
                    url: url
                };
            }

            if (audioQuality == 3)
                break;
        }
    }

    return current.url;
}
export default function digestStreamResponse(parse) {
    let current = {
        audioQuality: null,
        url: null
    };

    for (let i = 0; i < parse.streamingData.adaptiveFormats.length; i++) {
        let mimeType = parse.streamingData.adaptiveFormats[i].mimeType;
        if (mimeType.split("/")[0] == "audio") {

            let audioQuality;
            switch (parse.streamingData.adaptiveFormats[i].audioQuality) {
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
                let url = parse.streamingData.adaptiveFormats[i].url;
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
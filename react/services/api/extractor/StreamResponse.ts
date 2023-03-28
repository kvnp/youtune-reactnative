export default function digestStreamResponse(parse) {
    let current = {
        audioQuality: null,
        url: null,
        mimeType: null
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
            
            if (audioQuality > current.audioQuality)
                current = {
                    audioQuality: audioQuality,
                    url: formats[i].url,
                    mimeType: formats[i].mimeType
                };

            if (audioQuality == 3)
                break;
        }
    }

    return current;
}
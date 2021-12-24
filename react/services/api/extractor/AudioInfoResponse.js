export default function digestAudioInfoResponse(response) {
    return {
        playable: response.playabilityStatus.status,
        id: response.videoDetails.videoId,
        channelId: response.videoDetails.channelId,
        title: response.videoDetails.title,
        artist: response.videoDetails.author.split(" - Topic")[0],
        duration: Number.parseInt(response.videoDetails.lengthSeconds),
        artwork: response.videoDetails.thumbnail.thumbnails[response.videoDetails.thumbnail.thumbnails.length - 1].url
    };
}
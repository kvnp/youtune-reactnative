import Media from "../api/Media";

export default class IO {
    static readBase64({blob, url}) {
        return new Promise(async(resolve, reject) => {
            if (url) blob = await Media.getBlob(url);

            let fileReader = new FileReader();
            fileReader.readAsDataURL(blob);

            fileReader.onloadend = () => {
                resolve(fileReader.result);
            }
        })
    }
}
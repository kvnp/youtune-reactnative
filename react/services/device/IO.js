import Media from "../api/Media";

export default class IO {
    static isBlob(data) {
        return data instanceof Blob;
    }

    static isBase64(base64) {
        try {
            if(btoa(atob(base64)) == base64)
                return true;
        } catch (_) {}

        return false;
    }

    static isURL(url) {
        try {
            url = new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    static getBlobAsBase64({blob, url, controllerCallback}) {
        return new Promise(async(resolve, reject) => {
            if (url) {
                if (this.isBlob(url))
                    blob = url;
                else
                    blob = await Media.getBlob({url, controllerCallback});
            }

            let fileReader = new FileReader();
            fileReader.readAsDataURL(blob);

            fileReader.onloadend = () => {
                resolve(fileReader.result);
            }
        })
    }

    static getBlobAsURL(blob) {
        return URL.createObjectURL(blob);
    }
}
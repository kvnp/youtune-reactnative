export function msToMin(ms) {
    return Math.floor((ms / 1000 / 60) % 60);
}

export function msToMMSS(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = msToMin(ms);

    let secondString = seconds + "";
    if (secondString.length == 1) secondString = "0" + secondString;
    
    return minutes + ":" + secondString;
}

export function textToSec(text) {
    let array = text.split(":");
    let minutes = Number.parseInt(array[0]) * 60;
    let seconds = Number.parseInt(array[1]);
    return minutes + seconds;
}


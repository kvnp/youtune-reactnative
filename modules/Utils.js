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
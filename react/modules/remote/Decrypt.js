import { getHttpResponse } from "./HTTP";
import { configuration, headers_simple } from "./API";

const REGEXES = [
    "(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*\"\"\\s*\\)",
    "([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(\"\"\\)\\s*;",
    "\\b([\\w$]{2})\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(\"\"\\)\\s*;",
    "yt\\.akamaized\\.net/\\)\\s*\\|\\|\\s*.*?\\s*c\\s*&&\\s*d\\.set\\([^,]+\\s*,\\s*(:encodeURIComponent\\s*\\()([a-zA-Z0-9$]+)\\(",
    "\\bc\\s*&&\\s*d\\.set\\([^,]+\\s*,\\s*(:encodeURIComponent\\s*\\()([a-zA-Z0-9$]+)\\("
];

const domain = "https://www.youtube.com";

const function_name = "decryptionFunction";
var functionString = null;

export function getFunctionState() {
    if (functionString == null)
        return false;
    else
        return true;
}

function getFunction(code) {
    let decryptionFunctionName;
    for (let i = 0; i < REGEXES.length; i++) {
        let pattern = new RegExp(REGEXES[i]);
        let result = pattern.exec(code);

        if (result != undefined) {
            if (result[1] != undefined) {
                decryptionFunctionName = result[1];
                break;
            }
        }
    }

    let functionPattern = new RegExp("(" + decryptionFunctionName.split("$").join("\\$") + "=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})");
    let decryptionFunction = "var " + functionPattern.exec(code)[1] + ";";
    let helperObjectName = new RegExp(";([A-Za-z0-9_\\$]{2})\\...\\(").exec(decryptionFunction)[1];
    let helperPattern = "(var " + helperObjectName.split("$").join("\\$") + "=\\{.+?\\}\\};)";
    let helperObject = new RegExp(helperPattern).exec(code.split("\n").join(""));
    let callerFunction = "function " + function_name + "(a){return " + decryptionFunctionName + "(a);}";
    
    return helperObject + decryptionFunction + callerFunction;
}

async function fetchBaseJsLocation(videoId) {
    let location;
    if (!configuration) {
        let watch = domain + "/watch?v=" + videoId;
        let watchResponse = await getHttpResponse(watch, {
            method: "GET",
            headers: headers_simple
        }, "text");

        location = extractLocation(watchResponse);
    } else {
        location = configuration
            .WEB_PLAYER_CONTEXT_CONFIGS
            .WEB_PLAYER_CONTEXT_CONFIG_ID_MUSIC_WATCH
            .jsUrl;
    }

    await fetchBaseJs(location);
}

function extractLocation(response) {
    let searchTerm;
    if (response.indexOf('"js":') != -1) {
        searchTerm = '"js":';
    } else if (response.indexOf('"jsUrl":') != -1) {
        searchTerm = '"jsUrl":';
    } else {
        return null;
    }

    let jsIndex = response.indexOf(searchTerm);

    let side = response.substring(jsIndex + searchTerm.length);
    let ind1x = side.indexOf(",");
    let ind2x = side.indexOf("}");

    let result;
    if (ind1x < ind2x)
        result = side.substring(0, ind1x);
    else
        result = side.substring(0, ind2x);

    return result.replace(/\\/g, '').replace(/\"/g, '');
}

async function fetchBaseJs(location) {
    let playerUrl = domain + location;
    let playerCode = await getHttpResponse(playerUrl, {
        method: "GET",
        headers: headers_simple
    }, "text");

    setFunction(getFunction(playerCode));
}

function setFunction(functionString) {
    gEval = function(){ (1, eval)(functionString.replace(";,", ";")); };
    gEval();
}

export async function getSignature(videoId, signature) {
    if (functionString == null)
        await fetchBaseJsLocation(videoId);

    return decryptionFunction(signature);
}
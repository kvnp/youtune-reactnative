export async function getHttpResponse(url, input, type) {
    const response = await fetch(url, input);
    switch(type) {
        case "json":
            return response.json();
        case "text":
            return response.text();
    }
}
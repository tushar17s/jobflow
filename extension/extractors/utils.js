export function getText(selector){

    const element = document.querySelector(selector);

    return element
        ? element.innerText.trim()
        : "";

}

export function getHref(selector){

    const element = document.querySelector(selector);

    return element
        ? element.href
        : "";

}

export function clean(text){

    return text.trim();

}
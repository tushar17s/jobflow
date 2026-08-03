export function extractNaukri() {

    const getText = (selector) => {

        const element = document.querySelector(selector);

        return element
            ? element.innerText.trim()
            : "";

    };

    const extractDescription = () => {

        let text = "";

        // Job Highlights
        const highlights = document.querySelector(
            ".styles_JDC__job-highlight-list__QZC12"
        );

        if (highlights) {

            highlights.querySelectorAll("li").forEach(item => {

                text += "• " + item.innerText.trim() + "\n";

            });

        }

        // Complete Job Description
        const description = document.querySelector(
            ".styles_job-desc-container__txpYf"
        );

        if (description) {

            text += "\n\n" + description.innerText.trim();

        }

        return text.trim();

    };

    const role = getText(
        ".styles_jd-header-title__rZwM1"
    );

    const company = getText(
        ".styles_jd-header-comp-name__MvqAI"
    );

    const location = getText(
        ".styles_jhc__location__W_pVs"
    );

    const requirements = extractDescription();

    console.log("===== Naukri Debug =====");

    console.log({

        role,

        company,

        location,

        requirements

    });

    if (!role || !company) {

        return null;

    }

    return {

        company,

        role,

        location,

        platform: "Naukri",

        url: window.location.href,

        requirements

    };

}
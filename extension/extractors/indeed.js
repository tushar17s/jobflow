export function extractIndeed() {

    const getText = (selector) => {

        const element = document.querySelector(selector);

        return element
            ? element.innerText.trim()
            : "";

    };

    const extractDescription = () => {

        const container = document.querySelector("#jobDescriptionText");

        return container
            ? container.innerText.trim()
            : "";

    };

    let role = getText(
        '[data-testid="jobsearch-JobInfoHeader-title"]'
    );

    role = role.replace(/\s*-\s*job post/i, "").trim();

    const company = getText(".css-1h4l2d7");

    const location = getText(
        '[data-testid="inlineHeader-companyLocation"]'
    );

    const requirements = extractDescription();

    console.log("===== Indeed Debug =====");
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

        platform: "Indeed",

        url: window.location.href,

        requirements

    };

}
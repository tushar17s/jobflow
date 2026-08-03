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

    const role = getText(
        '[data-testid="jobsearch-JobInfoHeader-title"]'
    ).replace(/\s*-\s*job post/i, "").trim();

    // Try multiple selectors for company
    const company =
        getText('[data-testid="inlineHeader-companyName"]') ||
        getText("#companyLink") ||
        getText(".css-1h4l2d7");

    // Try multiple selectors for location
    const location =
        getText('[data-testid="inlineHeader-companyLocation"]') ||
        getText("#jobLocationText") ||
        getText("#location-collapsed-header");

    const requirements = extractDescription();

    console.log("===== Indeed Debug =====");

    console.log({
        role,
        company,
        location,
        requirements
    });

    return {

        company,

        role,

        location,

        platform: "Indeed",

        url: window.location.href,

        requirements

    };

}
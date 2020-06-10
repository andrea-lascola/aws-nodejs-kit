/**
 * split ISO lang to a structured object
 *
 * parseISOLang("en_US") => { lang: 'en', country: 'US' }
 *
 * @param isoLang
 */
export const parseISOLang = (isoLang: string) => {
    const separator = isoLang.includes("_") ? "_" : "-";

    const [lang, country] = isoLang
        .split(separator);
    return {lang, country};
};

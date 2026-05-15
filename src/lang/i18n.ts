import esAdmin from "../lang/es/admin.json";
import esCommon from "../lang/es/common.json";
import esGame from "../lang/es/game.json";
import esHome from "../lang/es/home.json";
import esNavbar from "../lang/es/navbar.json";
import esNotFound from "../lang/es/notFound.json";
import esProfile from "../lang/es/profile.json";
import esRanking from "../lang/es/ranking.json";
import esRegisterLogin from "../lang/es/registerLogin.json";
import esError from "../lang/es/error.json";

import enAdmin from "../lang/en/admin.json";
import enCommon from "../lang/en/common.json";
import enGame from "../lang/en/game.json";
import enHome from "../lang/en/home.json";
import enNavbar from "../lang/en/navbar.json";
import enNotFound from "../lang/en/notFound.json";
import enProfile from "../lang/en/profile.json";
import enRanking from "../lang/en/ranking.json";
import enRegisterLogin from "../lang/en/registerLogin.json";
import enError from "../lang/en/error.json";

function flattenMessages(nestedMessages: any, prefix = ""): Record<string, string> {
    return Object.keys(nestedMessages).reduce((messages: any, key: string) => {
        const value = nestedMessages[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === "object") {
            Object.assign(messages, flattenMessages(value, prefixedKey));
        } else {
            messages[prefixedKey] = value;
        }

        return messages;
    }, {});
}

export const messages = {
    es: flattenMessages({
        admin: esAdmin,
        common: esCommon,
        game: esGame,
        home: esHome,
        navbar: esNavbar,
        notFound: esNotFound,
        profile: esProfile,
        ranking: esRanking,
        registerLogin: esRegisterLogin,
        error: esError,
    }),
    en: flattenMessages({
        admin: enAdmin,
        common: enCommon,
        game: enGame,
        home: enHome,
        navbar: enNavbar,
        notFound: enNotFound,
        profile: enProfile,
        ranking: enRanking,
        registerLogin: enRegisterLogin,
        error: enError,
    })
};

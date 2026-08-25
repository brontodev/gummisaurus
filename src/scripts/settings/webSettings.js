import DefaultConfig from '../../config.json';

let data;

async function getConfig() {
    if (!data) {
        // Vega WebView blocks fetches between packaged files, so Gummisaurus
        // uses its compiled configuration as a standalone client.
        data = { ...DefaultConfig, multiserver: true };
    }

    return data;
}

export function getIncludeCorsCredentials() {
    return getConfig()
        .then(config => !!config.includeCorsCredentials)
        .catch(error => {
            console.log('cannot get web config:', error);
            return false;
        });
}

export function getMultiServer() {
    // Enable multi-server support when served by webpack
    if (__WEBPACK_SERVE__) {
        return Promise.resolve(true);
    }

    return getConfig().then(config => {
        return !!config.multiserver;
    }).catch(error => {
        console.log('cannot get web config:', error);
        return false;
    });
}

export function getServers() {
    return getConfig().then(config => {
        return config.servers || [];
    }).catch(error => {
        console.log('cannot get web config:', error);
        return [];
    });
}

const baseDefaultTheme = {
    'name': 'TBO',
    'id': 'dark',
    'default': true
};

let internalDefaultTheme = baseDefaultTheme;

const checkDefaultTheme = (themes) => {
    if (themes) {
        const defaultTheme = themes.find((theme) => theme.default);

        if (defaultTheme) {
            internalDefaultTheme = defaultTheme;
            return;
        }
    }

    internalDefaultTheme = baseDefaultTheme;
};

export function getThemes() {
    return getConfig().then(config => {
        if (!Array.isArray(config.themes)) {
            console.error('web config is invalid, missing themes:', config);
        }
        const themes = Array.isArray(config.themes) ? config.themes : DefaultConfig.themes;
        checkDefaultTheme(themes);
        return themes;
    }).catch(error => {
        console.log('cannot get web config:', error);
        checkDefaultTheme();
        return DefaultConfig.themes;
    });
}

export const getDefaultTheme = () => internalDefaultTheme;

export function getMenuLinks() {
    return getConfig().then(config => {
        if (!config.menuLinks) {
            console.error('web config is invalid, missing menuLinks:', config);
        }
        return config.menuLinks || [];
    }).catch(error => {
        console.log('cannot get web config:', error);
        return [];
    });
}

export function getPlugins() {
    return getConfig().then(config => {
        if (!config.plugins) {
            console.error('web config is invalid, missing plugins:', config);
        }
        return config.plugins || DefaultConfig.plugins;
    }).catch(error => {
        console.log('cannot get web config:', error);
        return DefaultConfig.plugins;
    });
}

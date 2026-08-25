import React, { type FC, type PropsWithChildren, createContext, useContext } from 'react';

import type { WebConfig } from '../types/webConfig';
import defaultConfig from '../config.json';

const gummisaurusConfig: WebConfig = { ...defaultConfig, multiserver: true };

export const WebConfigContext = createContext<WebConfig>(gummisaurusConfig);
export const useWebConfig = () => useContext(WebConfigContext);

export const WebConfigProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
    return (
        <WebConfigContext.Provider value={gummisaurusConfig}>
            {children}
        </WebConfigContext.Provider>
    );
};

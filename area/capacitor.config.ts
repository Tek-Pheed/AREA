import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.epitech.tekpheed.nexus',
    appName: 'Nexus',
    webDir: 'www',

    plugins: {
        CapacitorHttp: {
            enabled: true,
        },
    },
};

export default config;

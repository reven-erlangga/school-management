import { 
    createOrUpdateConfigurationApi 
} from '../api/create-or-update-configuration.api';
import { fetchOneConfigurationApi } from '../api/fetch-one-configuration.api';
import { createSuperUserApi } from '../api/create-super-user.api';
import { uploadConfigurationFileApi } from '../api/upload-configuration-file.api';

export const configurationService = {
    saveGeneralSettings: async (settings: {
        foundationName: string;
        appName: string;
        shortName: string;
        description: string;
        logo: File | null;
        favicon: File | null;
    }) => {
        try {
            // Save text settings
            await createOrUpdateConfigurationApi('general', {
                foundation_name: settings.foundationName,
                app_name: settings.appName,
                short_name: settings.shortName,
                description: settings.description
            });

            // Upload files if they exist
            if (settings.logo) {
                await uploadConfigurationFileApi('general', settings.logo, 'logo');
            }

            if (settings.favicon) {
                await uploadConfigurationFileApi('general', settings.favicon, 'favicon');
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save general settings:', error);
            throw error;
        }
    },

    getGeneralSettings: async () => {
        try {
            const data = await fetchOneConfigurationApi('general');
            
            let logoUrl = null;
            let faviconUrl = null;

            if (data.logo) {
                try {
                    const logoData = JSON.parse(data.logo);
                    logoUrl = logoData.url;
                } catch (e) {
                    console.error('Failed to parse logo JSON', e);
                }
            }

            if (data.favicon) {
                try {
                    const faviconData = JSON.parse(data.favicon);
                    faviconUrl = faviconData.url;
                } catch (e) {
                    console.error('Failed to parse favicon JSON', e);
                }
            }

            return {
                foundationName: data.foundation_name || '',
                appName: data.app_name || '',
                shortName: data.short_name || '',
                description: data.description || '',
                logoUrl,
                faviconUrl
            };
        } catch (error) {
            console.error('Failed to get general settings:', error);
            throw error;
        }
    },

    saveServerSettings: async (settings: {
        tolgee: {
            apiUrl: string;
            apiKey: string;
        },
        mailServer: {
            host: string;
            port: string;
            username: string;
            password?: string;
            fromEmail: string;
        }
    }) => {
        try {
            // Save Tolgee settings
            await createOrUpdateConfigurationApi('tolgee', {
                api_url: settings.tolgee.apiUrl,
                api_key: settings.tolgee.apiKey
            });

            // Save Mail Server settings
            await createOrUpdateConfigurationApi('mail-server', {
                host: settings.mailServer.host,
                port: settings.mailServer.port,
                username: settings.mailServer.username,
                password: settings.mailServer.password,
                from_email: settings.mailServer.fromEmail
            });
        } catch (error) {
            console.error('Failed to save server settings:', error);
            throw error;
        }
    },

    getServerSettings: async () => {
        try {
            const [tolgeeData, mailData] = await Promise.all([
                fetchOneConfigurationApi('tolgee'),
                fetchOneConfigurationApi('mail-server')
            ]);

            return {
                tolgee: {
                    apiUrl: tolgeeData.api_url || '',
                    apiKey: tolgeeData.api_key || ''
                },
                mailServer: {
                    host: mailData.host || '',
                    port: mailData.port || '',
                    username: mailData.username || '',
                    password: mailData.password || '',
                    fromEmail: mailData.from_email || ''
                }
            };
        } catch (error) {
            console.error('Failed to get server settings:', error);
            throw error;
        }
    },

    createSuperUser: async (data: {
        name: string;
        email: string;
        password: string;
    }) => {
        try {
            return await createSuperUserApi(data);
        } catch (error) {
            console.error('Failed to create super user:', error);
            throw error;
        }
    }
};

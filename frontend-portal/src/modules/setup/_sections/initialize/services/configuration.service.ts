import { 
    createOrUpdateConfigurationApi 
} from '../api/create-or-update-configuration.api';
import { fetchOneConfigurationApi } from '../api/fetch-one-configuration.api';
import { createSuperUserApi } from '../api/create-super-user.api';
import { uploadConfigurationFileApi } from '../api/upload-configuration-file.api';

export interface ConfigurationService {
    saveGeneralSettings: (settings: {
        foundationName: string;
        appName: string;
        shortName: string;
        description: string;
        logo: File | null;
        favicon: File | null;
    }) => Promise<boolean>;
    getGeneralSettings: () => Promise<{
        foundationName: string;
        appName: string;
        shortName: string;
        description: string;
        logoUrl: string | null;
        faviconUrl: string | null;
    }>;
    saveMailServerSettings: (settings: {
        host: string;
        port: string;
        username: string;
        password?: string;
        fromEmail: string;
    }) => Promise<void>;
    getMailServerSettings: () => Promise<{
        host: string;
        port: string;
        username: string;
        password: string;
        fromEmail: string;
    }>;
    createSuperUser: (data: { name: string; email: string; password: string }) => Promise<any>;
    saveXenditSettings: (settings: {
        enabled: boolean;
        paymentMode: 'manual' | 'xendit';
        apiKey: string;
        secretKey: string;
        webhookUrl: string;
    }) => Promise<void>;
    getXenditSettings: () => Promise<{
        enabled: boolean | string;
        paymentMode: string;
        apiKey: string;
        secretKey: string;
        webhookUrl: string;
    }>;
}

export const configurationService: ConfigurationService = {
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
                foundationName: settings.foundationName,
                appName: settings.appName,
                shortName: settings.shortName,
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
                foundationName: data.foundationName || '',
                appName: data.appName || '',
                shortName: data.shortName || '',
                description: data.description || '',
                logoUrl,
                faviconUrl
            };
        } catch (error) {
            console.error('Failed to get general settings:', error);
            throw error;
        }
    },

    saveMailServerSettings: async (settings: {
        host: string;
        port: string;
        username: string;
        password?: string;
        fromEmail: string;
    }) => {
        try {
            // Save Mail Server settings
            await createOrUpdateConfigurationApi('mail-server', {
                host: settings.host,
                port: settings.port,
                username: settings.username,
                password: settings.password,
                fromEmail: settings.fromEmail
            });
        } catch (error) {
            console.error('Failed to save server settings:', error);
            throw error;
        }
    },

    getMailServerSettings: async () => {
        try {
            const mailData = await fetchOneConfigurationApi('mail-server');

            return {
                host: mailData.host || '',
                port: mailData.port || '',
                username: mailData.username || '',
                password: mailData.password || '',
                fromEmail: mailData.fromEmail || ''
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
    },

    saveXenditSettings: async (settings: {
        enabled: boolean;
        paymentMode: 'manual' | 'xendit';
        apiKey: string;
        secretKey: string;
        webhookUrl: string;
    }) => {
        try {
            await createOrUpdateConfigurationApi('xendit', {
                xendit_enabled: settings.enabled,
                xendit_payment_mode: settings.paymentMode,
                xendit_api_key: settings.apiKey,
                xendit_webhook_secret: settings.secretKey,
                xendit_webhook_url: settings.webhookUrl
            });
        } catch (error) {
            console.error('Failed to save Xendit settings:', error);
            throw error;
        }
    },

    getXenditSettings: async () => {
        try {
            const data = await fetchOneConfigurationApi('xendit');
            return {
                enabled: data.xendit_enabled ?? data.enabled ?? false,
                paymentMode: data.xendit_payment_mode ?? data.paymentMode ?? 'manual',
                apiKey: data.xendit_api_key ?? data.apiKey ?? '',
                secretKey: data.xendit_webhook_secret ?? data.secretKey ?? '',
                webhookUrl: data.xendit_webhook_url ?? data.webhookUrl ?? ''
            };
        } catch (error) {
            console.error('Failed to get Xendit settings:', error);
            throw error;
        }
    }
};

import { triggerSeederApi } from '../api/trigger-seeder.api';
import { streamSeederApi } from '../api/stream-seeder.api';

export interface SeederService {
    trigger: () => Promise<string>;
    tracking: (key: string) => EventSource;
}

export const seederService: SeederService = {
    trigger: async () => {
        const response = await triggerSeederApi();
        const key = response?.data?.key ?? response?.data?.jobId ?? response?.data?.job_id ?? response?.jobId ?? response?.job_id;

        if (!key || typeof key !== 'string') {
            throw new Error('No key returned from seeder');
        }

        return key;
    },
    tracking: (key: string) => {
        return streamSeederApi(key);
    }
};

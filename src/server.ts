import InitConfig from '@/config/InitConfig';
import InitService from '@/services/InitService';
import Log from '@/helper/Logging';

declare global {
    function Log(
        message: string,
        error?: any
    ): void;
}

global.Log = Log

async function startServices() {
    Log('[Server] starting');

    await InitConfig();
    await InitService();
}

startServices();

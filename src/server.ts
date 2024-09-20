import Log from '@/helper/Logging';
import InitConfig from '@/config/InitConfig';
import InitService from '@/services/InitService';

async function startServices() {
    Log('[Server] starting');

    await InitConfig();
    await InitService();
}

startServices();

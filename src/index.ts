import { ProxyAgent, setGlobalDispatcher } from 'undici';
import { fetchSourceExtension } from './fetch-source.ts';

setGlobalDispatcher(new ProxyAgent('127.0.0.1:7890'));

(async () => {
    try {
        fetchSourceExtension();
    }
    catch {}
})();

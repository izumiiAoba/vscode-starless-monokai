import { fetchSourceExtension } from './fetch-source.ts';
import { setFetchProxy } from './utils/proxy.ts';

setFetchProxy();

(async () => {
    try {
        fetchSourceExtension();
    }
    catch {}
})();

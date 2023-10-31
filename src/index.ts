import { fetchSourceExtension } from './fetch-source.ts';
import { setFetchProxy } from './utils/proxy.ts';

// NOTE: if necessary
setFetchProxy('http://127.0.0.1:7890');

(async () => {
    try {
        fetchSourceExtension();
    }
    catch {}
})();

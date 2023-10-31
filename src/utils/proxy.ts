import { ProxyAgent, setGlobalDispatcher } from 'undici';

export const setFetchProxy = (): void => {
    setGlobalDispatcher(new ProxyAgent('http://127.0.0.1:7890'));
};

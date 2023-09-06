import { WeaveAPI, WeaveHelper } from "@weavechain/weave-node-api"

import LOCAL_STORAGE from "./storage";

export async function createApi(
    chain,
    bootstrapNode,
    wallet,
    sign = null
) {
    let stateData = LOCAL_STORAGE.loadState() || {};
    const keys = WeaveHelper.generateKeys();
    const pub = stateData.pub || keys[0];
    const pvk = stateData.pvk || keys[1];

    const signatures = stateData.signatures || {};

    const cfg = WeaveHelper.getConfig(bootstrapNode, pub, pvk);
    const nodeApi = new WeaveAPI().create(cfg);
    await nodeApi.init();

    const key = "eth:" + wallet + ":" + pub;
    let sig = signatures[key];

    if (!sig && sign) {
        const message = `Please sign this message to confirm you own this wallet\nThere will be no blockchain transaction or any gas fees.\n\nWallet: ${wallet}\nKey: ${pub}`;
        sig = sign(message);
        console.log(sig)
        if (sig) {
            signatures[key] = sig;
        }
    }

    const credentials = sig ? {
            account: chain + ":" + wallet,
            sig: sig,
            template: "*",
            role: "*",
        } : null;

    LOCAL_STORAGE.saveState({
        ...stateData,
        signatures: signatures,
        pub,
        pvk,
    });

    return { pub, nodeApi, credentials, wallet };
}

export async function credentials(
    chain,
    wallet,
    signature
) {
    let stateData = LOCAL_STORAGE.loadState() || {};
    const pub = stateData.pub;

    const signatures = stateData.signatures || {};
    const key = "eth:" + wallet + ":" + pub;
    signatures[key] = signature;

    const credentials = signature ? {
        account: chain + ":" + wallet,
        sig: signature,
        template: "*",
        role: "*",
    } : null;

    LOCAL_STORAGE.saveState({
        ...stateData,
        signatures: signatures
    });

    return credentials;
}

export async function saveResult(pub, nodeApi, credentials, config, wallet, content, metadata) {
    const session = await nodeApi.login(config.organization, pub, config.scope || "*", credentials);

    const record = [
        null, // id, autofilled
        null, // timestamp, autofilled
        null, // writer, autofilled
        null, // wallet, autofilled
        null, // signature, autofilled
        "writer",
        typeof content === 'string' || content instanceof String ? content : JSON.stringify(content),
        typeof metadata === 'string' || metadata instanceof String ? metadata : JSON.stringify(metadata),
    ];

    const records = new WeaveHelper.Records(config.table, [record]);
    return nodeApi.write(
        session,
        config.scope,
        records,
        WeaveHelper.Options.WRITE_DEFAULT
    );
}

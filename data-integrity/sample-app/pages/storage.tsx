export const loadState = () => {
    try {
        const serialState = localStorage.getItem("appState");
        if (serialState === null) return {};

        return JSON.parse(serialState);
    } catch (err) {
        return {};
    }
};

export const saveState = (state : any) => {
    try {
        const serialState = JSON.stringify(state);
        localStorage.setItem("appState", serialState);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const clearStorage = (names: string[]) => {
    let state = LOCAL_STORAGE.loadState() || {};

    if (names) {
        names.forEach((type) => (state["app_data:" + type] = {}));
        LOCAL_STORAGE.saveState(state);
    }
};

export const readObject = (name: string) : any => {
    let state = LOCAL_STORAGE.loadState() || {};
    return state["app_data:" + name];
};

export const saveObject = (name: string, content : any) => {
    let state = LOCAL_STORAGE.loadState() || {};
    state["app_data:" + name] = content;
    LOCAL_STORAGE.saveState(state);
};

const LOCAL_STORAGE = {
    saveState,
    loadState,
    clearStorage,
    readObject,
    saveObject
};

export default LOCAL_STORAGE;
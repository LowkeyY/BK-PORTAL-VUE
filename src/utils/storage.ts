const storage = {
    has: (key: string) => {
        return !!uni.getStorageSync(key);
    },
    get: (key: string) => {
        return uni.getStorageSync(key);
    },
    set: (key: string, data: any) => {
        uni.setStorageSync(key, data);
    },
    remove: (key: string) => {
        return uni.removeStorageSync(key);
    },
    clear: () => {
        uni.clearStorageSync();
    },
};

export default storage;

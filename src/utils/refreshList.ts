interface typeSearchData {
    searchData?: any;
    currentPage: number;
    pageSize: number;
    count?: number;
}

interface typeDataState {
    listData: any[];
    pagination: typeSearchData;
}
interface typeOptions {
    searchApi: string;
    searchData: typeSearchData;
}

export default function useRefreshList(options: typeOptions, immediate = false) {
    const { searchApi, searchData = {} } = options;
    const loading = ref<boolean>(false);
    const hasMore = ref<boolean>(false);
    const dynamApi = ref<any>(searchApi); // tab切换时动态更新API
    const searchState: typeSearchData = reactive<typeSearchData>({
        searchData,
        currentPage: 1,
        pageSize: 10,
    });
    const dataState: typeDataState = reactive<typeDataState>({
        listData: [],
        pagination: {
            currentPage: 1,
            pageSize: 10,
            count: 0,
        },
    });
    async function fetchList(params: any) {
        params.currentPage = 1; // 查询始终从1开始，也可加参数与loadMore方法合并
        loading.value = true;
        const { currentPage = 1, pageSize = 10, searchData } = params;

        const query = { currentPage, pageSize };
        const newParams = searchData;
        try {
            const res = await dynamApi.value(newParams, query);
            const { data: listData, success } = res;
            if (success) {
                const { nowPage, pageSize, count, data } = listData;
                dataState.listData = data;
                dataState.pagination = Object.assign(dataState.pagination, { nowPage, pageSize, count });
                hasMore.value = dataState.listData.length < count;
            }
        } finally {
            loading.value = false;
        }
    }

    async function loadMore() {
        searchState.currentPage += 1;
        loading.value = true;

        const { currentPage = 1, pageSize = 10, searchData } = searchState;

        const query = { currentPage, pageSize };
        const newParams = searchData;
        try {
            const res = await dynamApi.value(newParams, query);
            const { data: listData, success } = res;
            if (success) {
                const { nowPage, pageSize, count, data } = listData;
                dataState.listData = [...dataState.listData, ...data];
                hasMore.value = dataState.listData.length < count;
                dataState.pagination = Object.assign(dataState.pagination, { nowPage, pageSize, count });
            }
        } finally {
            loading.value = false;
        }
    }

    const refresh = async (callback: () => void) => {
        try {
            await fetchList(searchState);
        } finally {
            callback();
        }
    };
    immediate && fetchList(searchState);
    return {
        fetchList,
        searchState,
        loading,
        hasMore,
        dataState,
        loadMore,
        refresh,
        dynamApi,
    };
}

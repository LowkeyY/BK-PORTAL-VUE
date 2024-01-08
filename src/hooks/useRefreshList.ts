
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
    searchApi: any;
    searchData: typeSearchData;
}
interface Config {
    immediate?: boolean;
    dataKey?: string;
}
const defaultConfig:Config={
    immediate: true,
    dataKey: 'data'
};
export default function useRefreshList(options: typeOptions, config=defaultConfig) {
    const { searchApi, searchData = {} } = options;
    const {immediate=true,dataKey='data'} = config;
    const loading = ref<boolean>(false);
    const hasMoreLoading = ref<boolean>(false);
    const hasMore = ref<boolean>(false);
    const isRefresh = ref<boolean>(false);
    const dynamApi = ref<any>(searchApi); // tab切换时动态更新API
    const otherData = ref<Record<string,any>>({});
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
        const { currentPage = 1, pageSize = 10, searchData ,searchApi:curSearchApi} = params;
        const query = { currentPage, pageSize };
        const newParams = searchData;
        if(curSearchApi){
            dynamApi.value=curSearchApi;
        }
        searchState.searchData=searchData;
        searchState.currentPage=currentPage;
        searchState.pageSize=pageSize;
        try {
            const res =await dynamApi.value(newParams, query);
            const { [dataKey]:listData, success,currentPage, pageSize, count,maxPage,...others } = res;
            if (success) {
                if(currentPage&&pageSize&&count){
                    dataState.pagination = Object.assign(dataState.pagination, { currentPage, pageSize, count,maxPage });
                    hasMore.value = dataState.listData.length < count;
                }
                dataState.listData = listData;
                otherData.value = others;
            }
        } finally {
            loading.value = false;
        }
    }

    async function loadMore() {
        searchState.currentPage += 1;
        hasMoreLoading.value=true;
        const { currentPage = 1, pageSize = 10, searchData } = searchState;
        const query = { currentPage, pageSize };
        const newParams = searchData;
        try {
            const res = await dynamApi?.value(newParams, query);
            const { [dataKey]: listData, success,currentPage:resCurrentPage, pageSize:resPageSize, count,maxPage,...others } = res;
            if (success) {
                dataState.listData = [...dataState.listData, ...listData];
                otherData.value = others;
                hasMore.value = dataState.listData.length < count;
                dataState.pagination = Object.assign(dataState.pagination, { resCurrentPage, resPageSize, count,maxPage });
            }
        } finally {
            hasMoreLoading.value = false;
        }
    }

    const refresh = async (callback: () => void) => {
        isRefresh.value=true;
        try {
            await fetchList(searchState);
        } finally {
            callback();
            isRefresh.value=false;
        }
    };
    immediate && fetchList(searchState);
    return {
        fetchList,
        searchState,
        loading,
        hasMoreLoading,
        hasMore,
        dataState,
        loadMore,
        refresh,
        isRefresh,
        dynamApi,
        otherData,
    };
}

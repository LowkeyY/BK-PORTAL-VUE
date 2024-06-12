import {defineStore} from 'pinia';
import { Toast} from '@/utils/uniapi/prompt';
import {ErrorPrompt} from '@/enums/appEnum';
import {queryChoiceParams} from '@/services/model/resource';
import {queryChoiceApi} from '@/services/choice';

interface ChoiceState {
    choiceData: Record<string, any>;
    choiceLoading: boolean;
}

export const useChoiceStore = defineStore({
    id: 'choice',
    state: (): ChoiceState => ({
        choiceData: {},
        choiceLoading: false,
    }),
    getters: {
    },
    actions: {
        async queryChoice(params: queryChoiceParams): Promise<any> {
            try {
                this.choiceLoading = true;
                const res = await queryChoiceApi(params);
                if (res.success) {
                    this.choiceData = res.data;
                } else {
                    Toast(res.message || ErrorPrompt.RESOURCE_ERROR);
                }

            } finally {
                this.choiceLoading = false;
                uni.stopPullDownRefresh();
            }
        }
    },
});

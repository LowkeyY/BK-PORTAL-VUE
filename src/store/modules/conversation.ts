import {defineStore} from 'pinia';
import { Toast} from '@/utils/uniapi/prompt';
import {ErrorPrompt} from '@/enums/appEnum';
import { getConversationApi, sendConversationApi } from '@/services/message';

interface ConversationState {
  conversationData: Record<string, any>;
  conversationLoading: boolean;
  sendConversationLoading: boolean;
}

export const useConversationStore = defineStore({
    id: 'conversation',
    state: (): ConversationState => ({
        conversationData: {},
        conversationLoading: false,
        sendConversationLoading: false,
    }),
    getters: {
    },
    actions: {
        async queryConversation(params: MessageConversationParams): Promise<any> {
            try {
                this.conversationLoading = true;
                const res = await getConversationApi(params);
                if (res.success) {
                    this.conversationData = res.data.reverse();
                    console.log(this.conversationData,'this.conversationData');
                } else {
                    Toast(res.message || ErrorPrompt.RESOURCE_ERROR);
                }

            } finally {
                this.conversationLoading = false;
            }
        },
        async sendConversation(params: any): Promise<any> {
            try {
                this.sendConversationLoading = true;
                const res = await sendConversationApi(params);
                if (res.success) {
                    console.log(res);
                } else {
                    Toast(res.message || ErrorPrompt.RESOURCE_ERROR);
                }

            } finally {
                this.sendConversationLoading = false;
            }
        }
    },
});

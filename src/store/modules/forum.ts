import { defineStore } from 'pinia';
import { addForumApi, postAddApi, queryForumApi, queryForumCommentsApi } from '@/services/forum';
import { Toast } from '@/utils/uniapi/prompt';
import {forumDataParmas, forumDetailParams, forumParams} from '@/services/model/resource';

interface UserState {
    forumData: Record<string, any>;
    forumDetailData: Record<string, any>;
    posts: any[];
    parent: Record<string, any>;
    replyList: any[];
    loading: boolean;
    detailLoading: boolean;
    saveLoading: boolean;
    submitLoading: boolean;
    refreshing: boolean;
}

const getShowList = (nodeId: any, map: any, index = 0, counts: any = {}, num = 0) => {
    const result = map[nodeId];
    counts[nodeId] = 0;
    result.level = index;
    result.num = num;
    num++;
    index++;
    Object.keys(counts).map((k) => {
        counts[k] = ++counts[k];
    });
    if (result && result.children && result.children.length) {
        result.children = result.children.map((nId: any) => getShowList(nId, map, index, counts, num++));
    }
    result.totalCounts = counts[nodeId];
    return result;
};
export const useForumStore = defineStore({
    id: 'forum',
    state: (): UserState => ({
        forumData: {},
        forumDetailData: {},
        posts: [],
        parent: {},
        loading: false,
        detailLoading: false,
        saveLoading: false,
        submitLoading: false,
        replyList: [],
        refreshing: false,
    }),
    actions: {
        async queryForumCourse(params: forumParams): Promise<any> {
            this.loading = true;
            try {
                const res = await queryForumApi(params);
                if (res.success) {
                    this.forumData = res;
                } else {
                    Toast('请稍后再试');
                }
            } catch (err: any) {
                return Promise.reject(err);
            } finally {
                this.loading = false;
            }
        },
        async queryForumComments(params: forumDetailParams): Promise<any> {
            this.detailLoading=true;
            try {
                const res = await queryForumCommentsApi(params);
                const {
                    success,
                    message = '请稍后再试',
                    posts = [],
                    ratinginfo: { ratings = [] },
                } = res;
                if (success) {
                    this.forumDetailData = res;
                    const postNodes: any = {};
                    const ratingNodes: any = {};
                    let parentNode = { children: [] };
                    ratings.map((rating: Record<string, any>) => {
                        const { itemid, ...others } = rating;
                        ratingNodes[itemid] = others;
                    });
                    posts.map((post: Record<string, any>) => {
                        const postId = post.id;
                        postNodes[postId] = Object.assign(post, ratingNodes[postId] || {});
                        if (post.parent === 0) {
                            parentNode = postNodes[postId];
                        }
                    });
                    this.posts = posts;
                    this.parent = parentNode;
                    this.replyList =
                        parentNode.children && parentNode.children.length ? parentNode.children.map((nodeId) => getShowList(nodeId, postNodes)) : [];
                } else {
                    Toast(message || '评论数据加载失败');
                }
            } catch (err: any) {
                return Promise.reject(err);
            }finally {
                this.detailLoading=false;
                uni.stopPullDownRefresh();
            }
        },
        async addForum(data: forumDataParmas, callback: Function): Promise<any> {
            this.submitLoading = true;
            try {
                const res = await addForumApi(data);
                if (res.success && !res.data) {
                    callback && callback();
                    Toast('保存成功');
                } else {
                    Toast(res.message||'保存失败');
                }
            } catch (err: any) {
                return Promise.reject(err);
            } finally {
                this.submitLoading = false;
            }
        },
        async addPost(data: forumDataParmas, callback: Function): Promise<any> {
            this.submitLoading = true;
            try {
                const res = await postAddApi(data);
                if (res.success && !res.data) {
                    callback && callback();
                    Toast('保存成功');
                } else {
                    Toast(res.message||'保存失败');
                }
            } catch (err: any) {
                return Promise.reject(err);
            } finally {
                this.submitLoading = false;
            }
        },
    },
});

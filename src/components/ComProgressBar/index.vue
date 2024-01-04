<template>
    <view ref="elePBar" class="com-progress-bar" :style="style">
        <view
            :class="['com-progress-bar-wrapper', ...barMode]"
            :style="wrapperStyle"
        >
            <view class="com-progress-bar-bar" :style="barStyle">
                <view class="com-progress-bar-inside"></view>
            </view>
            <view v-if="!disableValue" class="com-progress-bar-value">
                {{
                    valueStr
                }}
            </view>
        </view>
    </view>
</template>

<script>
// #ifndef H5
// 获取元素宽
const _getWidth = (query, selector) => {
    return new Promise((resolve, reject) => {
        query
            .select(selector)
            .fields({ size: true })
            .exec((rst) => {
                if (!rst) return resolve(0);
                if (!rst[0]) return resolve(0);
                const size = rst.pop();
                resolve(size.width);
            });
    });
};
// #endif

export default {
    name: 'ComProgressBar',

    props: {
        /**
         * 宽度
         *
         * 默认：100%
         */
        width: [String, Number],

        height: {
            type: Number,
            default: 12,
        },

        /**
         * 进度
         *
         * 默认：0
         */
        value: Number,

        /**
         * 不显示值
         */
        disableValue: Boolean,

        unit: {
            type: String,
            default: '%',
        },

        /**
         * 样式
         *
         * left, inside-left
         * center, inside-center
         * right, inside-right
         * outside-left
         * outside-right
         * follow-left
         * follow-right
         */
        type: {
            type: String,
            default: 'right',
            validator: () => true,
        },

        /**
         * 圆角
         */
        rounded: {
            type: Boolean,
            default: true,
        },

        /**
         * 文字颜色
         */
        color: {
            type: [String, Array],
            default: '#333',
        },

        /**
         * 开启反色
         */
        invertColor: Boolean,

        /**
         * 颜色纹理
         */
        texture: {
            type: [String, Array],
            default: undefined,
            validator: () => true,
        },

        /**
         * 预设模式
         */
        preset: String,
    },

    data() {
        return {
            valuePosFix: 0,
        };
    },

    computed: {
        valueFixed() {
            if (this.value < -1) return -1;
            if (this.value > 1) return 1;
            return this.value;
        },

        textureLib() {
            let texture;
            if (typeof this.texture === 'string') {
                texture = [this.texture, 'transparent'];
            } else if (this.texture) {
                texture = [...this.texture];
            } else {
                texture = ['#4cd964', '#FAFAFA'];
            }
            return texture;
        },

        style() {
            const style = {};
            if (this.width) {
                style.width =
                    typeof this.width === 'string' ? this.width : `${this.width}px`;
            }
            return Object.keys(style)
                .map((key) => `${key}:${style[key]}`)
                .join(';');
        },

        wrapperStyle() {
            const style = {
                height: `${this.height}px`,
            };

            const fontSize = this.height > 14 ? this.height - 4 : 10;
            style['font-size'] = `${fontSize}px`;
            style['--com-progress-bar-color'] = this.color;

            style['--com-progress-bar-value'] = `${this.valueFixed * 100}%`;
            let fixedPos = this.valueFixed * 100;
            if (this.type === 'follow-left' && this.valuePosFix > fixedPos) {
                fixedPos = this.valuePosFix;
            } else if (this.type === 'follow-right') {
                const pos = 100 - this.valuePosFix;
                if (fixedPos > pos) {
                    fixedPos = pos;
                }
            }
            style['--com-progress-bar-value-fixed'] = `${fixedPos}%`;
            style['--com-progress-bar-fg'] = this.textureLib[0];
            style['--com-progress-bar-bg'] = this.textureLib[1];
            style['--com-progress-bar-radius'] = this.rounded
                ? `${this.height / 2}px`
                : '0';

            style['--com-progress-bar-invert'] = this.invertColor
                ? 'difference'
                : 'none';

            return Object.keys(style)
                .map((key) => `${key}:${style[key]}`)
                .join(';');
        },

        barStyle() {
            const style = {
                height:
                    typeof this.height === 'string' ? this.height : `${this.height}px`,
            };

            return Object.keys(style)
                .map((key) => `${key}:${style[key]}`)
                .join(';');
        },

        barMode() {
            const type = this.type.replace(/inside-/, '');
            return [type, this.rounded && 'rounded'];
        },

        valueStr() {
            const val = Math.floor((this.valueFixed || 0) * 1000) / 10;
            return `${val}${this.unit}`;
        },
    },

    watch: {
        value() {
            this.$nextTick(() => {
                this.fixValuePosition();
            });
        },
    },

    mounted() {
        this.fixValuePosition();
    },

    methods: {
        /**
         * 修复 follow- 模式下文字的位置
         */
        fixValuePosition() {
            if (this.disableValue) return;

            // #ifndef H5
            const query = uni.createSelectorQuery().in(this);
            Promise.all([
                _getWidth(query, '.com-progress-bar-bar'),
                _getWidth(query, '.com-progress-bar-value'),
            ]).then((resp) => {
                if (!resp[0] || !resp[1]) return;
                this.valuePosFix = ((resp[1] + 8) / resp[0]) * 100;
            });
            // #endif

            // #ifdef H5
            const dom = this.$refs.elePBar.$el;
            if (!dom) return;
            const bar = dom.querySelector('.com-progress-bar-bar');
            const val = dom.querySelector('.com-progress-bar-value');
            const barWidthPx = bar.getBoundingClientRect().width;
            const valueWidthPx = val.getBoundingClientRect().width;
            this.valuePosFix = (valueWidthPx / barWidthPx) * 100;
            // #endif
        },
    },
};
</script>

<style scoped lang="scss">
.com-progress-bar {
  position: relative;
  width: 100%;
  margin: 4px 0;
}
.com-progress-bar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.com-progress-bar-bar {
  width: 100%;
  background: var(--com-progress-bar-bg, 'transparent');
}
.com-progress-bar-inside {
  height: 100%;
  width: var(--com-progress-bar-value, 0);
  background: var(--com-progress-bar-fg, --com-progress-bar-fg-def);
}
.com-progress-bar-bar,
.com-progress-bar-inside,
.com-progress-bar-value {
  transition: all 0.1s ease-in-out;
  background-size: auto 100%;
}
.com-progress-bar-value {
  color: var(--com-progress-bar-color);
  mix-blend-mode: var(--com-progress-bar-invert, none);
}
.rounded {
  .com-progress-bar-bar,
  .com-progress-bar-inside {
    border-radius: var(--com-progress-bar-radius, 0);
    overflow: hidden;
  }
}
.left,
.inside-left {
  .com-progress-bar-value {
    position: absolute;
    padding: 0 4px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
.center,
.inside-center {
  .com-progress-bar-value {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.right,
.inside-right {
  .com-progress-bar-value {
    position: absolute;
    padding: 0 4px;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
.outside-left {
  flex-direction: row-reverse;
  .com-progress-bar-value {
    margin-right: 4px;
  }
}
.outside-right {
  .com-progress-bar-value {
    margin-left: 4px;
  }
}
.follow-left {
  .com-progress-bar-value {
    position: absolute;
    top: 50%;
    left: var(--com-progress-bar-value-fixed);
    transform: translate(-100%, -50%);
    padding: 0 4px;
  }
}
.follow-right {
  .com-progress-bar-value {
    position: absolute;
    top: 50%;
    left: var(--com-progress-bar-value-fixed);
    transform: translate(0, -50%);
    padding: 0 4px;
  }
}
</style>

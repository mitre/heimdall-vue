<template>
    <div class="vx-card__code-container" ref="codeContainer" v-show="this.$slots.codeContainer" :style="codeContainerStyles" :class="{collapsed: !showCode}">
        <div class="code-content">
            <prism class="line-number" :language="codeLanguage" >
                <slot name="codeContainer"></slot>
            </prism>
        </div>
    </div>
</template>

<script>
import Prism from 'vue-prism-component'

export default {
    props: {
        codeLanguage: {
            default: "markup",
            type: String,
        },
    },
    components: {
        Prism,
    }
}
</script>
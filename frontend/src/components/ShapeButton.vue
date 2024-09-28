<template>

    <input type="radio" :id="id" :value="title" class="btn-check" name="tools" v-model="value">
    <label :for="id" :title="title" class="col btn btn-light">{{ symbol }}</label>
</template>
<script>
export default {
    props: {
        id: String,
        symbol: String,
        title: String,
        modelValue: String,
    },
    emits: ['update:modelValue'],
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    }
}
</script>
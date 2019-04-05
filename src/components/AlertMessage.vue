<template lang='pug'>
  .message-alert
    .alert.alert-dismissible(:class="'alert-' + item.status", v-for='(item, i) in messages', :key='i')
      | {{ item.message }}
      button.close(type='button', @click='removeMessage(i)', aria-label='Close')
        span(aria-hidden='true') ×
</template>

<script>
export default {
    name: "Navbar",
    data() {
        return {
            messages: [{
                message: '訊息內容',
                status: 'danger',
                timestamp: 123
            }]
        };
    },
    methods: {
        updateMessage(message, status) {
            const timestamp = Math.floor(new Date() / 1000);
            this.messages.push({
                message,
                status,
                timestamp
            });
            this.removeMessageWithTiming(timestamp);
        },
        removeMessage(num) {
            this.messages.splice(num, 1);
        },
        removeMessageWithTiming(timestamp) {
            const vm = this;
            setTimeout(() => {
                vm.messages.forEach((item, i) => {
                    if (item.timestamp === timestamp) {
                        vm.messages.splice(i, 1);
                    }
                });
            }, 5000);
        }
    },
    created() {
        const vm = this;

        // 自定義名稱 'messsage:push'
        // message: 傳入參數
        // status: bootstrap樣式，預設值為 warning
        // vm.$bus.$on("messsage:push", (message, status = "warning") => {
        //     vm.updateMessage(message, status);
        // });
        // 使用方法
        // vm.$bus.$emit('message:push', message, status);
    },
};
</script>

<style scope>
.message-alert {
    position: fixed;
    max-width: 50%;
    top: 56px;
    right: 20px;
    z-index: 1100;
}
</style>
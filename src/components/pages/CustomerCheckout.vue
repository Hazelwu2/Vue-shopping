<template lang="pug">
div
    .my-5.row.justify-content-center
        form.col-md-6(@submit.prevent='payOrder')
            table.table
                thead
                    tr
                        th 品名
                        th 數量
                        th 單價
                tbody
                    tr(v-for='item in order.products', :key='item.id')
                        td.align-middle {{ item.product.title }}
                        td.align-middle {{ item.qty }}/{{ item.product.unit }}
                        td.align-middle.text-right {{ item.final_total }}
                tfoot
                    tr
                        td.text-right(colspan='2') 總計
                        td.text-right {{ order.total }}
            table.table
                tbody
                    tr
                        th(width='100') Email
                        td {{ order.user.email }}
                    tr
                        th 姓名
                        td {{ order.user.name }}
                    tr
                        th 收件人電話
                        td {{ order.user.tel }}
                    tr
                        th 收件人地址
                        td {{ order.user.address }}
                    tr
                        th 付款狀態
                        td
                            span(v-if='!order.is_paid') 尚未付款
                            span.text-success(v-else='') 付款完成
            .text-right(v-if='order.is_paid === false')
                button.btn.btn-danger(@click="payOrder()") 確認付款去

</template>

<script>
export default {
    data() {
        return {
            orderId: "",
            order: {
                user: {}
            }
        };
    },
    created() {
        this.orderId = this.$route.params.orderId;
        this.getOrder();
    },
    methods: {
        getOrder() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/order/${vm.orderId}`;

            vm.isLoading = true;
            this.$http.get(api).then(response => {
                if (response.data.success) {
                    console.log(response.data.order);
                    vm.order = response.data.order;
                    vm.isLoading = false;
                } else {
                    console.log("有錯誤");
                    vm.isLoading = false;
                }
            });
        },
        payOrder() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/pay/${vm.orderId}`;

            vm.isLoading = true;
            this.$http.post(api).then(response => {
                console.log(response.data);
                if (response.data.success) {
                    console.log(response.data);
                    vm.getOrder();
                    this.$bus.$emit(
                        "messsage:push",
                        response.data,
                        "danger"
                    );
                } else {
                    console.log("有錯誤");
                }
                vm.isLoading = false;
            });
        }
    }
};
</script>

<style>
</style>

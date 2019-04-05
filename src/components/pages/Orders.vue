<template lang='pug'>
div
    h1 Order
    loading(:active.sync='isLoading')
    table.table.mt-4
        thead
        tr
            th 購買時間
            th Email
            th 購買款項
            th 應付金額
            th 是否付款
        tbody
            tr(v-for="order in orders", :key="order")
                td {{order.paid_date}}
                td {{order.user.email}}
                td {{order.products}}
                td {{order.is_paid}}
    // pagination(:pages="pagination", @getPage="getOrders")
</template>

<script>
import $ from "jquery";
import pagination from '../Pagination.vue'

export default {
    components: {
        pagination
    },
    data(){
        return {
            pagination: {},
            isLoading: false,
            orders: {},
            pagination: {},
            messages: {}
        }
    },
    methods: {
        getOrders(page = 1){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
            // /api/:api_path/admin/orders?page=:page
            vm.isLoading = true;

            this.$http
            .get(api)
            .then(response => {
                console.log('getOrders');
                console.log(response);
                vm.isLoading = false;
                vm.orders = response.data.orders;
                vm.pagination = response.data.pagination;
                vm.messages = {};
            })
        }
    },
    created(){
        this.getOrders();
    }
}
</script>
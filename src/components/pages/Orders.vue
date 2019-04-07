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
            tr(v-for="(item, key) in sortOrder", :key="key", v-if="orders.length", :class="{'text-secondary': !item.is_paid}")
                td {{item.create_at | date}}
                td 
                    span(v-if="item.user", v-text="item.user.email") {{item.user.email}}
                td
                    ul.list-unstyled
                        li(v-for="(product, i) in item.products", :key="i")
                            | {{product.product.title}} 數量：{{product.qty}}
                            | {{product.product.unit}}
                td {{item.total | currency }}
                td 
                    strong.text-success(v-if="item.is_paid") 已付款
                    span.text-muted(v-else) 尚未付款
    pagination(:pages="pagination", @getPage="getOrders")
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
            vm.isLoading = true;

            this.$http
                .get(api)
                .then(response => {
                    console.log('getOrders', response);
                    vm.orders = response.data.orders;
                    vm.pagination = response.data.pagination;
                    vm.isLoading = false;
                })
        }
    },
    computed: {
        sortOrder(){
            const vm = this;
            let newOrder = [];
            if (vm.orders.length) {
                newOrder = vm.orders.sort((a, b) => {
                    const aIsPaid = a.is_paid ? 1 : 0;
                    const bIsPaid = b.is_paid ? 1 : 0;
                    console.log('aIsPaid', aIsPaid);
                    console.log('bIsPaid', bIsPaid);
                    return bIsPaid - aIsPaid;
                });
            }
            return newOrder;
        }
    },
    created(){
        this.getOrders();
    }
}
</script>
<template lang='pug'>
div
    loading(:active.sync="isLoading")
    .row.mt-4
        .col-md-4.mb-4(v-for="item in products", :key="item.id")
            .card.border-0.shadow-sm
                div(style='height:200px; width: 200px;background-size: cover; background-position: center', :style="{backgroundImage: `url(${item.imageUrl})`}")
                div
                    .card-body
                        span.badge.badge-secondary.float-right.ml-2 {{item.category}}
                        h5.card-title
                            a.text-dark(href='#') {{item.title}}
                        p.card-text {{item.content}}
                        .d-flex.justify-content-between.align-items-baseline
                            .h5(v-if="!item.price") {{item.price}}
                            del.h6(v-if="item.price") 原價 {{item.origin_price}} 元
                            .h5(v-if="item.price") 現在只要 {{item.price}} 元
                        .card-footer.d-flex
                        button.btn.btn-outline-secondary.btn-sm(type='button')
                            i.fas.fa-spinner.fa-spin 
                            | 查看更多
                        button.btn.btn-outline-danger.btn-sm.ml-auto(type='button')
                            i.fas.fa-spinner.fa-spin 
                            | 加到購物車

</template>

<script>
import $ from "jquery";
import pagination from "../Pagination.vue";
export default {
    components: {
        pagination
    },
    data() {
        return {
            products: [],
            isLoading: false,
            pagination: {}
        };
    },
    methods: {
        getCustomerOrder(page = 1) {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/products?page=${page}`;
            vm.isLoading = true;
            this.$http.get(api).then(response => {
                console.log(response.data);
                vm.isLoading = false;
                vm.products = response.data.products;
                vm.pagination = response.data.pagination;
            });
        }
    },
    created() {
        this.getCustomerOrder();
    }
};
</script>
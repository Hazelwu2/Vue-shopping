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
                        button.btn.btn-outline-secondary.btn-sm(type='button', @click="getProduct(item.id)")
                            i.fas.fa-spinner.fa-spin(v-if="status.loadingItem === item.id")
                            | 查看更多
                        button.btn.btn-outline-danger.btn-sm.ml-auto(type='button')
                            i.fas.fa-spinner.fa-spin(v-if="status.loadingItem === item.id")
                            | 加到購物車
    pagination(:pages="pagination", @getPage="getProducts")
    // 查看單一產品 Modal
    #productModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true')
        .modal-dialog.modal-lg(role='document')
            .modal-content.border-0
                .modal-header.bg-dark.text-white 
                    h5#exampleModalLabel.modal-title {{product.title}}
                    button.close(type='button', data-dismiss='modal', aria-label='Close')
                    span(aria-hidden='true') ×
                .modal-body
                    img.img-fluid(:src="product.imageUrl")
                    blockquote.blockquote.mt-3
                        p.mb-0 {{product.content}}
                        footer.blockquote-footertext-right {{product.description}}
                    .d-flex.justify-content-between.align-items-baseline
                        .h4(v-if="!product.price") {{product.origin_price }} 元
                        del.h6(v-if="product.price") 原價 {{product.origin_price }} 元
                        .h4(v-if="product.price") 現在只要 {{product.price }} 元
                    select.form-control.mt-3(v-model="product.num")
                        option(value="1") 選購 1 件
                .modal-footer
                    .text-muted.text-nowrap.mr-3
                        | 小計
                        strong {{product.num * product.price }} 元
                    button.btn.btn-primary(type='button') 加到購物車

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
            product: {},
            isLoading: false,
            pagination: {},
            status: {
                loadingItem: '', // 存放產品 id
            }
        };
    },
    methods: {
        getProducts(page = 1) {
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
                console.log(vm.pagination)
            });
        },
        getProduct(id) { // 取得單一產品
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/product/${id}`;
            vm.status.loadingItem = id;
            this.$http.get(api).then(response => {
                console.log(response.data);
                vm.status.loadingItem = '';
                vm.product = response.data.product;
                $('#productModal').modal('show');
            });
        }
    },
    created() {
        this.getProducts();
    }
};
</script>
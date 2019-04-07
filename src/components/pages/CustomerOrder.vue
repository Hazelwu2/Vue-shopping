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
                        button.btn.btn-outline-danger.btn-sm.ml-auto(type='button', @click="addToCart(item.id)")
                            i.fas.fa-spinner.fa-spin(v-if="status.loadingItem === item.id")
                            | 加到購物車
    table.table
        thead
            tr
            th
            th 品名
            th 數量
            th 單價
        tbody
            tr(v-for='item in cart.carts')
                td.align-middle
                    button.btn.btn-outline-danger.btn-sm(type='button', @click="removeCartItem(item.id)")
                        i.far.fa-trash-alt
                td.align-middle
                    | {{ item.product.title }}
                    .text-success(v-if="item.coupon") 已套用優惠券
                td.align-middle {{ item.qty }}/{{ item.product.unit }}
                td.align-middle.text-right {{ item.final_total }}
        tfoot
            tr
            td.text-right(colspan='3') 總計
            td.text-right {{ cart.total }}
            tr(v-if="cart.final_total !== cart.total")
                td.text-right.text-success(colspan='3') 折扣價
                td.text-right.text-success {{ cart.final_total }}
        .input-group.mb-3.input-group-sm
            input.form-control(type='text', placeholder='請輸入優惠碼', v-model="coupon_code")
            .input-group-append
                button.btn.btn-outline-secondary(type='button', @click="addCouponCode()") 
                    | 套用優惠碼

    // 建立訂單
    .my-5.row.justify-content-center
        form.col-md-6(@submit.prevent="createOrder()")
            .form-group
                label(for='useremail') Email
                input#useremail.form-control(type='email', name='email', v-model='form.user.email', placeholder='請輸入 Email', v-validate="'required|email'")
                span.text-danger(v-if="errors.has('email')") {{ errors.first('email') }}

            .form-group
                label(for='username') 收件人姓名
                input#username.form-control(type='text', name='name', v-model='form.user.name', placeholder='輸入姓名', v-validate="'required'", :class="{'is-invalid': errors.has('name')}")
                span.text-danger(v-if="errors.has('name')") 姓名為必填
            .form-group
                label(for='usertel') 收件人電話
                input#usertel.form-control(name='tel', type='tel', v-model='form.user.tel', placeholder='請輸入電話', v-validate="'required'")
                span.text-danger(v-if="errors.has('tel')") 手機為必填，取件用
            .form-group
                label(for='useraddress') 收件人地址
                input#useraddress.form-control(type='text', name='address', v-model='form.user.address', placeholder='請輸入地址', v-validate="'required'")
                span.text-danger(v-if="errors.has('address')") 地址為必填，司機不知道地址不知道怎麼送過去捏
            .form-group
                label(for='comment') 留言
                textarea#comment.form-control(name='', cols='30', rows='10', v-model='form.message')
            .text-right
                button.btn.btn-danger(@click="createOrder()") 送出訂單

    // 換頁
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
                        option(:value="num", v-for="num in 10", :key="num") 選購 {{num}} {{product.unit}}
                .modal-footer
                    .text-muted.text-nowrap.mr-3
                        | 小計
                        strong {{product.num * product.price }} 元
                    button.btn.btn-primary(type='button', @click="addToCart(product.id, product.num)") 加到購物車

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
                loadingItem: "" // 存放產品 id
            },
            cart: {},
            coupon_code: "",
            form: {
                user: {
                    name: "",
                    email: "",
                    tel: "",
                    address: ""
                },
                message: ""
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
            });
        },
        getProduct(id) {
            // 取得單一產品
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/product/${id}`;
            vm.status.loadingItem = id;
            this.$http.get(api).then(response => {
                console.log(response.data);
                vm.status.loadingItem = "";
                vm.product = response.data.product;
                $("#productModal").modal("show");
            });
        },
        addToCart(id, qty = 1) {
            // id 商品id , qty 商品數量
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/cart`;
            const cart = {
                product_id: id,
                qty
            };
            vm.status.loadingItem = id;

            this.$http.post(api, { data: cart }).then(response => {
                console.log(response.data);
                vm.status.loadingItem = "";
                vm.getCart();
                $("#productModal").modal("hide");
            });
        },
        getCart() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/cart`;
            vm.isLoading = true;
            this.$http.get(api).then(response => {
                vm.isLoading = false;
                console.log(response);
                vm.cart = response.data.data;
            });
        },
        removeCartItem(id) {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/cart/${id}`;
            vm.isLoading = true;
            this.$http.delete(api).then(response => {
                this.getCart();
                vm.isLoading = false;
            });
        },
        addCouponCode() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/coupon`;
            const coupon = {
                code: vm.coupon_code
            };
            vm.isLoading = true;
            this.$http.post(api, { data: coupon }).then(response => {
                console.log(response);
                this.getCart();
                vm.isLoading = false;
            });
        },
        createOrder() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/order`;
            const order = vm.form;
            vm.isLoading = true;
            this.$validator.validate().then(valid => {
                if (valid) {
                    this.$http.post(api, { data: order }).then(response => {
                        console.log("訂單已建立", response);
                        vm.isLoading = false;
                        if (response.data.success) {
                            vm.$router.push(`/customer_checkout/${response.data.orderId}`);
                        }
                    });
                } else {
                    console.log('欄位不完整');
                    vm.isLoading = false;
                }
            });
        }
    },
    created() {
        this.getProducts();
        this.getCart();
    }
};
</script>
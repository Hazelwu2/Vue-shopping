<template lang='pug'>
div
    loading(:active.sync="isLoading")
    .text-right.mt-4
        button.btn.btn-outline-primary(@click='openModal(true)') 建立折價券
    table.table.mt-4
        thead
        tr
            th 折價卷名稱
            th 折扣百分比
            th 到期日
            th 是否啟用
            th 編輯
        tbody
            tr(v-for='(item) in coupons', :key="item")
                td {{item.title}}
                td {{item.percent}} %
                td {{item.due_date}}
                td {{item.is_enabled}}
                td
                    button.btn.btn-outline-primary.btn-sm(@click="openModal(false)") 編輯
                    button.btn.btn-outline-danger.btn-sm 刪除
    // Modal
    #couponsModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='couponsModalLabel', aria-hidden='true')
        .modal-dialog(role='document')
            .modal-content
                .modal-header
                    h5#couponsModalLabel.modal-title 新增優惠券
                    button.close(type='button', data-dismiss='modal', aria-label='Close')
                    span(aria-hidden='true') ×
                .modal-body
                    form
                    .form-group
                        label.col-form-label(for='couponTitle') 優惠券名稱
                        input#couponTitle.form-control(type='text', v-model="tempCoupon.title", placeholder="請輸入優惠碼")
                    .form-group
                        label.col-form-label(for='couponID') 優惠碼
                        input#couponID.form-control(type='text', v-model="tempCoupon.code")
                    .form-group
                        label.col-form-label(for='dueDate') 到期日
                        input#dueDate.form-control(type='date', v-model="due_date")
                    .form-group
                        label.col-form-label(for='precent') 折扣百分比
                        input#precent.form-control(type='number', v-model="tempCoupon.percent", placeholder="請輸入折扣百分比")
                    .form-check
                        input#is_enabled.form-check-input(type='checkbox', v-model='tempCoupon.is_enabled', :true-value='1', :false-value='0')
                        label.form-check-label(for='is_enabled') 是否啟用
                .modal-footer
                    button.btn.btn-secondary(type='button', data-dismiss='modal') 關閉
                    button.btn.btn-primary(type='button', @click="updateCoupon") 更新優惠券

    // pagination(:pages="pagination", @getPage="getCoupons")
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
            pagination: {},
            isLoading: false,
            coupons: {},
            messages: {},
            tempCoupon: {
                title: "",
                is_enabled: 0,
                percent: 100,
                due_date: 0,
                code: ""
            },
            due_date: new Date(),
            isNew: false,
        };
    },
    methods: {
        getCoupons(page = 1) {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/admin/coupons?page=${page}`;
            // /api/:api_path/admin/coupons?page=:page
            vm.isLoading = true;

            this.$http.get(api).then(response => {
                console.log("getCoupons");
                console.log(response);
                vm.isLoading = false;
                vm.coupons = response.data.coupons;
                vm.pagination = response.data.pagination;
            });
        },
        openModal(isNew, item) {
            if (isNew) {
                this.tempCoupon = {};
                this.isNew = true;
            } else {
                this.tempCoupon = Object.assign({}, item);
                this.isNew = false;
            }
            $("#couponsModal").modal("show");
        },
        updateCoupon() {
            const vm = this;
            if (vm.isNew) {
                const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
                // /api/:api_path/admin/coupon
                console.log(vm.tempCoupons);
                vm.isLoading = true;
                this.$http
                    .post(url, { data: vm.tempCoupons })
                    .then(response => {
                        console.log("updateCoupon");
                        console.log(response);

                        $("#couponsModal").modal("hide");
                        this.getCoupons();
                        vm.isLoading = false;
                    });
            } else {
                const url = `${process.env.APIPATH}/api/${
                    process.env.CUSTOMPATH
                }/admin/coupon/${vm.tempCoupon.id}`;
                vm.due_date = new Date(vm.tempCoupon.due_date * 1000);
                console.log("vm.due_date", vm.due_date);
                this.http.put(url, { data: vm.tempCoupon }).then(response => {
                    console.log(response);
                    $("#couponsModal").modal("hide");
                    this.getCoupons();
                    vm.isLoading = false;
                });
                // /api/:api_path/admin/coupon/:id
            }
        }
    },
    created() {
        this.getCoupons();
    }
};
</script>
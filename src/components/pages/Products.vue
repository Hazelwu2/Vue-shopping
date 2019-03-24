<template lang='pug'>
div
  loading(:active.sync="isLoading")
  .text-right.mt-4
    button.btn.btn-outline-primary(@click='openModal(true)') 建立新的產品
  table.table.mt-4
    thead
      tr
        th(width='120') 分類
        th 產品名稱
        th(width='120') 原價
        th(width='120') 售價
        th(width='100') 是否啟用
        th(width='80') 編輯
    tbody
      tr(v-for='(item) in products', :key='item.id')
        td {{item.category}}
        td {{item.title}}
        td.text-right {{item.origin_price}}$
        td.text-right {{item.price}}$
        td
          span.text-success(v-if='item.is_enabled') 啟用
          span(v-else='') 未啟用
        td
          button.btn.btn-outline-primary.btn-sm(@click='openModal(false, item)') 編輯
          button.btn.btn-outline-danger.btn-sm(@click='showModal(item)') 刪除
  #productModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true', @keyup.esc='hideModal')
    .modal-dialog.modal-lg(role='document')
      .modal-content.border-0
        .modal-header.bg-dark.text-white
          h5#exampleModalLabel.modal-title
            span 新增產品
          button.close(type='button', data-dismiss='modal', aria-label='Close')
            span(aria-hidden='true') ×
        .modal-body
          .row
            .col-sm-4
              .form-group
                label(for='image') 輸入圖片網址
                input#image.form-control(type='text', placeholder='請輸入圖片連結', v-model='tempProduct.imageUrl')
              .form-group
                label(for='customFile')
                  | 或 上傳圖片
                  i.fas.fa-spinner.fa-spin(v-if='status.fileUploading')
                input#customFile.form-control(type='file', ref='files', @change='uploadFile')
              img.img-fluid(img='https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80', alt='', :src="tempProduct.imageUrl")
            .col-sm-8
              .form-group
                label(for='title') 標題
                input#title.form-control(type='text', placeholder='請輸入標題', v-model='tempProduct.title')
              .form-row
                .form-group.col-md-6
                  label(for='category') 分類
                  input#category.form-control(type='text', placeholder='請輸入分類', v-model='tempProduct.category')
                .form-group.col-md-6
                  label(for='price') 單位
                  input#unit.form-control(type='unit', placeholder='請輸入單位', v-model='tempProduct.unit')
              .form-row
                .form-group.col-md-6
                  label(for='origin_price') 原價
                  input#origin_price.form-control(type='number', placeholder='請輸入原價', v-model='tempProduct.origin_price')
                .form-group.col-md-6
                  label(for='price') 售價
                  input#price.form-control(type='number', placeholder='請輸入售價', v-model='tempProduct.price')
              hr
              .form-group
                label(for='description') 產品描述
                textarea#description.form-control(type='text', placeholder='請輸入產品描述', v-model='tempProduct.description')
              .form-group
                label(for='content') 說明內容
                textarea#content.form-control(type='text', placeholder='請輸入產品說明內容', v-model='tempProduct.content')
              .form-group
                .form-check
                  input#is_enabled.form-check-input(type='checkbox', v-model='tempProduct.is_enabled' :true-value='1', :false-value='0')
                  label.form-check-label(for='is_enabled')
                    | 是否啟用
        .modal-footer
          button.btn.btn-outline-secondary(type='button', data-dismiss='modal') 取消
          button.btn.btn-primary(type='button', @click='updateProduct') 確認
  

  #delProductModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true', @keyup.esc='hideModal', @click='hideModal')
    .modal-dialog(role='document')
      .modal-content.border-0
        .modal-header.bg-danger.text-white
          h5#exampleModalLabel.modal-title
            span 刪除產品
          button.close(type='button', data-dismiss='modal', aria-label='Close')
            span(aria-hidden='true') ×
        .modal-body
          | 是否刪除 
          strong.text-danger {{ tempProduct.title }}
          |  商品(刪除後將無法恢復)。
        .modal-footer
          button.btn.btn-outline-secondary(type='button', data-dismiss='modal', @click='hideModal') 取消
          button.btn.btn-danger(type='button', @click='delProduct(tempProduct.id)') 確認刪除

</template>

<script>
import $ from "jquery";
export default {
    data() {
        return {
            products: [],
            tempProduct: {},
            isNew: false,
            tempDelProduct: {},
            isLoading: false,
            status: {
                fileUploading: false
            }
        };
    },
    methods: {
        getProducts() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/products`;
            vm.isLoading = true;
            this.$http.get(api).then(response => {
                console.log(response.data);
                this.products = response.data.products;
                vm.isLoading = false;
            });
        },
        openModal(isNew, item) {
            if (isNew) {
                this.tempProduct = {};
                this.isNew = true;
            } else {
                this.tempProduct = Object.assign({}, item);
                this.isNew = false;
            }
            $("#productModal").modal("show");
        },
        updateProduct() {
            const vm = this;
            let api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/admin/product`;
            let httpMethod = "post";

            if (!vm.isNew) {
                console.log(vm.isNew);
                api = `${process.env.APIPATH}/api/${
                    process.env.CUSTOMPATH
                }/admin/product/${vm.tempProduct.id}`;
                console.log(api);
                httpMethod = "put";
            }

            this.$http[httpMethod](api, { data: vm.tempProduct }).then(
                response => {
                    if (response.data.success) {
                        $("#productModal").modal("hide");
                        vm.getProducts();
                    } else {
                        $("#productModal").modal("hide");
                        vm.getProducts();
                        console.log("上傳失敗！");
                    }
                    // vm.products = response.data.products;
                }
            );
        },
        hideModal() {
            $("#delProductModal").modal("hide");
        },
        showModal(item) {
            $("#delProductModal").modal("show");
            this.tempDelProduct = Object.assign({}, item);
        },
        delProduct() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/admin/product/${vm.tempDelProduct.id}`;
            this.$http.delete(api).then(response => {
                if (response.data.success) {
                    $("#delProductModal").modal("hide");
                    console.log("刪除成功！");
                    vm.getProducts();
                } else {
                    $("#delProductModal").modal("hide");
                    console.log("刪除失敗！");
                    vm.getProducts();
                }
            });
        },
        uploadFile() {
            // console.log(this);
            const uploadedFile = this.$refs.files.files[0];
            const vm = this;
            const formData = new FormData();
            formData.append("file-to-upload", uploadedFile);
            const url = `${process.env.APIPATH}/api/${
                process.env.CUSTOMPATH
            }/admin/upload`;
            vm.status.fileUploading = true;
            this.$http
                .post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(response => {
                    console.log(response.data);
                    if (response.data.success) {
                        // vm.tempProduct.imageUrl = response.data.imageUrl;
                        // console.log(vm.tempProduct.imageUrl);
                        // 強制寫入
                        vm.$set(
                            vm.tempProduct,
                            "imageUrl",
                            response.data.imageUrl
                        );
                        vm.status.fileUploading = false;
                    } else {
                        this.$bus.$emit(
                            "messsage:push",
                            response.data.message,
                            "danger"
                        );
                    }
                });
        }
    },
    created() {
        this.getProducts();
    }
};
</script>
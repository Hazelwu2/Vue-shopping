<template lang="pug">
nav.col-md-2.d-none.d-md-block.bg-light.sidebar
  h6.sidebar-heading.d-flex.justify-content-between.align-items-center.px-3.mt-4.mb-1.text-muted
    span 管理員
    a.d-flex.align-items-center.text-muted(href='#')
      span(data-feather='plus-circle')
  ul.nav.flex-column.mb-2
    li.nav-item
      router-link.nav-link(to='/admins/products')
        i.fas.fa-box-open
        |  產品列表
    li.nav-item
      router-link.nav-link(to='/admins/orders')
        i.fas.fa-clipboard-list
        |  訂單列表
    li.nav-item
      router-link.nav-link(to='/admins/coupons')
        i.fas.fa-ticket-alt
        |  優惠券
  h6.sidebar-heading.d-flex.justify-content-between.align-items-center.px-3.mt-4.mb-1.text-muted
    span 模擬功能
    a.d-flex.align-items-center.text-muted(href='#')
      span(data-feather='plus-circle')
  ul.nav.flex-column.mb-2
    li.nav-item
      router-link.nav-link(to='/admin/products')
        i.far.fa-list-alt
        |  模擬訂單

</template>
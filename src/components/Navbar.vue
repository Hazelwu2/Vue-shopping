<template lang="pug">
div
    nav.navbar.navbar-dark.fixed-top.bg-dark.flex-md-nowrap.p-0.shadow
        a.navbar-brand.col-sm-3.col-md-2.mr-0(href='#') BookStore
        input.form-control.form-control-dark.w-100(type='text', placeholder='Search', aria-label='Search')
        ul.navbar-nav.px-3
            li.nav-item.text-nowrap
            a.nav-link(@click='signout') 登出
</template>
<script>
export default {
    data() {
        return {};
    },
    methods: {
        signout() {
            const api = `${process.env.APIPATH}/logout`;
            this.$http.post(api).then(response => {
                response.data.success ? this.$router.push("/login") : false;
            });
        }
    }
};
</script>
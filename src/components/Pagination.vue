<template lang="pug">
div
    nav(aria-label='Page navigation example')
        ul.pagination.justify-content-end
            li.page-item(:class="{'disabled': !pages.has_pre}")
                a.page-link(href='#', @click.prevent="getPage(pages.current_page -1)") <
            li.page-item(v-for="page in pages.total_pages", :key="page", :class="{'active': pages.current_page === page}")
                a.page-link(href='#', @click.prevent="getPage(page)") {{page}}
            li.page-item(:class="{'disabled': !pages.has_next}")
                a.page-link(href='#', @click.prevent="getPage(pages.current_page + 1)") >
</template>
<script>
export default {
    name: 'Pagination',
    props: {
        pages: {
            type: Object
        }
    },
    methods: {
        getPage(page) {
            this.$emit('getPage', page);
        }
    }
}
</script>

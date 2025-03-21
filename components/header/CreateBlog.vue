<template>
    <div>
        <Button v-if="route.path !== '/blog/create'" @click="handleCreateBlog" class="w-full">
            Đăng bài
        </Button>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handleCreateBlog = () => {
    router.push('/blog/create')
}

</script>

<style lang="scss" scoped></style>
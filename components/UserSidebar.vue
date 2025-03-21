<!-- Sidebar.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AuthenticationButton from './sidebar/AuthenticationButton.vue';
import UserCard from './user/UserCard.vue';
const authStore = useAuthStore();
const isAuthChecking = ref(true);

onMounted(async () => {
    await authStore.checkAuth();
    isAuthChecking.value = false;
});
</script>

<template>
    <div class="w-full md:w-1/6 h-full bg-zinc-50 dark:bg-zinc-800 flex flex-col justify-between p-4">
        <div class="flex-1">
            Sidebar
        </div>
        <div class="w-full flex justify-center mb-4">
            <!-- Hiển thị skeleton loader trong khi kiểm tra xác thực -->
            <div v-if="isAuthChecking" class="text-center animate-pulse">
                <div class="h-5 w-20 bg-zinc-600 rounded mb-2"></div>
                <div class="h-8 w-full bg-zinc-600 rounded"></div>
            </div>
            <div v-else-if="authStore.isLoggedIn" class="text-center w-full">
                <UserCard :username="authStore.user.username" :avatar="authStore.user.avatar"
                    :role="authStore.user.role" />
            </div>
            <AuthenticationButton v-else />
        </div>
    </div>
</template>
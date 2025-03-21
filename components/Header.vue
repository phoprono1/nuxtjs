<template>
    <div class="w-screen h-20 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-between px-4">
        <!-- Logo and Brand section -->
        <div class="flex items-center gap-x-4">
            <Logo />
        </div>

        <!-- Search bar in center -->
        <div class="flex-1 flex justify-center">
            <SearchBar />
        </div>

        <!-- Buttons on the right (Create Blog + Dark Mode) -->
        <div class="flex items-center gap-x-4">
            <CreateBlog />
            <DarkMode />
        </div>
    </div>
</template>

<script setup lang="ts">
import CreateBlog from './header/CreateBlog.vue';
import DarkMode from './header/DarkMode.vue';
import SearchBar from './header/SearchBar.vue';
import Logo from './header/Logo.vue';
</script>

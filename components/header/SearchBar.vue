<template>
    <div class="flex-1 flex justify-center max-w-sm mx-auto relative">
        <Input id="search" type="text" placeholder="Search..." class="pl-10" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-6 text-muted-foreground" />
        </span>
    </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-vue-next'    
</script>

<style scoped></style>
<!-- components/UserCard.vue -->
<script setup>
import { defineProps, ref } from 'vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import LogoutButton from '@/components/user/LogoutButton.vue';
import { ArrowDownUp, Settings, User, CreditCard } from 'lucide-vue-next';
import SettingDialog from './settings/SettingDialog.vue';

const router = useRouter();

// Props
const props = defineProps({
    username: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '/default-avatar.png',
    },
    role: {
        type: String,
        default: 'user',
    },
});

// Trạng thái hiển thị SettingDialog
const showSettings = ref(false);

// Các hàm hiện có
const getFallback = () => {
    const words = props.username.trim().split(/\s+/);
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
    return initials;
};

const getUserRole = () => {
    if (props.role === 'admin') {
        return 'Quản trị viên';
    }
    return 'Thành Viên';
};

const getUserRoleDetail = () => {
    switch (props.role) {
        case 'admin':
            return 'Quản trị viên hệ thống';
        case 'user':
            return 'Cấp Đồng';
        case 'user-silver':
            return 'Cấp Bạc';
        case 'user-gold':
            return 'Cấp Vàng';
        case 'user-diamond':
            return 'Cấp Kim Cương';
        default:
            return 'Cấp Đồng';
    }
};

const getRoleColor = () => {
    switch (props.role) {
        case 'admin':
            return 'bg-red-600 text-white';
        case 'user':
            return 'bg-amber-700 text-white hover:bg-amber-800';
        case 'user-silver':
            return 'bg-zinc-300 text-gray-800 hover:bg-zinc-400';
        case 'user-gold':
            return 'bg-amber-400 text-gray-800 hover:bg-amber-500';
        case 'user-diamond':
            return 'bg-cyan-200 text-gray-800 hover:bg-cyan-100';
        default:
            return 'bg-amber-700 text-white hover:bg-amber-800';
    }
};

const showPricingPage = () => {
    router.push('/pricing/plan');
};
</script>

<template>
    <div class="flex border rounded-lg hover:bg-zinc-800 bg-slate-500">
        <DropdownMenu class="w-full">
            <DropdownMenuTrigger class="flex items-center justify-between w-full space-x-2 p-2">
                <div class="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage :src="avatar" :alt="username" />
                        <AvatarFallback>{{ getFallback() }}</AvatarFallback>
                    </Avatar>
                    <div class="flex flex-col items-start">
                        <HoverCard>
                            <HoverCardTrigger>
                                <Badge :class="getRoleColor()">{{ getUserRole() }}</Badge>
                            </HoverCardTrigger>
                            <HoverCardContent :class="getRoleColor()" class="w-fit">
                                {{ getUserRoleDetail() }}
                            </HoverCardContent>
                        </HoverCard>
                        <span class="text-zinc-100 font-bold">{{ username }}</span>
                    </div>
                </div>
                <ArrowDownUp class="w-5 h-5 text-zinc-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-64 bg-zinc-500 text-zinc-50 font-semibold">
                <DropdownMenuLabel class="text-center">Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="flex justify-between items-center">
                    Hồ Sơ Người dùng
                    <User class="w-5 h-5" />
                </DropdownMenuItem>
                <DropdownMenuItem @click="showPricingPage" class="flex justify-between items-center">
                    Thanh Toán
                    <CreditCard class="w-5 h-5" />
                </DropdownMenuItem>
                <DropdownMenuItem @click="showSettings = true" class="flex justify-between items-center">
                    Cài Đặt
                    <Settings class="w-5 h-5" />
                </DropdownMenuItem>
                <DropdownMenuItem class="flex justify-between items-center">
                    <LogoutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <!-- Overlay và SettingDialog -->
        <div v-if="showSettings" class="fixed inset-0 z-40 flex items-center justify-center w-full h-full">
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-50"></div>
            <!-- SettingDialog -->
            <div class="relative z-50">
                <SettingDialog @close="showSettings = false" />
            </div>
        </div>
    </div>
</template>
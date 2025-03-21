<!-- components/settings/SettingProfile.vue -->
<script setup>
import { onMounted } from 'vue';
import { useProfileStore } from '~/stores/profile'; // Đường dẫn tới store trong Nuxt 3
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
// Lấy store
const profileStore = useProfileStore();

// Hàm kết nối MetaMask
const connectMetaMask = async () => {
    console.log('Bắt đầu kết nối MetaMask...');
    if (typeof window.ethereum !== 'undefined') {
        try {
            const isConnected = await window.ethereum.isConnected();
            console.log('MetaMask đã kết nối trước đó:', isConnected);

            const currentAccounts = await window.ethereum.request({ method: 'eth_accounts' });
            console.log('Tài khoản hiện tại (trước khi yêu cầu):', currentAccounts);

            let walletAddress;
            if (currentAccounts.length === 0) {
                console.log('Chưa có tài khoản nào kết nối, gửi yêu cầu eth_requestAccounts...');
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log('Accounts nhận được:', accounts);
                walletAddress = accounts[0];
            } else {
                console.log('Đã có tài khoản kết nối sẵn, sử dụng tài khoản hiện tại');
                walletAddress = currentAccounts[0];
            }

            console.log('Địa chỉ ví:', walletAddress);
            profileStore.user.wallet = walletAddress;
            console.log('Đã cập nhật wallet vào store:', profileStore.user.wallet);
        } catch (error) {
            console.error('Lỗi trong quá trình kết nối MetaMask:', error);
            alert('Không thể kết nối với MetaMask. Vui lòng thử lại.');
        }
    } else {
        console.error('MetaMask không được cài đặt!');
        alert('Vui lòng cài đặt MetaMask!');
    }
};

// Hàm gỡ địa chỉ ví
const disconnectWallet = () => {
    console.log('Gỡ địa chỉ ví...');
    profileStore.user.wallet = null;
    console.log('Đã gỡ wallet khỏi store:', profileStore.user.wallet);
};

// Gọi API khi component được mounted
onMounted(() => {
    if (!profileStore.isProfileLoaded) {
        profileStore.fetchUserProfile();
    }
});
</script>

<template>
    <div class="space-y-6">
        <!-- Trạng thái loading -->
        <div v-if="profileStore.loading" class="text-zinc-200 text-center">Đang tải thông tin...</div>

        <!-- Trạng thái lỗi -->
        <div v-else-if="profileStore.error" class="text-red-500 text-center">
            {{ profileStore.error }}
        </div>

        <!-- Hiển thị thông tin người dùng -->
        <div v-else-if="profileStore.user" class="space-y-4">
            <!-- Tên người dùng -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Tên người dùng</Label>
                <Input v-model="profileStore.user.username" type="text" placeholder="Nhập tên người dùng"
                    class="flex-grow" />
            </div>

            <!-- Email -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Email</Label>
                <Input v-model="profileStore.user.email" type="email" placeholder="Nhập email" class="flex-grow" />
            </div>

            <!-- Ví -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Địa chỉ ví</Label>
                <div class="flex-grow flex items-center space-x-2">
                    <Input v-model="profileStore.user.wallet" type="text" placeholder="Nhập địa chỉ ví"
                        class="flex-grow" :disabled="!!profileStore.user.wallet" />
                    <Button v-if="!profileStore.user.wallet" @click="connectMetaMask" variant="outline" class="ml-2">
                        Liên kết MetaMask
                    </Button>
                    <Button v-else @click="disconnectWallet" variant="outline"
                        class="ml-2 text-red-500 hover:bg-red-500/10">
                        Gỡ địa chỉ ví
                    </Button>
                </div>
            </div>
            <!-- Địa chỉ -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Địa chỉ</Label>
                <Input v-model="profileStore.user.address" type="text" placeholder="Nhập địa chỉ" class="flex-grow" />
            </div>

            <!-- Số điện thoại -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Số điện thoại</Label>
                <Input v-model="profileStore.user.phone" type="text" placeholder="Nhập số điện thoại"
                    class="flex-grow" />
            </div>

            <!-- Token Balance (chỉ đọc) -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Số dư token</Label>
                <Input :model-value="profileStore.user.tokenBalance" type="number" disabled
                    class="flex-grow text-white" />
            </div>

            <!-- Role (chỉ đọc) -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Vai trò</Label>
                <Input :model-value="profileStore.user.role" type="text" disabled class="flex-grow text-white" />
            </div>

            <!-- Status (chỉ đọc) -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Trạng thái</Label>
                <Input :model-value="profileStore.user.status" type="text" disabled class="flex-grow text-white" />
            </div>

            <!-- Thời gian tạo (chỉ đọc) -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Ngày tạo</Label>
                <Input :model-value="new Date(profileStore.user.createdAt).toLocaleString()" type="text" disabled
                    class="flex-grow text-white" />
            </div>

            <!-- Thời gian cập nhật (chỉ đọc) -->
            <div class="flex items-center">
                <Label class="w-1/3 text-sm font-medium text-zinc-200 text-left mr-4">Cập nhật lần cuối</Label>
                <Input :model-value="new Date(profileStore.user.updatedAt).toLocaleString()" type="text" disabled
                    class="flex-grow text-white" />
            </div>
        </div>
    </div>
</template>
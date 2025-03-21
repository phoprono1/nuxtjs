<!-- components/settings/SettingDialog.vue -->
<script setup>
import { ref } from 'vue';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SettingProfile from './SettingProfile.vue';

// Emit sự kiện close
const emit = defineEmits(['close']);

// Tab mặc định được chọn
const defaultTab = ref('profile');

// Hàm đóng dialog
const closeDialog = () => {
    emit('close');
};
</script>

<template>
    <div class="flex h-[750px] w-[1100px] bg-zinc-700 text-zinc-100 shadow-lg rounded-lg">
        <Tabs :default-value="defaultTab" class="flex w-full">
            <!-- Sidebar bên trái -->
            <div class="w-1/4 bg-zinc-600 border-r border-zinc-500 p-4 rounded-l-lg">
                <h2 class="text-lg font-semibold mb-4 text-zinc-50">Cài Đặt</h2>
                <TabsList class="flex flex-col space-y-2 bg-transparent">
                    <TabsTrigger value="profile"
                        class="w-full text-left px-4 py-2 rounded-md transition-colors data-[state=active]:bg-zinc-500 data-[state=active]:text-white text-zinc-200 hover:bg-zinc-500 hover:text-white">
                        Thông Tin Cá Nhân
                    </TabsTrigger>
                    <TabsTrigger value="privacy"
                        class="w-full text-left px-4 py-2 rounded-md transition-colors data-[state=active]:bg-zinc-500 data-[state=active]:text-white text-zinc-200 hover:bg-zinc-500 hover:text-white">
                        Quyền Riêng Tư
                    </TabsTrigger>
                    <TabsTrigger value="notifications"
                        class="w-full text-left px-4 py-2 rounded-md transition-colors data-[state=active]:bg-zinc-500 data-[state=active]:text-white text-zinc-200 hover:bg-zinc-500 hover:text-white">
                        Thông Báo
                    </TabsTrigger>
                    <TabsTrigger value="security"
                        class="w-full text-left px-4 py-2 rounded-md transition-colors data-[state=active]:bg-zinc-500 data-[state=active]:text-white text-zinc-200 hover:bg-zinc-500 hover:text-white">
                        Bảo Mật
                    </TabsTrigger>
                </TabsList>
            </div>

            <!-- Nội dung bên phải -->
            <div class="w-3/4 p-6 overflow-y-auto flex flex-col">
                <!-- Tab Hồ Sơ -->
                <TabsContent value="profile">
                    <h3 class="text-xl font-semibold mb-4 text-zinc-50">Thông Tin Cá Nhân</h3>
                    <div class="space-y-4">
                        <SettingProfile />
                    </div>
                </TabsContent>

                <!-- Tab Quyền Riêng Tư -->
                <TabsContent value="privacy">
                    <h3 class="text-xl font-semibold mb-4 text-zinc-50">Quyền Riêng Tư</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-200">Ẩn hồ sơ khỏi công chúng</span>
                            <input type="checkbox" class="w-5 h-5 text-blue-600 bg-zinc-600 border-zinc-500 rounded" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-200">Cho phép theo dõi hoạt động</span>
                            <input type="checkbox" class="w-5 h-5 text-blue-600 bg-zinc-600 border-zinc-500 rounded" />
                        </div>
                    </div>
                </TabsContent>

                <!-- Tab Thông Báo -->
                <TabsContent value="notifications">
                    <h3 class="text-xl font-semibold mb-4 text-zinc-50">Thông Báo</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-200">Thông báo qua email</span>
                            <input type="checkbox" class="w-5 h-5 text-blue-600 bg-zinc-600 border-zinc-500 rounded" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-200">Thông báo qua ứng dụng</span>
                            <input type="checkbox" class="w-5 h-5 text-blue-600 bg-zinc-600 border-zinc-500 rounded" />
                        </div>
                    </div>
                </TabsContent>

                <!-- Tab Bảo Mật -->
                <TabsContent value="security">
                    <h3 class="text-xl font-semibold mb-4 text-zinc-50">Bảo Mật</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-zinc-200">Mật khẩu mới</label>
                            <input type="password"
                                class="mt-1 w-full px-3 py-2 bg-zinc-600 border border-zinc-500 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mật khẩu mới" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-zinc-200">Xác nhận mật khẩu</label>
                            <input type="password"
                                class="mt-1 w-full px-3 py-2 bg-zinc-600 border border-zinc-500 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Xác nhận mật khẩu" />
                        </div>
                    </div>
                </TabsContent>

                <!-- Nút đóng và lưu -->
                <div class="mt-auto flex justify-end space-x-4">
                    <button @click="closeDialog"
                        class="px-4 py-2 bg-zinc-500 text-zinc-100 rounded-md hover:bg-zinc-400">
                        Hủy
                    </button>
                    <button @click="closeDialog" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Lưu
                    </button>
                </div>
            </div>
        </Tabs>
    </div>
</template>
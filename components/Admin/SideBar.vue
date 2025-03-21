<script setup lang=ts>
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  BlocksIcon,
  ChevronRight,
  ChevronsUpDown,
  Command,
  GalleryVerticalEnd,
  PieChart,
  Plus,
  SquareTerminal,
  User,
} from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { toast } from '../ui/toast'
const authStore = useAuthStore();
const isAuthChecking = ref(true);

const isLoading = ref(false);
onMounted(async () => {
  await authStore.checkAuth();
  isAuthChecking.value = false;
});

const handleLogout = async () => {
  try {
    isLoading.value = true;
    await authStore.logout();

    toast({
      title: 'Thành công',
      description: 'Đăng xuất thành công!',
    });
    navigateTo('/admin/auth/login');
  } catch (error) {
    toast({
      title: 'Lỗi',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng xuất.',
      variant: 'destructive',
    });
  } finally {
    isLoading.value = false;
  }
};

const data = {
  user: {
    name: authStore.user?.username,
    role: authStore.user?.role,
    // avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'BLOG STUDY',
      logo: GalleryVerticalEnd,
      plan: 'Corporate Department',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: PieChart,
      isActive: true,
      items: [
        {
          title: 'Thống kê',
          url: '/admin/dashboard',
        },

      ],
    },
    {
      title: 'Tài khoản',
      url: '/user',
      icon: User,
      isActive: false,
      items: [
        {
          title: 'Thêm tài khoản',
          url: '/admin/user/add',
        },
        {
          title: 'Danh sách tài khoản',
          url: '/admin/user/list',
        },

      ],
    },

    {
      title: 'Bài viết',
      url: '/blog',
      icon: BlocksIcon,
      isActive: false,
      items: [
        {
          title: 'Thêm bài viết',
          url: '/admin/blog/add',
        },
        {
          title: 'Danh sách bài viết',
          url: '/admin/blog/list',
        },

      ],
    },

  ],
}

const activeTeam = ref(data.teams[0])

// Hàm setActiveMenu để cập nhật trạng thái isActive khi click vào title
function setActiveMenu(title: string) {
  data.navMain.forEach(menu => {
    // Reset tất cả isActive thành false
    menu.isActive = false;

    // Kiểm tra xem menu có title trùng với title được chọn không
    if (menu.title === title) {
      menu.isActive = true; // Đặt isActive thành true cho mục vừa chọn
    }
  });
}


</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <div
                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <component :is="activeTeam.logo" class="size-4" />
                  </div>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ activeTeam.name }}</span>
                    <span class="truncate text-xs">{{ activeTeam.plan }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      <!--  -->
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible v-for="item in data.navMain" :key="item.title" as-child :default-open="item.isActive"
              class="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton :tooltip="item.title" @click="setActiveMenu(item.title)">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                    <ChevronRight
                      class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                      <SidebarMenuSubButton as-child>
                        <a :href="subItem.url">
                          <span>{{ subItem.title }}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar class="h-8 w-8 rounded-lg">
                    <!-- <AvatarImage :src="data.user.avatar" :alt="data.user.name" /> -->
                    <AvatarFallback class="rounded-lg">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <div v-if="isAuthChecking" class="text-center animate-pulse">
                    <div class="h-5 w-20 bg-zinc-600 rounded mb-2"></div>
                    <div class="h-8 w-full bg-zinc-600 rounded"></div>
                  </div>
                  <div v-else-if="authStore.isLoggedIn" class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">Tài khoản - {{ data.user.name }}</span>
                    <br />
                    <span class="truncate text-xs">Vai trò - {{ data.user.role }}</span>
                  </div>

                  <div v-else>Chưa đăng nhập</div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom"
                align="end" :side-offset="4">
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <!-- <AvatarImage :src="data.user.avatar" :alt="data.user.name" /> -->
                      <AvatarFallback class="rounded-lg">
                        CN
                      </AvatarFallback>
                    </Avatar>

                    <div v-if="isAuthChecking" class="text-center animate-pulse">
                      <div class="h-5 w-20 bg-zinc-600 rounded mb-2"></div>
                      <div class="h-8 w-full bg-zinc-600 rounded"></div>
                    </div>
                    <div v-else-if="authStore.isLoggedIn" class="text-center w-full">
                      <UserCard :username="data.user.name" :role="data.user.role" />
                    </div>
                    <div v-else>Chưa đăng nhập</div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <div v-if="authStore.isLoggedIn">
                    <Button @click="handleLogout" :disabled="isLoading" class="w-full">
                      Đăng Xuất
                    </Button>
                  </div>
                  <div v-else>
                    <NuxtLink to="/admin/auth/login">Đăng Nhập</NuxtLink>
                  </div>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <SidebarInset>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <NuxtPage />
      </div>
    </SidebarInset>

  </SidebarProvider>
</template>

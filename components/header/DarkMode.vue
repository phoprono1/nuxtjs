<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Icon } from '@iconify/vue'
import { watch, computed, ref, onMounted, nextTick } from 'vue'

const colorMode = useColorMode()

// Sử dụng ref thay vì computed để có thể đồng bộ giá trị thủ công
const isDark = ref(false)

// Cập nhật isDark dựa trên colorMode.value
const syncThemeState = () => {
  nextTick(() => {
    isDark.value = colorMode.value === 'dark'
  })
}

// Hàm để toggle giữa light và dark mode
const toggleTheme = (value: boolean) => {
  colorMode.preference = value ? 'dark' : 'light'
}

onMounted(() => {
  // Đồng bộ hóa trạng thái ban đầu
  syncThemeState()

  // Theo dõi thay đổi colorMode.value và cập nhật isDark
  watch(() => colorMode.value, () => {
    syncThemeState()
  })

  // Theo dõi thay đổi preference và cập nhật class
  watch(() => colorMode.preference, (newPreference) => {
    // Remove old theme classes
    document.documentElement.classList.remove('light', 'dark')

    // Add new theme class based on preference
    if (newPreference === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newPreference === 'light') {
      document.documentElement.classList.add('light')
    } else if (newPreference === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light')
    }

    // Đảm bảo isDark được cập nhật sau khi preference thay đổi
    syncThemeState()
  }, { immediate: true })
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <Icon icon="lucide:sun" class="h-4 w-4 text-orange-400" />
    <Switch :model-value="isDark" @update:model-value="toggleTheme" class="data-[state=checked]:bg-zinc-700">
      <template #thumb>
        <Icon v-if="isDark" icon="lucide:moon" class="size-3 text-indigo-300" />
        <Icon v-else icon="lucide:sun" class="size-3 text-amber-600" />
      </template>
    </Switch>
    <Icon icon="lucide:moon" class="h-4 w-4 text-indigo-300" />
  </div>
</template>
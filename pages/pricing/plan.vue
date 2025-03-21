<template>
  <div class="h-[calc(100vh-80px)] overflow-auto">
    <!-- Header có vị trí sticky -->
    <div class="sticky top-0 z-30 bg-zinc-300 dark:bg-zinc-500 pt-4 pb-4">
      <div
        class="w-full h-16 flex items-center justify-between bg-white dark:bg-zinc-800 z-30 rounded-xl p-4 border-zinc-300"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang Chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/pricing/plan">Thanh Toán</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
    <div class="p-4">
      <div
        class="grid grid-cols-2 gap-4 justify-items-center"
        style="grid-auto-rows: minmax(400px, auto)"
      >
        <BronzeCard />
        <SilverCard />
        <GoldCard />
        <DiamondCard />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BronzeCard from "~/components/contents/PricingCard/BronzeCard.vue";
import DiamondCard from "~/components/contents/PricingCard/DiamondCard.vue";
import GoldCard from "~/components/contents/PricingCard/GoldCard.vue";
import SilverCard from "~/components/contents/PricingCard/SilverCard.vue";
</script>

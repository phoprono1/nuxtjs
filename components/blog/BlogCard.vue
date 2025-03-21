<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
// Import Lucide icons
import {
  User,
  Calendar,
  Folder,
  Heart,
  Share,
  MessageCircle,
  Eye,
  BookOpen
} from "lucide-vue-next";
import { formatDate } from "~/filters/filters";

// Define props
const props = defineProps({
  id: String,
  title: String,
  authorId: String,
  category: String,
  tags: {
    type: Array,
    default: () => [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  sharedBy: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: String,
    default: "",
  },
});
const router = useRouter()

const handleReadMore = () => {
  router.push(`/blog/${props.id}`)
}

const getRelativeTime = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffTime = Math.abs(now.getTime() - past.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 30) {
    return formatDate(dateString);
  } else if (diffDays > 0) {
    return `${diffDays} ngày trước`;
  } else if (diffHours > 0) {
    return `${diffHours} giờ trước`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} phút trước`;
  } else {
    return 'Vừa xong';
  }
};

// Thay thế dòng const formattedDate = formatDate(props.created_at);
const relativeTime = computed(() => getRelativeTime(props.created_at));

</script>

<template>
  <Card class="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
    <CardHeader class="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-5">
      <HoverCard>
        <HoverCardTrigger>
          <CardTitle class="text-2xl font-bold line-clamp-1 ">{{ title }}</CardTitle>
        </HoverCardTrigger>
        <HoverCardContent>
          {{ title }}
        </HoverCardContent>
      </HoverCard>
      <CardDescription class="text-blue-100 mt-2 flex items-center gap-2">
        <span class="flex items-center gap-1">
          <User class="w-4 h-4" />
          {{ authorId }}
        </span>
        <span class="text-blue-200">•</span>
        <span class="flex items-center gap-1">
          <Calendar class="w-4 h-4" />
          {{ relativeTime }}
        </span>
      </CardDescription>
    </CardHeader>

    <CardContent class="p-5">
      <div class="flex items-center gap-2 mb-4">
        <Folder class="w-4 h-4 text-gray-500" />
        <Badge variant="secondary" class="font-medium">{{ category }}</Badge>
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
        <Badge v-for="(tag, index) in tags" :key="index" variant="outline" class="text-xs">
          {{ tag }}
        </Badge>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-600 text-sm">
        <span class="flex items-center gap-1">
          <Heart class="w-4 h-4 text-red-500" />
          {{ likes }}
        </span>
        <span class="flex items-center gap-1">
          <Share class="w-4 h-4 text-blue-500" />
          {{ sharedBy }}
        </span>
        <span class="flex items-center gap-1">
          <MessageCircle class="w-4 h-4 text-green-500" />
          {{ comments }}
        </span>
        <span class="flex items-center gap-1">
          <Eye class="w-4 h-4 text-purple-500" />
          {{ views }}
        </span>
      </div>
    </CardContent>

    <CardFooter class="p-5 bg-gray-50 flex flex-col space-y-3">
      <Button @click="handleReadMore" class="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:opacity-90">
        <BookOpen class="w-4 h-4 mr-2" />
        Đọc Thêm
      </Button>
      <div class="grid grid-cols-3 gap-2 w-full">
        <Button variant="outline" class="w-full flex items-center justify-center">
          <Heart class="w-4 h-4 mr-1" />
          <span class="text-sm">Thích</span>
        </Button>
        <Button variant="outline" class="w-full flex items-center justify-center">
          <Share class="w-4 h-4 mr-1" />
          <span class="text-sm">Chia Sẻ</span>
        </Button>
        <Button variant="outline" class="w-full flex items-center justify-center">
          <MessageCircle class="w-4 h-4 mr-1" />
          <span class="text-sm">Bình Luận</span>
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
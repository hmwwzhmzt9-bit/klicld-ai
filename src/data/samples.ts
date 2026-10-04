export interface SampleItem {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  url: string;
  resolution: string;
}

export const SAMPLE_VIDEOS: SampleItem[] = [
  {
    id: 'sample-anime',
    title: 'أنمي سايبربانك (لقطة حركة)',
    category: 'أنمي ومونتاج',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    resolution: '720p HD ➡️ 4K',
  },
  {
    id: 'sample-gaming',
    title: 'لقطة ألعاب تنافسية وسريعة',
    category: 'ألعاب وجيمينج',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    resolution: '1080p ➡️ 4K 60FPS',
  },
  {
    id: 'sample-nature',
    title: 'مشهد سينمائي طبيعي غامر',
    category: 'سينما وطبيعة',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    resolution: '480p SD ➡️ 4K UHD',
  },
];

export const SAMPLE_IMAGES: SampleItem[] = [
  {
    id: 'img-portrait',
    title: 'صورة شخصية (بورتريه)',
    category: 'وجوه وتفاصيل',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
    resolution: '500×750 ➡️ 4K UHD',
  },
  {
    id: 'img-anime',
    title: 'شخصية ألعاب ديجيتال',
    category: 'رسومات وألعاب',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=60',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=60',
    resolution: '500×333 ➡️ 4K UHD',
  },
  {
    id: 'img-cyberpunk',
    title: 'مدينة سايبربانك ليلية',
    category: 'خلفيات نيون',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60',
    resolution: '600×400 ➡️ 4K UHD',
  },
];

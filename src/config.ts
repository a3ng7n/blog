export const SITE = {
  website: "https://a3ng7n.com/", // replace this with your deployed domain
  author: "Aaron",
  profile: "https://a3ng7n.com/",
  desc: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
  title: "a3ng7n",
  ogImage: "og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/a3ng7n/blog/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Denver", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;

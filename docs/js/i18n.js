// 语言数据存储
const translations = {
  zh: {
    nav_features: "功能",
    nav_use_cases: "使用场景",
    nav_highlights: "特色",
    nav_getting_started: "快速入门",
    hero_title: "用标签重新定义书签管理",
    hero_subtitle: "摆脱传统文件夹结构的限制，以更灵活、更直观的方式整理您的网络世界。",
    hero_button_install: "安装扩展",
    hero_button_start: "立即开始",
    features_title: "强大功能，简约体验",
    features_description: "Tag Mark 提供了一套完整的书签管理解决方案，让您的数字生活更加有序。",
    feature_tags_title: "嵌套标签系统",
    feature_tags_desc: "支持多层嵌套标签结构，一个书签可关联多个标签，摆脱传统文件夹单一归属的限制。",
    feature_bookmarks_title: "智能书签管理",
    feature_bookmarks_desc: "现代化界面设计，轻松浏览、编辑和管理所有书签，批量操作提高工作效率。",
    feature_shortcuts_title: "快捷键支持",
    feature_shortcuts_desc: "支持键盘快捷键操作，为高效用户提供更快捷的工作方式，提升管理效率。",
    feature_theme_title: "深色/浅色模式",
    feature_theme_desc: "支持深色和浅色主题切换，自动适应系统设置，为您提供舒适的视觉体验。",
    feature_search_title: "高级搜索功能",
    feature_search_desc: "强大的搜索系统，同时检索书签和标签内容，快速找到您需要的信息。",
    feature_backup_title: "数据备份恢复",
    feature_backup_desc: "支持数据导出和导入功能，确保您的书签和标签数据安全，随时可恢复。",
    use_cases_title: "多种应用场景",
    use_cases_description: "无论您是学生、研究人员、专业人士还是普通用户，Tag Mark 都能满足您的需求。",
    use_case_academic_title: "学术研究",
    use_case_academic_desc: "创建如 #研究/人工智能/深度学习 的嵌套标签，将相关论文、工具和参考资料关联起来，形成完整知识网络。",
    use_case_project_title: "项目管理",
    use_case_project_desc: "为每个项目创建独立标签结构，如 #项目/网站重构/设计参考，轻松切换不同项目环境。",
    use_case_learning_title: "学习进阶",
    use_case_learning_desc: "创建如 #学习/编程/React/教程 的进阶标签结构，将初级到高级的学习资源有序组织，形成完整学习路径。",
    highlights_title: "特色亮点",
    highlights_description: "精心设计的细节，带来卓越的使用体验。",
    highlight_ui_title: "优雅界面",
    highlight_ui_desc: "简约大气的设计，提供流畅的用户体验，让书签管理成为一种享受。",
    highlight_efficiency_title: "高效操作",
    highlight_efficiency_desc: "智能化的交互设计，最大程度减少操作步骤，提高工作效率。",
    highlight_customization_title: "个性化定制",
    highlight_customization_desc: "可根据个人习惯调整设置，打造专属书签管理方式。",
    highlight_security_title: "数据安全",
    highlight_security_desc: "本地存储核心数据，支持备份恢复，保护您的隐私安全。",
    getting_started_title: "快速入门",
    getting_started_description: "只需几个简单步骤，即可开始使用 Tag Mark 管理您的书签。",
    step1_title: "安装扩展",
    step1_desc: "从 Chrome 网上应用店下载并安装 Tag Mark 扩展。",
    step2_title: "创建标签",
    step2_desc: '进入主界面，在"标签管理"选项卡创建您的首个标签结构。',
    step3_title: "关联书签",
    step3_desc: '切换到"书签管理"选项卡，为您的书签添加标签。',
    step4_title: "高效搜索",
    step4_desc: "使用搜索功能（Ctrl+K/⌘+K）快速定位您需要的内容。",
    cta_title: "立即体验 Tag Mark",
    cta_description: "重新思考书签整理方式，让您的数字生活更加有序。",
    button_source_code: "查看源码",
    button_install: "安装扩展",
    privacy_notice: "安装前请查看我们的",
    privacy_policy: "隐私协议",
    footer_tagline: "重新思考书签整理方式",
    footer_links: "链接",
    footer_resources: "资源",
    footer_contact: "联系我们",
    footer_docs: "文档",
    footer_faq: "常见问题",
    footer_feedback: "反馈问题",
    footer_changelog: "更新日志",
    footer_github: "GitHub",
    footer_email: "电子邮件",
    footer_contribute: "贡献代码",
    footer_copyright: "© 2025 Tag Mark. 开源项目 | 注重隐私 | 持续更新",
    language_switcher: "语言",
    language_zh: "简体中文",
    language_en: "English"
  },
  en: {
    nav_features: "Features",
    nav_use_cases: "Use Cases",
    nav_highlights: "Highlights",
    nav_getting_started: "Getting Started",
    hero_title: "Redefine Bookmark Management with Tags",
    hero_subtitle: "Break free from traditional folder structures and organize your web world in a more flexible and intuitive way.",
    hero_button_install: "Install Extension",
    hero_button_start: "Get Started",
    features_title: "Powerful Features, Elegant Experience",
    features_description: "Tag Mark provides a complete bookmark management solution to keep your digital life organized.",
    feature_tags_title: "Nested Tag System",
    feature_tags_desc:
      "Supports multi-level nested tag structures, allowing one bookmark to be associated with multiple tags, breaking free from the single-category limitation of traditional folders.",
    feature_bookmarks_title: "Smart Bookmark Management",
    feature_bookmarks_desc: "Modern interface design makes it easy to browse, edit and manage all bookmarks, with batch operations to improve efficiency.",
    feature_shortcuts_title: "Keyboard Shortcuts",
    feature_shortcuts_desc: "Supports keyboard shortcut operations, providing efficient users with faster ways to work and improving management efficiency.",
    feature_theme_title: "Dark/Light Mode",
    feature_theme_desc: "Supports dark and light theme switching, automatically adapting to system settings for a comfortable visual experience.",
    feature_search_title: "Advanced Search",
    feature_search_desc: "Powerful search system that simultaneously searches bookmark and tag content to quickly find the information you need.",
    feature_backup_title: "Data Backup & Recovery",
    feature_backup_desc: "Supports data export and import functions to ensure your bookmark and tag data is safe and recoverable at any time.",
    use_cases_title: "Multiple Use Cases",
    use_cases_description: "Whether you're a student, researcher, professional, or regular user, Tag Mark can meet your needs.",
    use_case_academic_title: "Academic Research",
    use_case_academic_desc: "Create nested tags like #Research/AI/DeepLearning to link related papers, tools, and references, forming a complete knowledge network.",
    use_case_project_title: "Project Management",
    use_case_project_desc:
      "Create independent tag structures for each project, such as #Project/WebsiteRedesign/DesignReferences, to easily switch between different project environments.",
    use_case_learning_title: "Learning Progression",
    use_case_learning_desc:
      "Create advanced tag structures like #Learning/Programming/React/Tutorials to organize learning resources from beginner to advanced, forming a complete learning path.",
    highlights_title: "Key Highlights",
    highlights_description: "Carefully designed details for an exceptional user experience.",
    highlight_ui_title: "Elegant Interface",
    highlight_ui_desc: "Simple and modern design provides a smooth user experience, making bookmark management a pleasure.",
    highlight_efficiency_title: "Efficient Operation",
    highlight_efficiency_desc: "Intelligent interaction design minimizes operation steps and improves work efficiency.",
    highlight_customization_title: "Personalization",
    highlight_customization_desc: "Adjust settings according to personal habits to create your own bookmark management style.",
    highlight_security_title: "Data Security",
    highlight_security_desc: "Local storage of core data, with backup and recovery support to protect your privacy.",
    getting_started_title: "Getting Started",
    getting_started_description: "Just a few simple steps to start using Tag Mark to manage your bookmarks.",
    step1_title: "Install the Extension",
    step1_desc: "Download and install the Tag Mark extension from the Chrome Web Store.",
    step2_title: "Create Tags",
    step2_desc: 'Go to the main interface and create your first tag structure in the "Tag Management" tab.',
    step3_title: "Link Bookmarks",
    step3_desc: 'Switch to the "Bookmark Management" tab to add tags to your bookmarks.',
    step4_title: "Efficient Search",
    step4_desc: "Use the search function (Ctrl+K/⌘+K) to quickly locate the content you need.",
    cta_title: "Try Tag Mark Now",
    cta_description: "Rethink how you organize bookmarks and make your digital life more orderly.",
    button_source_code: "View Source",
    button_install: "Install Extension",
    privacy_notice: "Please review our",
    privacy_policy: "Privacy Policy",
    footer_tagline: "Rethinking bookmark organization",
    footer_links: "Links",
    footer_resources: "Resources",
    footer_contact: "Contact Us",
    footer_docs: "Documentation",
    footer_faq: "FAQ",
    footer_feedback: "Feedback",
    footer_changelog: "Changelog",
    footer_github: "GitHub",
    footer_email: "Email",
    footer_contribute: "Contribute",
    footer_copyright: "© 2025 Tag Mark. Open Source | Privacy Focused | Constantly Updated",
    language_switcher: "Language",
    language_zh: "Chinese",
    language_en: "English"
  }
};

// 获取当前语言，默认为中文
function getCurrentLanguage() {
  return localStorage.getItem("language") || "zh";
}

// 设置语言
function setLanguage(lang) {
  localStorage.setItem("language", lang);
  applyTranslations(lang);
}

// 应用翻译
function applyTranslations(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  // 更新语言切换器显示
  const languageSwitcher = document.getElementById("language-switcher");
  if (languageSwitcher) {
    languageSwitcher.textContent = translations[lang]["language_" + lang];
  }

  // 更新HTML lang属性
  document.documentElement.lang = lang;
}

// 在页面加载时初始化国际化
document.addEventListener("DOMContentLoaded", () => {
  const currentLang = getCurrentLanguage();
  applyTranslations(currentLang);
});

// 将函数暴露到全局作用域，以便在HTML中使用
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.applyTranslations = applyTranslations;

// Toggle language dropdown visibility
function toggleLanguageDropdown() {
  const dropdown = document.getElementById("language-dropdown");
  dropdown.classList.toggle("hidden");

  // Close dropdown when clicking outside
  document.addEventListener("click", function closeDropdown(e) {
    const button = document.getElementById("language-dropdown-button");
    const dropdown = document.getElementById("language-dropdown");

    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
      document.removeEventListener("click", closeDropdown);
    }
  });
}

// Extend the setLanguage function to update the button text and checkmarks
const originalSetLanguage = window.setLanguage;
window.setLanguage = function (lang) {
  // Call the original function
  originalSetLanguage(lang);

  // Update checkmarks
  document.getElementById("zh-check").classList.toggle("hidden", lang !== "zh");
  document.getElementById("en-check").classList.toggle("hidden", lang !== "en");

  // Update the button text to show current language in the right language
  const currentLanguage = document.getElementById("current-language");
  if (lang === "zh") {
    currentLanguage.textContent = "中文";
  } else {
    currentLanguage.textContent = "English";
  }

  // Hide the dropdown after selection
  document.getElementById("language-dropdown").classList.add("hidden");
};

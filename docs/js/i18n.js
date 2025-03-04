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
    language_en: "English",
    privacy_page_title: "Tag Mark - 隐私协议",
    privacy_page_description: "Tag Mark 浏览器扩展的隐私协议",
    privacy_title: "隐私协议",
    privacy_last_updated: "最后更新日期：2025年3月1日",
    privacy_intro_title: "引言",
    privacy_intro_content:
      'Tag Mark（"我们"、"我们的"或"本扩展"）重视您的隐私。本隐私协议说明了当您使用我们的浏览器扩展时，我们如何收集、使用、存储和保护您的信息。请仔细阅读本协议，以便全面了解我们的隐私实践。',
    privacy_info_collection_title: "信息收集",
    privacy_info_collection_content: "Tag Mark 是一个本地书签管理扩展，主要功能在您的浏览器本地运行。我们收集以下信息：",
    privacy_info_collection_bookmarks: "<strong>书签数据</strong>：我们访问您的浏览器书签数据，以便您能够使用标签系统进行组织和管理。",
    privacy_info_collection_tags: "<strong>标签结构数据</strong>：我们存储您创建的标签结构和书签与标签之间的关联关系。",
    privacy_info_collection_settings: "<strong>设置偏好</strong>：包括主题选择、语言设置、快捷键配置等用户偏好。",
    privacy_data_storage_title: "数据存储",
    privacy_data_storage_content: "所有数据均存储在您的本地浏览器中：",
    privacy_data_storage_local: "所有书签数据、标签结构和关联关系存储在浏览器的本地存储中（Chrome Storage）。",
    privacy_data_storage_no_upload: "Tag Mark 不会将您的数据上传到任何服务器或云存储。",
    privacy_data_storage_sync: "如果您启用了浏览器的同步功能，您的数据可能会通过浏览器的同步机制在您的设备间同步。",
    privacy_info_usage_title: "信息使用",
    privacy_info_usage_content: "我们使用收集的信息：",
    privacy_info_usage_provide: "提供、维护和改进 Tag Mark 的核心功能。",
    privacy_info_usage_customize: "根据您的偏好设置，定制您的使用体验。",
    privacy_info_usage_ensure: "确保扩展的稳定性和性能。",
    privacy_info_sharing_title: "信息共享",
    privacy_info_sharing_content: "我们不会共享或出售您的个人信息。以下情况除外：",
    privacy_info_sharing_legal: "在法律要求的情况下，如遵守法院命令或其他法律程序。",
    privacy_info_sharing_protection: "为了保护 Tag Mark 的权利、财产或安全，以及我们的用户或公众的安全。",
    privacy_permissions_title: "权限说明",
    privacy_permissions_content: "Tag Mark 需要以下浏览器权限才能正常工作：",
    privacy_permissions_bookmarks: "<strong>bookmarks</strong>：用于访问和管理您的浏览器书签。",
    privacy_permissions_storage: "<strong>storage</strong>：用于存储标签数据和用户偏好设置。",
    privacy_permissions_tabs: "<strong>tabs</strong>：用于在新标签页中打开 Tag Mark 界面。",
    privacy_data_security_title: "数据安全",
    privacy_data_security_content: "我们采取合理的技术措施来保护您的信息：",
    privacy_data_security_local: "所有数据仅存储在您的本地设备上，不会传输到外部服务器。",
    privacy_data_security_code: "扩展代码经过审查，确保不存在安全漏洞。",
    privacy_children_title: "儿童隐私",
    privacy_children_content:
      "Tag Mark 不针对13岁以下的儿童。我们不会有意收集13岁以下儿童的个人信息。如果您是父母或监护人，发现您的孩子向我们提供了个人信息，请联系我们，我们将采取措施从我们的系统中删除这些信息。",
    privacy_changes_title: "隐私协议的变更",
    privacy_changes_content:
      "我们可能会不时更新本隐私协议。我们会在扩展更新时通知您有关变更，并在本页面上发布新的隐私协议。我们鼓励您定期查看本隐私协议，以了解我们如何保护您的信息。",
    privacy_data_deletion_title: "数据删除",
    privacy_data_deletion_content: "如果您想删除 Tag Mark 存储的所有数据：",
    privacy_data_deletion_reset: '您可以在扩展的设置页面中使用"重置数据"功能。',
    privacy_data_deletion_uninstall: "卸载扩展将移除存储在本地的所有相关数据。",
    privacy_contact_title: "联系我们",
    privacy_contact_content: "如果您对本隐私协议有任何疑问或顾虑，请在我们的 GitHub 存储库上提交 issue，或通过以下方式联系我们：",
    privacy_contact_email: '<a href="mailto:privacy@tag-mark-extension.com" class="text-indigo-600 hover:text-indigo-800">privacy@tag-mark-extension.com</a>',
    privacy_agreement: "通过使用 Tag Mark 扩展，您同意本隐私协议中描述的数据实践。"
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
    language_en: "English",
    privacy_page_title: "Tag Mark - Privacy Policy",
    privacy_page_description: "Privacy Policy for the Tag Mark browser extension",
    privacy_title: "Privacy Policy",
    privacy_last_updated: "Last updated: March 1, 2025",
    privacy_intro_title: "Introduction",
    privacy_intro_content:
      'Tag Mark ("we", "our", or "this extension") values your privacy. This privacy policy explains how we collect, use, store, and protect your information when you use our browser extension. Please read this policy carefully to fully understand our privacy practices.',
    privacy_info_collection_title: "Information Collection",
    privacy_info_collection_content: "Tag Mark is a local bookmark management extension that primarily operates within your browser. We collect the following information:",
    privacy_info_collection_bookmarks: "<strong>Bookmark data:</strong> We access your browser bookmark data to allow you to organize and manage it using our tag system.",
    privacy_info_collection_tags: "<strong>Tag structure data:</strong> We store the tag structures you create and the associations between bookmarks and tags.",
    privacy_info_collection_settings:
      "<strong>Preference settings:</strong> Including theme choice, language settings, keyboard shortcut configurations, and other user preferences.",
    privacy_data_storage_title: "Data Storage",
    privacy_data_storage_content: "All data is stored locally in your browser:",
    privacy_data_storage_local: "All bookmark data, tag structures, and associations are stored in your browser's local storage (Chrome Storage).",
    privacy_data_storage_no_upload: "Tag Mark does not upload your data to any servers or cloud storage.",
    privacy_data_storage_sync: "If you enable browser sync functionality, your data may be synchronized across your devices through your browser's sync mechanism.",
    privacy_info_usage_title: "Information Usage",
    privacy_info_usage_content: "We use the collected information to:",
    privacy_info_usage_provide: "Provide, maintain, and improve Tag Mark's core functionality.",
    privacy_info_usage_customize: "Customize your user experience based on your preferences.",
    privacy_info_usage_ensure: "Ensure the stability and performance of the extension.",
    privacy_info_sharing_title: "Information Sharing",
    privacy_info_sharing_content: "We do not share or sell your personal information. Exceptions include:",
    privacy_info_sharing_legal: "When required by law, such as complying with court orders or other legal processes.",
    privacy_info_sharing_protection: "To protect Tag Mark's rights, property, or safety, as well as the safety of our users or the public.",
    privacy_permissions_title: "Permissions Explanation",
    privacy_permissions_content: "Tag Mark requires the following browser permissions to function properly:",
    privacy_permissions_bookmarks: "<strong>bookmarks:</strong> Used to access and manage your browser bookmarks.",
    privacy_permissions_storage: "<strong>storage:</strong> Used to store tag data and user preferences.",
    privacy_permissions_tabs: "<strong>tabs:</strong> Used to open the Tag Mark interface in a new tab.",
    privacy_data_security_title: "Data Security",
    privacy_data_security_content: "We take reasonable technical measures to protect your information:",
    privacy_data_security_local: "All data is stored only on your local device and is not transmitted to external servers.",
    privacy_data_security_code: "Extension code is reviewed to ensure there are no security vulnerabilities.",
    privacy_children_title: "Children's Privacy",
    privacy_children_content:
      "Tag Mark is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and discover that your child has provided us with personal information, please contact us and we will take steps to delete such information from our systems.",
    privacy_changes_title: "Changes to Privacy Policy",
    privacy_changes_content:
      "We may update this privacy policy from time to time. We will notify you of any changes when the extension is updated and by posting the new privacy policy on this page. We encourage you to review this privacy policy periodically to stay informed about how we are protecting your information.",
    privacy_data_deletion_title: "Data Deletion",
    privacy_data_deletion_content: "If you wish to delete all data stored by Tag Mark:",
    privacy_data_deletion_reset: 'You can use the "Reset Data" function in the extension\'s settings page.',
    privacy_data_deletion_uninstall: "Uninstalling the extension will remove all related data stored locally.",
    privacy_contact_title: "Contact Us",
    privacy_contact_content: "If you have any questions or concerns about this privacy policy, please submit an issue on our GitHub repository or contact us at:",
    privacy_contact_email: '<a href="mailto:privacy@tag-mark-extension.com" class="text-indigo-600 hover:text-indigo-800">privacy@tag-mark-extension.com</a>',
    privacy_agreement: "By using the Tag Mark extension, you agree to the data practices described in this privacy policy."
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

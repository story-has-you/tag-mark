import { useTranslation } from "@/components/i18n-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import React from "react";

// 支持的语言列表
const SUPPORTED_LOCALES = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" }
];

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { locale, changeLocale } = useTranslation();
  const [isChanging, setIsChanging] = React.useState(false);

  const handleChange = async (value: string) => {
    if (value === locale) return;

    setIsChanging(true);
    try {
      await changeLocale(value);
    } finally {
      setIsChanging(false);
    }
  };

  // 获取当前语言名称
  const getCurrentLanguageName = () => {
    return SUPPORTED_LOCALES.find((lang) => lang.code === locale)?.name || "English";
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Select value={locale} onValueChange={handleChange} disabled={isChanging}>
        <SelectTrigger
          className={cn(
            "h-9 border border-slate-200/50 dark:border-slate-700/50",
            "bg-white/80 dark:bg-slate-800/80",
            "w-auto px-3 gap-2",
            "focus:ring-0 focus:ring-offset-0",
            isChanging && "opacity-70"
          )}>
          {isChanging ? <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin" /> : <Globe className="h-4 w-4" />}
          <SelectValue>
            <span className="hidden sm:inline">{getCurrentLanguageName()}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LOCALES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;

import type { Language } from "@/i18n/messages";

type StarterWizardProps = {
  language: Language;
  showToast: (text: string, tone?: "success" | "danger") => void;
};

export function StarterWizard({ language, showToast }: StarterWizardProps) {
  return (
    <section className="section" data-testid="starter-wizard">
      <div className="section__header">
        <p className="eyebrow">Starter Wizard</p>
        <h2>{language === "zh" ? "项目向导已归档" : "Starter Wizard archived"}</h2>
        <p>
          {language === "zh"
            ? "Local Clipboard Vault 已替换模板首页；该兼容组件仅保留给旧测试或外部引用。"
            : "Local Clipboard Vault replaced the template homepage; this compatibility component remains for older tests or external imports."}
        </p>
        <button
          className="button button--secondary button--md"
          onClick={() => showToast(language === "zh" ? "已保留兼容组件" : "Compatibility component kept")}
          type="button"
        >
          OK
        </button>
      </div>
    </section>
  );
}

import { memo, type ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSectionComponent = ({ title, children }: FormSectionProps) => {
  return (
    <section className="card card-outline card-primary border-0 shadow-sm">
      <div className="card-header">
        <h3 className="card-title h6 mb-0">{title}</h3>
      </div>
      <div className="card-body">
        <div className="row g-3">{children}</div>
      </div>
    </section>
  );
};

export const FormSection = memo(FormSectionComponent);

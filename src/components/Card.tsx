import type { ReactNode } from "react";
import { classNames } from "@/lib/classNames";

type CardProps = {
  children?: ReactNode;
  className?: string;
  description?: string;
  icon?: ReactNode;
  title?: string;
  tone?: "teal" | "amber" | "blue" | "rose" | "neutral";
};

export function Card({
  children,
  className,
  description,
  icon,
  title,
  tone = "neutral",
}: CardProps) {
  return (
    <article className={classNames("card", `card--${tone}`, className)}>
      {icon ? <div className="card__icon" aria-hidden="true">{icon}</div> : null}
      {title ? <h3>{title}</h3> : null}
      {description ? <p>{description}</p> : null}
      {children}
    </article>
  );
}

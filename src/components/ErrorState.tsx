import { CircleAlert } from "lucide-react";

type ErrorStateProps = {
  body: string;
  title: string;
};

export function ErrorState({ body, title }: ErrorStateProps) {
  return (
    <div className="state state--error" data-testid="error-state" role="alert">
      <CircleAlert size={28} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

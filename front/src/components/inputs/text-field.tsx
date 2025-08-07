import { Label } from "../ui/label";
import { useFieldContext } from "./form-context";
import { Input } from "../ui/input";

type TextFieldProps = {
  label: string | BigInt;
} & React.ComponentProps<"input">;

export function TextField({ label, ...props }: TextFieldProps) {
  const field = useFieldContext<string>();
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label.toString()}</Label>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
    </div>
  );
}

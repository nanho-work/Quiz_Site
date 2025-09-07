interface AnswerOptionProps {
  value: string;
  label: string;
  onSelect: (value: string) => void;
}

export default function AnswerOption({ value, label, onSelect }: AnswerOptionProps) {
  return (
    <label
      className="flex items-center p-3 sm:p-4 bg-muted rounded-lg cursor-pointer 
                 hover:bg-muted/80 transition-colors border border-transparent 
                 hover:border-primary/20"
    >
      <input
        type="radio"
        name="answer"
        value={value}
        className="hidden"
        onChange={() => onSelect(value)}
      />
      <span className="text-card-foreground">{label}</span>
    </label>
  );
}
import AnswerOption from "./AnswerOption";

interface QuestionCardProps {
  title: string;
  text: string;
  options: string[];
  onAnswer: (value: string) => void;
}

export default function QuestionCard({ title, text, options, onAnswer }: QuestionCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
      <div className="text-center mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mb-2">
          {title}
        </h1>
        <p className="text-muted-foreground">당신의 성격 유형을 알아보세요!</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 text-center">
          {text}
        </h2>
        <div className="space-y-4">
          {options.map((option, index) => (
            <AnswerOption
              key={index}
              value={String.fromCharCode(65 + index)}
              label={option}
              onSelect={onAnswer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTestById } from "../../../data/tests";

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const test = id ? getTestById(id) : null;

  useEffect(() => {
    if (!test) {
      router.push("/");
    }
  }, [test, router]);

  if (!test) {
    return null;
  }

  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const question = test.questions[currentQuestion];

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(""); // 선택 초기화
    } else {
      sessionStorage.setItem(`test-${id}-answers`, JSON.stringify(newAnswers));
      router.push(`/result/${id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            진행률
          </span>
          <span
            className="text-sm font-medium text-primary"
            data-testid="progress-text"
          >
            {currentQuestion + 1}/{test.questions.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card rounded-xl shadow-lg border border-border p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <div className="text-center mb-8">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mb-2"
            data-testid="test-title"
          >
            {test.title}
          </h1>
          <p className="text-muted-foreground">
            당신의 성격 유형을 알아보세요!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2
            className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 text-center"
            data-testid="question-text"
          >
            Q{currentQuestion + 1}. {question.text}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => {
              const value = String.fromCharCode(65 + index); // A, B

              return (
                <label
                  key={index}
                  className={`flex items-center p-3 sm:p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors border border-transparent hover:border-primary/20`}
                  data-testid={`answer-option-${value}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={value}
                    onChange={() => handleAnswerSelect(value)}
                    className="radio-custom mr-4"
                  />
                  <span className="text-card-foreground">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Counter */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          <i className="fas fa-lightbulb mr-1"></i>
          솔직하게 답변해주세요. 정답은 없어요! 😊
        </p>
      </div>
    </div>
  );
}
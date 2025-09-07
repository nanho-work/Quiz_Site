"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTestById } from "../../../data/tests";

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const test = id ? getTestById(id) : null;
  const [answers, setAnswers] = useState<string[]>(
    Array(test?.questions.length ?? 0).fill("")
  );

  useEffect(() => {
    if (!test) {
      router.push("/");
    }
  }, [test, router]);

  if (!test) {
    return null;
  }

  const start = currentPage * pageSize;
  const end = start + pageSize;
  const currentQuestions = test.questions.slice(start, end);

  const answeredCount = answers.filter(Boolean).length;
  const progress = (answeredCount / test.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {answeredCount}/{test.questions.length}
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
      <div className="bg-card rounded-xl shadow-lg border border-border p-8 mb-8">
        <div className="text-center mb-8">
          <h1
            className="text-2xl md:text-3xl font-bold text-card-foreground mb-2"
            data-testid="test-title"
          >
            {test.title}
          </h1>
          <p className="text-muted-foreground">
            당신의 성격 유형을 알아보세요!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {currentQuestions.map((question, qIndex) => {
            const questionNumber = start + qIndex + 1;
            return (
              <div key={qIndex} className="mb-6">
                <h2 className="text-xl font-semibold text-card-foreground mb-4 text-center">
                  Q{questionNumber}. {question.text}
                </h2>
                <div className="space-y-2">
                  {question.options.map((option, index) => {
                    const value = String.fromCharCode(65 + index);
                    const isSelected = answers[questionNumber - 1] === value;
                    return (
                      <label key={index} className={`flex items-center p-3 bg-muted rounded-lg cursor-pointer transition-colors border ${isSelected ? "border-primary bg-primary/5" : "border-transparent hover:border-primary/20"}`}>
                        <input
                          type="radio"
                          name={`answer-${questionNumber}`}
                          value={value}
                          checked={isSelected}
                          onChange={() => {
                            const newAnswers = [...answers];
                            newAnswers[questionNumber - 1] = value;
                            setAnswers(newAnswers);
                          }}
                          className="radio-custom mr-3"
                        />
                        <span className="text-card-foreground">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="text-center mt-8">
            <button
              onClick={() => {
                if (end < test.questions.length) {
                  // 현재 페이지의 5문항 답변 여부 확인
                  const pageAnswers = answers.slice(start, end);
                  const isPageComplete = pageAnswers.every(Boolean);
                  if (!isPageComplete) {
                    alert("모든 문항에 답변해 주세요!");
                    return;
                  }
                  setCurrentPage(currentPage + 1);
                } else {
                  if (answeredCount < test.questions.length) {
                    alert("모든 문항에 답변해 주세요!");
                    return;
                  }
                  sessionStorage.setItem(`test-${id}-answers`, JSON.stringify(answers));
                  router.push(`/result/${id}`);
                }
              }}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              {end < test.questions.length ? "다음 5문항" : "결과보기"}
            </button>
          </div>
        </div>
      </div>

      {/* Question Counter */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          <i className="fas fa-lightbulb mr-1"></i>
          솔직하게 답변해주세요. 정답은 없어요! 😊
        </p>
      </div>
    </div>
  );
}
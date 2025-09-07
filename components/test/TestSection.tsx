"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTestById } from "../../data/tests";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import QuestionFooter from "./QuestionFooter";

interface TestSectionProps {
  id: string;
}

export default function TestSection({ id }: TestSectionProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const test = id ? getTestById(id) : null;

  useEffect(() => {
    if (!test) router.push("/");
  }, [test, router]);

  if (!test) return null;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      sessionStorage.setItem(`test-${id}-answers`, JSON.stringify(newAnswers));
      router.push(`/result/${id}`);
    }
  };

  const question = test.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <ProgressBar current={currentQuestion} total={test.questions.length} />
      <QuestionCard
        title={test.title}
        text={`Q${currentQuestion + 1}. ${question.text}`}
        options={question.options}
        onAnswer={handleAnswerSelect}
      />
      <QuestionFooter />
    </div>
  );
}
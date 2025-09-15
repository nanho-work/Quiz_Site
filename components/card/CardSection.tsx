import React from "react";
import { tests } from "../../data/tests";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import Link from "next/link";

export default function TestCardSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tests.map((test) => (
        <Card
          key={test.id}
          className="card-hover shadow-lg h-[28rem] flex flex-col"
        >
          <div
            className={`h-48 rounded-t-lg flex items-center justify-center bg-cover bg-center ${
              !test.image ? `bg-gradient-to-br ${test.gradient}` : ""
            }`}
            style={test.image ? { backgroundImage: `url(${test.image})` } : {}}
          >
            <div className="text-center">
              <i className={`${test.icon} text-4xl text-white mb-3`}></i>
              <h3 className="text-white font-bold text-lg">
                {test.title.split(" ")[0]}
              </h3>
            </div>
          </div>
          <CardHeader>
            <CardTitle>{test.title}</CardTitle>
            <CardDescription>{test.description}</CardDescription>
          </CardHeader>
          <CardContent>{/* 추가 내용 필요 시 여기에 */}</CardContent>
          <CardFooter className="mt-auto">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-muted-foreground">
                소요 시간: {test.duration}
              </p>
              <Link
                href={`/test/${test.id}`}
                className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                테스트 시작
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
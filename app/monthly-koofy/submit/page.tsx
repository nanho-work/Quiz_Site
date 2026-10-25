import type { Metadata } from 'next';
import Submission from '../../../components/monthly/Submission';
export const metadata: Metadata = {
  title: '월간 쿠피 독자 투고 | Koofy Lab',
  description: '일상의 짧은 이야기와 글을 월간 쿠피에 보내주세요. 한국어·영어·일본어 독자 투고 안내.',
  alternates: { canonical: '/monthly-koofy/submit' },
};
export default function Page() { return <Submission />; }

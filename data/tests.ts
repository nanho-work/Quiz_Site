export interface Question {
  text: string;
  options: [string, string];
}

export interface TestResult {
  type: string;
  title: string;
  description: string;
  image: string;
  characteristics: string[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon?: string;
  image?: string;
  gradient?: string;
  questions: Question[];
  results: Record<string, TestResult>;
}

export const tests: Test[] = [
  {
    id: "personality",
    title: "에겐남/테토남 테스트",
    description: "여성성이 강한(공감, 감정, 관계 지향) 에겐남인지, 남성성이 강한(논리, 성취, 결과 지향) 테토남인지 10가지 질문으로 알아보세요!",
    duration: "3분 소요",
    icon: "fas fa-users",
    image: "/egenteto.png",
    questions: [
      {
        text: "친구가 힘들어할 때 당신의 반응은?",
        options: ["감정을 공감하고 위로한다", "문제 해결 방안을 제시한다"]
      },
      {
        text: "중요한 결정을 내릴 때 당신은?",
        options: ["상대방의 감정과 관계를 우선한다", "논리적 근거와 결과를 우선한다"]
      },
      {
        text: "팀 프로젝트에서 당신의 역할은?",
        options: ["분위기 조율과 협력을 이끈다", "목표 설정과 성과를 주도한다"]
      },
      {
        text: "갈등 상황이 발생했을 때?",
        options: ["상대방 기분을 배려하며 부드럽게 해결한다", "직접적으로 문제를 지적하고 해결한다"]
      },
      {
        text: "일상에서 더 중요하게 생각하는 것은?",
        options: ["정서적 안정과 관계", "성취와 결과"]
      },
      {
        text: "스트레스를 받을 때 주로 하는 행동은?",
        options: ["주변 사람과 대화하며 감정을 나눈다", "혼자 조용히 정리하거나 운동한다"]
      },
      {
        text: "새로운 사람을 만났을 때 당신은?",
        options: ["상대방의 감정에 민감하게 반응한다", "상황을 파악하고 분석한다"]
      },
      {
        text: "타인과의 관계에서 자주 듣는 평가는?",
        options: ["공감 능력이 뛰어나다", "의지가 강하다"]
      },
      {
        text: "주말에 더 끌리는 활동은?",
        options: ["가족, 친구와 감정 나누기", "개인 목표나 자기계발"]
      },
      {
        text: "인생에서 더 중요하게 여기는 가치는?",
        options: ["사랑과 유대감", "성취와 성공"]
      }
    ],
    results: {
      high: {
        type: "에겐남",
        title: "나는 에겐남일까, 테토남일까? 🤔",
        description: "여성성이 강한(공감, 감정, 관계 지향) 에겐남입니다. 타인의 감정에 공감하고, 따뜻한 위로와 배려로 주변 사람들과 깊은 유대감을 맺는 데 능합니다. 감정과 관계를 소중히 여기며, 조화로운 분위기를 만드는 데 자연스럽게 힘을 발휘해요. 🌸",
        image: "/extrovert.png",
        characteristics: ["공감력", "관계 지향", "정서적 안정", "배려심", "유대감"]
      },
      low: {
        type: "테토남",
        title: "나는 에겐남일까, 테토남일까? 🤔",
        description: "남성성이 강한(논리, 성취, 결과 지향) 테토남입니다. 논리적 사고와 목표 지향적 태도로 문제를 해결하고, 성과와 성공을 중시하는 경향이 있습니다. 독립적이고 의지가 강하며, 효율적으로 결과를 만들어내는 데 탁월해요. 🏆",
        image: "/introvert.png",
        characteristics: ["논리적", "성취 지향", "독립적", "의지력", "효율성"]
      }
    }
  },
  {
    id: "personality-female",
    title: "에겐녀/테토녀 테스트",
    description: "여성성이 강한(공감, 감정, 관계 지향) 에겐녀인지, 남성성이 강한(논리, 성취, 결과 지향) 테토녀인지 10가지 질문으로 알아보세요!",
    duration: "3분 소요",
    icon: "fas fa-female",
    image: "/mbti/egentetogirl.png",
    questions: [
      {
        text: "친한 친구가 힘들어할 때 당신의 반응은?",
        options: ["따뜻하게 공감하며 위로한다", "문제 해결 방법을 구체적으로 제시한다"]
      },
      {
        text: "중요한 결정을 앞두고 있을 때 당신은?",
        options: ["주변 사람의 감정과 관계를 고려한다", "논리적 근거와 결과를 중심으로 판단한다"]
      },
      {
        text: "직장이나 모임에서 주로 맡는 역할은?",
        options: ["분위기를 조율하고 팀워크를 만든다", "목표를 설정하고 성과를 주도한다"]
      },
      {
        text: "갈등 상황이 생겼을 때?",
        options: ["상대방 기분을 배려하며 부드럽게 해결한다", "직접적으로 문제를 지적하고 빠르게 해결한다"]
      },
      {
        text: "일상에서 더 중요하게 여기는 것은?",
        options: ["정서적 안정과 관계", "개인 성취와 결과"]
      },
      {
        text: "스트레스를 받을 때 주로 하는 행동은?",
        options: ["친구와 대화하며 감정을 나눈다", "혼자 시간을 가지며 정리하거나 운동한다"]
      },
      {
        text: "새로운 사람을 만났을 때 당신은?",
        options: ["상대방의 감정에 민감하게 반응한다", "상황을 분석하고 파악한다"]
      },
      {
        text: "주변 사람들이 자주 하는 평가는?",
        options: ["따뜻하고 공감 능력이 좋다", "독립적이고 의지가 강하다"]
      },
      {
        text: "주말에 더 끌리는 활동은?",
        options: ["가족, 친구와 즐겁게 보내기", "자기계발이나 개인 프로젝트"]
      },
      {
        text: "삶에서 더 중요하게 여기는 가치는?",
        options: ["사랑과 유대감", "성취와 성공"]
      }
    ],
    results: {
      high: {
        type: "에겐녀",
        title: "나는 에겐녀일까, 테토녀일까? 🤔",
        description: "공감과 관계 지향의 특성이 두드러지는 에겐녀입니다. 따뜻한 감성과 세심한 배려로 주변 사람들에게 힘이 되어주며, 감정과 인간관계를 소중히 여깁니다. 조화로운 분위기를 만들어내는 데 강점을 발휘해요. 🌸",
        image: "/mbti/egengirl.png",
        characteristics: ["공감력", "배려심", "관계 지향", "정서적 안정", "유대감"]
      },
      low: {
        type: "테토녀",
        title: "나는 에겐녀일까, 테토녀일까? 🤔",
        description: "논리와 성취 지향의 성향이 강한 테토녀입니다. 명확한 목표와 실질적인 성과를 중시하며, 독립적이고 자기주도적인 태도로 결과를 만들어냅니다. 문제 해결과 효율성 면에서 탁월해요. 🏆",
        image: "/mbti/tetogirl.png",
        characteristics: ["논리적", "성취 지향", "독립적", "의지력", "효율성"]
      }
    }
  },
  {
    id: "mbti",
    title: "MBTI 당신의 유형은? 지금 바로 확인하세요",
    "description": "전 세계가 열광하는 MBTI 성격 유형 테스트. 단 5분 만에 나의 성격 유형과 특성을 알 수 있습니다.\n단 3분 만에 성격 유형과 숨겨진 강점을 확인하세요. 친구와 비교하면 더 재미있습니다. 결과는 무료입니다.",
    duration: "10분 소요",
    icon: "fas fa-brain",
    image: "/mbti.png",
    questions: [
      // E vs I
      { text: "새로운 사람을 만나면 에너지가 충전된다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "파티나 모임에서 주인공이 되는 편이다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "고민이 있을 때 사람들과 이야기하며 푼다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "주말에는 약속을 잡는 편이다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "대화를 시작하는 것이 자연스럽다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "낯선 환경에서 쉽게 적응한다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "다른 사람과 함께 일할 때 더 잘한다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "내 생각을 바로 표현하는 편이다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "발표가 즐겁다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "친구가 많고 다양한 모임에 속한다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "전화 통화가 편하다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "즉흥적인 만남도 즐겁다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "처음 보는 사람과 금방 친해진다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "소음이 많은 곳에서도 괜찮다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "활발히 대화가 오가는 회의가 좋다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "감정을 쉽게 드러낸다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "다양한 활동에 참여하고 싶다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "혼자 있을 때 심심하다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "여행 갈 때 동행이 많을수록 즐겁다", options: ["그렇다", "아니다"] }, // (E vs I)
      { text: "즉각적으로 반응하는 편이다", options: ["그렇다", "아니다"] }, // (E vs I)

      // S vs N
      { text: "세부적인 사실에 주의를 기울인다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "과거 경험을 중요시한다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "설명할 때 구체적인 예시를 든다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "매일의 루틴이 편하다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "실제로 눈에 보이는 것에 집중한다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "전통과 규칙을 존중한다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "실용성이 중요한 기준이다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "지금 해야 할 일에 집중한다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "이미 검증된 방법을 선호한다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "작은 디테일까지 챙긴다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "현재 경험을 즐긴다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "실제 사례로 배우는 걸 선호한다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "현실적이고 구체적인 목표를 세운다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "작은 실수도 신경 쓰인다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "‘지금’에 초점을 맞춘다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "절차를 지키는 편이다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "눈앞의 이익을 중시한다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "기억력이 좋다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "매뉴얼대로 하는 게 편하다", options: ["그렇다", "아니다"] }, // (S vs N)
      { text: "이미 있는 것을 다듬는다", options: ["그렇다", "아니다"] }, // (S vs N)

      // T vs F
      { text: "의사결정 시 논리가 우선이다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "문제를 분석적으로 본다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "공정함이 중요하다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "갈등 상황에서 원인을 따진다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "사실을 직설적으로 말한다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "토론이 즐겁다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "성과가 가장 중요한 기준이다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "규칙을 엄격히 적용한다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "일 처리 시 효율성을 따진다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "객관적 사실을 믿는다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "이성적으로 위로한다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "의견 충돌을 기회로 본다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "냉철하다는 평가를 듣는다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "규칙이 우선이다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "실적이 나쁘면 이유를 분석한다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "의사결정이 빠르다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "논리적 설명을 선호한다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "옳고 그름이 분명하다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "경쟁 상황에서 불타오른다", options: ["그렇다", "아니다"] }, // (T vs F)
      { text: "정답을 찾는 게 중요하다", options: ["그렇다", "아니다"] }, // (T vs F)

      // J vs P
      { text: "할 일을 미리 계획한다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "계획대로 진행해야 마음이 편하다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "일정표를 꼼꼼히 관리한다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "목표가 명확해야 동기부여 된다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "일찍 도착하는 편이다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "숙제를 미리 한다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "깔끔하게 정리한다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "정해진 규칙을 따른다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "미리 준비하는 게 습관이다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "계획을 세우는 게 즐겁다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "체계적으로 일한다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "미래를 미리 대비한다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "마감 기한 전에 끝낸다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "깔끔한 환경이 필요하다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "계획이 틀어지면 불안하다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "주어진 규칙을 지킨다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "‘완료’ 체크가 즐겁다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "루틴이 안정감을 준다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "목표를 설정해 달성한다", options: ["그렇다", "아니다"] }, // (J vs P)
      { text: "정리된 일정표가 필수다", options: ["그렇다", "아니다"] }, // (J vs P)
    ],
    results: {
      ISTJ: {
        type: "ISTJ",
        title: "청렴결백한 논리주의자",
        description: "ISTJ 유형은 신뢰할 수 있고 책임감이 강한 사람들로, 전통과 규칙을 중요시하며 체계적인 접근을 선호합니다. 이들은 세부 사항에 주의를 기울이고, 맡은 일을 끝까지 완수하는 성실함을 지니고 있습니다. 사회적으로는 신중하고 실용적인 조언자로서 주변 사람들에게 안정감을 주며, 어려운 상황에서도 침착하게 문제를 해결하는 능력이 뛰어납니다.",
        image: "/mbti/ISTJ.png",
        characteristics: ["신뢰성", "실용적", "책임감", "체계적"]
      },
      ISFJ: {
        type: "ISFJ",
        title: "용감한 수호자",
        description: "ISFJ는 따뜻하고 헌신적인 성격으로, 타인의 필요에 민감하게 반응하며 조용히 돕는 것을 즐깁니다. 이들은 전통과 안정성을 중시하며, 주변 사람들에게 신뢰받는 든든한 버팀목 역할을 합니다. 대인관계에서 세심한 배려와 충성심을 발휘하며, 갈등 상황에서도 조화를 유지하려 노력하는 평화주의자입니다.",
        image: "/mbti/ISFJ.png",
        characteristics: ["헌신", "배려심", "책임감", "안정적"]
      },
      INFJ: {
        type: "INFJ",
        title: "선의의 옹호자",
        description: "INFJ는 깊은 통찰력과 이상주의를 가진 사람들로, 타인의 성장과 행복에 진심으로 관심을 기울입니다. 이들은 복잡한 감정을 이해하고 조화롭게 소통하는 능력이 뛰어나며, 강한 직관력으로 미래를 내다보는 경향이 있습니다. 사회적으로는 신뢰받는 조언자이자 변화를 이끄는 리더로서, 의미 있는 관계와 목표를 추구합니다.",
        image: "/mbti/INFJ.png",
        characteristics: ["통찰력", "이상주의", "배려", "깊은 사고"]
      },
      INTJ: {
        type: "INTJ",
        title: "용의주도한 전략가",
        description: "INTJ 유형은 독립적이고 분석적인 사고를 가진 전략가로, 복잡한 문제를 체계적으로 해결하는 데 강점을 보입니다. 이들은 장기적인 목표를 세우고 이를 실현하기 위해 계획적으로 행동하며, 높은 자기주도성을 자랑합니다. 사회적으로는 논리적이고 냉철한 판단력으로 존경받으며, 혁신적인 아이디어를 통해 변화를 주도하는 리더 역할을 합니다.",
        image: "/mbti/INTJ.png",
        characteristics: ["전략적", "독립적", "분석적", "목표 지향"]
      },
      ISTP: {
        type: "ISTP",
        title: "만능 재주꾼",
        description: "ISTP는 현실적이고 문제 해결에 뛰어난 실용주의자로, 손재주와 즉각적인 대응 능력을 갖추고 있습니다. 이들은 새로운 도전을 즐기며, 상황에 맞게 유연하게 대처하는 능력이 탁월합니다. 사회적으로는 조용하지만 신뢰할 수 있는 존재로, 독립적인 태도로 자신만의 방식으로 목표를 달성합니다.",
        image: "/mbti/ISTP.png",
        characteristics: ["실용적", "적응력", "문제 해결", "독립성"]
      },
      ISFP: {
        type: "ISFP",
        title: "호기심 많은 예술가",
        description: "ISFP 유형은 감성적이고 창의적인 예술가로, 자유로운 표현과 따뜻한 마음씨를 지니고 있습니다. 이들은 현재 순간을 즐기며, 타인의 감정을 잘 이해하고 공감하는 능력이 뛰어납니다. 사회적으로는 조용하지만 친절한 존재로, 자신의 가치관에 충실하며 주변에 긍정적인 영향을 미칩니다.",
        image: "/mbti/ISFP.png",
        characteristics: ["예술적", "따뜻함", "자유로움", "공감력"]
      },
      INFP: {
        type: "INFP",
        title: "열정적인 중재자",
        description: "INFP는 이상주의적이고 내면의 가치에 충실한 사람들로, 타인과의 조화와 깊은 의미를 추구합니다. 이들은 창의적이고 상상력이 풍부하며, 자신의 신념을 지키기 위해 노력합니다. 사회적으로는 따뜻하고 이해심 많은 조언자로서, 사람들의 성장을 돕고 긍정적인 변화를 이끄는 역할을 합니다.",
        image: "/mbti/INFP.png",
        characteristics: ["이상주의", "조화", "창의성", "배려"]
      },
      INTP: {
        type: "INTP",
        title: "논리적인 사색가",
        description: "INTP 유형은 분석적이고 호기심이 많은 사색가로, 복잡한 개념을 탐구하고 새로운 아이디어를 창출하는 데 탁월합니다. 이들은 독립적인 사고를 중시하며, 문제를 논리적으로 해결하려는 경향이 강합니다. 사회적으로는 다소 내성적이지만 깊이 있는 대화를 즐기며, 혁신적인 해결책을 제시하는 지적인 존재입니다.",
        image: "/mbti/INTP.png",
        characteristics: ["분석적", "창의적", "호기심", "독립적"]
      },
      ESTP: {
        type: "ESTP",
        title: "모험을 즐기는 사업가",
        description: "ESTP는 활동적이고 현실적인 성격으로, 즉각적인 행동과 도전을 즐기는 모험가입니다. 이들은 주변 상황을 빠르게 파악하고 유연하게 대처하는 능력이 뛰어나며, 사람들과의 상호작용에서 활력을 얻습니다. 사회적으로는 열정적이고 설득력 있는 리더로, 문제 해결과 기회 포착에 능숙합니다.",
        image: "/mbti/ESTP.png",
        characteristics: ["모험심", "활발함", "실용적", "직설적"]
      },
      ESFP: {
        type: "ESFP",
        title: "자유로운 연예인",
        description: "ESFP 유형은 사교적이고 낙천적인 성격으로, 현재 순간을 즐기며 주변 사람들과의 관계를 소중히 여깁니다. 이들은 타인을 즐겁게 하고 분위기를 밝게 만드는 데 능하며, 즉흥적인 상황에서도 유연하게 대처합니다. 사회적으로는 활기차고 긍정적인 에너지를 발산하며, 사람들에게 친근하고 사랑받는 존재입니다.",
        image: "/mbti/ESFP.png",
        characteristics: ["사교성", "활발함", "긍정적", "즉흥적"]
      },
      ENFP: {
        type: "ENFP",
        title: "재기발랄한 활동가",
        description: "ENFP는 창의적이고 열정적인 성격으로, 새로운 가능성을 탐구하고 사람들과 깊이 연결되기를 원합니다. 이들은 에너지 넘치고 낙관적이며, 타인의 잠재력을 발견하고 격려하는 데 재능이 있습니다. 사회적으로는 영감을 주는 리더이자 활발한 소통가로, 변화를 주도하며 긍정적인 분위기를 만듭니다.",
        image: "/mbti/ENFP.png",
        characteristics: ["창의성", "열정", "사교성", "자유로움"]
      },
      ENTP: {
        type: "ENTP",
        title: "뜨거운 논쟁가",
        description: "ENTP 유형은 재치 있고 논쟁을 즐기는 혁신가로, 새로운 아이디어와 가능성을 탐구하는 데 열정적입니다. 이들은 빠른 사고와 유연한 사고방식을 지니며, 복잡한 문제를 창의적으로 해결하는 능력이 뛰어납니다. 사회적으로는 활발한 토론가이자 설득력 있는 리더로, 변화를 두려워하지 않고 도전하는 모습을 보입니다.",
        image: "/mbti/ENTP.png",
        characteristics: ["재치", "혁신", "논리적", "활발함"]
      },
      ESTJ: {
        type: "ESTJ",
        title: "엄격한 관리자",
        description: "ESTJ는 조직적이고 현실적인 리더로, 규칙과 질서를 중시하며 목표 달성을 위해 노력합니다. 이들은 책임감이 강하고 결단력 있으며, 효율적인 시스템과 구조를 만드는 데 뛰어난 능력을 발휘합니다. 사회적으로는 신뢰받는 관리자이며, 팀을 이끌고 문제를 해결하는 데 탁월한 역할을 합니다.",
        image: "/mbti/ESTJ.png",
        characteristics: ["리더십", "체계적", "신뢰성", "현실적"]
      },
      ESFJ: {
        type: "ESFJ",
        title: "사교적인 외교관",
        description: "ESFJ는 따뜻하고 친절한 성격으로, 사람들과의 조화와 협력을 중요하게 생각합니다. 이들은 타인의 감정을 잘 이해하고 배려하며, 공동체 내에서 신뢰받는 존재입니다. 사회적으로는 활발한 소통가이자 협력자로서, 주변 사람들의 필요를 챙기고 분위기를 긍정적으로 이끌어갑니다.",
        image: "/mbti/ESFJ.png",
        characteristics: ["친절함", "사교성", "배려", "조화"]
      },
      ENFJ: {
        type: "ENFJ",
        title: "정의로운 사회운동가",
        description: "ENFJ는 카리스마 있고 타인을 이끄는 능력이 뛰어난 리더로, 협력과 배려를 통해 긍정적인 변화를 추구합니다. 이들은 사람들의 잠재력을 발견하고 격려하며, 공동의 목표를 위해 헌신하는 성향이 강합니다. 사회적으로는 영감을 주는 지도자이며, 깊은 인간관계를 통해 신뢰와 존경을 받습니다.",
        image: "/mbti/ENFJ.png",
        characteristics: ["카리스마", "배려", "리더십", "조화"]
      },
      ENTJ: {
        type: "ENTJ",
        title: "대담한 통솔자",
        description: "ENTJ는 강력한 리더십과 전략적 사고를 가진 통솔자로, 목표 달성을 위해 조직을 효율적으로 이끌어갑니다. 이들은 결단력 있고 자신감이 넘치며, 복잡한 문제를 체계적으로 해결하는 능력이 뛰어납니다. 사회적으로는 혁신적인 지도자이며, 도전적인 상황에서도 흔들림 없이 팀을 이끌어 성공을 추구합니다.",
        image: "/mbti/ENTJ.png",
        characteristics: ["리더십", "전략적", "결단력", "목표 지향"]
      }
    }
  }
];

export function getTestById(id: string): Test | undefined {
  return tests.find(test => test.id === id);
}

export function calculateResult(testId: string, answers: string[]): TestResult & { percentage?: number } {
  const test = getTestById(testId);
  if (!test) {
    throw new Error("Test not found");
  }

  if (testId === "personality" || testId === "personality-female") {
    const aCount = answers.filter(answer => answer === 'A').length;
    const percentage = Math.round((aCount / answers.length) * 100);
    const result = percentage >= 60 ? test.results.high : test.results.low;
    return {
      ...result,
      percentage
    };
  }

  if (testId === "mbti") {
    let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;
    answers.forEach((ans, idx) => {
      if (idx >= 0 && idx <= 19) {
        ans === 'A' ? E++ : I++;
      } else if (idx >= 20 && idx <= 39) {
        ans === 'A' ? S++ : N++;
      } else if (idx >= 40 && idx <= 59) {
        ans === 'A' ? T++ : F++;
      } else if (idx >= 60 && idx <= 79) {
        ans === 'A' ? J++ : P++;
      }
    });
    const type =
      (E >= I ? "E" : "I") +
      (S >= N ? "S" : "N") +
      (T >= F ? "T" : "F") +
      (J >= P ? "J" : "P");
    return test.results[type];
  }

  throw new Error("Unsupported test type");
}

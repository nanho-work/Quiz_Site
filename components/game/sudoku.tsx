import React from "react";

const SudokuDescription: React.FC = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-8 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-center pb-2 mb-4 border-b border-gray-300">
        🧩 스도쿠 퍼즐을 지금 바로 즐겨보세요!
      </h2>
      <div className="space-y-6">
        <p className="text-gray-700 text-left">
          두뇌 회전이 필요할 때, 스도쿠 퍼즐만큼 좋은 선택은 없습니다! 간단한 규칙과 깊이 있는 논리적 사고의 결합으로, 남녀노소 누구나 즐길 수 있는 <strong>스도쿠</strong>에 도전해 보세요. 차분히 숫자를 채워가며 자신만의 전략을 세우고, 정답을 찾는 짜릿함을 경험해 보시기 바랍니다.
          <br />
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow p-5 text-left">
          <h3 className="text-xl font-semibold mb-2 pb-1 border-b border-gray-200">📝 스도쿠 퍼즐에 대하여</h3>
          <p className="text-gray-700">
            스도쿠는 9×9 크기의 격자를 3×3의 작은 구역 9개로 나눈 퍼즐 게임입니다.
            <br /><br />
            일부 칸에는 이미 숫자가 채워져 있으며, 
            <br />
            나머지 빈 칸을 <strong>1부터 9까지의 숫자</strong>로 채워야 합니다.
            <br /><br />
            단순해 보이지만, 논리적 추론과 집중력이 요구되는 
            <br />
            <strong>두뇌 트레이닝 게임</strong>으로 전 세계적으로 인기가 높습니다.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow p-5 text-left">
          <h3 className="text-xl font-semibold mb-2 pb-1 border-b border-gray-200">📜 스도쿠 규칙</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>각 <strong>행</strong>에는 1부터 9까지의 숫자가 <strong>한 번씩만</strong> 들어가야 합니다.</li>
            <li>각 <strong>열</strong>에도 1부터 9까지의 숫자가 <strong>중복 없이</strong> 들어가야 합니다.</li>
            <li>각 <strong>3×3 구역</strong>에도 1부터 9까지의 숫자가 <strong>모두 한 번씩</strong> 들어가야 합니다.</li>
            <li>빈 칸을 채울 때, 이미 채워진 숫자를 참고하여 규칙을 지켜야 합니다.</li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow p-5 text-left">
          <h3 className="text-xl font-semibold mb-2 pb-1 border-b border-gray-200">🎯 스도쿠 퍼즐 하는 방법</h3>
          <p className="text-gray-700">
            스도쿠의 목표와 게임 오버 조건은 다음과 같습니다:
            <br />
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li><strong>목표:</strong> 9×9 격자의 모든 빈 칸을 규칙에 맞게 숫자로 채워 넣으세요.</li>
            <li><strong>실패 조건:</strong> 같은 행, 열 또는 3×3 구역 내에 동일한 숫자가 
            <br /><span className="ml-4">두 번 이상 들어가면 규칙 위반입니다.</span> 
            <br /><span className="ml-4">모든 칸을 올바르게 채우지 못하면 게임이 완료되지 않습니다.</span> </li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow p-5 text-left">
          <h3 className="text-xl font-semibold mb-2 pb-1 border-b border-gray-200">💡 스도쿠 퍼즐 팁</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            <li>숫자가 이미 많이 채워진 행, 열, 또는 3×3 구역을 먼저 살펴보세요. 
              <br /><span className="ml-4">가능한 숫자가 제한되기 때문에 빈 칸을 쉽게 채울 수 있습니다.</span>
              </li>
            <li>특정 숫자가 어느 위치에 올 수 있는지 행과 열을 따라 추적해보세요. 
              <br /><span className="ml-4">겹치는 부분을 찾으면 정답 칸이 좁혀집니다.</span>
              </li>
            <li>여러 칸에 후보 숫자를 메모하면서, 
              <br /><span className="ml-4">가능한 경우의 수를 줄여나가는 것도 좋은 전략입니다.</span>
              </li>
            <li>막혔을 때는 잠시 쉬었다가 다시 시도하거나,
              <br /><span className="ml-4">다른 구역부터 풀어보면 새로운 실마리가 보일 수 있습니다.</span>
            </li>
          </ol>
        </div>

        <p className="mt-6 text-left font-medium text-lg text-green-600">
          지금 바로 스도쿠 퍼즐을 풀며 <strong>논리적 사고력과 집중력</strong>을 키워보세요! 
          <br />여러분의 도전을 응원합니다. 🏆
          <br />
        </p>
      </div>
    </div>
  );
};

export default SudokuDescription;
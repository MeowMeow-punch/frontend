import type { CommunityDetailPost, CommunitySummary } from '@/services/communityService'

const dummyContent = (_title: string, body: string) => `
  <div class="space-y-6 text-[16px] leading-relaxed text-[#333]">
    <div class="prose prose-lg max-w-none">
       ${body}
    </div>
  </div>
`

export const MOCK_COMMUNITY_DATA: CommunityDetailPost[] = [
  {
    postId: 1,
    title: '간헐적 단식, 정말 효과가 있을까? 성공을 위한 완벽 가이드',
    category: 'DIET',
    createdAt: '2024-11-14T09:00:00',
    likes: 124,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1620706857370-e1b9fb92cee9?q=80&w=800&auto=format&fit=crop',
    writer: '박건강 영양사',
    content: dummyContent(
      '간헐적 단식, 정말 효과가 있을까?',
      `
      <p class="mb-6">
        최근 몇 년간 웰니스 트렌드에서 빠지지 않는 키워드가 바로 '간헐적 단식(Intermittent Fasting)'입니다. 실리콘밸리의 CEO들부터 유명 연예인들까지, 수많은 사람들이 이 식습관을 찬양하고 있죠. 단순히 "굶어서 뺀다"는 다이어트 방법론을 넘어, 우리 몸의 대사 시스템을 재설정하는 건강법으로 주목받고 있습니다. 과연 간헐적 단식은 과학적으로 증명된 효과가 있을까요? 그리고 어떻게 해야 부작용 없이 성공할 수 있을까요?
      </p>
      
      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. 간헐적 단식의 과학적 원리</h3>
      <p class="mb-4">
        우리 몸은 섭취한 음식을 포도당으로 분해하여 에너지원으로 사용하고, 남은 에너지는 간과 근육에 글리코겐 형태로 저장하거나 지방세포에 지방으로 저장합니다. 식사 후 인슐린 수치가 높아져 있는 동안에는 지방 연소가 일어나기 어렵습니다.
      </p>
      <p class="mb-6">
        하지만 공복 상태가 12시간 이상 지속되면 인슐린 수치가 급격히 떨어지며 우리 몸은 저장된 지방을 꺼내 쓰기 시작하는 '대사 전환(Metabolic Switch)'을 일으킵니다. <strong>간헐적 단식의 핵심은 바로 이 지방 연소 모드를 인위적으로 길게 유지하는 것</strong>입니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. 대표적인 단식 방법들</h3>
      <div class="space-y-6 mb-8">
        <div class="bg-gray-50 p-6 rounded-xl">
            <h4 class="font-bold text-lg text-gray-800 mb-2">16:8 방식 (초보자 추천)</h4>
            <p class="text-gray-600">하루 24시간 중 16시간 동안 공복을 유지하고, 나머지 8시간 동안 식사하는 방법입니다. 예를 들어, 저녁 8시에 식사를 마치고 다음 날 점심 12시까지 물만 마시는 식입니다. 수면 시간을 포함하기 때문에 비교적 실천하기 쉽습니다.</p>
        </div>
        <div class="bg-gray-50 p-6 rounded-xl">
            <h4 class="font-bold text-lg text-gray-800 mb-2">5:2 방식</h4>
            <p class="text-gray-600">일주일 중 5일은 평소대로 식사하고, 2일(연속되지 않게)은 하루 500-600kcal의 초저열량 식사를 하는 방법입니다. 영국에서 시작되어 큰 인기를 끌었습니다.</p>
        </div>
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. 놀라운 건강상의 이점</h3>
      <ul class="list-disc pl-5 mb-6 space-y-3">
        <li><strong>자가포식(Autophagy) 활성화:</strong> '스스로(Auto) 먹는다(Phagy)'는 뜻으로, 세포가 영양분 결핍 상황에서 불필요하거나 손상된 단백질, 세포 소기관을 분해해 에너지원으로 재활용하는 현상입니다. 이는 노화 방지와 치매 예방의 핵심 기전으로 알려져 있습니다.</li>
        <li><strong>인슐린 저항성 개선:</strong> 잦은 식사는 췌장을 쉴 새 없이 일하게 만듭니다. 공복 시간은 췌장에게 휴식을 주고, 세포들이 인슐린에 다시 민감하게 반응하도록 도와 제2형 당뇨병 예방에 도움을 줍니다.</li>
        <li><strong>만성 염증 감소:</strong> 여러 연구에서 간헐적 단식이 체내 염증 표지자 수치를 낮추는 것으로 확인되었습니다.</li>
        <li><strong>뇌 건강 증진:</strong> 뇌유래신경영양인자(BDNF)의 분비를 촉진하여 인지 기능 향상과 우울증 완화에 기여할 수 있습니다.</li>
      </ul>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">4. 실패하지 않는 실전 팁</h3>
      <p class="mb-4">
        <strong>첫째, 물을 충분히 드세요.</strong><br>
        공복감의 상당 부분은 갈증에서 옵니다. 허기가 질 때 따뜻한 물이나 허브티를 마시면 거짓 배고픔이 사라지는 경우가 많습니다. 단, 설탕이나 우유가 들어간 음료는 금물입니다.
      </p>
      <p class="mb-4">
        <strong>둘째, '무엇을' 먹느냐가 더 중요합니다.</strong><br>
        16시간 굶었다고 해서 8시간 동안 피자, 치킨, 케이크를 폭식한다면 건강은 오히려 악화됩니다. 식사 시간에는 양질의 단백질(고기, 생선, 두부), 건강한 지방(견과류, 올리브유), 그리고 풍부한 채소를 섭취해야 근손실을 막고 대사를 원활하게 할 수 있습니다.
      </p>
      <p class="mb-6">
        <strong>셋째, 내 몸의 소리를 들으세요.</strong><br>
        여성의 경우 호르몬 균형이 남성보다 민감하여 무리한 단식이 생리 불순이나 탈모를 유발할 수 있습니다. 컨디션이 좋지 않은 날은 무리하지 말고 유동적으로 시간을 조절하세요.
      </p>

      <div class="bg-red-50 p-6 rounded-xl border border-red-100 my-8">
        <h4 class="font-bold text-red-800 mb-2">⚠️ 주의사항: 이런 분들은 피하세요</h4>
        <ul class="text-red-700 text-sm list-disc pl-5 space-y-1">
            <li>성장기 어린이 및 청소년</li>
            <li>임산부 및 수유부</li>
            <li>저체중이거나 섭식 장애(거식증, 폭식증) 병력이 있는 분</li>
            <li>제1형 당뇨병 환자 또는 혈당 조절 약물을 복용 중인 분 (저혈당 쇼크 위험)</li>
        </ul>
      </div>

      <p class="text-gray-500 italic mt-8 text-center">
        간헐적 단식은 단기간의 '이벤트'가 아니라 평생 지속 가능한 '라이프스타일'이 되어야 합니다. 오늘 저녁 숟가락을 조금 일찍 내려놓는 것부터 시작해보는 건 어떨까요?
      </p>
      `,
    ),
    isLiked: false,
  },
  {
    postId: 2,
    title: '근력 운동 vs 유산소 운동, 다이어트의 승자는?',
    category: 'EXERCISE',
    createdAt: '2024-11-13T14:30:00',
    likes: 89,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
    writer: '김헬스 트레이너',
    content: dummyContent(
      '근력 운동 vs 유산소 운동',
      `
      <p class="mb-6">
        "살을 빼려면 런닝머신을 뛰어야 하나요, 아니면 무거운 덤벨을 들어야 하나요?" 헬스장에서 가장 많이 듣는 질문 중 하나입니다. 과거에는 '유산소=살빼기, 웨이트=근육키우기'라는 이분법적 사고가 지배적이었지만, 현대 스포츠 과학은 이 두 가지 운동의 시너지 효과에 주목하고 있습니다. 효율적인 체중 감량과 탄력 있는 몸매, 두 마리 토끼를 잡기 위한 운동 전략을 세워드립니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. 유산소 운동: 지방을 태우는 용광로</h3>
      <p class="mb-4">
        걷기, 달리기, 자전거 타기, 수영 등 유산소 운동은 심박수를 일정 수준 이상으로 유지하며 산소를 지속적으로 소비합니다.
      </p>
      <div class="mb-6 p-4 bg-blue-50 rounded-lg">
        <ul class="list-disc pl-5 space-y-2 text-blue-800">
            <li><strong>장점:</strong> 운동 수행 시간 동안의 칼로리 소모량이 근력 운동보다 높습니다. 체지방과 내장지방을 직접적으로 연소시키는 데 탁월하며, 심폐 지구력 강화와 혈액 순환 개선 효과가 있습니다.</li>
            <li><strong>단점:</strong> 과도한 유산소 운동만 할 경우 근손실이 발생할 수 있으며, 운동을 멈추면 칼로리 소모도 즉시 멈춥니다.</li>
        </ul>
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. 근력 운동: 살이 찌지 않는 체질로의 변화</h3>
      <p class="mb-4">
        웨이트 트레이닝은 근섬유에 미세한 상처를 내고, 이를 회복하는 과정에서 근육을 성장시킵니다. 다이어터들이 근력 운동을 두려워할 필요가 없는 이유가 여기에 있습니다.
      </p>
      <div class="mb-6 p-4 bg-purple-50 rounded-lg">
        <ul class="list-disc pl-5 space-y-2 text-purple-800">
            <li><strong>기초대사량 증가:</strong> 근육은 유지하는 데 많은 에너지가 필요한 조직입니다. 근육 1kg이 늘어나면 하루에 약 13~30kcal를 더 소모합니다. 작은 차이 같지만, 1년이면 지방 1~1.5kg을 감량하는 효과와 같습니다. 즉, '숨만 쉬어도 살이 빠지는' 몸이 되는 것입니다.</li>
            <li><strong>EPOC 효과 (초과산소소모):</strong> 고강도 근력 운동 후에는 우리 몸이 회복을 위해 평소보다 더 많은 산소를 소비합니다. 이 과정에서 운동이 끝난 후에도 최대 24~48시간 동안 칼로리가 계속 타오르는 '애프터번(After-burn)' 효과가 발생합니다.</li>
        </ul>
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. 황금 비율: 동시 병행 훈련 (Concurrent Training)</h3>
      <p class="mb-4">
        가장 이상적인 다이어트 운동 루틴은 두 가지를 결합하는 것입니다. 그런데 <strong>순서가 중요합니다.</strong> 과학적으로 권장되는 순서는 <strong>[워밍업 → 근력 운동 → 유산소 운동]</strong>입니다.
      </p>
      <p class="mb-6">
        근력 운동은 탄수화물(글리코겐)을 주 에너지원으로 사용합니다. 먼저 웨이트 트레이닝으로 체내 저장된 글리코겐을 고갈시킨 후 유산소 운동을 시작하면, 우리 몸은 에너지가 부족하다고 판단하여 지방을 더 빨리, 더 많이 태우기 시작합니다. 반대로 유산소 운동을 먼저 해서 힘을 다 빼버리면, 정작 중요한 근력 운동 때 집중력이 떨어져 부상 위험이 커지고 운동 강도를 뽑아낼 수 없습니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">4. 트레이너의 추천 주간 루틴</h3>
      <div class="overflow-hidden border border-gray-200 rounded-xl mb-6">
        <table class="min-w-full bg-white text-sm">
            <thead class="bg-gray-100 text-gray-700">
                <tr>
                    <th class="py-3 px-4 text-left">요일</th>
                    <th class="py-3 px-4 text-left">운동 내용</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <tr>
                    <td class="py-3 px-4 font-semibold">월</td>
                    <td class="py-3 px-4">하체 근력 (스쿼트, 런지) 40분 + 빠른 걷기 20분</td>
                </tr>
                <tr>
                    <td class="py-3 px-4 font-semibold">화</td>
                    <td class="py-3 px-4">상체 근력 (푸쉬업, 로우) 40분 + 사이클 20분</td>
                </tr>
                <tr>
                    <td class="py-3 px-4 font-semibold">수</td>
                    <td class="py-3 px-4 text-gray-500">휴식 또는 가벼운 스트레칭</td>
                </tr>
                <tr>
                    <td class="py-3 px-4 font-semibold">목</td>
                    <td class="py-3 px-4">전신 근력 (데드리프트, 플랭크) 40분 + 인터벌 러닝 15분</td>
                </tr>
                <tr>
                    <td class="py-3 px-4 font-semibold">금</td>
                    <td class="py-3 px-4">중강도 유산소 50분 (수영, 등산 등 즐거운 활동)</td>
                </tr>
                <tr>
                    <td class="py-3 px-4 font-semibold">주말</td>
                    <td class="py-3 px-4 text-gray-500">충분한 수면과 산책</td>
                </tr>
            </tbody>
        </table>
      </div>
      
      <p class="mb-4">
        다이어트는 단거리가 아닌 마라톤입니다. 빨리 빼고 싶어서 매일 2시간씩 유산소만 하다가 근육과 함께 의지까지 빠져버리는 경우를 너무 많이 봅니다. 탄탄하고 건강한 몸을 위해 오늘부터는 덤벨과 런닝머신, 둘 다와 친구가 되어보세요.
      </p>
      `,
    ),
    isLiked: true,
  },
  {
    postId: 3,
    title: '식곤증과 뱃살의 주범, 혈당 스파이크를 막는 골든타임 식사법',
    category: 'DISEASE',
    createdAt: '2024-11-12T10:15:00',
    likes: 245,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?q=80&w=800&auto=format&fit=crop',
    writer: '이닥터 전문의',
    content: dummyContent(
      '혈당 스파이크와 식사 순서',
      `
      <p class="mb-6">
        점심 식사 후 쏟아지는 졸음 때문에 업무에 집중하기 힘드신가요? 혹은 배가 부른데도 계속 단 것이 당기시나요? 그렇다면 당신은 '혈당 스파이크'의 롤러코스터에 타고 있을 가능성이 높습니다. 혈당 스파이크는 단순히 당뇨병 환자만의 문제가 아닙니다. 혈관을 손상시켜 노화를 촉진하고, 인슐린 시스템을 망가뜨려 비만을 유발하는 현대인의 숨겨진 적입니다. 그런데 놀랍게도, <strong>먹는 음식의 종류를 바꾸지 않고 '순서'만 바꿔도</strong> 이 문제를 해결할 수 있습니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. 혈당 스파이크란 무엇인가?</h3>
      <p class="mb-4">
        음식을 섭취한 후 혈당이 마치 뾰족한 가시(Spike)처럼 급격하게 치솟았다가 급락하는 현상을 말합니다.
        <br>혈당이 급격히 오르면 우리 몸은 이를 낮추기 위해 췌장에서 과도한 양의 인슐린을 분비합니다. 인슐린은 혈액 속의 포도당을 세포로 밀어 넣는데, 한꺼번에 너무 많은 양이 들어오면 세포는 이를 다 쓰지 못하고 지방으로 저장해버립니다. 특히 복부 지방으로 말이죠. 이후 혈당이 뚝 떨어지면 뇌는 위기감을 느끼고 다시 당분(탄수화물)을 갈구하는 악순환이 반복됩니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. 기적의 식사 순서: 채.단.탄</h3>
      <p class="mb-6">
        코넬대학교 연구팀의 실험에 따르면, 동일한 칼로리의 식사를 하더라도 섭취 순서에 따라 식후 혈당 수치가 현저하게 달랐습니다. 혈당 커브를 완만하게 만드는 마법의 주문, <strong>채소 → 단백질/지방 → 탄수화물</strong> 공식을 기억하세요.
      </p>
      
      <div class="space-y-6 mb-8">
        <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">1</div>
            <div>
                <h4 class="font-bold text-lg text-gray-900 mb-1">식이섬유 (채소) 먼저</h4>
                <p class="text-gray-600">위장에 먼저 도착한 식이섬유는 그물망을 형성하여 뒤이어 들어올 탄수화물의 소화 흡수 속도를 늦춥니다. 마치 고속도로에 과속 방지턱을 설치하는 것과 같습니다. 샐러드, 나물 반찬, 쌈 채소 등을 먼저 5분 이상 충분히 씹어 드세요.</p>
            </div>
        </div>
        <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
            <div>
                <h4 class="font-bold text-lg text-gray-900 mb-1">단백질과 지방 (메인 반찬)</h4>
                <p class="text-gray-600">고기, 생선, 두부, 계란 등입니다. 단백질과 지방은 위장 내 체류 시간이 길어 포만감을 주고, 인크레틴이라는 호르몬 분비를 촉진해 인슐린이 적절히 나오도록 돕습니다. 밥에 손을 대기 전에 반찬을 먼저 즐기세요.</p>
            </div>
        </div>
        <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">3</div>
            <div>
                <h4 class="font-bold text-lg text-gray-900 mb-1">마지막은 탄수화물 (밥, 면, 빵)</h4>
                <p class="text-gray-600">이미 채소와 단백질로 배가 어느 정도 찼기 때문에 자연스럽게 탄수화물 섭취량이 줄어듭니다. 또한 앞선 음식들이 쿠션 역할을 해주어 혈당이 완만하게 오릅니다.</p>
            </div>
        </div>
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. 실생활 적용 시나리오</h3>
      <ul class="list-disc pl-5 mb-6 space-y-3">
        <li><strong>한식을 먹을 때:</strong> 식탁에 앉자마자 나물 반찬이나 김치를 먼저 집어 드세요. 국 건더기(채소)를 건져 먹는 것도 좋습니다. 그 다음 고기 반찬이나 생선을 먹고, 밥은 맨 마지막에 국물 없이 드세요.</li>
        <li><strong>양식을 먹을 때:</strong> 식전 빵은 과감히 뒤로 미루세요. 샐러드를 가장 먼저 먹고, 스테이크나 파스타 속 해산물/버섯을 먼저 골라 먹습니다. 면은 마지막에 남은 소스와 함께 즐기세요.</li>
        <li><strong>고깃집에서:</strong> 고기가 익기 전 쌈 채소와 파절이를 먼저 먹습니다. 고기를 먹을 땐 밥 없이 쌈을 싸서 먹고, 냉면이나 된장술밥은 식사 끝무렵에 반 그릇만 먹습니다.</li>
      </ul>
    
      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">4. 식초의 비밀</h3>
      <p class="mb-4">
        식사 직전이나 식사 중에 식초(애플사이다비니거 등)를 물에 희석해 마시거나, 샐러드 드레싱으로 활용해보세요. 식초의 아세트산은 탄수화물 분해 효소의 작용을 억제하고 근육이 포도당을 더 잘 흡수하도록 도와 식후 혈당을 최대 30%까지 낮출 수 있다는 연구 결과가 있습니다.
      </p>

      <p class="mb-4">
        혈당 관리는 단순히 질병 예방을 넘어, 하루의 에너지 수준과 감정 기복, 집중력을 좌우하는 핵심 열쇠입니다. 오늘 점심부터 '채단탄' 순서를 실천해보세요. 식후 몰려오던 피로감이 사라지는 것을 즉시 느끼실 수 있을 것입니다.
      </p>
      `,
    ),
    isLiked: false,
  },
  {
    postId: 4,
    title: '잠만 잘 자도 살이 빠진다? 수면 다이어트의 모든 것',
    category: 'DIET',
    createdAt: '2024-11-11T22:00:00',
    likes: 156,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1520206183501-b80df610434f?q=80&w=800&auto=format&fit=crop',
    writer: '최수면 연구원',
    content: dummyContent(
      '수면과 체중 감량의 관계',
      `
      <p class="mb-6">
        열심히 운동하고 식단도 철저히 지키는데 체중계 바늘이 꿈쩍도 하지 않나요? 그렇다면 당신의 '수면'을 점검해볼 때입니다. 많은 사람들이 다이어트 성공 방정식에서 '운동'과 '영양'은 챙기지만 '휴식', 특히 수면의 중요성은 간과하곤 합니다. 하지만 잠을 자는 동안 우리 몸에서는 지방을 태우고 근육을 만드는 놀라운 마법이 일어납니다. 반대로 잠이 부족하면 살이 찔 수밖에 없는 호르몬의 노예가 됩니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. 식욕을 조종하는 두 가지 호르몬</h3>
      <p class="mb-4">
        수면 부족은 우리 뇌의 식욕 통제 센터를 마비시킵니다. 여기에는 <strong>'렙틴(Leptin)'</strong>과 <strong>'그렐린(Ghrelin)'</strong>이라는 두 호르몬이 관여합니다.
      </p>
      <ul class="list-disc pl-5 mb-6 space-y-3">
        <li><strong>렙틴 (식욕 억제):</strong> 지방세포에서 분비되어 뇌에게 "배부르니 그만 먹어"라는 신호를 보냅니다. 충분히 자면 렙틴 분비가 정상적으로 이루어집니다.</li>
        <li><strong>그렐린 (식욕 촉진):</strong> 위장에서 분비되어 뇌에게 "배고파, 밥 줘"라는 신호를 보냅니다. 수면이 부족하면 그렐린 수치가 폭발적으로 증가합니다.</li>
      </ul>
      <p class="mb-6">
        시카고 대학의 연구에 따르면, 하루 수면 시간을 8.5시간에서 5.5시간으로 줄이자 참가자들의 탄수화물 갈망이 급증했고, 하루 섭취 칼로리가 평균 300kcal 이상 늘어났다고 합니다. 잠을 못 자면 의지력이 약해서 먹는 게 아니라, 몸이 생존을 위해 먹도록 강요하는 것입니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. 스트레스 호르몬과 뱃살</h3>
      <p class="mb-4">
        밤을 새우거나 깊은 잠을 못 자면 우리 몸은 이를 비상사태로 인식하고 스트레스 호르몬인 <strong>'코르티솔(Cortisol)'</strong>을 뿜어냅니다. 코르티솔은 다음과 같은 악행을 저지릅니다.
      </p>
      <ol class="list-decimal pl-5 mb-6 space-y-2">
        <li>근육 단백질을 분해하여 에너지로 씁니다. (근손실 유발)</li>
        <li>혈당을 빠르게 올리고, 남은 에너지를 <strong>내장 지방</strong>으로 축적합니다.</li>
        <li>면역력을 떨어뜨립니다.</li>
      </ol>
      <p class="mb-4">
        즉, 잠을 줄여서 운동하는 것은 오히려 근육을 잃고 뱃살을 얻는 지름길이 될 수 있습니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. 성장호르몬: 천연 지방 분해제</h3>
      <p class="mb-4">
        성장호르몬은 아이들 키만 키우는 게 아닙니다. 성인에게는 손상된 세포를 복구하고 근육 합성을 도우며, <strong>체지방 분해를 촉진</strong>하는 강력한 안티에이징 호르몬입니다. 성장호르몬은 우리가 깊은 잠(서파 수면)에 빠졌을 때, 특히 밤 10시에서 새벽 2시 사이에 가장 왕성하게 분비됩니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">4. 꿀잠을 위한 5가지 수칙 (Sleep Hygiene)</h3>
      <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-6">
        <ul class="space-y-4 text-indigo-900">
            <li><strong>🌙 블루라이트 차단:</strong> 잠들기 1~2시간 전부터는 스마트폰, TV 시청을 자제하세요. 청색광은 수면 유도 호르몬인 멜라토닌 생성을 억제합니다.</li>
            <li><strong>🌡️ 적정 온도 유지:</strong> 침실 온도를 18~22도 정도로 약간 서늘하게 유지하는 것이 깊은 잠에 도움이 됩니다.</li>
            <li><strong>☕ 카페인 컷오프:</strong> 카페인의 반감기는 생각보다 깁니다(약 6시간). 점심 식사 이후에는 커피 섭취를 삼가세요.</li>
            <li><strong>🛀 따뜻한 목욕:</strong> 잠들기 90분 전 따뜻한 물로 샤워나 반신욕을 하면 체온이 올랐다가 떨어지면서 졸음이 옵니다.</li>
            <li><strong>☀️ 아침 햇살 샤워:</strong> 기상 후 30분 이내에 햇볕을 쫴야 체내 시계가 리셋되어 밤에 잠이 잘 옵니다.</li>
        </ul>
      </div>

      <p class="mb-4">
        다이어트의 3대 요소는 운동, 식단, 그리고 수면입니다. 이 삼각형의 균형이 맞을 때 비로소 건강하고 아름다운 몸을 얻을 수 있습니다. 오늘 밤은 넷플릭스 한 편을 포기하고, 내일의 날씬한 나를 위해 일찍 이불 속으로 들어가 보는 건 어떨까요?
      </p>
      `,
    ),
    isLiked: true,
  },
  {
    postId: 5,
    title: '단백질 보충제, 종류별 완벽 분석 (WPC, WPI, 비건)',
    category: 'NUTRIENT',
    createdAt: '2024-11-10T11:00:00',
    likes: 92,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=800&auto=format&fit=crop',
    writer: '박건강 영양사',
    content: dummyContent(
      '단백질 보충제 가이드',
      `
      <p class="mb-6">
        운동을 시작하면 으레 사게 되는 쉐이커와 단백질 파우더. 하지만 상세 페이지를 보면 WPC, WPI, WPH, 카제인 등 알 수 없는 영어 약자들이 난무하고 가격도 천차만별이라 혼란스럽습니다. 비싼 게 무조건 좋은 걸까요? 우유만 먹으면 배가 아픈 나는 뭘 먹어야 할까요? 초보자부터 중급자까지, 본인의 체질과 목적에 딱 맞는 단백질 보충제 고르는 법을 정리해드립니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. 유청 단백질 (Whey Protein) 종류 알아보기</h3>
      <p class="mb-4">
        우유에서 치즈를 만들고 남은 액체(유청)에서 단백질을 추출한 것으로, 흡수 속도가 빠르고 아미노산 조성이 뛰어나 가장 대중적입니다.
      </p>
      <div class="space-y-4 mb-8">
        <div class="border-l-4 border-blue-500 pl-4 py-1">
            <h4 class="font-bold text-lg text-gray-900">WPC (농축유청단백)</h4>
            <p class="text-gray-600">단백질 순도 약 80%. 유청을 농축만 했기 때문에 유당, 유지방, 미네랄이 살아있습니다. 가성비가 가장 좋지만, 유당불내증이 있는 분은 섭취 후 복통이나 설사를 할 수 있습니다.</p>
        </div>
        <div class="border-l-4 border-green-500 pl-4 py-1">
            <h4 class="font-bold text-lg text-gray-900">WPI (분리유청단백)</h4>
            <p class="text-gray-600">WPC에서 필터링을 더 거쳐 유당과 지방을 거의 제거한 제품입니다. 단백질 순도 90% 이상. 우유를 못 드시는 분들도 편하게 드실 수 있고 흡수가 더 빠르지만, 공정이 추가되어 가격이 비쌉니다.</p>
        </div>
        <div class="border-l-4 border-purple-500 pl-4 py-1">
            <h4 class="font-bold text-lg text-gray-900">WPH (가수분해유청단백)</h4>
            <p class="text-gray-600">소화효소를 넣어 단백질을 한번 더 잘게 쪼갠 제품입니다. 소화 흡수 속도가 가장 빠르지만, 쓴맛이 날 수 있고 가격이 가장 비쌉니다. 극도의 소화 장애가 있는 환자가 아니라면 일반인에게 WPI 대비 큰 이점은 없습니다.</p>
        </div>
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. 그 외의 선택지들</h3>
      <ul class="list-disc pl-5 mb-6 space-y-3">
        <li><strong>카제인 단백질 (Casein):</strong> 유청과 반대로 위산에 응고되어 아주 천천히 흡수됩니다(최대 7~8시간). 자는 동안 근육에 지속적으로 영양을 공급하고 싶을 때 자기 전에 섭취하면 좋습니다.</li>
        <li><strong>식물성 단백질 (Vegan):</strong> 대두(ISP), 완두콩, 쌀 등에서 추출합니다. 유제품 알레르기가 있거나 비건 지향인 분들에게 적합합니다. 아미노산 조성이 동물성에 비해 다소 부족할 수 있으나, 최근엔 여러 곡물을 배합해 이를 보완한 제품이 많습니다.</li>
      </ul>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. 얼마나, 언제 먹어야 할까?</h3>
      <p class="mb-4">
        <strong>섭취량:</strong> 일반인은 체중 1kg당 0.8~1.0g, 근력 운동을 하는 다이어터는 1.2~1.6g, 보디빌더 수준은 2.0g까지 권장합니다. (예: 60kg인 운동하는 여성 = 하루 약 72~96g). 한 번에 우리 몸이 흡수할 수 있는 양은 20~30g 정도이므로, 하루 총량을 3~4회로 나누어 드세요.
      </p>
      <p class="mb-4">
        <strong>섭취 타이밍:</strong> '기회의 창(운동 직후 30분 이내 섭취)' 이론은 최근 연구에서 조금 더 유연해졌습니다. 운동 직후 섭취가 도움은 되지만, <strong>하루 총 단백질 섭취량</strong>을 맞추는 것이 훨씬 더 중요합니다. 식사 사이 간식으로 먹거나, 운동 전후 편한 시간에 드셔도 무방합니다.
      </p>

      <div class="bg-yellow-50 p-6 rounded-xl border border-yellow-100 my-8">
        <h4 class="font-bold text-yellow-800 mb-2">💡 영양사의 조언: 보충제는 거들 뿐</h4>
        <p class="text-yellow-700 text-sm">
            보충제는 간편하게 단백질을 채울 수 있는 훌륭한 도구지만, '주식'이 되어서는 안 됩니다. 닭가슴살, 계란, 생선, 살코기 등 자연 식품에는 단백질 외에도 비타민, 미네랄 등 다양한 미량 영양소가 풍부합니다. 하루 필요량의 절반 이상은 반드시 식사로 섭취하고, 부족한 부분을 보충제로 채우는 습관을 들이세요. 또한 과도한 단백질 섭취는 간과 신장에 부담을 줄 수 있으니 본인에게 맞는 양을 지키는 것이 중요합니다.
        </p>
      </div>
      `,
    ),
    isLiked: false,
  },
  {
    postId: 6,
    title: '면역력의 70%는 장에서 나온다? 마이크로바이옴 관리법',
    category: 'DISEASE',
    createdAt: '2024-11-09T08:30:00',
    likes: 178,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop',
    writer: '이닥터 전문의',
    content: dummyContent(
      '장 건강과 면역력의 비밀',
      `
      <p class="mb-6">
        겨울철만 되면 감기를 달고 살거나, 이유 모를 피부 트러블, 만성 피로에 시달리시나요? 영양제를 챙겨 먹기 전에 당신의 '장'을 먼저 들여다봐야 합니다. 장은 단순히 음식물을 소화하고 배설하는 파이프라인이 아닙니다. 우리 몸 면역 세포의 70% 이상이 장 점막에 존재하며, 뇌와 신호를 주고받는 '제2의 뇌'이기도 합니다. 내 몸 안의 작은 우주, 마이크로바이옴(Microbiome)을 건강하게 가꾸는 법을 소개합니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. 마이크로바이옴이란?</h3>
      <p class="mb-4">
        인체에 서식하는 미생물(Microbe)과 생태계(Biome)의 합성어로, 우리 몸에는 세포 수보다 많은 약 38조 개의 미생물이 살고 있습니다. 대부분 대장에 서식하는데, 이들의 무게만 1~2kg에 달합니다. 건강한 사람의 장은 유익균(25%), 유해균(15%), 그리고 상황에 따라 우세한 쪽 편을 드는 중간균(60%)이 적절한 균형을 이루고 있습니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. 장이 무너지면 온몸이 아프다</h3>
      <p class="mb-4">
        불규칙한 식습관, 스트레스, 항생제 남용 등으로 유해균이 득세하면 '장 누수 증후군(Leaky Gut Syndrome)'이 발생할 수 있습니다. 장 점막의 결합이 느슨해지면서 세균, 독소, 소화 덜 된 음식물 그들이 혈관으로 침투하는 현상입니다. 이는 전신 만성 염증을 유발하여 비만, 당뇨, 아토피, 류마티스 관절염, 심지어 우울증의 원인이 됩니다. '뚱보균'이라 불리는 피르미쿠테스균이 많아지면 물만 먹어도 살이 찐다는 말이 현실이 됩니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. 장내 꽃밭을 가꾸는 3단계 전략</h3>
      <div class="space-y-6 mb-8">
        <div class="bg-green-50 p-6 rounded-xl">
            <h4 class="font-bold text-lg text-green-800 mb-2">1. 나쁜 놈 굶기기 (유해균 억제)</h4>
            <p class="text-green-700">유해균이 가장 좋아하는 먹이는 <strong>설탕, 정제 탄수화물, 가공식품의 첨가물</strong>입니다. 단 음식을 줄이는 것만으로도 나쁜 균의 증식을 막을 수 있습니다.</p>
        </div>
        <div class="bg-green-50 p-6 rounded-xl">
            <h4 class="font-bold text-lg text-green-800 mb-2">2. 좋은 놈 넣어주기 (프로바이오틱스)</h4>
            <p class="text-green-700">김치, 된장, 청국장, 요거트, 콤부차 등 발효 식품을 가까이 하세요. 식품으로 섭취가 어렵다면 유산균 영양제를 챙기는 것도 방법입니다. 균주 수(CFU)도 중요하지만 '보장 균수'와 자신에게 맞는 균주를 찾는 것이 중요합니다.</p>
        </div>
        <div class="bg-green-50 p-6 rounded-xl">
            <h4 class="font-bold text-lg text-green-800 mb-2">3. 군량미 지원하기 (프리바이오틱스)</h4>
            <p class="text-green-700">아무리 좋은 균을 넣어도 먹이가 없으면 굶어 죽고 배출됩니다. 유익균의 먹이가 되는 <strong>식이섬유(프리바이오틱스)</strong>를 풍부하게 드세요. 양배추, 브로콜리, 통곡물, 바나나, 사과 껍질, 우엉 등이 좋습니다.</p>
        </div>
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">4. 뇌-장 축 (Gut-Brain Axis)</h3>
      <p class="mb-4">
        긴장하면 배가 아프거나 설사를 하는 과민성 대장 증후군을 겪어보셨나요? 뇌와 장은 미주 신경으로 연결되어 서로 실시간으로 소통합니다. 행복 호르몬이라 불리는 <strong>세로토닌의 90%가 장에서 생성</strong>됩니다. 장이 편안해야 마음도 편안해지고, 숙면을 취할 수 있습니다.
      </p>
      
      <p class="mb-4 text-gray-600">
        오늘 먹은 음식이 내일의 내 면역력과 기분을 결정합니다. 장내 미생물들을 위한 건강한 밥상을 차려주는 건 어떨까요? 그것이 곧 나를 위한 가장 확실한 건강 투자입니다.
      </p>
      `,
    ),
    isLiked: true,
  },
  {
    postId: 7,
    title: '물, 진짜 하루에 2리터 마셔야 할까? 올바른 수분 섭취 가이드',
    category: 'NUTRIENT',
    createdAt: '2024-11-08T15:00:00',
    likes: 67,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=800&auto=format&fit=crop',
    writer: '최수면 연구원',
    content: dummyContent(
      '올바른 수분 섭취법',
      `
      <p class="mb-6">
        "하루 물 8잔 마시기"는 건강의 황금률처럼 여겨집니다. 연예인들의 피부 비결로 항상 언급되는 것도 바로 '물 많이 마시기'죠. 수분은 우리 몸의 60~70%를 차지하며, 영양소 운반, 체온 조절, 노폐물 배출 등 생명 유지에 필수적입니다. 하지만 무조건 많이 마시는 게 능사일까요? 커피나 차도 물 대신 마셔도 될까요? 수분에 대한 오해와 진실, 그리고 똑똑하게 마시는 법을 알려드립니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. 내 몸에 필요한 물의 양 계산하기</h3>
      <p class="mb-4">
        세계보건기구(WHO)의 일반적인 권장량은 1.5~2리터이지만, 이는 모든 사람에게 적용되는 절대적인 기준이 아닙니다. 개인의 체중, 활동량, 날씨에 따라 달라져야 합니다.
      </p>
      <div class="bg-blue-50 p-4 rounded-xl text-center my-4">
        <p class="text-blue-900 font-bold text-lg">나의 적정 수분 섭취량 = 체중(kg) × 30~33ml</p>
        <p class="text-blue-700 text-sm mt-2">(예시: 60kg 성인 → 약 1.8~2.0L)</p>
      </div>
      <p class="mb-4">
        가장 정확한 지표는 <strong>소변 색깔</strong>입니다. 옅은 노란색(레모네이드 색)이라면 수분 상태가 양호한 것이고, 진한 노란색이나 주황색에 가깝다면 수분이 부족한 신호입니다. 반대로 너무 투명하다면 물을 과하게 마시고 있다는 뜻일 수 있습니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. 물 대신 마셔도 되는 것 vs 안 되는 것</h3>
      <p class="mb-4">
        맹물 마시기가 힘들어서 차나 음료로 대체하려는 분들이 많습니다. 하지만 마신다고 다 물이 되는 건 아닙니다.
      </p>
      <ul class="list-disc pl-5 mb-6 space-y-3">
        <li><strong>대체 가능 (O):</strong> 보리차, 현미차, 옥수수수염차(약함), 히비스커스차, 탄산수(무가당). 
            <br><span class="text-gray-500 text-sm">곡물 차는 미네랄이 풍부하고 이뇨 작용이 거의 없어 물 대용으로 가장 좋습니다.</span>
        </li>
        <li><strong>대체 불가 (X):</strong> 커피, 녹차, 홍차, 둥굴레차, 헛개나무차, 우유, 이온음료.
            <br><span class="text-gray-500 text-sm">카페인이 든 음료는 강력한 이뇨 작용으로 마신 양보다 더 많은 수분을 배출시킵니다. 커피를 한 잔 마셨다면 물 두 잔을 더 마셔 보충해줘야 합니다. 이온음료나 주스는 당분이 너무 많아 건강에 해롭습니다.</span>
        </li>
      </ul>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. 수면과 다이어트에 미치는 영향</h3>
      <p class="mb-4">
        만성 탈수 상태가 되면 우리 몸은 갈증을 배고픔으로 착각합니다. 이를 <strong>'가짜 식욕'</strong>이라 부릅니다. 밥을 먹었는데도 입이 심심하다면 물을 한 잔 마셔보세요.
      </p>
      <p class="mb-4">
        또한 수분이 부족하면 대사 기능이 떨어져 지방 연소가 더뎌집니다. 독일의 한 연구에 따르면 물 500ml를 마시면 10분 후부터 대사율이 30% 증가하고, 이 효과는 약 40분간 지속된다고 합니다. 찬물보다는 미지근한 물이 신진대사 활성화에 더 효과적입니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">4. 건강하게 물 마시는 타이밍</h3>
      <ul class="list-disc pl-5 mb-6 space-y-2">
        <li><strong>기상 직후 1잔:</strong> 자는 동안 소실된 수분을 보충하고 밤새 쌓인 노폐물을 배출하며 장 운동을 촉진합니다 (변비 예방).</li>
        <li><strong>식사 30분 전 1잔:</strong> 위장 준비 운동을 돕고 포만감을 주어 과식을 막습니다. (단, 식사 직전이나 도중에 물을 많이 마시면 위액이 묽어져 소화를 방해하니 주의하세요.)</li>
        <li><strong>일과 중 틈틈이:</strong> 한 번에 벌컥벌컥 마시면 세포에 흡수되지 않고 소변으로 바로 빠져나갑니다. 조금씩 자주(홀짝홀짝) 마셔야 내 몸의 수분이 됩니다.</li>
        <li><strong>취침 1~2시간 전:</strong> 잠들기 직전에 마시면 야간뇨로 수면을 방해하므로, 조금 일찍 마시는 게 좋습니다.</li>
      </ul>
      `,
    ),
    isLiked: false,
  },
  {
    postId: 8,
    title: '배고파서 먹는 게 아니다? 가짜 식욕(Emotional Eating) 구별법',
    category: 'DIET',
    createdAt: '2024-11-07T18:45:00',
    likes: 112,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop',
    writer: '김헬스 트레이너',
    content: dummyContent(
      '가짜 배고픔 구별과 극복',
      `
      <p class="mb-6">
        점심을 든든하게 먹고 돌아서자마자 빵 냄새에 이끌려 빵집으로 들어간 적, 스트레스를 받을 때마다 매운 떡볶이나 달콤한 초콜릿을 미친 듯이 찾은 적 있으신가요? 다이어트에 실패하는 가장 큰 원인은 '의지 박약'이 아니라, 내 몸과 마음의 신호를 잘못 해석하는 데 있습니다. 당신이 느끼는 그 허기, 위장이 비어서 보내는 신호가 아닌 뇌가 보내는 거짓말일 수 있습니다. 이를 '가짜 식욕' 또는 '감정적 섭식(Emotional Eating)'이라고 합니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. 진짜 vs 가짜, 3초 만에 구별하는 법</h3>
      <div class="overflow-x-auto mb-8">
        <table class="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left font-bold text-gray-700 w-1/2">진짜 배고픔 (생리적)</th>
              <th class="py-3 px-4 text-left font-bold text-red-600 w-1/2">가짜 배고픔 (심리적)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="py-3 px-4">서서히 배가 고파진다 (꼬르륵 소리)</td>
              <td class="py-3 px-4 text-red-500">갑작스럽게 식욕이 덮친다</td>
            </tr>
            <tr>
              <td class="py-3 px-4">어떤 음식이든 먹어서 배를 채우고 싶다</td>
              <td class="py-3 px-4 text-red-500">특정 음식(단 것, 짠 것, 매운 것)만 당긴다</td>
            </tr>
            <tr>
              <td class="py-3 px-4">먹고 나면 배부르고 만족스럽다</td>
              <td class="py-3 px-4 text-red-500">배가 불러도 계속 먹고 싶고, 먹은 후 죄책감이 든다</td>
            </tr>
            <tr>
              <td class="py-3 px-4">육체적인 현상 (현기증, 기운 없음)</td>
              <td class="py-3 px-4 text-red-500">감정적인 변화 (스트레스, 우울, 지루함)가 트리거</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. 왜 가짜 식욕이 생기는 걸까?</h3>
      <p class="mb-4">
        가장 큰 원인은 <strong>스트레스</strong>입니다. 스트레스를 받으면 코르티솔 호르몬이 분비되는데, 이는 행복 호르몬인 세로토닌을 억제합니다. 우리 뇌는 줄어든 세로토닌을 빠르게 보충하기 위해 당분이나 자극적인 음식을 섭취하도록 명령합니다.
      </p>
      <p class="mb-4">
        두 번째는 <strong>갈증</strong>입니다. 뇌의 시상하부에서는 갈증 중추와 식욕 중추가 매우 가까이 있어, 목마름 신호를 배고픔으로 착각하는 경우가 흔합니다.
      </p>
      <p class="mb-4">
        세 번째는 <strong>혈당 롤러코스터</strong>입니다. 정제 탄수화물(빵, 과자, 면) 위주의 식사를 하면 혈당이 급격히 떨어지면서 저혈당 증세와 유사한 강렬한 허기를 느끼게 됩니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. 가짜 식욕을 잠재우는 솔루션</h3>
      <div class="space-y-4 mb-6">
        <div class="flex items-start">
            <span class="flex-shrink-0 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 mt-1">1</span>
            <div>
                <h4 class="font-bold text-gray-900">물 한 잔의 법칙</h4>
                <p class="text-gray-600">뭔가가 미친 듯이 당길 때, 무조건 물을 한 컵(200ml) 마시고 20분만 기다려보세요. 십중팔구 가짜 20분 뒤에는 그 간절함이 사라져 있을 것입니다.</p>
            </div>
        </div>
        <div class="flex items-start">
            <span class="flex-shrink-0 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 mt-1">2</span>
            <div>
                <h4 class="font-bold text-gray-900">양치질하기 또는 가글하기</h4>
                <p class="text-gray-600">치약의 민트 향은 식욕을 떨어뜨리는 효과가 있습니다. 입안이 상쾌해지면 음식을 넣고 싶은 욕구가 줄어듭니다.</p>
            </div>
        </div>
         <div class="flex items-start">
            <span class="flex-shrink-0 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 mt-1">3</span>
            <div>
                <h4 class="font-bold text-gray-900">감정적 허기임을 인정하기 (마음챙김)</h4>
                <p class="text-gray-600">"아, 내가 지금 배고픈 게 아니라 회사 일 때문에 화가 났구나."라고 스스로 인지하는 것만으로도 충동적인 폭식을 막을 수 있습니다. 먹는 것 대신 산책, 통화, 샤워 등으로 기분을 전환해보세요.</p>
            </div>
        </div>
      </div>

      <p class="mb-4">
        식욕은 억지로 참아야 하는 적이 아닙니다. 내 몸이 보내는 신호를 올바르게 해석하고 달래주는 연습이 필요합니다. 오늘부터는 무작정 냉장고 문을 여는 대신, 내 마음의 문을 먼저 열어보는 건 어떨까요?
      </p>
      `,
    ),
    isLiked: true,
  },
  {
    postId: 9,
    title: '지방을 먹어야 지방이 빠진다? 착한 지방 vs 나쁜 지방',
    category: 'NUTRIENT',
    createdAt: '2024-11-06T12:00:00',
    likes: 88,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop',
    writer: '박건강 영양사',
    content: dummyContent(
      '착한 지방 vs 나쁜 지방',
      `
      <p class="mb-6">
        수십 년간 "저지방(Low Fat)"은 다이어트와 건강 식단의 대명사였습니다. 지방은 1g당 9kcal로 탄수화물이나 단백질(4kcal)보다 열량이 높기 때문에, 무조건 피해야 할 공공의 적으로 취급받았죠. 하지만 최근 키토제닉(저탄고지) 다이어트의 유행과 함께 지방에 대한 오해가 풀리고 있습니다. 지방은 우리 몸 60조 개 세포의 막을 구성하고, 성호르몬을 생성하며, 뇌 기능 유지와 지용성 비타민 흡수에 필수적인 영양소입니다. 핵심은 지방을 먹느냐 마느냐가 아니라, <strong>'어떤 지방'을 먹느냐</strong>입니다.
      </p>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">1. 절대 먹지 말아야 할 최악의 적: 트랜스 지방</h3>
      <p class="mb-4">
        액체 상태의 식물성 기름을 고체로 가공하는 과정(경화)에서 생성되는 변형된 지방입니다. 우리 몸에는 이를 분해할 효소가 없어 한번 들어오면 배출되지 않고, 혈관에 찌꺼기처럼 쌓여 동맥경화, 심장병, 암을 유발합니다. WHO에서는 하루 섭취량을 2g 미만, 사실상 '0'으로 만들 것을 권고합니다.
      </p>
      <div class="bg-red-50 p-4 rounded-lg mb-6 text-red-800">
        <strong>⚠️ 대표 음식:</strong> 마가린, 쇼트닝으로 만든 빵과 케이크, 감자튀김, 팝콘, 도넛, 오래된 튀김 기름.
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">2. 조심해서 먹어야 할: 포화 지방</h3>
      <p class="mb-4">
        상온에서 고체 상태인 동물성 지방입니다. 과거에는 심혈관 질환의 주범으로 몰렸으나, 최근에는 적당량 섭취는 문제없다는 연구가 많습니다. 오히려 호르몬 생성과 면역 체계 유지에 필요합니다. 단, 에너지로 쓰이지 않고 남은 양은 쉽게 중성지방으로 저장되므로 과식은 금물입니다.
      </p>
      <div class="bg-yellow-50 p-4 rounded-lg mb-6 text-yellow-800">
        <strong>⚠️ 대표 음식:</strong> 삼겹살 비계, 버터, 치즈, 팜유(라면, 과자), 코코넛 오일.
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">3. 매일 챙겨 먹어야 할: 불포화 지방 (착한 지방)</h3>
      <p class="mb-4">
        '기름으로 기름을 뺀다'는 말의 주인공입니다. 상온에서 액체 상태이며, 혈액 속 나쁜 콜레스테롤(LDL) 수치를 낮추고 혈관을 청소해주는 고마운 지방입니다. 또한 포만감을 오래 유지시켜 다이어트 시 폭식을 막아줍니다. 체내에서 합성이 안 되어 반드시 음식으로 섭취해야 합니다.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="border border-green-200 rounded-xl p-5">
            <h4 class="font-bold text-lg text-green-800 mb-2">오메가-3 (다가 불포화지방)</h4>
            <p class="text-gray-600 text-sm mb-3">염증 감소, 뇌 건강, 혈행 개선에 탁월합니다.</p>
            <ul class="list-disc pl-5 text-gray-700 text-sm">
                <li>등푸른 생선 (고등어, 연어, 꽁치)</li>
                <li>들기름 (가열하지 말고 생으로)</li>
                <li>호두, 아마씨</li>
            </ul>
        </div>
        <div class="border border-green-200 rounded-xl p-5">
            <h4 class="font-bold text-lg text-green-800 mb-2">오메가-9 (단일 불포화지방)</h4>
            <p class="text-gray-600 text-sm mb-3">나쁜 콜레스테롤만 골라서 낮춰줍니다.</p>
            <ul class="list-disc pl-5 text-gray-700 text-sm">
                <li>엑스트라 버진 올리브 오일</li>
                <li>아보카도, 아보카도 오일</li>
                <li>아몬드, 마카다미아 등 견과류</li>
            </ul>
        </div>
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900 border-b pb-2">4. 건강하게 지방 섭취하는 팁</h3>
      <ul class="list-disc pl-5 mb-6 space-y-3">
        <li><strong>샐러드엔 올리브유:</strong> 채소의 지용성 비타민 흡수율을 높여줍니다.</li>
        <li><strong>간식은 견과류:</strong> 하루 한 줌(약 25g)의 견과류는 최고의 천연 영양제입니다.</li>
        <li><strong>고기 굽기보단 삶기:</strong> 고기를 먹을 땐 튀기거나 굽는 대신 수육 형태로 먹으면 불필요한 지방 섭취를 줄일 수 있습니다.</li>
        <li><strong>연기 나는 기름 피하기:</strong> 아무리 좋은 오일도 발연점을 넘어가면 산패되어 독소로 변합니다. 들기름과 올리브유는 샐러드용으로, 튀김엔 아보카도 오일이나 현미유를 쓰세요.</li>
      </ul>
      `,
    ),
    isLiked: false,
  },
]

export const MOCK_COMMUNITY_SUMMARIES: CommunitySummary[] = MOCK_COMMUNITY_DATA.map((post) => ({
  id: post.postId,
  postId: post.postId,
  category: post.category,
  title: post.title,
  previewText: post.content.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...', // Strip HTML for preview
  thumbnailUrl: post.thumbnailUrl,
  likes: post.likes,
  writer: post.writer,
  readingTime: Math.ceil(post.content.length / 500) + '분', // Approx reading time
  createdAt: post.createdAt,
}))

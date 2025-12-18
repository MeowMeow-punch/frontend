<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'back'): void
}>()
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto max-w-[960px] px-4 py-8 pb-16 md:px-8 md:py-12 md:pb-24">
      <button
        type="button"
        class="mb-6 flex items-center gap-2 text-[var(--gray-600)] transition-colors hover:text-[var(--gray-900)]"
        @click="emit('back')"
      >
        <ArrowLeft class="h-5 w-5" />
        <span class="text-[14px]" style="font-weight: 500">뒤로가기</span>
      </button>

      <div class="mb-8">
        <h1
          class="mb-2 text-[20px] leading-[1.4] tracking-[-0.02em] text-[var(--gray-900)] md:text-[22px]"
          style="font-weight: 700"
        >
          개인정보 처리방침
        </h1>
        <p class="text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
          최종 수정일: 2024년 12월 8일
        </p>
      </div>

      <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6 sm:p-8">
        <section class="mb-8">
          <h2 class="mb-4 text-[20px] font-semibold text-[var(--gray-900)]">
            1. 개인정보의 수집 및 이용 목적
          </h2>
          <p class="mb-3 text-[15px] leading-relaxed text-[var(--gray-700)]">
            픽잇은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적
            이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법에 따라
            별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul class="list-disc space-y-2 pl-5 text-[15px] text-[var(--gray-700)]">
            <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공, 본인확인</li>
            <li>서비스 제공: 맞춤형 식단 추천, 영양 정보 제공, 건강 관리 기록</li>
            <li>마케팅 및 광고 활용: 이벤트 정보 제공, 서비스 개선을 위한 통계 분석</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-[20px] font-semibold text-[var(--gray-900)]">
            2. 수집하는 개인정보 항목
          </h2>
          <p class="mb-3 text-[15px] leading-relaxed text-[var(--gray-700)]">
            픽잇은 서비스 제공을 위해 다음과 같은 개인정보를 수집하고 있습니다.
          </p>

          <div class="mb-3 rounded-lg bg-[var(--gray-50)] p-4">
            <h3 class="mb-2 text-[16px] font-semibold text-[var(--gray-900)]">필수 정보</h3>
            <ul class="list-disc space-y-1 pl-5 text-[14px] text-[var(--gray-700)]">
              <li>닉네임, 이메일, 비밀번호</li>
              <li>성별, 나이, 키, 몸무게</li>
              <li>건강 목표 (영양관리/다이어트/체중증량)</li>
            </ul>
          </div>

          <div class="rounded-lg bg-[var(--gray-50)] p-4">
            <h3 class="mb-2 text-[16px] font-semibold text-[var(--gray-900)]">선택 정보</h3>
            <ul class="list-disc space-y-1 pl-5 text-[14px] text-[var(--gray-700)]">
              <li>알러지 정보, 질환 정보</li>
              <li>소속 정보 (학교, 단체명)</li>
              <li>흡연/음주 빈도, 활동량</li>
            </ul>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-[20px] font-semibold text-[var(--gray-900)]">
            3. 개인정보의 보유 및 이용기간
          </h2>
          <p class="mb-3 text-[15px] leading-relaxed text-[var(--gray-700)]">
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <ul class="list-disc space-y-2 pl-5 text-[15px] text-[var(--gray-700)]">
            <li>
              회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당
              수사·조사 종료 시까지)
            </li>
            <li>
              전자상거래 등에서의 소비자 보호에 관한 법률에 따라 계약 또는 청약철회 등에 관한 기록:
              5년
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-[20px] font-semibold text-[var(--gray-900)]">
            4. 개인정보의 제3자 제공
          </h2>
          <p class="text-[15px] leading-relaxed text-[var(--gray-700)]">
            회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만
            처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에
            해당하는 경우에만 개인정보를 제3자에게 제공합니다.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-[20px] font-semibold text-[var(--gray-900)]">
            5. 개인정보의 파기절차 및 방법
          </h2>
          <p class="mb-3 text-[15px] leading-relaxed text-[var(--gray-700)]">
            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
            지체없이 해당 개인정보를 파기합니다.
          </p>
          <div class="rounded-lg bg-[var(--gray-50)] p-4">
            <p class="mb-2 text-[14px] text-[var(--gray-700)]">
              <strong>파기절차:</strong> 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부
              방침 및 기타 관련 법령에 따라 일정기간 저장된 후 파기됩니다.
            </p>
            <p class="text-[14px] text-[var(--gray-700)]">
              <strong>파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적
              방법을 사용합니다.
            </p>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-[20px] font-semibold text-[var(--gray-900)]">
            6. 정보주체의 권리·의무 및 행사방법
          </h2>
          <p class="mb-3 text-[15px] leading-relaxed text-[var(--gray-700)]">
            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수
            있습니다.
          </p>
          <ul class="list-disc space-y-2 pl-5 text-[15px] text-[var(--gray-700)]">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-[20px] font-semibold text-[var(--gray-900)]">
            7. 개인정보 보호책임자
          </h2>
          <div class="rounded-lg bg-[var(--gray-50)] p-4">
            <p class="mb-2 text-[15px] text-[var(--gray-700)]">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
              정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고
              있습니다.
            </p>
            <div class="mt-3 space-y-1 text-[14px] text-[var(--gray-700)]">
              <p><strong>개인정보 보호책임자</strong></p>
              <p>이름: 개인정보보호팀</p>
              <p>이메일: privacy@pickit.com</p>
              <p>전화: 02-1234-5678</p>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="mb-4 text-[20px] font-semibold text-[var(--gray-900)]">
            8. 개인정보 처리방침 변경
          </h2>
          <p class="text-[15px] leading-relaxed text-[var(--gray-700)]">
            이 개인정보 처리방침은 2024년 12월 8일부터 적용되며, 법령 및 방침에 따른 변경내용의
            추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할
            것입니다.
          </p>
        </section>

        <div class="mt-8 rounded-xl border border-[#00C73C]/20 bg-[#E6F9ED] p-5">
          <p class="text-[14px] text-[var(--gray-900)]">
            <strong>📌 문의하기</strong><br />
            개인정보 처리방침에 대한 문의사항이 있으시면 언제든지
            <a href="mailto:privacy@pickit.com" class="text-[#00C73C] underline"
              >privacy@pickit.com</a
            >으로 연락주시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

import { Users, Heart } from 'lucide-react';
import type { TeamSection } from '../lib/types';

const TEAM_DATA: TeamSection[] = [
  {
    title: 'Chủ biên',
    members: [
      {
        name: 'TS. Trần Hải Bằng',
        role: 'Chủ biên',
        description: 'Tổng biên tập và kiến trúc nội dung giáo trình WiT.',
      },
    ],
  },
  {
    title: 'Ban biên soạn',
    members: [
      {
        name: 'ThS. Nguyễn Minh Anh',
        role: 'Biên soạn viên',
        description: 'Phụ trách nội dung chương 1–3: Nhận thức & Nội tâm.',
      },
      {
        name: 'ThS. Lê Thanh Hà',
        role: 'Biên soạn viên',
        description: 'Phụ trách nội dung chương 4–6: Phẩm chất & Quan hệ.',
      },
      {
        name: 'CN. Phạm Quốc Đạt',
        role: 'Biên soạn viên',
        description: 'Phụ trách nội dung chương 7–9: Quy luật & Giáo dục.',
      },
    ],
  },
  {
    title: 'Ban cố vấn',
    members: [
      {
        name: 'PGS.TS. Vũ Thị Lan',
        role: 'Cố vấn học thuật',
        description: 'Cố vấn về phương pháp giáo dục và tâm lý học.',
      },
      {
        name: 'TS. Yamamoto Kenji',
        role: 'Cố vấn ngôn ngữ',
        description: 'Cố vấn bản dịch tiếng Nhật và giao thoa văn hóa.',
      },
    ],
  },
  {
    title: 'Tổ công nghệ',
    members: [
      {
        name: 'KS. Đỗ Hoàng Long',
        role: 'Lead Developer',
        description: 'Kiến trúc hệ thống và phát triển nền tảng WiT.',
      },
      {
        name: 'CN. Trương Thị Mai',
        role: 'UI/UX Designer',
        description: 'Thiết kế giao diện và trải nghiệm người dùng.',
      },
    ],
  },
];

function getInitials(name: string): string {
  const parts = name.replace(/^(TS\.|PGS\.TS\.|ThS\.|CN\.|KS\.)\s*/i, '').trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-wit-red text-white',
  'bg-wit-gold text-white',
  'bg-wit-success text-white',
  'bg-[#3B7DD8] text-white',
  'bg-[#8B5CF6] text-white',
  'bg-[#EC4899] text-white',
  'bg-[#F59E0B] text-white',
  'bg-[#10B981] text-white',
];

export default function Team() {
  let colorIndex = 0;

  return (
    <div className="page-enter p-4 sm:p-6 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-wit-gold-soft mb-4">
          <Users className="h-7 w-7 text-wit-gold" />
        </div>
        <h1 className="text-3xl font-bold text-wit-text font-serif">Đội ngũ WiT</h1>
        <p className="text-sm text-wit-text-secondary mt-2 max-w-md mx-auto">
          Những con người tâm huyết đằng sau hành trình tri thức WiT
        </p>
      </div>

      {/* Team sections */}
      {TEAM_DATA.map((section) => (
        <section key={section.title}>
          <h2 className="text-lg font-semibold text-wit-text mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-wit-red rounded-full" />
            {section.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.members.map((member) => {
              const avatarColor = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
              colorIndex++;

              return (
                <div
                  key={member.name}
                  className="bg-wit-surface rounded-xl shadow-card border border-wit-line/50 p-5 hover:shadow-card-hover transition-shadow duration-200"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`
                        shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                        font-semibold text-sm ${avatarColor}
                      `}
                    >
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-wit-text truncate">{member.name}</h3>
                      <p className="text-xs text-wit-red font-medium">{member.role}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-wit-text-secondary leading-relaxed">
                    {member.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Footer note */}
      <div className="text-center pt-4 pb-8">
        <p className="text-sm text-wit-text-tertiary flex items-center justify-center gap-1.5">
          Xây dựng với
          <Heart className="h-3.5 w-3.5 text-wit-red fill-wit-red" />
          bởi đội ngũ WiT
        </p>
      </div>
    </div>
  );
}

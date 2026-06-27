import { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { useLessons } from '../hooks/useLessons';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../contexts/SettingsContext';
import { getLessonStatus } from '../lib/utils';
import { getLocalized } from '../lib/types';
import { FilterBar } from '../components/curriculum/FilterBar';
import { LessonCard } from '../components/curriculum/LessonCard';
import { LoadingState, EmptyState } from '../components/ui';

export default function Curriculum() {
  const { lessons, chapters, loading: lessonsLoading } = useLessons();
  const { completedLessons, loading: progressLoading } = useProgress();
  const { interfaceLang } = useSettings();

  const [chapterFilter, setChapterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      // Chapter filter
      if (chapterFilter !== 'all' && lesson.chapterId !== chapterFilter) return false;

      // Status filter
      if (statusFilter !== 'all') {
        const status = getLessonStatus(lesson.lessonNo, completedLessons);
        if (status !== statusFilter) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = getLocalized(lesson, 'title', interfaceLang).toLowerCase();
        const summary = getLocalized(lesson, 'summary', interfaceLang).toLowerCase();
        if (!title.includes(q) && !summary.includes(q)) return false;
      }

      return true;
    });
  }, [lessons, chapterFilter, statusFilter, searchQuery, completedLessons, interfaceLang]);

  if (lessonsLoading || progressLoading) {
    return <LoadingState message="Đang tải giáo trình..." />;
  }

  const completedCount = lessons.filter(
    (l) => getLessonStatus(l.lessonNo, completedLessons) === 'completed'
  ).length;

  return (
    <div className="page-enter space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-wit-red-soft flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-wit-red" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-wit-text">Giáo trình</h1>
            <p className="text-sm text-wit-text-secondary">
              {completedCount}/{lessons.length} bài đã hoàn thành
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        chapters={chapters}
        selectedChapter={chapterFilter}
        selectedStatus={statusFilter}
        searchQuery={searchQuery}
        onChapterChange={setChapterFilter}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
      />

      {/* Lesson grid */}
      {filteredLessons.length === 0 ? (
        <EmptyState
          title="Không tìm thấy bài học"
          description="Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => {
            const status = getLessonStatus(lesson.lessonNo, completedLessons);
            const chapter = chapters.find((c) => c.id === lesson.chapterId);
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                status={status}
                chapter={chapter}
                lang={interfaceLang}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

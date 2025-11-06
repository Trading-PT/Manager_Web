'use client';

import { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import RichTextEditor from '../../components/RichTextEditor';
import type { Column, ColumnCategory } from '../../api/columns';

interface ColumnFormModalProps {
  column?: Column | null; // null이면 새 칼럼 작성, 값이 있으면 수정
  categories: ColumnCategory[];
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    subtitle: string;
    content: string;
    category: string;
    writerName: string;
    fontFamily: string;
  }) => Promise<void>;
}

export default function ColumnFormModal({
  column,
  categories,
  onClose,
  onSubmit,
}: ColumnFormModalProps) {
  const isEditMode = !!column;

  const [title, setTitle] = useState(column?.title || '');
  const [subtitle, setSubtitle] = useState(column?.subtitle || '');
  const [content, setContent] = useState(column?.content || '');
  const [category, setCategory] = useState(column?.category || '');
  const [writerName, setWriterName] = useState(column?.writerName || '');
  const [fontFamily, setFontFamily] = useState(column?.fontFamily || 'default');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (column) {
      setTitle(column.title);
      setSubtitle(column.subtitle);
      setContent(column.content || '');
      setCategory(column.categoryName);
      setWriterName(column.writerName);
      setFontFamily(column.fontFamily || 'default');
    }
  }, [column]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!subtitle.trim()) {
      alert('부제목을 입력해주세요.');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      alert('내용을 입력해주세요.');
      return;
    }
    if (!category.trim()) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!writerName.trim()) {
      alert('작성자 이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        subtitle,
        content,
        category,
        writerName,
        fontFamily,
      });
      onClose();
    } catch (error) {
      console.error('칼럼 저장 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal onClose={onClose} size="xl">
      <div className="p-6 max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? '칼럼 수정' : '새 칼럼 작성'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="칼럼 제목을 입력하세요"
              required
            />
          </div>

          {/* 부제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              부제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="칼럼 부제목을 입력하세요"
              required
            />
          </div>

          {/* 카테고리와 작성자 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                작성자 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="작성자 이름"
                required
              />
            </div>
          </div>

          {/* 내용 (리치 텍스트 에디터) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="칼럼 내용을 작성하세요..."
              selectedFont={fontFamily}
              onFontChange={setFontFamily}
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <CustomButton
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </CustomButton>
            <CustomButton
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? '저장 중...'
                : isEditMode
                ? '수정 완료'
                : '작성 완료'}
            </CustomButton>
          </div>
        </form>
      </div>
    </CustomModal>
  );
}

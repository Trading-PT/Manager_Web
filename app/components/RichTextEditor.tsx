'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';

// 사용 가능한 폰트 목록
export const AVAILABLE_FONTS = [
  { value: 'default', label: '기본 폰트' },
  { value: 'noto-sans', label: 'Noto Sans KR' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'nanum-gothic', label: '나눔고딕' },
  { value: 'nanum-myeongjo', label: '나눔명조' },
  { value: 'gothic-a1', label: 'Gothic A1' },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  selectedFont?: string;
  onFontChange?: (font: string) => void;
  readOnly?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  selectedFont = 'default',
  onFontChange,
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // value가 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // 폰트에 따른 스타일
  const getFontClassName = (font: string) => {
    const fontMap: Record<string, string> = {
      default: '',
      'noto-sans': 'font-noto-sans',
      roboto: 'font-roboto',
      'nanum-gothic': 'font-nanum-gothic',
      'nanum-myeongjo': 'font-nanum-myeongjo',
      'gothic-a1': 'font-gothic-a1',
    };
    return fontMap[font] || '';
  };

  if (!editor) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500">에디터 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 폰트 선택 드롭다운 */}
      {onFontChange && !readOnly && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            폰트 선택:
          </label>
          <select
            value={selectedFont}
            onChange={(e) => onFontChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {AVAILABLE_FONTS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500">
            선택한 폰트는 칼럼 전체에 적용됩니다
          </span>
        </div>
      )}

      {/* 툴바 */}
      {!readOnly && (
        <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-2">
          {/* 텍스트 스타일 */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('bold')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('italic')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('strike')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            <s>S</s>
          </button>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* 헤딩 */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            H3
          </button>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* 리스트 */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('bulletList')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            • 리스트
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1.5 rounded border ${
              editor.isActive('orderedList')
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            1. 리스트
          </button>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* 정렬 */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            왼쪽
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            가운데
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1.5 rounded border text-sm ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            type="button"
          >
            오른쪽
          </button>
        </div>
      )}

      {/* 에디터 영역 */}
      <div
        className={`${getFontClassName(selectedFont)} ${
          readOnly ? '' : 'border border-gray-300 rounded-b-lg'
        }`}
      >
        <EditorContent
          editor={editor}
          className={`prose max-w-none ${readOnly ? '' : 'min-h-[400px] p-4'}`}
        />
      </div>

      <style jsx global>{`
        /* TipTap 에디터 스타일 */
        .ProseMirror {
          min-height: 350px;
          outline: none;
        }

        .ProseMirror p {
          margin: 0.5rem 0;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 1rem 0;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75rem 0;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5rem 0;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* 폰트 클래스 정의 */
        .font-noto-sans {
          font-family: 'Noto Sans KR', sans-serif;
        }

        .font-roboto {
          font-family: 'Roboto', sans-serif;
        }

        .font-nanum-gothic {
          font-family: 'Nanum Gothic', sans-serif;
        }

        .font-nanum-myeongjo {
          font-family: 'Nanum Myeongjo', serif;
        }

        .font-gothic-a1 {
          font-family: 'Gothic A1', sans-serif;
        }
      `}</style>
    </div>
  );
}

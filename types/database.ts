export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'needs_edit';

export type SubmissionCategory = 
  | 'إعادة تدوير'
  | 'ترشيد المياه'
  | 'ترشيد الطاقة'
  | 'تشجير'
  | 'حماية البيئة'
  | 'مشروع كيمياء خضراء'
  | 'فكرة ابتكارية'
  | 'أخرى';

export interface Submission {
  id: string;
  student_name: string;
  title: string;
  description: string;
  category: SubmissionCategory | string;
  file_url: string | null;
  file_path: string | null;
  status: SubmissionStatus;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  admin_note: string | null;
}

export interface QuizQuestion {
  id: number;
  axis: string;
  icon: string;
  question: string;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}
